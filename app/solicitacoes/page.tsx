"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavBar } from "@/components/nav-bar";
import {
  WorkshopRequestService,
  WorkshopRequest,
} from "../../lib/services/workshopRequestService";
import { EmailService } from "../../lib/services/emailService";
import { useEffect, useState, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { AuthService } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
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
        console.log("Usuário não está autenticado");
        router.push("/");
        return;
      }

      console.log("Verificando se é admin:", user.uid);
      const isAdmin = await AuthService.isAdmin(user.uid);
      if (!isAdmin) {
        console.log("Usuário não é admin");
        router.push("/dashboard");
        return;
      }

      try {
        console.log("Buscando todas as solicitações...");
        const allRequests = await WorkshopRequestService.getAllRequests();
        console.log("Solicitações encontradas:", allRequests);
        setRequests(allRequests);
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
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

  const handleStatusUpdate = async (
    requestId: string,
    status: "approved" | "rejected" | "pending"
  ) => {
    if (!user) return;

    try {
      await WorkshopRequestService.updateRequestStatus(
        requestId,
        status,
        user.uid
      );
      setRequests(
        requests.map((request) =>
          request.id === requestId ? { ...request, status } : request
        )
      );
      toast({
        title: "Sucesso",
        description: `Status da solicitação atualizado com sucesso`,
      });
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível atualizar o status da solicitação",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-500 text-yellow-500";
      case "approved":
        return "border-green-500 text-green-500";
      case "rejected":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovada";
      case "rejected":
        return "Rejeitada";
      default:
        return status;
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
          <h1 className="text-2xl font-bold mb-6 text-iftm-gray">
            Painel Administrativo
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-iftm-gray">
              Solicitações de Oficinas
            </h2>

            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request: WorkshopRequest) => (
                  <Card
                    key={request.id}
                    className="border-t-4 border-t-iftm-green"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-iftm-gray">
                            {request.schoolName}
                          </CardTitle>
                          <CardDescription>
                            Coordenador: {request.coordinator}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(request.status)}
                          >
                            {getStatusText(request.status)}
                          </Badge>
                          <Select
                            value={request.status}
                            onValueChange={(
                              value: "approved" | "rejected" | "pending"
                            ) => handleStatusUpdate(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Alterar status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="approved">Aprovada</SelectItem>
                              <SelectItem value="rejected">
                                Rejeitada
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Tipo de Oficina</p>
                          <p className="text-sm">
                            {request.workshopType === "other"
                              ? request.otherDescription
                              : request.workshopType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Quantidade de Horas
                          </p>
                          <p className="text-sm">{request.hours} horas</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Quantidade de Alunos
                          </p>
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
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-t-4 border-t-iftm-green">
                <CardHeader>
                  <CardTitle className="text-iftm-gray">
                    Nenhuma solicitação encontrada
                  </CardTitle>
                  <CardDescription>
                    Não há solicitações de oficinas registradas no sistema.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
