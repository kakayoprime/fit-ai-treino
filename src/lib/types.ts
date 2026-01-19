export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  weight: number
  height: number
  gender: 'male' | 'female'
  goal: 'lose_weight' | 'gain_muscle' | 'maintain'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  workoutDays: number[]
  dietaryRestrictions: string[]
  availableEquipment: string[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutPlan {
  id: string
  userId: string
  name: string
  description: string
  duration: number // em semanas
  workouts: DailyWorkout[]
  createdAt: Date
}

export interface DailyWorkout {
  day: number
  name: string
  exercises: Exercise[]
  estimatedDuration: number // em minutos
}

export interface Exercise {
  id: string
  name: string
  category: string
  sets: number
  reps: string
  rest: number // em segundos
  instructions: string
  targetMuscles: string[]
  equipment: string[]
}

export interface DietPlan {
  id: string
  userId: string
  name: string
  description: string
  dailyCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: DailyMeal[]
  createdAt: Date
}

export interface DailyMeal {
  day: number
  meals: Meal[]
}

export interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: Food[]
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

export interface Food {
  id: string
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface ProgressEntry {
  id: string
  userId: string
  date: Date
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  photos?: string[]
  notes?: string
}

export interface WorkoutSession {
  id: string
  userId: string
  workoutId: string
  date: Date
  duration: number // em minutos
  exercises: CompletedExercise[]
  notes?: string
  completed: boolean
}

export interface CompletedExercise {
  exerciseId: string
  sets: CompletedSet[]
}

export interface CompletedSet {
  reps: number
  weight?: number
  duration?: number // para exercícios de tempo
  completed: boolean
}