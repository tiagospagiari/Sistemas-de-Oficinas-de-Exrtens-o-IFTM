"use client";

import type React from "react";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { NavBar } from "@/components/nav-bar";
import { Eye, EyeOff } from "lucide-react";
import { AuthCheck } from "@/components/auth-check";
import { useAuth } from "@/contexts/auth-context";
import { SchoolService } from "@/lib/services/schoolService";
import { AuthService } from "@/lib/services/authService";

export default function RegisterSchoolPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Dados da escola
    schoolName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    // Dados do representante
    representativeName: "",
    representativeEmail: "",
    representativePassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (formData.representativePassword !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.representativePassword.length < 8) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.representativeEmail ||
      !formData.representativeEmail.includes("@")
    ) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.schoolName || formData.schoolName.trim() === "") {
      toast({
        title: "Erro de validação",
        description: "O nome da escola é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Registrar a escola
      const schoolData = {
        schoolName: formData.schoolName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        status: "active" as const,
      };

      const newSchool = await SchoolService.createSchool(schoolData);

      // 2. Registrar o representante da escola
      await AuthService.registerSchoolRepresentative(
        formData.representativeEmail,
        formData.representativePassword,
        newSchool.id,
        formData.representativeName
      );

      toast({
        title: "Cadastro realizado com sucesso",
        description:
          "A escola e o representante foram cadastrados com sucesso.",
      });

      router.push("/schools");
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description:
          error.message || "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      {user && <NavBar />}

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-t-4 border-t-iftm-green">
            <CardHeader>
              <CardTitle className="text-iftm-gray">
                Cadastro de Escola e Representante
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para cadastrar uma nova escola e
                seu representante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-iftm-green">
                    Dados da Escola
                  </h3>

                  <div className="grid gap-2">
                    <Label htmlFor="schoolName">Nome da Escola</Label>
                    <Input
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Institucional</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium pt-4 text-iftm-green">
                    Dados do Representante
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="representativeName">
                        Nome do Representante
                      </Label>
                      <Input
                        id="representativeName"
                        value={formData.representativeName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="representativeEmail">
                        Email do Representante
                      </Label>
                      <Input
                        id="representativeEmail"
                        type="email"
                        value={formData.representativeEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="representativePassword">Senha</Label>
                      <div className="relative">
                        <Input
                          id="representativePassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.representativePassword}
                          onChange={handleChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
