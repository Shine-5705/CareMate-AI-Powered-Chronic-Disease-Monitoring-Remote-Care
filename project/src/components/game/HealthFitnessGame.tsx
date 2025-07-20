import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Square, Camera, RotateCcw, Trophy, Heart, Zap, Home, MapPin, Sparkles, Target, Timer, Award } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { generatePersonalizedTasks, analyzeTaskVideo, getMotivationalMessage, UserProfile } from '../../api/fitness-game';

interface HealthFitnessGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Exercise {
  id: string;
  name: string;
  icon: string;
  description: string;
  rescueAction: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pointsPerRep: number;
  arEffect: string;
}

interface AnimalSpecies {
  id: string;
  name: string;
  icon: string;
  habitat: string;
  unlockPoints: number;
  rescued: boolean;
}

interface ARHabitat {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockPoints: number;
  restored: boolean;
  animals: string[];
}

interface GameSession {
  selectedExercises: Exercise[];
  currentExercise: Exercise | null;
  repsCompleted: number;
  totalPoints: number;
  animalsRescued: number;
  habitatsRestored: number;
  sessionTime: number;
  isActive: boolean;
}

const HealthFitnessGame: React.FC<HealthFitnessGameProps> = ({ isOpen, onClose }) => {
  const [gamePhase, setGamePhase] = useState<'setup' | 'exercise-selection' | 'profile' | 'playing' | 'results'>('setup');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    healthConditions: '',
    fitnessGoal: '',
    activityLevel: 'moderate',
    medicalRestrictions: ''
  });
  
  const [gameSession, setGameSession] = useState<GameSession>({
    selectedExercises: [],
    currentExercise: null,
    repsCompleted: 0,
    totalPoints: 0,
    animalsRescued: 0,
    habitatsRestored: 0,
    sessionTime: 0,
    isActive: false
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [arMode, setArMode] = useState(false);
  const [unlockedAnimals, setUnlockedAnimals] = useState<string[]>(['fox', 'rabbit']);
  const [unlockedHabitats, setUnlockedHabitats] = useState<string[]>(['forest']);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available exercises with AR rescue actions
  const availableExercises: Exercise[] = [
    {
      id: 'squats',
      name: 'Squats',
      icon: '🏋️',
      description: 'Lower body strength exercise',
      rescueAction: 'Lift heavy debris to free trapped animals',
      category: 'strength',
      difficulty: 'beginner',
      pointsPerRep: 15,
      arEffect: 'Magical lifting power that moves boulders and fallen trees'
    },
    {
      id: 'jumping_jacks',
      name: 'Jumping Jacks',
      icon: '🤸',
      description: 'Full-body cardio exercise',
      rescueAction: 'Charge rescue beacons to guide lost animals home',
      category: 'cardio',
      difficulty: 'beginner',
      pointsPerRep: 10,
      arEffect: 'Lightning energy that powers rescue beacons across the landscape'
    },
    {
      id: 'push_ups',
      name: 'Push-ups',
      icon: '💪',
      description: 'Upper body strength exercise',
      rescueAction: 'Build shelters and safe havens for rescued animals',
      category: 'strength',
      difficulty: 'intermediate',
      pointsPerRep: 20,
      arEffect: 'Construction magic that creates cozy animal shelters'
    },
    {
      id: 'running',
      name: 'Running in Place',
      icon: '🏃',
      description: 'Cardio endurance exercise',
      rescueAction: 'Track and follow lost animal signals through the wilderness',
      category: 'cardio',
      difficulty: 'intermediate',
      pointsPerRep: 12,
      arEffect: 'Speed boost that reveals hidden animal tracks and trails'
    },
    {
      id: 'yoga_poses',
      name: 'Yoga Poses',
      icon: '🧘',
      description: 'Flexibility and mindfulness',
      rescueAction: 'Heal injured creatures with calming energy',
      category: 'flexibility',
      difficulty: 'beginner',
      pointsPerRep: 25,
      arEffect: 'Healing aura that restores health to wounded animals'
    },
    {
      id: 'planks',
      name: 'Planks',
      icon: '🏗️',
      description: 'Core strength exercise',
      rescueAction: 'Create bridges to help animals cross dangerous terrain',
      category: 'strength',
      difficulty: 'intermediate',
      pointsPerRep: 30,
      arEffect: 'Earth-shaping power that forms safe pathways'
    },
    {
      id: 'lunges',
      name: 'Lunges',
      icon: '🦵',
      description: 'Lower body strength and balance',
      rescueAction: 'Navigate through obstacles to reach trapped animals',
      category: 'balance',
      difficulty: 'intermediate',
      pointsPerRep: 18,
      arEffect: 'Agility enhancement that allows precise movement through hazards'
    },
    {
      id: 'stretching',
      name: 'Stretching',
      icon: '🤲',
      description: 'Flexibility and recovery',
      rescueAction: 'Restore damaged ecosystems with gentle care',
      category: 'flexibility',
      difficulty: 'beginner',
      pointsPerRep: 15,
      arEffect: 'Nature restoration magic that brings life back to barren lands'
    }
  ];

  // Animal species to rescue
  const animalSpecies: AnimalSpecies[] = [
    { id: 'fox', name: 'Arctic Fox', icon: '🦊', habitat: 'tundra', unlockPoints: 0, rescued: true },
    { id: 'rabbit', name: 'Forest Rabbit', icon: '🐰', habitat: 'forest', unlockPoints: 0, rescued: true },
    { id: 'deer', name: 'White-tailed Deer', icon: '🦌', habitat: 'forest', unlockPoints: 100, rescued: false },
    { id: 'eagle', name: 'Golden Eagle', icon: '🦅', habitat: 'mountains', unlockPoints: 200, rescued: false },
    { id: 'whale', name: 'Blue Whale', icon: '🐋', habitat: 'ocean', unlockPoints: 300, rescued: false },
    { id: 'panda', name: 'Giant Panda', icon: '🐼', habitat: 'bamboo_forest', unlockPoints: 400, rescued: false },
    { id: 'tiger', name: 'Bengal Tiger', icon: '🐅', habitat: 'jungle', unlockPoints: 500, rescued: false },
    { id: 'penguin', name: 'Emperor Penguin', icon: '🐧', habitat: 'antarctica', unlockPoints: 600, rescued: false }
  ];

  // AR Habitats to restore
  const arHabitats: ARHabitat[] = [
    {
      id: 'forest',
      name: 'Enchanted Forest',
      icon: '🌲',
      description: 'A magical woodland home to many creatures',
      unlockPoints: 0,
      restored: true,
      animals: ['rabbit', 'deer']
    },
    {
      id: 'ocean',
      name: 'Crystal Ocean',
      icon: '🌊',
      description: 'Pristine waters teeming with marine life',
      unlockPoints: 150,
      restored: false,
      animals: ['whale', 'dolphin']
    },
    {
      id: 'mountains',
      name: 'Mystic Mountains',
      icon: '⛰️',
      description: 'Towering peaks where eagles soar',
      unlockPoints: 250,
      restored: false,
      animals: ['eagle', 'mountain_goat']
    },
    {
      id: 'jungle',
      name: 'Emerald Jungle',
      icon: '🌴',
      description: 'Dense rainforest full of exotic wildlife',
      unlockPoints: 350,
      restored: false,
      animals: ['tiger', 'monkey', 'parrot']
    },
    {
      id: 'tundra',
      name: 'Arctic Tundra',
      icon: '🏔️',
      description: 'Frozen wilderness of the far north',
      unlockPoints: 450,
      restored: false,
      animals: ['fox', 'polar_bear']
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setGamePhase('setup');
      setGameSession({
        selectedExercises: [],
        currentExercise: null,
        repsCompleted: 0,
        totalPoints: 0,
        animalsRescued: 0,
        habitatsRestored: 0,
        sessionTime: 0,
        isActive: false
      });
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameSession.isActive) {
      interval = setInterval(() => {
        setGameSession(prev => ({
          ...prev,
          sessionTime: prev.sessionTime + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameSession.isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startCamera();
    }

    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(videoBlob);
        setIsRecording(false);
      };

      setIsRecording(true);
      mediaRecorder.start();

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 60000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeExercise = async () => {
    if (!recordedVideo || !gameSession.currentExercise) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeTaskVideo(recordedVideo, {
        id: gameSession.currentExercise.id,
        title: gameSession.currentExercise.name,
        description: gameSession.currentExercise.description,
        category: gameSession.currentExercise.category,
        difficulty: gameSession.currentExercise.difficulty,
        duration: '60 seconds',
        instructions: [],
        safetyTips: [],
        points: gameSession.currentExercise.pointsPerRep
      });

      setAnalysisResult(result);
      
      // Update game session with results
      const pointsEarned = result.pointsEarned;
      const repsDetected = Math.floor(pointsEarned / gameSession.currentExercise.pointsPerRep);
      
      setGameSession(prev => ({
        ...prev,
        repsCompleted: prev.repsCompleted + repsDetected,
        totalPoints: prev.totalPoints + pointsEarned,
        animalsRescued: prev.animalsRescued + Math.floor(repsDetected / 3),
        habitatsRestored: prev.habitatsRestored + Math.floor(pointsEarned / 100)
      }));

      // Check for unlocks
      checkUnlocks(gameSession.totalPoints + pointsEarned);
      
    } catch (error) {
      console.error('Exercise analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkUnlocks = (totalPoints: number) => {
    // Check for new animal unlocks
    animalSpecies.forEach(animal => {
      if (totalPoints >= animal.unlockPoints && !unlockedAnimals.includes(animal.id)) {
        setUnlockedAnimals(prev => [...prev, animal.id]);
      }
    });

    // Check for new habitat unlocks
    arHabitats.forEach(habitat => {
      if (totalPoints >= habitat.unlockPoints && !unlockedHabitats.includes(habitat.id)) {
        setUnlockedHabitats(prev => [...prev, habitat.id]);
      }
    });
  };

  const selectExercise = (exercise: Exercise) => {
    if (gameSession.selectedExercises.find(ex => ex.id === exercise.id)) {
      // Remove if already selected
      setGameSession(prev => ({
        ...prev,
        selectedExercises: prev.selectedExercises.filter(ex => ex.id !== exercise.id)
      }));
    } else if (gameSession.selectedExercises.length < 5) {
      // Add if under limit
      setGameSession(prev => ({
        ...prev,
        selectedExercises: [...prev.selectedExercises, exercise]
      }));
    }
  };

  const startGameSession = () => {
    if (gameSession.selectedExercises.length === 0) return;
    
    setGameSession(prev => ({
      ...prev,
      currentExercise: prev.selectedExercises[0],
      isActive: true,
      sessionTime: 0
    }));
    setGamePhase('playing');
    startCamera();
  };

  const nextExercise = () => {
    const currentIndex = gameSession.selectedExercises.findIndex(ex => ex.id === gameSession.currentExercise?.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < gameSession.selectedExercises.length) {
      setGameSession(prev => ({
        ...prev,
        currentExercise: prev.selectedExercises[nextIndex]
      }));
      setRecordedVideo(null);
      setAnalysisResult(null);
    } else {
      // End session
      setGameSession(prev => ({ ...prev, isActive: false }));
      setGamePhase('results');
      stopCamera();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">🌍 EcoFit: Animal Rescue Adventure</h2>
            <p className="text-sm opacity-90 mt-1">
              Transform your workout into an epic mission to save animals and restore habitats!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Setup Phase */}
          {gamePhase === 'setup' && (
            <div className="text-center space-y-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Welcome to EcoFit Adventure!</h3>
                <p className="text-neutral-600 mb-6">
                  Embark on an immersive AR fitness journey where every exercise you perform helps rescue endangered animals 
                  and restore beautiful habitats. Your real-world movements become magical powers in a virtual ecosystem!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🏋️‍♀️</div>
                    <h4 className="font-semibold text-green-800">Choose Your Powers</h4>
                    <p className="text-sm text-green-700">Select exercises that become rescue abilities</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-2">🦋</div>
                    <h4 className="font-semibold text-blue-800">Save Animals</h4>
                    <p className="text-sm text-blue-700">Each rep rescues creatures in need</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">🌺</div>
                    <h4 className="font-semibold text-purple-800">Restore Nature</h4>
                    <p className="text-sm text-purple-700">Unlock and heal magical habitats</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setGamePhase('profile')}
                  variant="primary"
                  size="lg"
                  leftIcon={<Target className="h-5 w-5" />}
                >
                  Start Your Adventure
                </Button>
                <Button
                  onClick={() => setGamePhase('exercise-selection')}
                  variant="outline"
                  size="lg"
                >
                  Quick Start
                </Button>
              </div>
            </div>
          )}

          {/* Profile Setup */}
          {gamePhase === 'profile' && (
            <Card title="🎯 Customize Your Adventure">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Your adventure name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Fitness Goal</label>
                    <select
                      value={userProfile.fitnessGoal}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    >
                      <option value="">Select your mission</option>
                      <option value="weight_loss">Become a Swift Ranger (Weight Loss)</option>
                      <option value="muscle_gain">Become a Strong Guardian (Muscle Gain)</option>
                      <option value="endurance">Become an Endurance Explorer (Cardio)</option>
                      <option value="flexibility">Become a Zen Healer (Flexibility)</option>
                      <option value="general_fitness">Become a Balanced Protector (Overall Fitness)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Activity Level</label>
                    <select
                      value={userProfile.activityLevel}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, activityLevel: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    >
                      <option value="sedentary">Novice Adventurer (Sedentary)</option>
                      <option value="light">Apprentice Ranger (Light Activity)</option>
                      <option value="moderate">Skilled Guardian (Moderate Activity)</option>
                      <option value="active">Expert Protector (Active)</option>
                      <option value="very_active">Master Eco-Warrior (Very Active)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Health Conditions (Optional)</label>
                  <input
                    type="text"
                    value={userProfile.healthConditions}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, healthConditions: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Any conditions we should consider for your adventure"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setGamePhase('setup')}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setGamePhase('exercise-selection')}
                    variant="primary"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Choose Your Powers
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Exercise Selection */}
          {gamePhase === 'exercise-selection' && (
            <div className="space-y-6">
              <Card title="🎮 Choose Your Rescue Powers">
                <p className="text-neutral-600 mb-6">
                  Select up to 5 exercises that will become your magical abilities in the AR world. 
                  Each exercise maps to a unique rescue action!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableExercises.map((exercise) => {
                    const isSelected = gameSession.selectedExercises.find(ex => ex.id === exercise.id);
                    return (
                      <div
                        key={exercise.id}
                        onClick={() => selectExercise(exercise)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                            : 'border-neutral-200 hover:border-green-300 hover:bg-green-25'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{exercise.icon}</div>
                          <h4 className="font-semibold text-neutral-900">{exercise.name}</h4>
                          <p className="text-xs text-neutral-600 mb-2">{exercise.description}</p>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border border-blue-200 mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">🎯 Rescue Power:</p>
                            <p className="text-xs text-blue-700">{exercise.rescueAction}</p>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {exercise.difficulty}
                            </span>
                            <span className="font-medium text-purple-600">
                              {exercise.pointsPerRep} pts/rep
                            </span>
                          </div>
                          
                          {isSelected && (
                            <div className="mt-2 text-green-600 font-medium text-sm">
                              ✓ Power Selected!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Selected Powers: {gameSession.selectedExercises.length}/5
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gameSession.selectedExercises.map((exercise) => (
                      <span
                        key={exercise.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {exercise.icon} {exercise.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => setGamePhase('setup')}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={startGameSession}
                    variant="primary"
                    disabled={gameSession.selectedExercises.length === 0}
                    leftIcon={<Play className="h-4 w-4" />}
                  >
                    Begin Rescue Mission
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Playing Phase */}
          {gamePhase === 'playing' && gameSession.currentExercise && (
            <div className="space-y-6">
              {/* Game HUD */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{gameSession.currentExercise.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{gameSession.currentExercise.name}</h3>
                      <p className="text-sm opacity-90">{gameSession.currentExercise.rescueAction}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{gameSession.totalPoints}</div>
                    <div className="text-sm opacity-90">Rescue Points</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{gameSession.animalsRescued}</div>
                    <div className="text-xs opacity-90">🦋 Animals Saved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{gameSession.habitatsRestored}</div>
                    <div className="text-xs opacity-90">🌺 Habitats Restored</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{gameSession.repsCompleted}</div>
                    <div className="text-xs opacity-90">⚡ Powers Used</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{formatTime(gameSession.sessionTime)}</div>
                    <div className="text-xs opacity-90">⏱️ Mission Time</div>
                  </div>
                </div>
              </div>

              {/* AR Effect Visualization */}
              <Card title="🌟 AR Rescue Vision">
                <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-6 min-h-[200px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-lg"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-4">🌍</div>
                    <h4 className="font-bold text-lg text-neutral-800 mb-2">
                      {gameSession.currentExercise.arEffect}
                    </h4>
                    <p className="text-neutral-700 mb-4">
                      Perform {gameSession.currentExercise.name.toLowerCase()} to activate this rescue power!
                    </p>
                    
                    {/* Animated rescue scene */}
                    <div className="flex justify-center items-center space-x-4 mb-4">
                      <div className="animate-bounce">🐾</div>
                      <div className="text-2xl">→</div>
                      <div className="animate-pulse text-2xl">{gameSession.currentExercise.icon}</div>
                      <div className="text-2xl">→</div>
                      <div className="animate-bounce">💚</div>
                    </div>
                    
                    <div className="text-sm text-neutral-600">
                      {gameSession.repsCompleted > 0 && (
                        <div className="text-green-600 font-medium">
                          ✨ {gameSession.repsCompleted} rescue actions completed!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Video Recording */}
              <Card title="📹 Exercise Recording">
                <div className="space-y-4">
                  {!recordedVideo ? (
                    <div>
                      <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <p className="text-lg font-bold mb-2">🎯 Rescue Zone Active</p>
                            <p className="text-sm">Position yourself in frame and perform {gameSession.currentExercise.name}</p>
                          </div>
                        </div>
                        {isRecording && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            ● REC
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-center space-x-3">
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            variant="primary"
                            leftIcon={<Camera className="h-4 w-4" />}
                          >
                            Start Rescue Mission (60s)
                          </Button>
                        ) : (
                          <Button
                            onClick={stopRecording}
                            variant="outline"
                            leftIcon={<Square className="h-4 w-4" />}
                          >
                            Complete Mission
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">🎬</div>
                          <div>
                            <h4 className="font-semibold text-green-800">Mission Recorded!</h4>
                            <p className="text-sm text-green-700">Ready to analyze your rescue performance</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-3">
                        <Button
                          onClick={analyzeExercise}
                          variant="primary"
                          isLoading={isAnalyzing}
                          leftIcon={!isAnalyzing ? <Sparkles className="h-4 w-4" /> : undefined}
                        >
                          {isAnalyzing ? 'Analyzing Rescue...' : 'Analyze Rescue Performance'}
                        </Button>
                        <Button
                          onClick={() => {
                            setRecordedVideo(null);
                            setAnalysisResult(null);
                          }}
                          variant="outline"
                          leftIcon={<RotateCcw className="h-4 w-4" />}
                        >
                          Retry Mission
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Analysis Results */}
              {analysisResult && (
                <Card title="🏆 Mission Results">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${
                      analysisResult.taskCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-bold text-lg ${
                            analysisResult.taskCompleted ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {analysisResult.taskCompleted ? '🎉 Mission Successful!' : '⚡ Partial Success!'}
                          </h4>
                          <p className={`text-sm ${
                            analysisResult.taskCompleted ? 'text-green-700' : 'text-yellow-700'
                          }`}>
                            Form Quality: {analysisResult.formQuality} • Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">+{analysisResult.pointsEarned}</div>
                          <div className="text-sm text-purple-600">Rescue Points</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">🌟 Rescue Impact</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {analysisResult.feedback.map((feedback: string, index: number) => (
                            <li key={index}>• {feedback}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {analysisResult.improvements.length > 0 && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">💡 Power Enhancement Tips</h5>
                          <ul className="text-sm text-orange-700 space-y-1">
                            {analysisResult.improvements.map((improvement: string, index: number) => (
                              <li key={index}>• {improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={nextExercise}
                        variant="primary"
                        leftIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Continue Adventure
                      </Button>
                      <Button
                        onClick={() => {
                          setRecordedVideo(null);
                          setAnalysisResult(null);
                        }}
                        variant="outline"
                      >
                        Use Power Again
                      </Button>
                    </div>
                  </div>
                </Card>
                
              )}
            </div>
          )}

          {/* Results Phase */}
          {gamePhase === 'results' && (
            <div className="space-y-6">
              <Card title="🏆 Mission Complete!">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🌟</div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    Congratulations, Eco-Warrior!
                  </h3>
                  <p className="text-neutral-600">
                    You've completed an amazing rescue mission and made a real difference!
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">{gameSession.totalPoints}</div>
                      <div className="text-sm text-purple-700">Total Points</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{gameSession.animalsRescued}</div>
                      <div className="text-sm text-green-700">Animals Rescued</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{gameSession.habitatsRestored}</div>
                      <div className="text-sm text-blue-700">Habitats Restored</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">{formatTime(gameSession.sessionTime)}</div>
                      <div className="text-sm text-orange-700">Mission Time</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">🎖️ Achievement Unlocked!</h4>
                    <p className="text-green-700">
                      {getMotivationalMessage(gameSession.totalPoints, gameSession.selectedExercises.length, gameSession.selectedExercises.length)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Unlocked Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="🦋 Rescued Animals">
                  <div className="grid grid-cols-2 gap-3">
                    {animalSpecies.filter(animal => unlockedAnimals.includes(animal.id)).map((animal) => (
                      <div key={animal.id} className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                        <div className="text-2xl mb-1">{animal.icon}</div>
                        <div className="text-sm font-medium text-green-800">{animal.name}</div>
                        <div className="text-xs text-green-600">{animal.habitat}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="🌺 Restored Habitats">
                  <div className="space-y-3">
                    {arHabitats.filter(habitat => unlockedHabitats.includes(habitat.id)).map((habitat) => (
                      <div key={habitat.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{habitat.icon}</div>
                          <div>
                            <div className="font-medium text-blue-800">{habitat.name}</div>
                            <div className="text-sm text-blue-600">{habitat.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => {
                    setGamePhase('exercise-selection');
                    setGameSession({
                      selectedExercises: [],
                      currentExercise: null,
                      repsCompleted: 0,
                      totalPoints: 0,
                      animalsRescued: 0,
                      habitatsRestored: 0,
                      sessionTime: 0,
                      isActive: false
                    });
                  }}
                  variant="primary"
                  leftIcon={<Play className="h-4 w-4" />}
                >
                  Start New Mission
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default HealthFitnessGame;