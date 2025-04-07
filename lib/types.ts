// School Interface
export interface School {
  id: string;
  schoolName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
}

// Workshop Request Interface
export interface WorkshopRequest {
  id: string;
  schoolId: string;
  workshopType: string;
  description: string;
  expectedParticipants: number;
  preferredDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
  feedback?: string;
}

// Workshop Type Interface
export interface WorkshopType {
  id: string;
  name: string;
  description: string;
  duration: string;
  requirements: string[];
  status: "active" | "inactive";
}

// Feedback Interface
export interface Feedback {
  id: string;
  workshopRequestId: string;
  schoolId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Admin Interface
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordinator";
  createdAt: string;
  lastLogin: string;
}

// Database Paths
export const DB_PATHS = {
  SCHOOLS: "schools",
  WORKSHOP_REQUESTS: "workshopRequests",
  WORKSHOP_TYPES: "workshopTypes",
  FEEDBACK: "feedback",
  ADMINS: "admins",
} as const;
