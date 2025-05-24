import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WorkshopRequest } from "@/lib/services/workshopRequestService";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface WorkshopEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: WorkshopRequest;
  onSave: (updatedRequest: WorkshopRequest) => Promise<void>;
}

export function WorkshopEditModal({
  isOpen,
  onClose,
  request,
  onSave,
}: WorkshopEditModalProps) {
  const [formData, setFormData] = useState({
    coordinator: request.coordinator,
    hours: request.hours,
    students: request.students,
    workshopType: request.workshopType,
    otherDescription: request.otherDescription,
    materials: request.materials,
    startTime: request.startTime,
    endTime: request.endTime,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        ...request,
        ...formData,
      });
      onClose();
      toast({
        title: "Sucesso",
        description: "Solicitação atualizada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar solicitação",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Solicitação</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na solicitação de oficina.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coordinator">Coordenador Responsável</Label>
              <Input
                id="coordinator"
                value={formData.coordinator}
                onChange={(e) =>
                  setFormData({ ...formData, coordinator: e.target.value })
                }
                required
                className="border-iftm-green/50 focus:ring-iftm-green"
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
                  onChange={(e) =>
                    setFormData({ ...formData, hours: e.target.value })
                  }
                  required
                  className="border-iftm-green/50 focus:ring-iftm-green"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="students">Quantidade de Alunos Prevista</Label>
                <Input
                  id="students"
                  type="number"
                  min="1"
                  value={formData.students}
                  onChange={(e) =>
                    setFormData({ ...formData, students: e.target.value })
                  }
                  required
                  className="border-iftm-green/50 focus:ring-iftm-green"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="workshopType">Tipo de Oficina Desejada</Label>
              <Select
                value={formData.workshopType}
                onValueChange={(value) =>
                  setFormData({ ...formData, workshopType: value })
                }
                required
              >
                <SelectTrigger
                  id="workshopType"
                  className="border-iftm-green/50 focus:ring-iftm-green"
                >
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherDescription: e.target.value,
                    })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, materials: e.target.value })
                }
                placeholder="Liste os materiais disponíveis para a oficina"
                required
                className="border-iftm-green/50 focus-visible:ring-iftm-green"
              />
            </div>

            <div className="grid gap-2">
              <Label>Horário Disponível para a Oficina</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="startTime"
                    className="text-sm text-muted-foreground"
                  >
                    Início
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                    className="border-iftm-green/50 focus-visible:ring-iftm-green"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="endTime"
                    className="text-sm text-muted-foreground"
                  >
                    Fim
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                    className="border-iftm-green/50 focus-visible:ring-iftm-green"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-iftm-green hover:bg-iftm-darkGreen"
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
