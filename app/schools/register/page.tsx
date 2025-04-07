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

export default function RegisterSchoolPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    responsibleName: "",
    responsiblePosition: "",
    password: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.email.includes("@")) {
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

    // Simulação de envio do formulário
    setIsSubmitting(true);

    // Aqui seria implementada a lógica para cadastrar a escola no banco de dados
    setTimeout(() => {
      setIsSubmitting(false);

      toast({
        title: "Cadastro realizado com sucesso",
        description: "A escola foi cadastrada com sucesso no sistema.",
      });

      router.push("/schools");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      {user && <NavBar />}

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-t-4 border-t-iftm-green">
            <CardHeader>
              <CardTitle className="text-iftm-gray">
                Cadastro de Escola
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para cadastrar uma nova escola no
                sistema
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
                    Dados do Responsável
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="responsibleName">
                        Nome do Responsável
                      </Label>
                      <Input
                        id="responsibleName"
                        value={formData.responsibleName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="responsiblePosition">Cargo</Label>
                      <Input
                        id="responsiblePosition"
                        value={formData.responsiblePosition}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium pt-4 text-iftm-green">
                    Credenciais de Acesso
                  </h3>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
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
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/schools")}
                className="mr-2 border-iftm-green text-iftm-green hover:bg-iftm-lightGreen"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-iftm-green hover:bg-iftm-darkGreen"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar Escola"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
