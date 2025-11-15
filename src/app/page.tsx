"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Garantir que estamos no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar se usuário já está autenticado
  useEffect(() => {
    if (!mounted) return;
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkUser();
  }, [mounted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mounted) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Criar usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Redirecionar para o dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Não renderizar até estar no cliente
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">
            Glowup 30 Dias
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Transforme sua pele em 1 mês
          </p>
          <p className="text-sm text-gray-500">
            Crie sua conta para começar sua jornada
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white shadow-2xl border-2 border-purple-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h2>
            <p className="text-gray-600 text-sm">Preencha seus dados para começar</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-base font-semibold mt-6"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta e começar"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          {/* Benefícios */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">O que você vai ter:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Análise facial com IA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Rotina de skincare personalizada</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Progressão visual em 30 dias</span>
              </div>
            </div>
          </div>

          {/* Link para login */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                disabled={loading}
              >
                Faça login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
