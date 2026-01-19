"use client"

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Calendar, 
  Target, 
  TrendingUp, 
  Dumbbell, 
  Apple,
  User,
  Settings,
  BarChart3,
  Clock,
  Flame,
  Trophy,
  Play,
  CheckCircle,
  Timer,
  Utensils,
  Scale,
  Zap,
  ChevronRight,
  Star,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Minus,
  Heart,
  AlertCircle,
  Download,
  Sparkles,
  Camera,
  Upload,
  Save
} from 'lucide-react'
import { cn } from '@/lib/utils'
import jsPDF from 'jspdf'

// Tipos para o formulário
interface UserData {
  // Dados básicos
  name: string
  age: number
  gender: 'male' | 'female' | ''
  height: number
  weight: number
  
  // Avatar
  avatar?: string
  
  // Objetivo
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | ''
  targetWeight?: number
  timeline: '1_month' | '3_months' | '6_months' | '1_year' | ''
  
  // Experiência e disponibilidade
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | ''
  workoutDays: number[]
  workoutDuration: '30' | '45' | '60' | '90' | ''
  
  // Equipamentos e local
  workoutLocation: 'home' | 'gym' | 'both' | ''
  equipment: string[]
  
  // Restrições e preferências
  injuries: string[]
  dietaryRestrictions: string[]
  foodPreferences: string[]
  
  // Estilo de vida
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | ''
  sleepHours: number
  stressLevel: 'low' | 'medium' | 'high' | ''
}

// Componente Card reutilizável
function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Componente de Métrica
function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  color = "blue" 
}: {
  title: string
  value: string | number
  unit?: string
  icon: React.ElementType
  trend?: number
  color?: "blue" | "purple" | "cyan" | "green" | "orange"
}) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500", 
    cyan: "from-cyan-500 to-teal-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500"
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-slate-400 text-sm ml-1">{unit}</span>}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Componente de Navegação
function Navigation({ activeTab, setActiveTab }: { 
  activeTab: string
  setActiveTab: (tab: string) => void 
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'diet', label: 'Dieta', icon: Apple },
    { id: 'profile', label: 'Perfil', icon: User },
  ]

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">FitAI Pro</h1>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Função para gerar PDF
function generatePDF(userData: UserData | null, userPlans: any) {
  const pdf = new jsPDF()
  
  // Configurações
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  let yPosition = 20

  // Título
  pdf.setFontSize(24)
  pdf.setTextColor(59, 130, 246) // Azul
  pdf.text('FitAI Pro - Seu Plano Personalizado', margin, yPosition)
  yPosition += 15

  // Informações do usuário
  if (userData) {
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Nome: ${userData.name}`, margin, yPosition)
    yPosition += 8
    pdf.setFontSize(12)
    pdf.text(`Idade: ${userData.age} anos | Peso: ${userData.weight}kg | Altura: ${userData.height}cm`, margin, yPosition)
    yPosition += 8
    const goalText = userData.goal === 'lose_weight' ? 'Perder Peso' : userData.goal === 'gain_muscle' ? 'Ganhar Massa' : 'Manutenção'
    pdf.text(`Objetivo: ${goalText}`, margin, yPosition)
    yPosition += 15
  }

  // Plano de Treino
  if (userPlans?.workout) {
    pdf.setFontSize(18)
    pdf.setTextColor(59, 130, 246)
    pdf.text('Plano de Treino', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Frequência: ${userPlans.workout.frequency}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Duração: ${userPlans.workout.duration}`, margin, yPosition)
    yPosition += 10

    pdf.setFontSize(14)
    pdf.text('Exercícios:', margin, yPosition)
    yPosition += 8

    userPlans.workout.exercises.forEach((exercise: any, index: number) => {
      pdf.setFontSize(11)
      pdf.text(`${index + 1}. ${exercise.name}`, margin + 5, yPosition)
      yPosition += 5
      pdf.setFontSize(10)
      pdf.text(`   ${exercise.sets} séries x ${exercise.reps} reps | Descanso: ${exercise.rest}`, margin + 5, yPosition)
      yPosition += 5
      pdf.text(`   Músculo: ${exercise.muscle}`, margin + 5, yPosition)
      yPosition += 7

      // Nova página se necessário
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
    })
  }

  // Plano de Dieta
  if (userPlans?.diet) {
    yPosition += 10
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(18)
    pdf.setTextColor(16, 185, 129) // Verde
    pdf.text('Plano Alimentar', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Calorias Totais: ${userPlans.diet.totalCalories} kcal/dia`, margin, yPosition)
    yPosition += 6
    pdf.text(`Proteínas: ${userPlans.diet.totalProtein}g | Carboidratos: ${userPlans.diet.totalCarbs}g | Gorduras: ${userPlans.diet.totalFat}g`, margin, yPosition)
    yPosition += 10

    pdf.setFontSize(14)
    pdf.text('Refeições:', margin, yPosition)
    yPosition += 8

    userPlans.diet.meals.forEach((meal: any, index: number) => {
      pdf.setFontSize(11)
      pdf.text(`${meal.name} - ${meal.time}`, margin + 5, yPosition)
      yPosition += 5
      pdf.setFontSize(10)
      pdf.text(`   ${meal.calories} kcal | Proteína: ${meal.protein}g | Carbo: ${meal.carbs}g | Gordura: ${meal.fat}g`, margin + 5, yPosition)
      yPosition += 5
      pdf.text(`   Alimentos: ${meal.foods.join(', ')}`, margin + 5, yPosition)
      yPosition += 7

      // Nova página se necessário
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
    })
  }

  // Salvar PDF
  const fileName = userData?.name ? `FitAI_${userData.name.replace(/\s+/g, '_')}.pdf` : 'FitAI_Plano.pdf'
  pdf.save(fileName)
}

// Função para gerar dieta com IA
async function generateDietWithAI(userData: UserData) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer fn_TJ9tjr_sQj-5cFao0o0rvVuzqyeSrADE0aEXS_UoOro`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista especializado em criar planos alimentares personalizados. Retorne APENAS um JSON válido com o plano de dieta.'
          },
          {
            role: 'user',
            content: `Crie um plano alimentar detalhado para:
- Nome: ${userData.name}
- Idade: ${userData.age} anos
- Peso: ${userData.weight}kg
- Altura: ${userData.height}cm
- Objetivo: ${userData.goal === 'lose_weight' ? 'Perder peso' : userData.goal === 'gain_muscle' ? 'Ganhar massa muscular' : 'Manter peso'}
- Nível de atividade: ${userData.activityLevel}
- Restrições alimentares: ${userData.dietaryRestrictions.join(', ') || 'Nenhuma'}
- Preferências: ${userData.foodPreferences.join(', ') || 'Nenhuma'}

Retorne um JSON com esta estrutura exata:
{
  "totalCalories": número,
  "totalProtein": número,
  "totalCarbs": número,
  "totalFat": número,
  "meals": [
    {
      "name": "Nome da refeição",
      "time": "HH:MM",
      "calories": número,
      "protein": número,
      "carbs": número,
      "fat": número,
      "foods": ["alimento 1", "alimento 2"],
      "preparation": "Instruções de preparo"
    }
  ]
}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro da API OpenAI:', response.status, errorText)
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Resposta da API inválida:', data)
      throw new Error('Resposta da API inválida')
    }

    const dietPlan = JSON.parse(data.choices[0].message.content)
    return dietPlan
  } catch (error) {
    console.error('Erro ao gerar dieta com IA:', error)
    // Retorna plano padrão em caso de erro
    return generateDefaultDiet(userData)
  }
}

// Função para gerar dieta padrão (fallback)
function generateDefaultDiet(userData: UserData) {
  const baseCalories = userData.goal === 'lose_weight' ? 1800 : userData.goal === 'gain_muscle' ? 2500 : 2200
  
  return {
    totalCalories: baseCalories,
    totalProtein: userData.goal === 'gain_muscle' ? 180 : 140,
    totalCarbs: userData.goal === 'lose_weight' ? 150 : 250,
    totalFat: userData.goal === 'lose_weight' ? 60 : 90,
    meals: [
      {
        name: "Café da Manhã",
        time: "07:00",
        calories: Math.round(baseCalories * 0.25),
        protein: 25,
        carbs: 35,
        fat: 15,
        foods: [
          "2 ovos mexidos",
          userData.dietaryRestrictions.includes('Glúten') ? "Tapioca" : "2 fatias de pão integral",
          "1 banana média",
          userData.dietaryRestrictions.includes('Lactose') ? "Leite vegetal" : "1 copo de leite desnatado"
        ],
        preparation: "Prepare os ovos mexidos com pouco óleo. Acompanhe com carboidrato de sua preferência."
      },
      {
        name: "Almoço",
        time: "12:00",
        calories: Math.round(baseCalories * 0.35),
        protein: 45,
        carbs: 60,
        fat: 20,
        foods: [
          userData.foodPreferences.includes('Frango') ? "150g de peito de frango grelhado" : "150g de peixe grelhado",
          "1 xícara de arroz integral",
          "Salada verde à vontade",
          "Legumes cozidos"
        ],
        preparation: "Grelhe a proteína com temperos naturais. Cozinhe o arroz e prepare os vegetais no vapor."
      },
      {
        name: "Lanche da Tarde",
        time: "16:00",
        calories: Math.round(baseCalories * 0.15),
        protein: 20,
        carbs: 25,
        fat: 10,
        foods: [
          userData.dietaryRestrictions.includes('Lactose') ? "Iogurte vegetal" : "1 pote de iogurte grego",
          "1 porção de frutas",
          "1 punhado de castanhas"
        ],
        preparation: "Misture o iogurte com as frutas e adicione as castanhas."
      },
      {
        name: "Jantar",
        time: "19:00",
        calories: Math.round(baseCalories * 0.25),
        protein: 40,
        carbs: 30,
        fat: 15,
        foods: [
          userData.foodPreferences.includes('Peixe') ? "150g de salmão" : "150g de frango",
          "Batata doce assada",
          "Brócolis no vapor",
          "Salada verde"
        ],
        preparation: "Asse ou grelhe a proteína. Cozinhe os vegetais no vapor e tempere com azeite."
      }
    ]
  }
}

// Componente do Formulário Inteligente
function PersonalizedPlanForm({ onComplete, onClose }: {
  onComplete: (userData: UserData, plans: any) => void
  onClose: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    goal: '',
    targetWeight: 0,
    timeline: '',
    fitnessLevel: '',
    workoutDays: [],
    workoutDuration: '',
    workoutLocation: '',
    equipment: [],
    injuries: [],
    dietaryRestrictions: [],
    foodPreferences: [],
    activityLevel: '',
    sleepHours: 8,
    stressLevel: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    {
      title: "Informações Básicas",
      description: "Vamos começar com seus dados pessoais"
    },
    {
      title: "Seus Objetivos",
      description: "O que você quer alcançar?"
    },
    {
      title: "Experiência e Disponibilidade",
      description: "Qual seu nível e tempo disponível?"
    },
    {
      title: "Equipamentos e Local",
      description: "Onde e com o que você vai treinar?"
    },
    {
      title: "Restrições e Preferências",
      description: "Alguma limitação ou preferência?"
    },
    {
      title: "Estilo de Vida",
      description: "Como é sua rotina atual?"
    }
  ]

  const updateUserData = (field: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }))
  }

  const generatePlans = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Gerar plano de treino
      const workoutPlan = {
        name: `Plano ${userData.goal === 'lose_weight' ? 'Emagrecimento' : userData.goal === 'gain_muscle' ? 'Ganho de Massa' : 'Manutenção'}`,
        duration: userData.timeline === '1_month' ? '4 semanas' : userData.timeline === '3_months' ? '12 semanas' : '24 semanas',
        frequency: `${userData.workoutDays.length}x por semana`,
        exercises: [
          {
            name: "Agachamento Livre",
            sets: userData.fitnessLevel === 'beginner' ? 3 : 4,
            reps: userData.goal === 'gain_muscle' ? "8-10" : "12-15",
            rest: "90s",
            difficulty: userData.fitnessLevel === 'beginner' ? 'Fácil' : 'Médio',
            muscle: "Quadríceps e Glúteos",
            instructions: "Mantenha os pés na largura dos ombros, desça até 90° e suba controladamente."
          },
          {
            name: "Flexão de Braço",
            sets: userData.fitnessLevel === 'beginner' ? 2 : 3,
            reps: userData.fitnessLevel === 'beginner' ? "8-12" : "12-20",
            rest: "60s",
            difficulty: userData.fitnessLevel === 'beginner' ? 'Fácil' : 'Médio',
            muscle: "Peito e Tríceps",
            instructions: "Mantenha o corpo alinhado, desça até o peito quase tocar o chão."
          }
        ]
      }

      // Gerar plano de dieta com IA
      const dietPlan = await generateDietWithAI(userData)

      const plans = { workout: workoutPlan, diet: dietPlan }
      setIsGenerating(false)
      onComplete(userData, plans)
    } catch (error) {
      console.error('Erro ao gerar planos:', error)
      setError('Erro ao gerar plano com IA. Usando plano padrão personalizado.')
      
      // Gera plano padrão mesmo com erro
      const workoutPlan = {
        name: `Plano ${userData.goal === 'lose_weight' ? 'Emagrecimento' : userData.goal === 'gain_muscle' ? 'Ganho de Massa' : 'Manutenção'}`,
        duration: userData.timeline === '1_month' ? '4 semanas' : userData.timeline === '3_months' ? '12 semanas' : '24 semanas',
        frequency: `${userData.workoutDays.length}x por semana`,
        exercises: [
          {
            name: "Agachamento Livre",
            sets: userData.fitnessLevel === 'beginner' ? 3 : 4,
            reps: userData.goal === 'gain_muscle' ? "8-10" : "12-15",
            rest: "90s",
            difficulty: userData.fitnessLevel === 'beginner' ? 'Fácil' : 'Médio',
            muscle: "Quadríceps e Glúteos",
            instructions: "Mantenha os pés na largura dos ombros, desça até 90° e suba controladamente."
          },
          {
            name: "Flexão de Braço",
            sets: userData.fitnessLevel === 'beginner' ? 2 : 3,
            reps: userData.fitnessLevel === 'beginner' ? "8-12" : "12-20",
            rest: "60s",
            difficulty: userData.fitnessLevel === 'beginner' ? 'Fácil' : 'Médio',
            muscle: "Peito e Tríceps",
            instructions: "Mantenha o corpo alinhado, desça até o peito quase tocar o chão."
          }
        ]
      }
      
      const dietPlan = generateDefaultDiet(userData)
      const plans = { workout: workoutPlan, diet: dietPlan }
      
      setTimeout(() => {
        setIsGenerating(false)
        onComplete(userData, plans)
      }, 2000)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => updateUserData('name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Como você gostaria de ser chamado?"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Idade</label>
                <input
                  type="number"
                  value={userData.age || ''}
                  onChange={(e) => updateUserData('age', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Anos"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Altura (cm)</label>
                <input
                  type="number"
                  value={userData.height || ''}
                  onChange={(e) => updateUserData('height', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="170"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={userData.weight || ''}
                  onChange={(e) => updateUserData('weight', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="70"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Gênero</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'male', label: 'Masculino' },
                  { value: 'female', label: 'Feminino' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('gender', option.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200",
                      userData.gender === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Qual é seu objetivo principal?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'lose_weight', label: 'Perder Peso', icon: Scale, color: 'from-red-500 to-pink-500' },
                  { value: 'gain_muscle', label: 'Ganhar Massa', icon: Dumbbell, color: 'from-blue-500 to-cyan-500' },
                  { value: 'maintain', label: 'Manter Forma', icon: Target, color: 'from-green-500 to-emerald-500' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('goal', option.value)}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.goal === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} mx-auto mb-3 flex items-center justify-center`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {userData.goal === 'lose_weight' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Peso desejado (kg)</label>
                <input
                  type="number"
                  value={userData.targetWeight || ''}
                  onChange={(e) => updateUserData('targetWeight', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meta de peso"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Em quanto tempo quer alcançar seu objetivo?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: '1_month', label: '1 Mês' },
                  { value: '3_months', label: '3 Meses' },
                  { value: '6_months', label: '6 Meses' },
                  { value: '1_year', label: '1 Ano' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('timeline', option.value)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.timeline === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Qual seu nível de experiência com exercícios?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'Iniciante', desc: 'Pouca ou nenhuma experiência' },
                  { value: 'intermediate', label: 'Intermediário', desc: 'Treino há alguns meses' },
                  { value: 'advanced', label: 'Avançado', desc: 'Treino há mais de 1 ano' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('fitnessLevel', option.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.fitnessLevel === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Quantos dias por semana você pode treinar?</label>
              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newDays = userData.workoutDays.includes(index)
                        ? userData.workoutDays.filter(d => d !== index)
                        : [...userData.workoutDays, index]
                      updateUserData('workoutDays', newDays)
                    }}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm",
                      userData.workoutDays.includes(index)
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Selecionados: {userData.workoutDays.length} dias
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Quanto tempo por treino?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: '30', label: '30 min' },
                  { value: '45', label: '45 min' },
                  { value: '60', label: '60 min' },
                  { value: '90', label: '90 min' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('workoutDuration', option.value)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.workoutDuration === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Onde você vai treinar?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'home', label: 'Em Casa', icon: Heart },
                  { value: 'gym', label: 'Academia', icon: Dumbbell },
                  { value: 'both', label: 'Ambos', icon: Target }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('workoutLocation', option.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.workoutLocation === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    <option.icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Quais equipamentos você tem acesso?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Halteres',
                  'Barras',
                  'Elásticos',
                  'Kettlebell',
                  'Máquinas',
                  'Peso Corporal',
                  'TRX',
                  'Bicicleta',
                  'Esteira'
                ].map((equipment) => (
                  <button
                    key={equipment}
                    onClick={() => toggleArrayItem('equipment', equipment)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm",
                      userData.equipment.includes(equipment)
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Você tem alguma lesão ou limitação física?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Joelho',
                  'Ombro',
                  'Costas',
                  'Punho',
                  'Tornozelo',
                  'Pescoço',
                  'Quadril',
                  'Cotovelo',
                  'Nenhuma'
                ].map((injury) => (
                  <button
                    key={injury}
                    onClick={() => toggleArrayItem('injuries', injury)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm",
                      userData.injuries.includes(injury)
                        ? "border-red-500 bg-red-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {injury}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Restrições alimentares</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Lactose',
                  'Glúten',
                  'Vegetariano',
                  'Vegano',
                  'Diabetes',
                  'Hipertensão',
                  'Nenhuma'
                ].map((restriction) => (
                  <button
                    key={restriction}
                    onClick={() => toggleArrayItem('dietaryRestrictions', restriction)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm",
                      userData.dietaryRestrictions.includes(restriction)
                        ? "border-yellow-500 bg-yellow-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Preferências alimentares</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Frango',
                  'Peixe',
                  'Carne Vermelha',
                  'Ovos',
                  'Frutas',
                  'Vegetais',
                  'Grãos',
                  'Laticínios',
                  'Nozes'
                ].map((preference) => (
                  <button
                    key={preference}
                    onClick={() => toggleArrayItem('foodPreferences', preference)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm",
                      userData.foodPreferences.includes(preference)
                        ? "border-green-500 bg-green-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Qual seu nível de atividade no dia a dia?</label>
              <div className="space-y-3">
                {[
                  { value: 'sedentary', label: 'Sedentário', desc: 'Trabalho de escritório, pouco movimento' },
                  { value: 'light', label: 'Levemente Ativo', desc: 'Caminhadas ocasionais, trabalho em pé' },
                  { value: 'moderate', label: 'Moderadamente Ativo', desc: 'Exercícios leves 1-3x por semana' },
                  { value: 'active', label: 'Ativo', desc: 'Exercícios regulares 3-5x por semana' },
                  { value: 'very_active', label: 'Muito Ativo', desc: 'Exercícios intensos 6-7x por semana' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('activityLevel', option.value)}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left",
                      userData.activityLevel === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Quantas horas você dorme por noite?</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateUserData('sleepHours', Math.max(4, userData.sleepHours - 1))}
                  className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-white">{userData.sleepHours}</div>
                  <div className="text-sm text-slate-400">horas</div>
                </div>
                <button
                  onClick={() => updateUserData('sleepHours', Math.min(12, userData.sleepHours + 1))}
                  className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Como está seu nível de estresse?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Baixo', color: 'from-green-500 to-emerald-500' },
                  { value: 'medium', label: 'Médio', color: 'from-yellow-500 to-orange-500' },
                  { value: 'high', label: 'Alto', color: 'from-red-500 to-pink-500' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateUserData('stressLevel', option.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                      userData.stressLevel === option.value
                        ? "border-blue-500 bg-blue-500/20 text-white"
                        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                    )}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${option.color} mx-auto mb-2`} />
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userData.name && userData.age && userData.gender && userData.height && userData.weight
      case 1:
        return userData.goal && userData.timeline
      case 2:
        return userData.fitnessLevel && userData.workoutDays.length > 0 && userData.workoutDuration
      case 3:
        return userData.workoutLocation && userData.equipment.length > 0
      case 4:
        return true // Opcional
      case 5:
        return userData.activityLevel && userData.stressLevel
      default:
        return false
    }
  }

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center">
          <div className="p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gerando seu plano personalizado com IA...
            </h3>
            <p className="text-slate-400 mb-6">
              Nossa IA está analisando suas informações e criando o plano perfeito de treino e dieta para você!
            </p>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <p className="text-yellow-400 text-sm">{error}</p>
              </div>
            )}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
            <p className="text-slate-400">{steps[currentStep].description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progresso</span>
            <span className="text-sm text-slate-400">{currentStep + 1} de {steps.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              currentStep === 0
                ? "text-slate-500 cursor-not-allowed"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={generatePlans}
              disabled={!canProceed()}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
                canProceed()
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105"
                  : "bg-slate-600 text-slate-400 cursor-not-allowed"
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Plano com IA</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={!canProceed()}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                canProceed()
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
                  : "bg-slate-600 text-slate-400 cursor-not-allowed"
              )}
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

// [Resto do código permanece igual - componentes Dashboard, WorkoutTab, DietTab, ProfileTab, etc.]
// Componente Dashboard
function Dashboard({ 
  showForm, 
  setShowForm, 
  userPlans, 
  userData,
  completedExercises,
  completedMeals
}: { 
  showForm: boolean
  setShowForm: (show: boolean) => void
  userPlans: any
  userData: UserData | null
  completedExercises: number[]
  completedMeals: number[]
}) {
  // Calcular dias de treino baseado nos dias selecionados pelo usuário
  const workoutDaysCount = userData?.workoutDays?.length || 0
  
  // Calcular calorias consumidas baseado nas refeições completadas
  const consumedCalories = userPlans?.diet?.meals
    ? userPlans.diet.meals
        .filter((_: any, index: number) => completedMeals.includes(index))
        .reduce((sum: number, meal: any) => sum + meal.calories, 0)
    : 0

  // Calcular tempo de treino baseado na duração selecionada
  const workoutTime = userData?.workoutDuration ? parseInt(userData.workoutDuration) : 45

  // Calcular progresso semanal real baseado nos dias de treino selecionados
  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const weekProgress = weekDays.map((day, index) => ({
    day,
    completed: userData?.workoutDays?.includes(index) || false,
    progress: userData?.workoutDays?.includes(index) ? 100 : 0
  }))

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {userData?.name ? `Olá, ${userData.name}! 💪` : 'Bem-vindo de volta! 💪'}
        </h2>
        <p className="text-slate-400">
          {userPlans ? 'Continue sua jornada de transformação' : 'Vamos começar sua jornada de transformação'}
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Dias de Treino"
          value={workoutDaysCount}
          unit="dias/semana"
          icon={Calendar}
          color="blue"
        />
        <MetricCard
          title="Peso Atual"
          value={userData?.weight || "75"}
          unit="kg"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Calorias Consumidas"
          value={consumedCalories}
          unit="kcal"
          icon={Flame}
          color="orange"
        />
        <MetricCard
          title="Tempo de Treino"
          value={workoutTime}
          unit="min"
          icon={Clock}
          color="cyan"
        />
      </div>

      {/* Progresso semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Progresso Semanal</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {weekProgress.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.day}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.completed ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-600'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-12">
                    {item.completed ? '✓' : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Próximos Treinos</h3>
            <Dumbbell className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {userPlans?.workout ? (
              userPlans.workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="text-white font-medium">{exercise.name}</p>
                    <p className="text-slate-400 text-sm">{exercise.sets} séries • {exercise.reps} reps</p>
                  </div>
                  <button className="px-3 py-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-all duration-200">
                    Iniciar
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>Crie seu plano personalizado para ver seus treinos aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Call to action para usuários novos */}
      {!userPlans && (
        <Card className="text-center py-8">
          <div className="max-w-md mx-auto">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Pronto para começar?
            </h3>
            <p className="text-slate-400 mb-6">
              Crie seu plano personalizado de treino e dieta com nossa IA
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Criar Plano Personalizado
            </button>
          </div>
        </Card>
      )}

      {/* Plano personalizado existente */}
      {userPlans && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Seu Plano Personalizado com IA</h3>
                <p className="text-slate-400">
                  Plano criado especialmente para {userData?.goal === 'lose_weight' ? 'emagrecimento' : userData?.goal === 'gain_muscle' ? 'ganho de massa' : 'manutenção'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{userPlans.workout?.frequency}</div>
                <div className="text-slate-400 text-sm">Frequência</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-slate-700/30">
                <Dumbbell className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-lg font-bold text-white">{userPlans.workout?.exercises?.length || 0}</div>
                <div className="text-sm text-slate-400">Exercícios</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-700/30">
                <Apple className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-lg font-bold text-white">{userPlans.diet?.totalCalories || 0}</div>
                <div className="text-sm text-slate-400">Calorias/dia</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-700/30">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-lg font-bold text-white">{userPlans.workout?.duration || '12 semanas'}</div>
                <div className="text-sm text-slate-400">Duração</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => generatePDF(userData, userPlans)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PDF</span>
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Ajustar Plano</span>
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// [Resto do código permanece igual - componentes ExerciseCard, WorkoutTab, MealCard, DietTab, ProfileTab]
// Componente de Exercício
function ExerciseCard({ exercise, onStart, completed = false }: {
  exercise: {
    name: string
    sets: number
    reps: string
    rest: string
    difficulty: 'Fácil' | 'Médio' | 'Difícil'
    muscle: string
    instructions: string
  }
  onStart: () => void
  completed?: boolean
}) {
  const difficultyColors = {
    'Fácil': 'from-green-500 to-emerald-500',
    'Médio': 'from-yellow-500 to-orange-500',
    'Difícil': 'from-red-500 to-pink-500'
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
            {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-slate-400 text-sm mb-3">{exercise.muscle}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-slate-300">{exercise.sets} séries</span>
            <span className="text-slate-300">{exercise.reps} reps</span>
            <span className="text-slate-300">Descanso: {exercise.rest}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[exercise.difficulty]} text-white text-xs font-medium`}>
          {exercise.difficulty}
        </div>
      </div>
      
      <p className="text-slate-400 text-sm mb-4">{exercise.instructions}</p>
      
      <button
        onClick={onStart}
        className={cn(
          "w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200",
          completed
            ? "bg-green-600 text-white"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105"
        )}
      >
        {completed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Concluído</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Iniciar Exercício</span>
          </>
        )}
      </button>
    </Card>
  )
}

// Componente Aba de Treino
function WorkoutTab({ userPlans, completedExercises, setCompletedExercises }: { 
  userPlans: any
  completedExercises: number[]
  setCompletedExercises: (exercises: number[]) => void
}) {
  const todayWorkout = userPlans?.workout || {
    name: "Treino Personalizado",
    duration: "45-60 min",
    difficulty: "Intermediário",
    exercises: []
  }

  const handleStartExercise = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises([...completedExercises, index])
    }
  }

  const completionPercentage = todayWorkout.exercises.length > 0 
    ? Math.round((completedExercises.length / todayWorkout.exercises.length) * 100)
    : 0

  if (!userPlans?.workout || todayWorkout.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
          <Dumbbell className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Nenhum treino disponível</h3>
        <p className="text-slate-400 text-center max-w-md">
          Crie seu plano personalizado no Dashboard para começar seus treinos!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do treino */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{todayWorkout.name}</h2>
              <div className="flex items-center space-x-4 text-slate-300">
                <div className="flex items-center space-x-1">
                  <Timer className="w-4 h-4" />
                  <span>{todayWorkout.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{todayWorkout.difficulty}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{todayWorkout.exercises.length} exercícios</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{completionPercentage}%</div>
              <div className="text-slate-400 text-sm">Concluído</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Exercícios"
          value={completedExercises.length}
          unit={`/${todayWorkout.exercises.length}`}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Tempo Estimado"
          value="45"
          unit="min"
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Calorias"
          value="320"
          unit="kcal"
          icon={Flame}
          color="orange"
        />
        <MetricCard
          title="Músculos"
          value="2"
          unit="grupos"
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Lista de exercícios */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Exercícios do Dia</h3>
        {todayWorkout.exercises.map((exercise: any, index: number) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            onStart={() => handleStartExercise(index)}
            completed={completedExercises.includes(index)}
          />
        ))}
      </div>

      {/* Botão de finalizar treino */}
      {completionPercentage === 100 && (
        <Card className="text-center py-8">
          <div className="max-w-md mx-auto">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Parabéns! Treino Concluído! 🎉
            </h3>
            <p className="text-slate-400 mb-6">
              Você completou todos os exercícios. Ótimo trabalho!
            </p>
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Finalizar e Salvar Treino
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}

// Componente de Refeição
function MealCard({ meal, onComplete, completed = false }: {
  meal: {
    name: string
    time: string
    calories: number
    protein: number
    carbs: number
    fat: number
    foods: string[]
    preparation: string
  }
  onComplete: () => void
  completed?: boolean
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{meal.name}</h3>
            {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-slate-400 text-sm mb-3">{meal.time}</p>
          
          {/* Macros */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{meal.calories}</div>
              <div className="text-xs text-slate-400">kcal</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{meal.protein}g</div>
              <div className="text-xs text-slate-400">Proteína</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{meal.carbs}g</div>
              <div className="text-xs text-slate-400">Carbo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{meal.fat}g</div>
              <div className="text-xs text-slate-400">Gordura</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alimentos */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Alimentos:</h4>
        <ul className="space-y-1">
          {meal.foods.map((food, index) => (
            <li key={index} className="text-sm text-slate-400 flex items-center">
              <ChevronRight className="w-3 h-3 mr-1" />
              {food}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Preparo */}
      <p className="text-slate-400 text-sm mb-4">{meal.preparation}</p>
      
      <button
        onClick={onComplete}
        className={cn(
          "w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200",
          completed
            ? "bg-green-600 text-white"
            : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-lg transform hover:scale-105"
        )}
      >
        {completed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Refeição Concluída</span>
          </>
        ) : (
          <>
            <Utensils className="w-4 h-4" />
            <span>Marcar como Consumida</span>
          </>
        )}
      </button>
    </Card>
  )
}

// Componente Aba de Dieta
function DietTab({ userPlans, completedMeals, setCompletedMeals }: { 
  userPlans: any
  completedMeals: number[]
  setCompletedMeals: (meals: number[]) => void
}) {
  const todayDiet = userPlans?.diet || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals: []
  }

  const handleCompleteMeal = (index: number) => {
    if (!completedMeals.includes(index)) {
      setCompletedMeals([...completedMeals, index])
    }
  }

  const completionPercentage = todayDiet.meals.length > 0
    ? Math.round((completedMeals.length / todayDiet.meals.length) * 100)
    : 0
    
  const consumedCalories = todayDiet.meals
    .filter((_: any, index: number) => completedMeals.includes(index))
    .reduce((sum: number, meal: any) => sum + meal.calories, 0)

  if (!userPlans?.diet || todayDiet.meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="p-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 mb-6">
          <Apple className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Nenhum plano alimentar disponível</h3>
        <p className="text-slate-400 text-center max-w-md">
          Crie seu plano personalizado no Dashboard para ver suas refeições!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da dieta */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Plano Alimentar Gerado por IA</h2>
              <div className="flex items-center space-x-4 text-slate-300">
                <div className="flex items-center space-x-1">
                  <Utensils className="w-4 h-4" />
                  <span>{todayDiet.meals.length} refeições</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{todayDiet.totalCalories} kcal</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{completionPercentage}%</div>
              <div className="text-slate-400 text-sm">Concluído</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Estatísticas nutricionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Calorias"
          value={consumedCalories}
          unit={`/${todayDiet.totalCalories}`}
          icon={Flame}
          color="orange"
        />
        <MetricCard
          title="Proteína"
          value={Math.round((consumedCalories / todayDiet.totalCalories) * todayDiet.totalProtein)}
          unit="g"
          icon={Scale}
          color="blue"
        />
        <MetricCard
          title="Carboidratos"
          value={Math.round((consumedCalories / todayDiet.totalCalories) * todayDiet.totalCarbs)}
          unit="g"
          icon={Apple}
          color="green"
        />
        <MetricCard
          title="Gorduras"
          value={Math.round((consumedCalories / todayDiet.totalCalories) * todayDiet.totalFat)}
          unit="g"
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Lista de refeições */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Refeições do Dia</h3>
        {todayDiet.meals.map((meal: any, index: number) => (
          <MealCard
            key={index}
            meal={meal}
            onComplete={() => handleCompleteMeal(index)}
            completed={completedMeals.includes(index)}
          />
        ))}
      </div>

      {/* Resumo nutricional */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Resumo Nutricional</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Proteínas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Proteínas</span>
              <span className="text-blue-400 font-semibold">{todayDiet.totalProtein}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">30% das calorias</p>
          </div>
          
          {/* Carboidratos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Carboidratos</span>
              <span className="text-green-400 font-semibold">{todayDiet.totalCarbs}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '40%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">40% das calorias</p>
          </div>
          
          {/* Gorduras */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Gorduras</span>
              <span className="text-yellow-400 font-semibold">{todayDiet.totalFat}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-yellow-500" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">30% das calorias</p>
          </div>
        </div>
      </Card>

      {/* Dicas nutricionais */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">💡 Dicas do Dia</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
            <p className="text-slate-300 text-sm">
              Beba pelo menos 2-3 litros de água ao longo do dia para manter-se hidratado.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
            <p className="text-slate-300 text-sm">
              Consuma as refeições nos horários indicados para otimizar seu metabolismo.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
            <p className="text-slate-300 text-sm">
              Mastigue bem os alimentos e coma devagar para melhor digestão.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Componente de Perfil
function ProfileTab({ userData, setUserData }: { 
  userData: UserData | null
  setUserData: (data: UserData) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<UserData>(userData || {
    name: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    goal: '',
    timeline: '',
    fitnessLevel: '',
    workoutDays: [],
    workoutDuration: '',
    workoutLocation: '',
    equipment: [],
    injuries: [],
    dietaryRestrictions: [],
    foodPreferences: [],
    activityLevel: '',
    sleepHours: 8,
    stressLevel: ''
  })

  const handleSave = () => {
    setUserData(editedData)
    setIsEditing(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
          <User className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Nenhum perfil criado</h3>
        <p className="text-slate-400 text-center max-w-md">
          Crie seu plano personalizado no Dashboard para configurar seu perfil!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do perfil */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                  {editedData.avatar ? (
                    <img src={editedData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Informações básicas */}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="text-2xl font-bold text-white bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white mb-2">{userData.name}</h2>
                )}
                <div className="flex items-center space-x-4 text-slate-300">
                  <span>{userData.age} anos</span>
                  <span>•</span>
                  <span>{userData.gender === 'male' ? 'Masculino' : 'Feminino'}</span>
                  <span>•</span>
                  <span>{userData.height}cm</span>
                  <span>•</span>
                  <span>{userData.weight}kg</span>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditedData(userData)
                      setIsEditing(false)
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Estatísticas do perfil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Objetivo</p>
              <p className="text-white font-semibold">
                {userData.goal === 'lose_weight' ? 'Perder Peso' : userData.goal === 'gain_muscle' ? 'Ganhar Massa' : 'Manutenção'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Nível</p>
              <p className="text-white font-semibold">
                {userData.fitnessLevel === 'beginner' ? 'Iniciante' : userData.fitnessLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Frequência</p>
              <p className="text-white font-semibold">{userData.workoutDays.length}x por semana</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados físicos */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Dados Físicos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Altura</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedData.height}
                  onChange={(e) => setEditedData({ ...editedData, height: parseInt(e.target.value) })}
                  className="w-24 px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{userData.height} cm</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Peso Atual</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedData.weight}
                  onChange={(e) => setEditedData({ ...editedData, weight: parseInt(e.target.value) })}
                  className="w-24 px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{userData.weight} kg</span>
              )}
            </div>
            {userData.targetWeight && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peso Meta</span>
                <span className="text-white font-medium">{userData.targetWeight} kg</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">IMC</span>
              <span className="text-white font-medium">
                {(userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1)}
              </span>
            </div>
          </div>
        </Card>

        {/* Estilo de vida */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Estilo de Vida</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nível de Atividade</span>
              <span className="text-white font-medium">
                {userData.activityLevel === 'sedentary' ? 'Sedentário' : 
                 userData.activityLevel === 'light' ? 'Leve' :
                 userData.activityLevel === 'moderate' ? 'Moderado' :
                 userData.activityLevel === 'active' ? 'Ativo' : 'Muito Ativo'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Horas de Sono</span>
              <span className="text-white font-medium">{userData.sleepHours}h por noite</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nível de Estresse</span>
              <span className="text-white font-medium">
                {userData.stressLevel === 'low' ? 'Baixo' : 
                 userData.stressLevel === 'medium' ? 'Médio' : 'Alto'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Local de Treino</span>
              <span className="text-white font-medium">
                {userData.workoutLocation === 'home' ? 'Casa' : 
                 userData.workoutLocation === 'gym' ? 'Academia' : 'Ambos'}
              </span>
            </div>
          </div>
        </Card>

        {/* Equipamentos */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Equipamentos Disponíveis</h3>
          <div className="flex flex-wrap gap-2">
            {userData.equipment.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30"
              >
                {item}
              </span>
            ))}
          </div>
        </Card>

        {/* Restrições */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Restrições e Preferências</h3>
          <div className="space-y-4">
            {userData.injuries.length > 0 && (
              <div>
                <p className="text-slate-400 text-sm mb-2">Lesões/Limitações:</p>
                <div className="flex flex-wrap gap-2">
                  {userData.injuries.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm border border-red-500/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {userData.dietaryRestrictions.length > 0 && (
              <div>
                <p className="text-slate-400 text-sm mb-2">Restrições Alimentares:</p>
                <div className="flex flex-wrap gap-2">
                  {userData.dietaryRestrictions.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm border border-yellow-500/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function FitAIApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [userPlans, setUserPlans] = useState<any>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [completedMeals, setCompletedMeals] = useState<number[]>([])

  const handleFormComplete = (data: UserData, plans: any) => {
    setUserData(data)
    setUserPlans(plans)
    setShowForm(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            showForm={showForm}
            setShowForm={setShowForm}
            userPlans={userPlans}
            userData={userData}
            completedExercises={completedExercises}
            completedMeals={completedMeals}
          />
        )
      case 'workout':
        return (
          <WorkoutTab 
            userPlans={userPlans}
            completedExercises={completedExercises}
            setCompletedExercises={setCompletedExercises}
          />
        )
      case 'diet':
        return (
          <DietTab 
            userPlans={userPlans}
            completedMeals={completedMeals}
            setCompletedMeals={setCompletedMeals}
          />
        )
      case 'profile':
        return <ProfileTab userData={userData} setUserData={setUserData} />
      default:
        return (
          <Dashboard 
            showForm={showForm}
            setShowForm={setShowForm}
            userPlans={userPlans}
            userData={userData}
            completedExercises={completedExercises}
            completedMeals={completedMeals}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Formulário de Plano Personalizado */}
      {showForm && (
        <PersonalizedPlanForm
          onComplete={handleFormComplete}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
