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
import { AuthService } from "./authService";

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
    schoolData: Partial<School>,
    userId: string
  ): Promise<void> {
    // Verificar permissões
    const userData = await AuthService.getUserData(userId);
    if (!userData) {
      throw new Error("Usuário não encontrado");
    }

    const isAdmin = userData.email === "extensao@iftm.com";
    const isSchoolRepresentative =
      userData.role === "school_representative" &&
      userData.schoolId === schoolId;

    if (!isAdmin && !isSchoolRepresentative) {
      throw new Error("Você não tem permissão para editar esta escola");
    }

    const updates = {
      ...schoolData,
      updatedAt: new Date().toISOString(),
    };

    // Usar set com merge para atualizar apenas os campos fornecidos
    await set(ref(db, `schools/${schoolId}`), {
      ...(await this.getSchoolById(schoolId)),
      ...updates,
    });
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
