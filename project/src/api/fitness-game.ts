// Fitness Game API for personalized task generation and analysis
import { API_KEYS } from '../config/apiKeys';

export interface TaskRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'endurance' | 'rehabilitation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  instructions: string[];
  safetyTips: string[];
  points: number;
  targetMuscles?: string[];
  equipment?: string[];
  modifications?: string[];
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  healthConditions: string;
  fitnessGoal: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  medicalRestrictions: string;
}

export interface VideoAnalysisResult {
  taskCompleted: boolean;
  formQuality: 'excellent' | 'good' | 'fair' | 'poor';
  confidence: number;
  feedback: string[];
  pointsEarned: number;
  improvements: string[];
}

// Generate personalized fitness tasks using Groq AI
export const generatePersonalizedTasks = async (userProfile: UserProfile): Promise<TaskRecommendation[]> => {
  try {
    const grokApiKey = import.meta.env.VITE_GROK_API_KEY || 
                      process.env.REACT_APP_GROK_API_KEY || 
                      'GRQO_API_KEY';

    if (!grokApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Calculate BMI for better recommendations
    const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);
    const bmiCategory = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';

    const prompt = `You are an expert fitness coach and exercise physiologist. Generate 5 personalized, safe, and effective fitness tasks for this user.

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- BMI: ${bmi.toFixed(1)} (${bmiCategory})
- Health Conditions: ${userProfile.healthConditions || 'None'}
- Fitness Goal: ${userProfile.fitnessGoal}
- Activity Level: ${userProfile.activityLevel}
- Medical Restrictions: ${userProfile.medicalRestrictions || 'None'}

Please provide a JSON response with exactly 5 tasks in this format:
{
  "tasks": [
    {
      "id": "task_1",
      "title": "Exercise Name",
      "description": "Brief description of the exercise and its benefits",
      "category": "cardio|strength|flexibility|balance|endurance|rehabilitation",
      "difficulty": "beginner|intermediate|advanced",
      "duration": "X minutes" or "X repetitions" or "X sets",
      "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "safetyTips": ["Safety tip 1", "Safety tip 2"],
      "points": 15,
      "targetMuscles": ["muscle group 1", "muscle group 2"],
      "equipment": ["equipment needed or 'none'"],
      "modifications": ["easier version", "harder version"]
    }
  ]
}

IMPORTANT GUIDELINES:
1. **Age-Appropriate**: Adjust intensity based on age (${userProfile.age} years)
2. **BMI Considerations**: Account for ${bmiCategory} BMI category
3. **Health Conditions**: Consider "${userProfile.healthConditions}" - avoid contraindicated exercises
4. **Fitness Goal**: Align with "${userProfile.fitnessGoal}"
5. **Activity Level**: Match current "${userProfile.activityLevel}" level
6. **Safety First**: Include proper warm-up and safety considerations
7. **Progressive Difficulty**: Start easier and gradually increase
8. **Equipment**: Prefer bodyweight or minimal equipment exercises
9. **Time Realistic**: 5-15 minute exercises suitable for home environment
10. **Medical Restrictions**: Respect "${userProfile.medicalRestrictions}"

SPECIFIC CONSIDERATIONS:
- If age > 60: Focus on balance, flexibility, low-impact exercises
- If age < 25: Can include higher intensity exercises
- If BMI > 30: Emphasize low-impact, joint-friendly exercises
- If health conditions mentioned: Provide appropriate modifications
- If sedentary: Start with very basic movements
- If very active: Include challenging variations

Ensure all exercises are:
- Safe for home environment
- Clearly explained with step-by-step instructions
- Appropriate for the user's fitness level
- Aligned with their specific goals
- Include proper safety warnings`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fitness coach and exercise physiologist specializing in personalized workout programs. Provide safe, effective, and age-appropriate exercise recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse.tasks || [];
      }
    } catch (parseError) {
      console.warn('Failed to parse AI JSON response, using fallback');
    }

    // Fallback tasks if AI parsing fails
    return generateFallbackTasks(userProfile);

  } catch (error) {
    console.error('Task generation error:', error);
    return generateFallbackTasks(userProfile);
  }
};

// Fallback task generation when AI fails
const generateFallbackTasks = (userProfile: UserProfile): TaskRecommendation[] => {
  const isOlderAdult = userProfile.age > 60;
  const isYoungAdult = userProfile.age < 30;
  const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);
  const isOverweight = bmi > 25;
  const isSedentary = userProfile.activityLevel === 'sedentary';

  const baseTasks: TaskRecommendation[] = [
    {
      id: 'task_1',
      title: isOlderAdult ? 'Gentle Chair Exercises' : 'Bodyweight Squats',
      description: isOlderAdult 
        ? 'Low-impact seated exercises to improve circulation and flexibility'
        : 'Strengthen your legs and glutes with this fundamental exercise',
      category: isOlderAdult ? 'flexibility' : 'strength',
      difficulty: isSedentary ? 'beginner' : 'intermediate',
      duration: isOlderAdult ? '5 minutes' : '10 repetitions',
      instructions: isOlderAdult ? [
        'Sit comfortably in a sturdy chair',
        'Lift your arms overhead slowly',
        'Rotate your ankles clockwise and counterclockwise',
        'Gently twist your torso left and right'
      ] : [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting in a chair',
        'Keep your chest up and knees behind toes',
        'Return to standing position'
      ],
      safetyTips: [
        'Stop if you feel any pain or discomfort',
        'Breathe steadily throughout the exercise',
        'Move slowly and controlled'
      ],
      points: 15,
      targetMuscles: isOlderAdult ? ['full body'] : ['quadriceps', 'glutes', 'hamstrings'],
      equipment: isOlderAdult ? ['chair'] : ['none'],
      modifications: ['Reduce range of motion if needed', 'Use wall support if balance is an issue']
    },
    {
      id: 'task_2',
      title: isOverweight ? 'Low-Impact Marching' : 'Push-ups',
      description: isOverweight 
        ? 'Gentle cardiovascular exercise that\'s easy on the joints'
        : 'Build upper body strength with this classic exercise',
      category: isOverweight ? 'cardio' : 'strength',
      difficulty: 'beginner',
      duration: isOverweight ? '3 minutes' : '5-10 repetitions',
      instructions: isOverweight ? [
        'Stand with feet hip-width apart',
        'March in place, lifting knees to comfortable height',
        'Swing arms naturally as you march',
        'Maintain steady breathing'
      ] : [
        'Start in plank position with hands under shoulders',
        'Lower your chest toward the ground',
        'Push back up to starting position',
        'Keep your body in a straight line'
      ],
      safetyTips: [
        'Start slowly and gradually increase pace',
        'Stay hydrated',
        'Stop if you feel dizzy or short of breath'
      ],
      points: 20,
      targetMuscles: isOverweight ? ['legs', 'core'] : ['chest', 'shoulders', 'triceps'],
      equipment: ['none'],
      modifications: ['Wall push-ups for easier version', 'Knee push-ups for intermediate']
    },
    {
      id: 'task_3',
      title: 'Stretching Routine',
      description: 'Improve flexibility and reduce muscle tension',
      category: 'flexibility',
      difficulty: 'beginner',
      duration: '5 minutes',
      instructions: [
        'Neck rolls: Gently roll your head in circles',
        'Shoulder shrugs: Lift shoulders up and release',
        'Arm circles: Make small and large circles',
        'Gentle spinal twist while seated or standing'
      ],
      safetyTips: [
        'Never force a stretch',
        'Hold each stretch for 15-30 seconds',
        'Breathe deeply during stretches'
      ],
      points: 10,
      targetMuscles: ['neck', 'shoulders', 'back'],
      equipment: ['none'],
      modifications: ['Use chair for support', 'Reduce range of motion if tight']
    },
    {
      id: 'task_4',
      title: isYoungAdult ? 'Jumping Jacks' : 'Standing Balance Exercise',
      description: isYoungAdult 
        ? 'Full-body cardio exercise to get your heart pumping'
        : 'Improve balance and stability for daily activities',
      category: isYoungAdult ? 'cardio' : 'balance',
      difficulty: isYoungAdult ? 'intermediate' : 'beginner',
      duration: isYoungAdult ? '30 seconds' : '1 minute each leg',
      instructions: isYoungAdult ? [
        'Stand with feet together, arms at sides',
        'Jump while spreading legs and raising arms overhead',
        'Jump back to starting position',
        'Maintain steady rhythm'
      ] : [
        'Stand behind a chair for support',
        'Lift one foot slightly off the ground',
        'Hold for 10-30 seconds',
        'Switch to the other leg'
      ],
      safetyTips: [
        'Land softly on the balls of your feet',
        'Use chair for balance support if needed',
        'Stop if you feel unsteady'
      ],
      points: isYoungAdult ? 25 : 15,
      targetMuscles: isYoungAdult ? ['full body'] : ['core', 'legs'],
      equipment: ['none'],
      modifications: ['Step-touches instead of jumping', 'Hold wall for extra support']
    },
    {
      id: 'task_5',
      title: 'Deep Breathing Exercise',
      description: 'Reduce stress and improve oxygen flow throughout your body',
      category: 'endurance',
      difficulty: 'beginner',
      duration: '3 minutes',
      instructions: [
        'Sit or lie down comfortably',
        'Place one hand on chest, one on belly',
        'Breathe in slowly through nose for 4 counts',
        'Hold breath for 2 counts',
        'Exhale slowly through mouth for 6 counts'
      ],
      safetyTips: [
        'Don\'t force your breathing',
        'If you feel dizzy, return to normal breathing',
        'Practice in a quiet, comfortable space'
      ],
      points: 10,
      targetMuscles: ['diaphragm', 'core'],
      equipment: ['none'],
      modifications: ['Shorter breath counts if needed', 'Can be done sitting or lying down']
    }
  ];

  return baseTasks;
};

// Simulate video analysis (in real app, this would use computer vision)
export const analyzeTaskVideo = async (
  videoBlob: Blob, 
  task: TaskRecommendation
): Promise<VideoAnalysisResult> => {
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI analysis results
    const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
    const taskCompleted = confidence > 0.75;
    const formQuality = confidence > 0.9 ? 'excellent' : 
                       confidence > 0.8 ? 'good' : 
                       confidence > 0.7 ? 'fair' : 'poor';
    
    const pointsEarned = taskCompleted ? 
      Math.floor(task.points * confidence) : 
      Math.floor(task.points * 0.3);

    const feedback: string[] = [];
    const improvements: string[] = [];

    if (taskCompleted) {
      feedback.push('Great job completing the exercise!');
      if (formQuality === 'excellent') {
        feedback.push('Your form was excellent throughout the exercise.');
      } else if (formQuality === 'good') {
        feedback.push('Good form overall with minor areas for improvement.');
      }
    } else {
      feedback.push('Task partially completed. Keep practicing!');
      improvements.push('Focus on completing the full range of motion');
    }

    // Add specific feedback based on task category
    switch (task.category) {
      case 'strength':
        if (formQuality !== 'excellent') {
          improvements.push('Maintain proper posture throughout the movement');
          improvements.push('Control the speed of each repetition');
        }
        break;
      case 'cardio':
        feedback.push('Good cardiovascular effort detected');
        if (formQuality !== 'excellent') {
          improvements.push('Try to maintain consistent pace');
        }
        break;
      case 'flexibility':
        feedback.push('Nice work on flexibility training');
        improvements.push('Hold stretches for the full duration');
        break;
      case 'balance':
        if (taskCompleted) {
          feedback.push('Excellent balance control demonstrated');
        } else {
          improvements.push('Use wall support if needed for stability');
        }
        break;
    }

    return {
      taskCompleted,
      formQuality,
      confidence,
      feedback,
      pointsEarned,
      improvements
    };

  } catch (error) {
    console.error('Video analysis error:', error);
    
    // Fallback result
    return {
      taskCompleted: true,
      formQuality: 'fair',
      confidence: 0.6,
      feedback: ['Task analysis completed'],
      pointsEarned: Math.floor(task.points * 0.6),
      improvements: ['Keep practicing to improve form']
    };
  }
};

// Get motivational messages based on performance
export const getMotivationalMessage = (
  totalPoints: number, 
  tasksCompleted: number, 
  totalTasks: number
): string => {
  const completionRate = tasksCompleted / totalTasks;
  const avgPointsPerTask = tasksCompleted > 0 ? totalPoints / tasksCompleted : 0;

  if (completionRate === 1 && avgPointsPerTask >= 20) {
    return "🏆 Outstanding performance! You're a true Eco-Warrior champion! The animals are forever grateful!";
  } else if (completionRate >= 0.8 && avgPointsPerTask >= 15) {
    return "🌟 Excellent work! You're making great progress as a Guardian of Nature!";
  } else if (completionRate >= 0.6) {
    return "💪 Good effort! Keep pushing yourself to save more animals and restore habitats!";
  } else {
    return "🎯 Every rescue counts! Keep practicing and you'll become a master Eco-Warrior!";
  }
};

// AR Exercise mapping for rescue actions
export const getARRescueAction = (exerciseType: string): {
  action: string;
  effect: string;
  animalImpact: string;
  habitatImpact: string;
} => {
  const rescueActions: { [key: string]: any } = {
    squats: {
      action: "Lift heavy debris to free trapped animals",
      effect: "Magical lifting power that moves boulders and fallen trees",
      animalImpact: "Frees 1 trapped animal per 3 reps",
      habitatImpact: "Clears pathways for animal migration"
    },
    jumping_jacks: {
      action: "Charge rescue beacons to guide lost animals home",
      effect: "Lightning energy that powers rescue beacons across the landscape",
      animalImpact: "Guides 1 lost animal home per 4 reps",
      habitatImpact: "Illuminates safe paths through the wilderness"
    },
    push_ups: {
      action: "Build shelters and safe havens for rescued animals",
      effect: "Construction magic that creates cozy animal shelters",
      animalImpact: "Builds shelter for 1 animal family per 2 reps",
      habitatImpact: "Creates permanent safe zones in habitats"
    },
    running: {
      action: "Track and follow lost animal signals through the wilderness",
      effect: "Speed boost that reveals hidden animal tracks and trails",
      animalImpact: "Locates 1 missing animal per 30 seconds",
      habitatImpact: "Maps safe corridors between habitats"
    },
    yoga_poses: {
      action: "Heal injured creatures with calming energy",
      effect: "Healing aura that restores health to wounded animals",
      animalImpact: "Heals 1 injured animal per pose held for 30 seconds",
      habitatImpact: "Restores natural balance to ecosystems"
    },
    planks: {
      action: "Create bridges to help animals cross dangerous terrain",
      effect: "Earth-shaping power that forms safe pathways",
      animalImpact: "Enables safe passage for 5 animals per 30-second hold",
      habitatImpact: "Connects fragmented habitats"
    },
    lunges: {
      action: "Navigate through obstacles to reach trapped animals",
      effect: "Agility enhancement that allows precise movement through hazards",
      animalImpact: "Rescues 1 animal from dangerous terrain per 4 reps",
      habitatImpact: "Creates safe access routes to remote areas"
    },
    stretching: {
      action: "Restore damaged ecosystems with gentle care",
      effect: "Nature restoration magic that brings life back to barren lands",
      animalImpact: "Revives habitat for 3 animals per stretch session",
      habitatImpact: "Regenerates 10% of damaged ecosystem per session"
    }
  };
  
  return rescueActions[exerciseType] || rescueActions.squats;
};

// Calculate rescue impact based on exercise performance
export const calculateRescueImpact = (
  exerciseType: string,
  repsCompleted: number,
  timeHeld: number,
  formQuality: 'excellent' | 'good' | 'fair' | 'poor'
): {
  animalsRescued: number;
  habitatProgress: number;
  specialUnlocks: string[];
} => {
  const qualityMultiplier = {
    excellent: 1.5,
    good: 1.2,
    fair: 1.0,
    poor: 0.7
  };
  
  const baseAnimalsRescued = Math.floor(repsCompleted / 3) * qualityMultiplier[formQuality];
  const baseHabitatProgress = Math.floor(repsCompleted / 5) * qualityMultiplier[formQuality];
  
  const specialUnlocks: string[] = [];
  
  // Special unlocks based on performance
  if (repsCompleted >= 20 && formQuality === 'excellent') {
    specialUnlocks.push('Golden Rescue Badge');
  }
  if (timeHeld >= 300) { // 5 minutes
    specialUnlocks.push('Endurance Explorer Title');
  }
  if (baseAnimalsRescued >= 10) {
    specialUnlocks.push('Animal Whisperer Achievement');
  }
  
  return {
    animalsRescued: Math.floor(baseAnimalsRescued),
    habitatProgress: Math.floor(baseHabitatProgress),
    specialUnlocks
  };
};

// Generate fitness insights based on user performance
export const generateFitnessInsights = async (
  userProfile: UserProfile,
  completedTasks: any[],
  totalPoints: number
): Promise<string[]> => {
  try {
    const grokApiKey = import.meta.env.VITE_GROK_API_KEY || 
                      process.env.REACT_APP_GROK_API_KEY || 
                      'GRQO_API_KEY';

    const prompt = `As a fitness expert and eco-adventure guide, analyze this user's performance and provide 5 personalized insights and recommendations for their animal rescue fitness journey.

USER PROFILE:
- Age: ${userProfile.age}
- Fitness Goal: ${userProfile.fitnessGoal}
- Activity Level: ${userProfile.activityLevel}

PERFORMANCE DATA:
- Tasks Completed: ${completedTasks.length}
- Total Points: ${totalPoints}
- Average Points per Task: ${(totalPoints / completedTasks.length).toFixed(1)}

Provide insights as a simple list of 5 actionable recommendations that relate to both fitness improvement and their role as an eco-warrior rescuing animals.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a fitness expert and eco-adventure guide providing personalized insights for animal rescue fitness missions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 512,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const insights = data.choices[0].message.content
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 5);
      return insights;
    }
  } catch (error) {
    console.error('Insights generation error:', error);
  }

  // Fallback insights
  return [
    'Continue your rescue missions regularly to build consistency and save more animals',
    'Gradually increase exercise intensity to unlock more powerful rescue abilities',
    'Focus on proper form to maximize your rescue impact and animal safety',
    'Combine different exercise types to become a well-rounded eco-warrior',
    'Stay hydrated and rest well between missions to maintain your rescue powers'
  ];
};