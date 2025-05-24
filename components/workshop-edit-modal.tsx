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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Solicitação</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na solicitação de oficina.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coordinator" className="text-right">
                Coordenador
              </Label>
              <Input
                id="coordinator"
                value={formData.coordinator}
                onChange={(e) =>
                  setFormData({ ...formData, coordinator: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">
                Horas
              </Label>
              <Input
                id="hours"
                type="number"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="students" className="text-right">
                Alunos
              </Label>
              <Input
                id="students"
                type="number"
                value={formData.students}
                onChange={(e) =>
                  setFormData({ ...formData, students: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workshopType" className="text-right">
                Tipo
              </Label>
              <Select
                value={formData.workshopType}
                onValueChange={(value) =>
                  setFormData({ ...formData, workshopType: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Oficina</SelectItem>
                  <SelectItem value="lecture">Palestra</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.workshopType === "other" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otherDescription" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="otherDescription"
                  value={formData.otherDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherDescription: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materials" className="text-right">
                Materiais
              </Label>
              <Textarea
                id="materials"
                value={formData.materials}
                onChange={(e) =>
                  setFormData({ ...formData, materials: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Início
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                Fim
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-iftm-green hover:bg-iftm-darkGreen"
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
