import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { auth, db } from "../firebase/config";

export type UserRole = "admin" | "school_representative";

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  schoolId?: string; // ID da escola que o representante representa
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthService {
  // Criar novo usuário representante de escola
  static async registerSchoolRepresentative(
    email: string,
    password: string,
    schoolId: string,
    displayName: string
  ): Promise<UserData> {
    try {
      // Verificar se a escola existe
      const schoolSnapshot = await get(ref(db, `schools/${schoolId}`));
      if (!schoolSnapshot.exists()) {
        throw new Error("Escola não encontrada");
      }

      // Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Criar dados do usuário no Realtime Database
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        role: "school_representative",
        schoolId,
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Salvar dados do usuário no Realtime Database
      await set(ref(db, `users/${user.uid}`), userData);

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Criar usuário admin
  static async registerAdmin(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserData> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        role: "admin",
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await set(ref(db, `users/${user.uid}`), userData);

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Login
  static async login(email: string, password: string): Promise<UserData> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await this.getUserData(userCredential.user.uid);

      if (!userData) {
        throw new Error("Dados do usuário não encontrados");
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Obter dados do usuário
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const snapshot = await get(ref(db, `users/${uid}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Verificar se usuário é admin
  static async isAdmin(uid: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData?.role === "admin";
    } catch {
      return false;
    }
  }

  // Verificar se usuário é representante de escola
  static async isSchoolRepresentative(uid: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData?.role === "school_representative";
    } catch {
      return false;
    }
  }

  // Obter escola do representante
  static async getRepresentativeSchool(uid: string) {
    try {
      const userData = await this.getUserData(uid);
      if (!userData?.schoolId) return null;

      const schoolSnapshot = await get(ref(db, `schools/${userData.schoolId}`));
      return schoolSnapshot.exists() ? schoolSnapshot.val() : null;
    } catch {
      return null;
    }
  }
}
