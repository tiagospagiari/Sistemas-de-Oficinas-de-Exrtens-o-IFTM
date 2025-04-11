"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavBar } from "@/components/nav-bar"
import { WorkshopRequestService, WorkshopRequest } from "../../lib/services/workshopRequestService"
import { EmailService } from "../../lib/services/emailService"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const [requests, setRequests] = useState<WorkshopRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const pendingRequests = await WorkshopRequestService.getRequestsByStatus('pending')
        setRequests(pendingRequests)
      } catch (error) {
        console.error('Error fetching requests:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as solicitações",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await WorkshopRequestService.updateRequestStatus(requestId, status)
      const updatedRequest = requests.find(request => request.id === requestId)
      if (updatedRequest) {
        await EmailService.sendStatusUpdateEmail({
          ...updatedRequest,
          status
        })
      }
      setRequests(requests.filter(request => request.id !== requestId))
      toast({
        title: "Sucesso",
        description: `Solicitação ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
      })
    } catch (error) {
      console.error('Error updating request status:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      <NavBar isAdmin={true} />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-iftm-gray">Painel Administrativo</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-iftm-gray">Solicitações Pendentes</h2>

            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="border-t-4 border-t-iftm-green">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-iftm-gray">{request.schoolName}</CardTitle>
                          <CardDescription>Coordenador: {request.coordinator}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-iftm-green text-iftm-green">
                          Pendente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Tipo de Oficina</p>
                          <p className="text-sm">{request.workshopType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quantidade de Horas</p>
                          <p className="text-sm">{request.hours} horas</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quantidade de Alunos</p>
                          <p className="text-sm">{request.students} alunos</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Horário</p>
                          <p className="text-sm">
                            Das {request.startTime} às {request.endTime}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" className="border-iftm-red text-iftm-red hover:bg-red-50" onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                        Recusar
                      </Button>
                      <Button className="bg-iftm-green hover:bg-iftm-darkGreen" onClick={() => handleStatusUpdate(request.id, 'approved')}>Aprovar</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-t-4 border-t-iftm-green">
                <CardHeader>
                  <CardTitle className="text-iftm-gray">Nenhuma solicitação pendente</CardTitle>
                  <CardDescription>Não há solicitações de oficinas pendentes para aprovação.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

