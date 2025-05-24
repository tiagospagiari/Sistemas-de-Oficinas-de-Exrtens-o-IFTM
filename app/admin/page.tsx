"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavBar } from "@/components/nav-bar"
import { WorkshopRequestService, WorkshopRequest } from "../../lib/services/workshopRequestService"
import { EmailService } from "../../lib/services/emailService"
import { useEffect, useState, ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { AuthService } from "@/lib/services/authService"
import { useRouter } from "next/navigation"

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children: ReactNode;
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<WorkshopRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/');
        return;
      }

      const isAdmin = await AuthService.isAdmin(user.uid);
      if (!isAdmin) {
        router.push('/dashboard');
        return;
      }

      try {
        const pendingRequests = await WorkshopRequestService.getRequestsByStatus('pending');
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as solicitações",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, router]);

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      await WorkshopRequestService.updateRequestStatus(requestId, status, user.uid);
      setRequests(requests.filter((request: WorkshopRequest) => request.id !== requestId));
      toast({
        title: "Sucesso",
        description: `Solicitação ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
      });
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status da solicitação",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-iftm-lightGray">
        <NavBar isAdmin={true} />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Carregando...</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    );
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
                {requests.map((request: WorkshopRequest) => (
                  <Card key={request.id} className="border-t-4 border-t-iftm-green">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-iftm-gray">{request.schoolName}</CardTitle>
                          <CardDescription>Coordenador: {request.coordinator}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Pendente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Tipo de Oficina</p>
                          <p className="text-sm">
                            {request.workshopType === 'other' ? request.otherDescription : request.workshopType}
                          </p>
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
                      <Button 
                        variant="outline" 
                        className="border-iftm-red text-iftm-red hover:bg-red-50" 
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      >
                        Recusar
                      </Button>
                      <Button 
                        className="bg-iftm-green hover:bg-iftm-darkGreen" 
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                      >
                        Aprovar
                      </Button>
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
  );
}

