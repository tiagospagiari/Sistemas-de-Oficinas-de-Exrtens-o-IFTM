"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { FirebaseError } from "firebase/app";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, signUp, user, loading } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Estado para os formulários
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers para o formulário de login
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
  };

  // Atualizar o handleLoginSubmit para mostrar toast de sucesso
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(loginData.email, loginData.password);

      // Toast de sucesso ao fazer login
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema de oficinas IFTM!",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "Falha ao fazer login. Verifique suas credenciais.";

      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        errorMessage = "Email ou senha incorretos.";
      } else if (firebaseError.code === "auth/too-many-requests") {
        errorMessage =
          "Muitas tentativas de login. Tente novamente mais tarde.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "Formato de email inválido.";
      }

      toast({
        title: "Erro de autenticação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualizar o handleRegisterSubmit para mostrar mais toasts
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 8) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!registerData.email || !registerData.email.includes("@")) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Envio do formulário
    setIsSubmitting(true);

    try {
      await signUp(registerData.email, registerData.password);

      toast({
        title: "Cadastro realizado com sucesso",
        description:
          "Sua conta foi criada. Você já pode fazer login no sistema.",
      });

      // Resetar o formulário e mudar para a aba de login
      setRegisterData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Mudar para a aba de login programaticamente
      const loginTab = document.getElementById(
        "login-tab"
      ) as HTMLButtonElement;
      if (loginTab) loginTab.click();
    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "Falha ao criar conta.";

      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "Email inválido.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca.";
      } else if (firebaseError.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }

      toast({
        title: "Erro de cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [id]: value }));
  };

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iftm-lightGray">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iftm-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-iftm-lightGray p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo-iftm.png"
            alt="Logo IFTM"
            width={300}
            height={150}
            className="mb-4"
          />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger
              id="login-tab"
              value="login"
              className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
            >
              Cadastro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-iftm-green border-t-4">
              <CardHeader>
                <CardTitle className="text-center text-iftm-gray">
                  Acesso ao Sistema
                </CardTitle>
                <CardDescription className="text-center">
                  Entre com suas credenciais para acessar o sistema de
                  solicitação de oficinas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@escola.gov.br"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ocultar senha" : "Mostrar senha"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full bg-iftm-green hover:bg-iftm-darkGreen"
                  onClick={handleLoginSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-iftm-green border-t-4">
              <CardHeader>
                <CardTitle className="text-center text-iftm-gray">
                  Cadastro de Usuário
                </CardTitle>
                <CardDescription className="text-center">
                  Crie sua conta para acessar o sistema de solicitação de
                  oficinas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ocultar senha" : "Mostrar senha"}
                          </span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A senha deve ter pelo menos 8 caracteres.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="register-confirm-password">
                        Confirmar Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword
                              ? "Ocultar senha"
                              : "Mostrar senha"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full bg-iftm-green hover:bg-iftm-darkGreen"
                  onClick={handleRegisterSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Button className="w-full bg-iftm-green hover:bg-iftm-darkGreen mt-3">
          <Link href="/schools/register">Cadastrar escola</Link>
        </Button>
      </div>
    </div>
  );
}
