import { ref, set, get, query, orderByChild, equalTo, update, DataSnapshot } from "firebase/database";
import { db } from "../firebase/config";
import { EmailService } from './emailService';
import { AuthService } from './authService';

export interface WorkshopRequest {
  id: string;
  schoolId: string;
  representativeId: string;
  schoolName: string;
  coordinator: string;
  hours: string;
  students: string;
  workshopType: string;
  otherDescription: string;
  materials: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export class WorkshopRequestService {
  static async createRequest(
    request: Omit<WorkshopRequest, 'id' | 'createdAt' | 'updatedAt' | 'schoolId' | 'representativeId'>,
    schoolId: string,
    representativeId: string
  ): Promise<WorkshopRequest> {
    const userData = await AuthService.getUserData(representativeId);
    if (!userData || userData.role !== 'school_representative' || userData.schoolId !== schoolId) {
      throw new Error('Apenas representantes da escola podem criar solicitações');
    }

    const requestId = crypto.randomUUID();
    const newRequest: WorkshopRequest = {
      ...request,
      id: requestId,
      schoolId,
      representativeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await set(ref(db, `workshopRequests/${requestId}`), newRequest);
    await EmailService.sendWorkshopRequestEmail(newRequest);

    return newRequest;
  }

  static async getRequestsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<WorkshopRequest[]> {
    const requestsRef = ref(db, 'workshopRequests');
    const statusQuery = query(requestsRef, orderByChild('status'), equalTo(status));
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

  static async getRequestsBySchool(schoolId: string): Promise<WorkshopRequest[]> {
    const requestsRef = ref(db, 'workshopRequests');
    const schoolQuery = query(requestsRef, orderByChild('schoolId'), equalTo(schoolId));
    const snapshot: DataSnapshot = await get(schoolQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const requests: WorkshopRequest[] = [];
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      requests.push(childSnapshot.val() as WorkshopRequest);
    });

    return requests;
  }

  static async getApprovedRequestsBySchool(schoolId: string): Promise<WorkshopRequest[]> {
    const requests = await this.getRequestsBySchool(schoolId);
    return requests.filter(request => request.status === 'approved');
  }

  static async updateRequestStatus(id: string, status: 'approved' | 'rejected', adminId: string): Promise<void> {
    const isAdmin = await AuthService.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Apenas administradores podem aprovar ou rejeitar solicitações');
    }

    const requestRef = ref(db, `workshopRequests/${id}`);
    const snapshot = await get(requestRef);
    
    if (!snapshot.exists()) {
      throw new Error('Solicitação não encontrada');
    }

    const request = snapshot.val();
    
    await update(requestRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    await EmailService.sendStatusUpdateEmail({
      ...request,
      status
    });
  }
} 