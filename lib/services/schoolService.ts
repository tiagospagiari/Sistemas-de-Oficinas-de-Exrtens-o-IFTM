import {
  ref,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../firebase/config";
import { School } from "../types";

export class SchoolService {
  // Criar uma nova escola
  static async createSchool(
    schoolData: Omit<School, "id" | "createdAt" | "updatedAt">
  ): Promise<School> {
    const schoolId = crypto.randomUUID();
    const newSchool: School = {
      ...schoolData,
      id: schoolId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
    };

    await set(ref(db, `schools/${schoolId}`), newSchool);
    return newSchool;
  }

  // Buscar todas as escolas
  static async getAllSchools(): Promise<School[]> {
    const snapshot = await get(ref(db, "schools"));
    if (!snapshot.exists()) {
      return [];
    }

    const schools: School[] = [];
    snapshot.forEach((childSnapshot) => {
      schools.push(childSnapshot.val());
    });

    return schools;
  }

  // Buscar escola por ID
  static async getSchoolById(schoolId: string): Promise<School | null> {
    const snapshot = await get(ref(db, `schools/${schoolId}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  // Buscar escolas por status
  static async getSchoolsByStatus(
    status: "active" | "inactive"
  ): Promise<School[]> {
    const schoolsRef = ref(db, "schools");
    const statusQuery = query(
      schoolsRef,
      orderByChild("status"),
      equalTo(status)
    );

    const snapshot = await get(statusQuery);
    if (!snapshot.exists()) {
      return [];
    }

    const schools: School[] = [];
    snapshot.forEach((childSnapshot) => {
      schools.push(childSnapshot.val());
    });

    return schools;
  }

  // Atualizar escola
  static async updateSchool(
    schoolId: string,
    schoolData: Partial<School>
  ): Promise<void> {
    const updates = {
      ...schoolData,
      updatedAt: new Date().toISOString(),
    };

    await update(ref(db, `schools/${schoolId}`), updates);
  }

  // Deletar escola
  static async deleteSchool(schoolId: string): Promise<void> {
    await remove(ref(db, `schools/${schoolId}`));
  }

  // Desativar escola (soft delete)
  static async deactivateSchool(schoolId: string): Promise<void> {
    await update(ref(db, `schools/${schoolId}`), {
      status: "inactive",
      updatedAt: new Date().toISOString(),
    });
  }
}
