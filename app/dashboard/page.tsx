"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/components/nav-bar";
import Link from "next/link";
import { AuthCheck } from "@/components/auth-check";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState, ReactNode } from "react";
import {
  WorkshopRequestService,
  WorkshopRequest,
} from "@/lib/services/workshopRequestService";
import { AuthService } from "@/lib/services/authService";
import { WorkshopEditModal } from "@/components/workshop-edit-modal";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface AuthCheckProps {
  children: ReactNode;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<WorkshopRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<WorkshopRequest[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WorkshopRequest | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;

      try {
        const userData = await AuthService.getUserData(user.uid);
        setUserRole(userData?.role || null);

        if (userData?.role === "admin") {
          // Se for admin, carrega todas as solicitações
          const allRequests = await WorkshopRequestService.getAllRequests();
          setPendingRequests(allRequests.filter((r) => r.status === "pending"));
          setApprovedRequests(
            allRequests.filter((r) => r.status === "approved")
          );
        } else if (userData?.schoolId) {
          // Se for representante, carrega apenas as solicitações da escola
          const schoolRequests =
            await WorkshopRequestService.getRequestsBySchool(userData.schoolId);
          setPendingRequests(
            schoolRequests.filter((r) => r.status === "pending")
          );
          setApprovedRequests(
            schoolRequests.filter((r) => r.status === "approved")
          );
        }
      } catch (error) {
        console.error("Erro ao carregar solicitações:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as solicitações",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user]);

  const handleEditClick = (request: WorkshopRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedRequest: WorkshopRequest) => {
    if (!user || !selectedRequest) return;

    try {
      await WorkshopRequestService.updateRequest(
        selectedRequest.id,
        updatedRequest,
        user.uid
      );

      // Atualiza as listas
      setPendingRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r))
      );
      setApprovedRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? updatedRequest : r))
      );

      setIsEditModalOpen(false);
      setSelectedRequest(null);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar solicitação",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!user) return;

    try {
      await WorkshopRequestService.updateRequestStatus(
        requestId,
        newStatus,
        user.uid
      );

      // Atualiza as listas
      setPendingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
      setApprovedRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status",
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
      <AuthCheck>
        <div className="min-h-screen flex flex-col bg-iftm-lightGray">
          <NavBar />
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
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen flex flex-col bg-iftm-lightGray">
        <NavBar />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-iftm-gray">
              Painel de Controle
            </h1>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4 bg-white border border-iftm-green/20">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Solicitações Pendentes
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Solicitações Aprovadas
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Oficinas Realizadas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request: WorkshopRequest) => (
                    <Card
                      key={request.id}
                      className="border-t-4 border-t-iftm-green"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-iftm-gray">
                              {request.workshopType === "other"
                                ? request.otherDescription
                                : request.workshopType}
                            </CardTitle>
                            <CardDescription>
                              {request.hours} horas • {request.students} alunos
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusBadgeColor(request.status)}
                            >
                              {getStatusText(request.status)}
                            </Badge>
                            {userRole === "admin" && (
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
                                  <SelectItem value="pending">
                                    Pendente
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Aprovada
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejeitada
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {userRole === "school_representative" && (
                              <Button
                                variant="outline"
                                onClick={() => handleEditClick(request)}
                                className="bg-iftm-green hover:bg-iftm-darkGreen text-white"
                              >
                                Editar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Das {request.startTime} às {request.endTime}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-t-4 border-t-iftm-green">
                    <CardHeader>
                      <CardTitle className="text-iftm-gray">
                        Nenhuma solicitação pendente
                      </CardTitle>
                      <CardDescription>
                        Você não possui solicitações de oficinas pendentes no
                        momento.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/request">
                        <Button className="bg-iftm-green hover:bg-iftm-darkGreen">
                          Nova Solicitação
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedRequests.length > 0 ? (
                  approvedRequests.map((request: WorkshopRequest) => (
                    <Card
                      key={request.id}
                      className="border-t-4 border-t-iftm-green"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-iftm-gray">
                              {request.workshopType === "other"
                                ? request.otherDescription
                                : request.workshopType}
                            </CardTitle>
                            <CardDescription>
                              {request.hours} horas • {request.students} alunos
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusBadgeColor(request.status)}
                            >
                              {getStatusText(request.status)}
                            </Badge>
                            {userRole === "admin" && (
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
                                  <SelectItem value="pending">
                                    Pendente
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Aprovada
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejeitada
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {userRole === "school_representative" && (
                              <Button
                                variant="outline"
                                onClick={() => handleEditClick(request)}
                                className="bg-iftm-green hover:bg-iftm-darkGreen text-white"
                              >
                                Editar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Das {request.startTime} às {request.endTime}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-t-4 border-t-iftm-green">
                    <CardHeader>
                      <CardTitle className="text-iftm-gray">
                        Nenhuma solicitação aprovada
                      </CardTitle>
                      <CardDescription>
                        Você não possui solicitações de oficinas aprovadas no
                        momento.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <Card className="border-t-4 border-t-iftm-green">
                  <CardHeader>
                    <CardTitle className="text-iftm-gray">
                      Nenhuma oficina realizada
                    </CardTitle>
                    <CardDescription>
                      Você não possui oficinas realizadas que necessitem de
                      avaliação.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {selectedRequest && (
          <WorkshopEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </AuthCheck>
  );
}
