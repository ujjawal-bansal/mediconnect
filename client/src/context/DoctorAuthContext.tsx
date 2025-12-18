import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  phone: string;
  hospital?: string;
  clinic?: string;
  availability: "online" | "busy" | "offline";
  modeAvailability: {
    chat: boolean;
    audio: boolean;
    video: boolean;
  };
  rating?: number;
  profileImageUrl?: string;
}

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
    const storedToken = localStorage.getItem("doctorToken");
    const storedDoctor = localStorage.getItem("doctorData");
    if (storedToken && storedDoctor) {
      setToken(storedToken);
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/doctor/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await res.json();
    setToken(data.token);
    setDoctor(data.doctor);
    localStorage.setItem("doctorToken", data.token);
    localStorage.setItem("doctorData", JSON.stringify(data.doctor));
  };

  const logout = () => {
    setToken(null);
    setDoctor(null);
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorData");
  };

  const updateAvailability = async (availability: "online" | "busy" | "offline") => {
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/doctor/availability`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ availability }),
    });

    if (!res.ok) {
      throw new Error("Failed to update availability");
    }

    const updatedDoctor = await res.json();
    setDoctor(updatedDoctor);
    localStorage.setItem("doctorData", JSON.stringify(updatedDoctor));
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

