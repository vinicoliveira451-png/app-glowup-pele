"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Verificar se usuário já está autenticado
  useEffect(() => {
    const user = localStorage.getItem("glowup_user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Verificar se usuário existe
    const user = localStorage.getItem("glowup_user");
    
    if (!user) {
      setError("Usuário não encontrado. Crie uma conta primeiro.");
      return;
    }

    const userData = JSON.parse(user);
    
    // Validar credenciais
    if (userData.email === formData.email && userData.password === formData.password) {
      // Login bem-sucedido
      router.push("/dashboard");
    } else {
      setError("Email ou senha incorretos.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 mb-4 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Glowup 30 Dias
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta!
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white shadow-2xl border-2 border-purple-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entrar</h2>
            <p className="text-gray-600 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-base font-semibold mt-6"
            >
              Entrar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Link para cadastro */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
