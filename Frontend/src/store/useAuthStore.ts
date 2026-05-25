import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'student' | 'mentor' | 'faculty' | 'client' | 'admin';
export type StudentLevel = 'A' | 'B' | 'C' | 'D' | null;

export interface ReputationMetrics {
  professionalismScore: number;
  reliabilityScore: number;
  examIntegrityScore: number;
  collaborationRating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone_number?: string;
  studentLevel?: StudentLevel; // Only for students
  reputation?: ReputationMetrics; // Faculty and Mentors can view this
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ 
        user: state.user ? { ...state.user, ...data } : null 
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
