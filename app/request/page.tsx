"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { NavBar } from "@/components/nav-bar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { WorkshopRequestService } from "@/lib/services/workshopRequestService"

interface FormData {
  schoolName: string
  coordinator: string
  hours: string
  students: string
  workshopType: string
  otherDescription: string
  materials: string
  startTime: string
  endTime: string
  status: 'pending'
}

export default function RequestForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    coordinator: "",
    hours: "",
    students: "",
    workshopType: "",
    otherDescription: "",
    materials: "",
    startTime: "",
    endTime: "",
    status: "pending"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, workshopType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await WorkshopRequestService.createRequest(formData)

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada com sucesso e está aguardando aprovação.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      toast({
        title: "Erro ao enviar solicitação",
        description: "Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      <NavBar />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-t-4 border-t-iftm-green">
            <CardHeader>
              <CardTitle className="text-iftm-gray">Solicitação de Oficina</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para solicitar uma oficina de extensão do IFTM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="schoolName">Nome da Escola</Label>
                    <Input 
                      id="schoolName" 
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="coordinator">Coordenador Responsável</Label>
                    <Input 
                      id="coordinator" 
                      value={formData.coordinator}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hours">Quantidade de Horas Desejadas</Label>
                      <Input 
                        id="hours" 
                        type="number" 
                        min="1" 
                        value={formData.hours}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="students">Quantidade de Alunos Prevista</Label>
                      <Input 
                        id="students" 
                        type="number" 
                        min="1" 
                        value={formData.students}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="workshopType">Tipo de Oficina Desejada</Label>
                    <Select 
                      value={formData.workshopType} 
                      onValueChange={handleSelectChange} 
                      required
                    >
                      <SelectTrigger id="workshopType" className="border-iftm-green/50 focus:ring-iftm-green">
                        <SelectValue placeholder="Selecione o tipo de oficina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="robotics">Robótica</SelectItem>
                        <SelectItem value="programming">Programação</SelectItem>
                        <SelectItem value="electronics">Eletrônica</SelectItem>
                        <SelectItem value="ai">IA</SelectItem>
                        <SelectItem value="other">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.workshopType === "other" && (
                    <div className="grid gap-2">
                      <Label htmlFor="otherDescription">Descrição da Oficina</Label>
                      <Textarea
                        id="otherDescription"
                        value={formData.otherDescription}
                        onChange={handleInputChange}
                        placeholder="Descreva o tipo de oficina desejada"
                        required
                        className="border-iftm-green/50 focus-visible:ring-iftm-green"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="materials">Materiais Disponíveis na Escola</Label>
                    <Textarea
                      id="materials"
                      value={formData.materials}
                      onChange={handleInputChange}
                      placeholder="Liste os materiais disponíveis para a oficina"
                      required
                      className="border-iftm-green/50 focus-visible:ring-iftm-green"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Horário Disponível para a Oficina</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startTime" className="text-sm text-muted-foreground">
                          Início
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                          className="border-iftm-green/50 focus-visible:ring-iftm-green"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endTime" className="text-sm text-muted-foreground">
                          Fim
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                          className="border-iftm-green/50 focus-visible:ring-iftm-green"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
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
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

