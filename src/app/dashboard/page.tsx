"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Camera, Sparkles, Calendar, TrendingUp, Zap, Target, Award, CheckCircle2, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [progression, setProgression] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Garantir que estamos no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar se usuário está autenticado
  useEffect(() => {
    if (!mounted) return;
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/");
        } else {
          setUserName(session.user.user_metadata?.name || session.user.email || "Usuário");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/");
      }
    };
    
    checkUser();
  }, [mounted, router]);

  const handleLogout = async () => {
    if (!mounted) return;
    
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    
    // Simulação de análise com IA
    setTimeout(() => {
      setAnalysis({
        skinType: "Mista",
        concerns: [
          { icon: "💧", text: "Oleosidade na zona T", severity: "medium" },
          { icon: "🔍", text: "Poros dilatados", severity: "medium" },
          { icon: "📏", text: "Linhas finas", severity: "low" }
        ],
        score: 72,
        hydration: 65,
        texture: 70,
        tone: 80,
        recommendations: [
          {
            category: "Limpeza",
            icon: "🧼",
            morning: "Gel de limpeza suave com ácido salicílico",
            night: "Limpeza dupla: óleo + gel",
            frequency: "2x ao dia",
            color: "from-blue-500 to-cyan-500"
          },
          {
            category: "Hidratação",
            icon: "💦",
            morning: "Sérum de ácido hialurônico + hidratante oil-free",
            night: "Creme noturno com niacinamida",
            frequency: "2x ao dia",
            color: "from-cyan-500 to-teal-500"
          },
          {
            category: "Tratamento",
            icon: "✨",
            morning: "Vitamina C sérum",
            night: "Retinol 2-3x por semana",
            frequency: "Diário/Alternado",
            color: "from-purple-500 to-pink-500"
          },
          {
            category: "Proteção",
            icon: "☀️",
            morning: "Protetor solar FPS 50+ oil-free",
            night: "Não necessário",
            frequency: "Diário",
            color: "from-orange-500 to-red-500"
          }
        ]
      });

      setProgression({
        week1: { 
          score: 75, 
          changes: "Redução de oleosidade, pele mais limpa",
          improvements: ["Menos brilho", "Poros começam a reduzir"]
        },
        week2: { 
          score: 80, 
          changes: "Poros menos aparentes, textura melhorada",
          improvements: ["Textura mais suave", "Tom mais uniforme"]
        },
        week3: { 
          score: 85, 
          changes: "Tom mais uniforme, hidratação equilibrada",
          improvements: ["Hidratação balanceada", "Linhas suavizadas"]
        },
        week4: { 
          score: 90, 
          changes: "Pele radiante, linhas suavizadas",
          improvements: ["Glow natural", "Pele saudável e vibrante"]
        }
      });

      setAnalyzing(false);
    }, 2500);
  };

  // Não renderizar até estar no cliente
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Glowup 30 Dias
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Olá, {userName}! 👋</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!selectedImage ? (
          // Upload Section
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Análise com IA em segundos</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Descubra o potencial da
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  sua pele
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Tire uma selfie e receba um plano personalizado de skincare com progressão visual para os próximos 30 dias
              </p>
            </div>

            {/* Upload Card */}
            <Card className="relative overflow-hidden border-2 border-purple-200 bg-white shadow-2xl hover:shadow-purple-200 transition-all duration-300 mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 opacity-50" />
              
              <div className="relative p-8 sm:p-12">
                <div className="flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl">
                      <Camera className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center max-w-md">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      Comece sua transformação
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Tire uma selfie em boa iluminação, de frente para a câmera, sem maquiagem para análise precisa
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={triggerFileInput}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 rounded-2xl cursor-pointer"
                  >
                    <Upload className="w-6 h-6 mr-3" />
                    Enviar Foto e Começar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Badge variant="outline" className="text-sm border-purple-300 text-purple-700 px-4 py-2">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Análise IA
                    </Badge>
                    <Badge variant="outline" className="text-sm border-pink-300 text-pink-700 px-4 py-2">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progressão Visual
                    </Badge>
                    <Badge variant="outline" className="text-sm border-orange-300 text-orange-700 px-4 py-2">
                      <Target className="w-4 h-4 mr-2" />
                      Plano 30 Dias
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Análise Completa</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  IA avalia tipo de pele, hidratação, textura, tom e identifica pontos de melhoria
                </p>
              </Card>

              <Card className="p-6 bg-white border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:shadow-xl group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Rotina Personalizada</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Plano de skincare customizado com produtos e horários específicos para você
                </p>
              </Card>

              <Card className="p-6 bg-white border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl group sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Progressão em 4 Semanas</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visualize como sua pele pode evoluir seguindo o cronograma completo
                </p>
              </Card>
            </div>
          </div>
        ) : (
          // Results Section
          <div className="max-w-7xl mx-auto">
            {analyzing ? (
              <Card className="p-12 sm:p-16 bg-white shadow-2xl">
                <div className="flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-ping opacity-20" />
                  </div>
                  
                  <div className="text-center max-w-md">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Analisando sua pele...
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Nossa IA está avaliando tipo de pele, hidratação, textura, tom e identificando oportunidades de melhoria
                    </p>
                    <Progress value={75} className="w-full h-3 mb-3" />
                    <p className="text-sm text-gray-500">Isso leva apenas alguns segundos</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Tabs defaultValue="analysis" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg p-1.5 rounded-2xl">
                  <TabsTrigger value="analysis" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Análise
                  </TabsTrigger>
                  <TabsTrigger value="routine" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Rotina
                  </TabsTrigger>
                  <TabsTrigger value="progression" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Progressão
                  </TabsTrigger>
                </TabsList>

                {/* Analysis Tab */}
                <TabsContent value="analysis" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Image Card */}
                    <Card className="p-6 bg-white shadow-xl">
                      <div className="relative rounded-2xl overflow-hidden mb-4 shadow-lg">
                        <img
                          src={selectedImage}
                          alt="Sua foto"
                          className="w-full h-auto"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500 text-white border-0 shadow-lg">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Analisada
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all"
                        onClick={() => {
                          setSelectedImage(null);
                          setAnalysis(null);
                          setProgression(null);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Enviar Nova Foto
                      </Button>
                    </Card>

                    {/* Analysis Results */}
                    <div className="space-y-4">
                      {/* Score Card */}
                      <Card className="p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-purple-100 text-sm mb-1">Score Geral da Pele</p>
                            <h3 className="text-4xl font-bold">{analysis?.score}<span className="text-2xl">/100</span></h3>
                          </div>
                          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Award className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-white font-medium">
                            🎯 Potencial incrível! Com a rotina certa, você pode alcançar <span className="font-bold text-yellow-300">90+</span> em 30 dias.
                          </p>
                        </div>
                      </Card>

                      {/* Skin Type */}
                      <Card className="p-6 bg-white shadow-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Tipo de Pele Identificado</p>
                            <h3 className="text-2xl font-bold text-gray-900">{analysis?.skinType}</h3>
                          </div>
                          <div className="text-4xl">🧴</div>
                        </div>
                      </Card>

                      {/* Metrics */}
                      <Card className="p-6 bg-white shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-5 text-lg">Métricas Detalhadas</h3>
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>💧</span> Hidratação
                              </span>
                              <span className="text-sm font-bold text-purple-600">{analysis?.hydration}%</span>
                            </div>
                            <Progress value={analysis?.hydration} className="h-3" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>✨</span> Textura
                              </span>
                              <span className="text-sm font-bold text-pink-600">{analysis?.texture}%</span>
                            </div>
                            <Progress value={analysis?.texture} className="h-3" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>🎨</span> Tom Uniforme
                              </span>
                              <span className="text-sm font-bold text-orange-600">{analysis?.tone}%</span>
                            </div>
                            <Progress value={analysis?.tone} className="h-3" />
                          </div>
                        </div>
                      </Card>

                      {/* Concerns */}
                      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-orange-600" />
                          Pontos de Atenção
                        </h3>
                        <div className="space-y-3">
                          {analysis?.concerns.map((concern: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                              <span className="text-2xl">{concern.icon}</span>
                              <span className="text-sm font-medium text-gray-700 flex-1">{concern.text}</span>
                              <Badge variant="outline" className={`
                                ${concern.severity === 'high' ? 'border-red-300 text-red-700' : ''}
                                ${concern.severity === 'medium' ? 'border-orange-300 text-orange-700' : ''}
                                ${concern.severity === 'low' ? 'border-yellow-300 text-yellow-700' : ''}
                              `}>
                                {concern.severity === 'high' ? 'Alto' : concern.severity === 'medium' ? 'Médio' : 'Baixo'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Routine Tab */}
                <TabsContent value="routine" className="space-y-6">
                  <Card className="p-8 bg-white shadow-xl">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Sua Rotina Personalizada
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Siga este cronograma diariamente para resultados visíveis em 30 dias
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {analysis?.recommendations.map((rec: any, index: number) => (
                        <Card key={index} className="p-6 border-2 border-gray-200 hover:border-purple-300 transition-all shadow-lg bg-gradient-to-br from-white to-gray-50">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center text-2xl shadow-lg`}>
                                {rec.icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {rec.category}
                                </h3>
                                <p className="text-sm text-gray-600">Passo {index + 1} da rotina</p>
                              </div>
                            </div>
                            <Badge className={`bg-gradient-to-r ${rec.color} text-white border-0 shadow-md`}>
                              {rec.frequency}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-xl border-2 border-orange-200 shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-md">
                                  <span className="text-xl">☀️</span>
                                </div>
                                <span className="font-bold text-gray-900 text-lg">Manhã</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{rec.morning}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200 shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-md">
                                  <span className="text-xl">🌙</span>
                                </div>
                                <span className="font-bold text-gray-900 text-lg">Noite</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{rec.night}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-2 border-purple-300 mt-8 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">💡 Dicas Extras para Potencializar Resultados</h3>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Beba pelo menos 2L de água por dia para hidratação interna</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Durma 7-8 horas por noite para regeneração celular</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Evite tocar o rosto com as mãos durante o dia</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Troque a fronha do travesseiro 2x por semana</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </Card>
                </TabsContent>

                {/* Progression Tab */}
                <TabsContent value="progression" className="space-y-6">
                  <Card className="p-8 bg-white shadow-xl">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Sua Progressão em 30 Dias
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Veja como sua pele pode evoluir seguindo a rotina personalizada
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      {Object.entries(progression || {}).map(([week, data]: [string, any], index) => (
                        <Card key={week} className="p-6 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-lg bg-gradient-to-br from-white to-purple-50">
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  Semana {index + 1}
                                </h3>
                                <p className="text-xs text-gray-600">Dias {index * 7 + 1}-{(index + 1) * 7}</p>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-md text-base px-3 py-1">
                              {data.score}
                            </Badge>
                          </div>

                          <div className="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl mb-5 flex items-center justify-center shadow-inner border-2 border-purple-200">
                            <div className="text-center p-6">
                              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                              <p className="text-sm font-semibold text-gray-700">Progressão Semana {index + 1}</p>
                              <p className="text-xs text-gray-600 mt-1">Score: {data.score}/100</p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 mb-4">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              Mudanças Esperadas
                            </h4>
                            <p className="text-sm text-gray-700 mb-3">{data.changes}</p>
                            <div className="space-y-1.5">
                              {data.improvements.map((imp: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  <span>{imp}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Progress value={(data.score / 90) * 100} className="h-2.5" />
                        </Card>
                      ))}
                    </div>

                    <Card className="p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white shadow-2xl">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-2xl sm:text-3xl font-bold mb-3">Resultado Final Esperado</h3>
                          <p className="text-purple-100 text-lg leading-relaxed">
                            Seguindo a rotina consistentemente, você pode alcançar uma pele com <span className="font-bold text-yellow-300">score 90+</span> em 30 dias! Continue firme e veja sua transformação acontecer. 🌟✨
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-md mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Glowup 30 Dias
            </p>
          </div>
          <p className="text-sm text-gray-600">Sua jornada para uma pele radiante e saudável</p>
        </div>
      </footer>
    </div>
  );
}
