import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2)
}

export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: number,
  goal: 'lose' | 'maintain' | 'gain'
): number {
  // Fórmula de Harris-Benedict
  let bmr: number
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  
  const tdee = bmr * activityLevel
  
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500) // Déficit de 500 calorias
    case 'gain':
      return Math.round(tdee + 500) // Superávit de 500 calorias
    default:
      return Math.round(tdee)
  }
}