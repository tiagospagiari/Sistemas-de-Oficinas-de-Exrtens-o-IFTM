"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { NavBar } from "@/components/nav-bar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "@/components/star-rating"

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")

  // Dados de exemplo para demonstração
  const workshopData = {
    id: params.id,
    schoolName: "Escola Municipal João da Silva",
    workshopType: "Robótica",
    date: "15/04/2025",
    instructor: "Prof. Carlos Mendes",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, forneça uma nota para a oficina.",
        variant: "destructive",
      })
      return
    }

    // Aqui seria implementada a lógica para enviar o feedback

    toast({
      title: "Feedback enviado",
      description: "Obrigado por avaliar a oficina!",
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      <NavBar />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-t-4 border-t-iftm-green">
            <CardHeader>
              <CardTitle className="text-iftm-gray">Avaliação da Oficina</CardTitle>
              <CardDescription>Forneça seu feedback sobre a oficina realizada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-iftm-green">Detalhes da Oficina</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-iftm-lightGreen p-4 rounded-md">
                  <div>
                    <p className="text-sm font-medium">Escola</p>
                    <p className="text-sm">{workshopData.schoolName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tipo de Oficina</p>
                    <p className="text-sm">{workshopData.workshopType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data</p>
                    <p className="text-sm">{workshopData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instrutor</p>
                    <p className="text-sm">{workshopData.instructor}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Avaliação (1 a 5 estrelas)</label>
                    <StarRating rating={rating} setRating={setRating} />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="feedback" className="block text-sm font-medium">
                      Feedback
                    </label>
                    <Textarea
                      id="feedback"
                      placeholder="Compartilhe sua experiência com a oficina..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={5}
                      required
                      className="border-iftm-green/50 focus-visible:ring-iftm-green"
                    />
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
              <Button type="submit" onClick={handleSubmit} className="bg-iftm-green hover:bg-iftm-darkGreen">
                Enviar Avaliação
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

