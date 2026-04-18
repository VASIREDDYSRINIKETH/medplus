import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userName: string | null;
  setToken: (token: string) => void;
  setUserName: (name: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('auth_token'),
  userName: localStorage.getItem('auth_user'),
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token });
  },
  setUserName: (name: string) => {
    localStorage.setItem('auth_user', name);
    set({ userName: name });
  },
  clearToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ token: null, userName: null });
  },
  isAuthenticated: () => get().token !== null,
}));
