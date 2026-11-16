"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NavodayanProfile } from "@/types";
import { dataService } from "@/services/dataService";
import { sound } from "@/lib/sound";

interface AuthContextType {
  user: NavodayanProfile | null;
  isAuthenticated: boolean;
  isOnboardingOpen: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, pass: string) => void;
  loginDemoUser: (userIndex?: number) => void;
  logout: () => void;
  saveOnboarding: (data: Partial<NavodayanProfile>) => NavodayanProfile;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isOnboardingOpen: false,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  loginWithGoogle: () => {},
  loginWithEmail: () => {},
  loginDemoUser: () => {},
  logout: () => {},
  saveOnboarding: () => ({} as NavodayanProfile),
  requireAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NavodayanProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    const isAuth = dataService.getIsAuthenticated();
    const curUser = dataService.getCurrentUser();
    setIsAuthenticated(isAuth);
    if (isAuth && curUser) {
      setUser(curUser);
      if (!curUser.onboarding_completed) {
        setIsOnboardingOpen(true);
      }
    }
  }, []);

  const openAuthModal = () => {
    sound.playTap();
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = () => {
    sound.playSuccess();
    dataService.login();
    const cur = dataService.getCurrentUser();
    setUser(cur);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    if (!cur.onboarding_completed) {
      setIsOnboardingOpen(true);
    }
  };

  const loginWithEmail = (email: string) => {
    sound.playSuccess();
    dataService.login({ email });
    const cur = dataService.getCurrentUser();
    setUser(cur);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    if (!cur.onboarding_completed) {
      setIsOnboardingOpen(true);
    }
  };

  const loginDemoUser = (userIndex: number = 0) => {
    sound.playSuccess();
    const demoProfiles = dataService.getProfiles();
    const chosen = demoProfiles[userIndex] || demoProfiles[0];
    dataService.login(chosen);
    setUser(chosen);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    sound.playTap();
    dataService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const saveOnboarding = (data: Partial<NavodayanProfile>): NavodayanProfile => {
    sound.playSuccess();
    const completed = dataService.completeOnboarding(data);
    setUser(completed);
    setIsAuthenticated(true);
    setIsOnboardingOpen(false);
    return completed;
  };

  const requireAuth = (action: () => void) => {
    if (isAuthenticated && user) {
      action();
    } else {
      openAuthModal();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOnboardingOpen,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        loginDemoUser,
        logout,
        saveOnboarding,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
