import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockDoctorLogin, getCurrentDoctorAuth, logoutDoctor, updateDoctorAvailability, type Doctor } from "@/lib/mockData";

interface DoctorAuthContextType {
  doctor: Doctor | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAvailability: (availability: "online" | "busy" | "offline") => Promise<void>;
  isAuthenticated: boolean;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

export const DoctorAuthProvider = ({ children }: { children: ReactNode }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authData = getCurrentDoctorAuth();
    if (authData) {
      setToken(authData.token);
      setDoctor(authData.doctor);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const authData = mockDoctorLogin(email, password);
    if (!authData) {
      throw new Error("Invalid credentials. Use any doctor email with password: doctor123");
    }
    setToken(authData.token);
    setDoctor(authData.doctor);
  };

  const logout = () => {
    setToken(null);
    setDoctor(null);
    logoutDoctor();
  };

  const updateAvailability = async (availability: "online" | "busy" | "offline") => {
    if (!doctor) return;
    updateDoctorAvailability(doctor._id, availability);
    const updatedDoctor = { ...doctor, availability };
    setDoctor(updatedDoctor);
  };

  return (
    <DoctorAuthContext.Provider
      value={{
        doctor,
        token,
        login,
        logout,
        updateAvailability,
        isAuthenticated: !!doctor && !!token,
      }}
    >
      {children}
    </DoctorAuthContext.Provider>
  );
};

export const useDoctorAuth = () => {
  const context = useContext(DoctorAuthContext);
  if (!context) {
    throw new Error("useDoctorAuth must be used within DoctorAuthProvider");
  }
  return context;
};

