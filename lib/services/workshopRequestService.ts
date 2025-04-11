import { ref, set, get, query, orderByChild, equalTo, update } from "firebase/database";
import { db } from "../firebase/config";
import { EmailService } from './emailService';

export interface WorkshopRequest {
  id: string;
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
  static async createRequest(request: Omit<WorkshopRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkshopRequest> {
    const requestId = crypto.randomUUID();
    const newRequest: WorkshopRequest = {
      ...request,
      id: requestId,
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
    const snapshot = await get(statusQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const requests: WorkshopRequest[] = [];
    snapshot.forEach((childSnapshot) => {
      requests.push(childSnapshot.val());
    });

    return requests;
  }

  static async updateRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    await update(ref(db, `workshopRequests/${id}`), {
      status,
      updatedAt: new Date().toISOString()
    });
  }
} 