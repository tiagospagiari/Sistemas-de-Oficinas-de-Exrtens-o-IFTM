"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { School } from "@/lib/types";
import { WorkshopRequestService } from "@/lib/services/workshopRequestService";
import { WorkshopRequest } from "@/lib/services/workshopRequestService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SchoolDetailsModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SchoolDetailsModal({
  school,
  isOpen,
  onClose,
}: SchoolDetailsModalProps) {
  const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequest[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkshopRequests = async () => {
      if (!school) return;

      try {
        setIsLoading(true);
        console.log("Carregando oficinas para a escola:", school.id);
        const requests = await WorkshopRequestService.getRequestsBySchool(
          school.id
        );
        console.log("Oficinas encontradas:", requests);
        setWorkshopRequests(requests);
      } catch (error) {
        console.error("Erro ao carregar solicitações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshopRequests();
  }, [school]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!school) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-iftm-gray">
            Detalhes da Escola
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="workshops">Oficinas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-iftm-gray">
                      Nome da Escola
                    </h3>
                    <p>{school.schoolName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">Email</h3>
                    <p>{school.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">Telefone</h3>
                    <p>{school.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">Status</h3>
                    <Badge
                      className={
                        school.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    >
                      {school.status === "active" ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">Endereço</h3>
                    <p>{school.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">
                      Cidade/Estado
                    </h3>
                    <p>
                      {school.city}, {school.state}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">CEP</h3>
                    <p>{school.zipCode}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">
                      Data de Cadastro
                    </h3>
                    <p>{formatDate(school.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-iftm-gray">
                      Última Atualização
                    </h3>
                    <p>{formatDate(school.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workshops">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Carregando oficinas...
                  </p>
                </CardContent>
              </Card>
            ) : workshopRequests.length > 0 ? (
              <div className="space-y-4">
                {workshopRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="border-l-4 border-l-iftm-green"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-iftm-gray">
                              {request.workshopType}
                            </h3>
                            <Badge
                              className={getStatusBadgeColor(request.status)}
                            >
                              {request.status === "pending" && "Pendente"}
                              {request.status === "approved" && "Aprovada"}
                              {request.status === "rejected" && "Rejeitada"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Coordenador: {request.coordinator}
                          </p>
                          <p className="text-sm">
                            Horas: {request.hours} | Alunos: {request.students}
                          </p>
                          <p className="text-sm">
                            Data: {formatDate(request.startTime)} -{" "}
                            {formatDate(request.endTime)}
                          </p>
                          {request.otherDescription && (
                            <p className="text-sm">
                              Descrição: {request.otherDescription}
                            </p>
                          )}
                          {request.materials && (
                            <p className="text-sm">
                              Materiais: {request.materials}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Nenhuma oficina registrada para esta escola.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
