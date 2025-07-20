// Model loading utilities for MobileNetV3 skin analysis
import * as tf from '@tensorflow/tfjs';

export interface ModelInfo {
  name: string;
  version: string;
  classes: string[];
  inputShape: number[];
  description: string;
}

export const SKIN_ANALYSIS_MODEL_INFO: ModelInfo = {
  name: 'MobileNetV3 Skin Classifier',
  version: '1.0.0',
  classes: [
    // Melanoma (4 classes)
    'melanoma', 'malignant_melanoma', 'suspicious_mole', 'atypical_nevus',
    // Acne (6 classes)
    'acne_vulgaris', 'comedonal_acne', 'inflammatory_acne', 'cystic_acne', 'blackheads', 'whiteheads',
    // Injuries (18 classes) - Enhanced injury detection
    'deep_cut', 'shallow_cut', 'laceration', 'puncture_wound', 'abrasion', 'scrape',
    'first_degree_burn', 'second_degree_burn', 'thermal_burn', 'chemical_burn',
    'fresh_bruise', 'healing_bruise', 'hematoma', 'scratch_marks', 'bite_wound',
    'surgical_wound', 'infected_wound', 'healing_wound',
    // Benign (5 classes)
    'seborrheic_keratosis', 'benign_nevus', 'age_spot', 'freckle', 'skin_tag',
    // Other (6 classes)
    'eczema', 'psoriasis', 'dermatitis', 'rash', 'fungal_infection', 'allergic_reaction'
  ],
  inputShape: [224, 224, 3],
  description: 'Enhanced transfer learning model based on MobileNetV3-Large for comprehensive dermatological condition and injury detection with first aid guidance'
};

export class ModelManager {
  private static instance: ModelManager;
  private models: Map<string, tf.LayersModel> = new Map();
  private loadingPromises: Map<string, Promise<tf.LayersModel>> = new Map();

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async loadModel(modelPath: string, modelName: string): Promise<tf.LayersModel> {
    // Return cached model if already loaded
    if (this.models.has(modelName)) {
      return this.models.get(modelName)!;
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(modelName)) {
      return this.loadingPromises.get(modelName)!;
    }

    // Start loading the model
    const loadingPromise = this.loadModelInternal(modelPath, modelName);
    this.loadingPromises.set(modelName, loadingPromise);

    try {
      const model = await loadingPromise;
      this.models.set(modelName, model);
      this.loadingPromises.delete(modelName);
      return model;
    } catch (error) {
      this.loadingPromises.delete(modelName);
      throw error;
    }
  }

  private async loadModelInternal(modelPath: string, modelName: string): Promise<tf.LayersModel> {
    console.log(`🔄 Loading ${modelName} model from ${modelPath}...`);
    
    // Ensure TensorFlow.js is ready
    await tf.ready();
    
    // Load the model
    const model = await tf.loadLayersModel(modelPath);
    
    // Warm up the model with a dummy prediction
    const dummyInput = tf.zeros([1, ...SKIN_ANALYSIS_MODEL_INFO.inputShape]);
    const warmupPrediction = model.predict(dummyInput) as tf.Tensor;
    warmupPrediction.dispose();
    dummyInput.dispose();
    
    console.log(`✅ ${modelName} model loaded and warmed up successfully`);
    return model;
  }

  getModel(modelName: string): tf.LayersModel | null {
    return this.models.get(modelName) || null;
  }

  disposeModel(modelName: string): void {
    const model = this.models.get(modelName);
    if (model) {
      model.dispose();
      this.models.delete(modelName);
      console.log(`🗑️ Disposed ${modelName} model`);
    }
  }

  disposeAllModels(): void {
    this.models.forEach((model, name) => {
      model.dispose();
      console.log(`🗑️ Disposed ${name} model`);
    });
    this.models.clear();
    this.loadingPromises.clear();
  }

  getMemoryInfo(): { numTensors: number; numBytes: number } {
    return tf.memory();
  }

  async preloadSkinAnalysisModel(): Promise<void> {
    try {
      await this.loadModel('/models/mobilenetv3_skin_classifier/model.json', 'skin_classifier');
    } catch (error) {
      console.warn('⚠️ Could not preload skin analysis model:', error);
    }
  }
}

// Preprocess image for MobileNetV3 input
export function preprocessImageForModel(imageData: ImageData): tf.Tensor {
  return tf.tidy(() => {
    // Convert ImageData to tensor
    let tensor = tf.browser.fromPixels(imageData, 3);
    
    // Resize to model input size (224x224)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize to [-1, 1] range (MobileNetV3 preprocessing)
    tensor = tensor.div(127.5).sub(1);
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

// Post-process model predictions
export function postprocessPredictions(
  predictions: tf.Tensor, 
  threshold: number = 0.1
): Array<{ class: string; confidence: number; category: string }> {
  const probabilities = predictions.dataSync();
  const results: Array<{ class: string; confidence: number; category: string }> = [];
  
  // Map predictions to classes with categories
  const categories = ['melanoma', 'acne', 'injury', 'benign', 'other'];
  const classesPerCategory = [4, 6, 18, 5, 6]; // Updated for enhanced injury detection
  
  let classIndex = 0;
  categories.forEach((category, categoryIndex) => {
    const numClasses = classesPerCategory[categoryIndex];
    for (let i = 0; i < numClasses; i++) {
      const confidence = probabilities[classIndex];
      if (confidence > threshold) {
        results.push({
          class: SKIN_ANALYSIS_MODEL_INFO.classes[classIndex],
          confidence,
          category
        });
      }
      classIndex++;
    }
  });
  
  // Sort by confidence and return top results
  return results.sort((a, b) => b.confidence - a.confidence);
}

// Initialize model manager on module load
export const modelManager = ModelManager.getInstance();

// Preload the skin analysis model when the module is imported
if (typeof window !== 'undefined') {
  // Only preload in browser environment
  modelManager.preloadSkinAnalysisModel().catch(console.warn);
}