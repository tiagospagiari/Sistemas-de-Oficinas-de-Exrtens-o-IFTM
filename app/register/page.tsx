"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

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
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio do formulário
    setIsSubmitting(true)

    // Aqui seria implementada a lógica para cadastrar a escola no banco de dados
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua escola foi cadastrada. Você já pode fazer login no sistema.",
      })

      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-iftm-lightGray p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo-iftm.png" alt="Logo IFTM" width={300} height={150} className="mb-4" />
        </div>

        <Card className="border-iftm-green border-t-4">
          <CardHeader>
            <CardTitle className="text-center text-iftm-gray">Cadastro de Escola</CardTitle>
            <CardDescription className="text-center">
              Preencha o formulário abaixo para cadastrar sua escola no sistema de solicitação de oficinas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-iftm-green">Dados da Escola</h3>

                <div className="grid gap-2">
                  <Label htmlFor="schoolName">Nome da Escola</Label>
                  <Input id="schoolName" value={formData.schoolName} onChange={handleChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={formData.city} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={formData.state} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Institucional</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <h3 className="text-lg font-medium pt-4 text-iftm-green">Dados do Responsável</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="responsibleName">Nome do Responsável</Label>
                    <Input id="responsibleName" value={formData.responsibleName} onChange={handleChange} required />
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

                <h3 className="text-lg font-medium pt-4 text-iftm-green">Credenciais de Acesso</h3>

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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 8 caracteres.</p>
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-iftm-green text-iftm-green hover:bg-iftm-lightGreen">
                Voltar para Login
              </Button>
            </Link>
            <Button
              className="w-full sm:w-auto sm:flex-1 bg-iftm-green hover:bg-iftm-darkGreen"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Escola"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

