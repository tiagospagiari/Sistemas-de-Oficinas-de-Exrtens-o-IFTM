import {
  ref,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  update,
  DataSnapshot,
} from "firebase/database";
import { db } from "../firebase/config";
import { EmailService } from "./emailService";
import { AuthService } from "./authService";

export interface WorkshopRequest {
  id: string;
  schoolId: string;
  representativeId: string;
  schoolName: string;
  coordinator: string;
  hours: string;
  students: string;
  workshopType: string;
  otherDescription?: string;
  materials?: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  educationLevel: string[];
  availableDays: string[];
  workshopDescription?: string;
}

export class WorkshopRequestService {
  static async createRequest(
    request: Omit<
      WorkshopRequest,
      "id" | "createdAt" | "updatedAt" | "schoolId" | "representativeId"
    >,
    schoolId: string,
    representativeId: string
  ): Promise<WorkshopRequest> {
    const userData = await AuthService.getUserData(representativeId);
    if (
      !userData ||
      userData.role !== "school_representative" ||
      userData.schoolId !== schoolId
    ) {
      throw new Error(
        "Apenas representantes da escola podem criar solicitações"
      );
    }

    const requestId = crypto.randomUUID();
    const newRequest: WorkshopRequest = {
      ...request,
      id: requestId,
      schoolId,
      representativeId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(db, `workshopRequests/${requestId}`), newRequest);
    await EmailService.sendWorkshopRequestEmail(newRequest);

    return newRequest;
  }

  static async getRequestsByStatus(
    status: "pending" | "approved" | "rejected"
  ): Promise<WorkshopRequest[]> {
    const requestsRef = ref(db, "workshopRequests");
    const statusQuery = query(
      requestsRef,
      orderByChild("status"),
      equalTo(status)
    );
    const snapshot: DataSnapshot = await get(statusQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const requests: WorkshopRequest[] = [];
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      requests.push(childSnapshot.val() as WorkshopRequest);
    });

    return requests;
  }

  static async getRequestsBySchool(
    schoolId: string
  ): Promise<WorkshopRequest[]> {
    console.log("Buscando oficinas para escola:", schoolId);
    const requestsRef = ref(db, "workshopRequests");
    const schoolQuery = query(
      requestsRef,
      orderByChild("schoolId"),
      equalTo(schoolId)
    );
    const snapshot: DataSnapshot = await get(schoolQuery);

    console.log("Snapshot existe:", snapshot.exists());
    if (!snapshot.exists()) {
      return [];
    }

    const requests: WorkshopRequest[] = [];
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      const request = childSnapshot.val() as WorkshopRequest;
      console.log("Oficina encontrada:", request);
      requests.push(request);
    });

    return requests;
  }

  static async getApprovedRequestsBySchool(
    schoolId: string
  ): Promise<WorkshopRequest[]> {
    const requests = await this.getRequestsBySchool(schoolId);
    return requests.filter((request) => request.status === "approved");
  }

  static async getAllRequests(): Promise<WorkshopRequest[]> {
    console.log("Iniciando busca de todas as solicitações...");
    const requestsRef = ref(db, "workshopRequests");
    console.log("Referência criada:", requestsRef);

    const snapshot: DataSnapshot = await get(requestsRef);
    console.log(
      "Snapshot obtido:",
      snapshot.exists() ? "existe" : "não existe"
    );

    if (!snapshot.exists()) {
      console.log("Nenhuma solicitação encontrada");
      return [];
    }

    const requests: WorkshopRequest[] = [];
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      const request = childSnapshot.val() as WorkshopRequest;
      console.log("Solicitação encontrada:", request);
      requests.push(request);
    });

    console.log("Total de solicitações encontradas:", requests.length);
    return requests;
  }

  static async updateRequestStatus(
    id: string,
    status: "pending" | "approved" | "rejected",
    adminId: string
  ): Promise<void> {
    const isAdmin = await AuthService.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error(
        "Apenas administradores podem alterar o status das solicitações"
      );
    }

    const requestRef = ref(db, `workshopRequests/${id}`);
    const snapshot = await get(requestRef);

    if (!snapshot.exists()) {
      throw new Error("Solicitação não encontrada");
    }

    const request = snapshot.val();

    await update(requestRef, {
      status,
      updatedAt: new Date().toISOString(),
    });

    await EmailService.sendStatusUpdateEmail({
      ...request,
      status,
    });
  }

  static async updateRequest(
    id: string,
    updatedData: Partial<WorkshopRequest>,
    userId: string
  ): Promise<void> {
    const userData = await AuthService.getUserData(userId);
    if (!userData) {
      throw new Error("Usuário não encontrado");
    }

    const requestRef = ref(db, `workshopRequests/${id}`);
    const snapshot = await get(requestRef);

    if (!snapshot.exists()) {
      throw new Error("Solicitação não encontrada");
    }

    const request = snapshot.val() as WorkshopRequest;

    // Verifica se o usuário tem permissão para editar
    if (
      userData.role === "school_representative" &&
      request.representativeId !== userId
    ) {
      throw new Error("Você não tem permissão para editar esta solicitação");
    }

    // Se for representante, não pode alterar o status
    if (userData.role === "school_representative" && updatedData.status) {
      delete updatedData.status;
    }

    await update(requestRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
  }
}
