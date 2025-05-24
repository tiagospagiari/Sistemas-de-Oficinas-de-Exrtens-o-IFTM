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
import { AuthService } from "@/lib/services/authService";
import { SchoolService } from "@/lib/services/schoolService";
import { CitySelect } from "@/components/ui/city-select"
import { LocationService } from "@/lib/services/locationService"
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase/config";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, signUp, user, loading, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    schoolName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    representativeName: "",
    representativeEmail: "",
    representativePassword: "",
    confirmPassword: "",
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação específica para cada campo
    if (id === 'phone') {
      formattedValue = LocationService.formatPhone(value);
    } else if (id === 'zipCode') {
      // Para o CEP, permitimos a entrada completa antes de formatar
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 8) {
        formattedValue = LocationService.formatCEP(value);
      } else {
        // Se já tiver 8 dígitos, mantém o valor atual
        formattedValue = value;
      }
    }

    setRegisterData(prev => ({
      ...prev,
      [id]: formattedValue
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      state: value,
      city: '' // Limpa a cidade quando o estado muda
    }));
  };

  const handleCityChange = (city: string) => {
    setRegisterData(prev => ({
      ...prev,
      city
    }));
  };

  // Função para verificar se a escola já existe
  const checkExistingSchool = async (schoolName: string, email: string) => {
    const schoolsRef = ref(db, "schools");
    const snapshot = await get(schoolsRef);
    let exists = false;
    let message = "";

    snapshot.forEach((child) => {
      const school = child.val();
      if (school.schoolName.toLowerCase() === schoolName.toLowerCase()) {
        exists = true;
        message = "Já existe uma escola cadastrada com este nome.";
      } else if (school.email.toLowerCase() === email.toLowerCase()) {
        exists = true;
        message = "Já existe uma escola cadastrada com este email.";
      }
    });

    return { exists, message };
  };

  // Função para verificar se o email do representante já existe
  const checkExistingRepresentative = async (email: string) => {
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    let exists = false;

    snapshot.forEach((child) => {
      const user = child.val();
      if (user.email.toLowerCase() === email.toLowerCase()) {
        exists = true;
      }
    });

    return exists;
  };

  // Função para recuperação de senha
  const handleForgotPassword = async () => {
    if (!loginData.email) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe seu email para recuperar a senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, loginData.email);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      });
    }
  };

  const validateRegisterForm = () => {
    const errors: string[] = [];

    // Validações básicas
    if (!LocationService.validatePhone(registerData.phone)) {
      errors.push("Telefone inválido. Use o formato (00) 00000-0000");
    }

    if (!LocationService.validateCEP(registerData.zipCode)) {
      errors.push("CEP inválido. Use o formato 00000-000");
    }

    if (!registerData.city) {
      errors.push("Selecione uma cidade");
    }

    // Validação básica de senha
    if (registerData.representativePassword.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres");
    }

    // Validação de confirmação de senha
    if (registerData.representativePassword !== registerData.confirmPassword) {
      errors.push("As senhas não coincidem");
    }

    // Validação de email do representante
    if (!registerData.representativeEmail.includes("@")) {
      errors.push("Email do representante inválido");
    }

    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: errors.join("\n"),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await AuthService.login(loginData.email, loginData.password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verificar se o usuário está completamente deslogado
      if (user) {
        await logout();
        // Aguardar um pouco mais para garantir que o estado seja limpo
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Validar formulário
      if (!validateRegisterForm()) {
        setIsSubmitting(false);
        return;
      }

      // 1. Registrar a escola primeiro
      const schoolData = {
        schoolName: registerData.schoolName,
        address: registerData.address,
        city: registerData.city,
        state: registerData.state,
        zipCode: registerData.zipCode,
        phone: registerData.phone,
        email: registerData.email,
        status: "active" as const,
      };

      const newSchool = await SchoolService.createSchool(schoolData);

      // 2. Registrar o representante da escola
      await AuthService.registerSchoolRepresentative(
        registerData.representativeEmail,
        registerData.representativePassword,
        newSchool.id,
        registerData.representativeName
      );

      toast({
        title: "Cadastro realizado com sucesso",
        description: "A escola e o representante foram cadastrados com sucesso. Você já pode fazer login.",
      });

      // Limpar o formulário e mudar para a aba de login
      setRegisterData({
        schoolName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        representativeName: "",
        representativeEmail: "",
        representativePassword: "",
        confirmPassword: "",
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo-iftm.png"
            alt="Logo IFTM"
            width={300}
            height={150}
            priority
            className="mb-4 w-auto h-auto"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-iftm-green border-t-4">
              <CardHeader>
                <CardTitle className="text-center text-iftm-gray">
                  Acesso ao Sistema
                </CardTitle>
                <CardDescription className="text-center">
                  Entre com suas credenciais para acessar o sistema de solicitação de oficinas
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-iftm-green hover:text-iftm-darkGreen p-0 h-auto"
                        onClick={handleForgotPassword}
                        disabled={isSubmitting}
                      >
                        Esqueceu sua senha?
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-iftm-green hover:bg-iftm-darkGreen mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-iftm-green border-t-4">
              <CardHeader>
                <CardTitle className="text-center text-iftm-gray">
                  Cadastro de Escola e Representante
                </CardTitle>
                <CardDescription className="text-center">
                  Preencha o formulário abaixo para cadastrar sua escola e criar seu acesso ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-iftm-green">Dados da Escola</h3>

                    <div className="grid gap-2">
                      <Label htmlFor="schoolName">Nome da Escola</Label>
                      <Input
                        id="schoolName"
                        value={registerData.schoolName}
                        onChange={handleRegisterChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={registerData.address}
                        onChange={handleRegisterChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">Cidade</Label>
                        <CitySelect
                          uf={registerData.state}
                          value={registerData.city}
                          onValueChange={handleCityChange}
                          disabled={isSubmitting || !registerData.state}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="state">Estado</Label>
                        <select
                          id="state"
                          value={registerData.state}
                          onChange={handleStateChange}
                          required
                          disabled={isSubmitting}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          value={registerData.zipCode}
                          onChange={handleRegisterChange}
                          placeholder="00000-000"
                          required
                          disabled={isSubmitting}
                          maxLength={9}
                          inputMode="numeric"
                          pattern="\d{5}-?\d{3}"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        placeholder="(00) 00000-0000"
                        required
                        disabled={isSubmitting}
                        maxLength={15}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Institucional</Label>
                        <Input
                          id="email"
                          type="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-medium pt-4 text-iftm-green">
                      Dados do Representante
                    </h3>

                    <div className="grid gap-2">
                      <Label htmlFor="representativeName">Nome do Representante</Label>
                      <Input
                        id="representativeName"
                        value={registerData.representativeName}
                        onChange={handleRegisterChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="representativeEmail">Email do Representante</Label>
                      <Input
                        id="representativeEmail"
                        type="email"
                        value={registerData.representativeEmail}
                        onChange={handleRegisterChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="representativePassword">Senha</Label>
                      <div className="relative">
                        <Input
                          id="representativePassword"
                          type={showPassword ? "text" : "password"}
                          value={registerData.representativePassword}
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A senha deve ter pelo menos 6 caracteres.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-iftm-green hover:bg-iftm-darkGreen"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
