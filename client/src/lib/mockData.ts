// Mock data for MediConnect - No backend required

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  profileImageUrl: string;
  availability: "online" | "busy" | "offline";
  hospital?: string;
  clinic?: string;
  modeAvailability: {
    chat: boolean;
    audio: boolean;
    video: boolean;
  };
}

export interface Message {
  sender: "patient" | "doctor" | "system";
  text: string;
  timestamp: string;
}

export interface Consultation {
  _id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  mode: "chat" | "audio" | "video";
  symptoms: string;
  messages: Message[];
  status: "pending" | "active" | "ended";
  isEmergency: boolean;
  doctorNotes?: string;
  prescription?: string;
  followUpInstructions?: string;
  createdAt: string;
  acceptedAt?: string;
  endedAt?: string;
}

// Mock Doctors Database
export const MOCK_DOCTORS: Doctor[] = [
  {
    _id: "doc-001",
    name: "Dr. Amit Sharma",
    email: "amit.sharma@mediconnect.in",
    phone: "6396634403",
    specialization: "General Physician",
    experienceYears: 12,
    rating: 4.8,
    availability: "online",
    hospital: "Apollo Hospital, Delhi",
    profileImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "doc-002",
    name: "Dr. Priya Verma",
    email: "priya.verma@mediconnect.in",
    phone: "8534062358",
    specialization: "Emergency Medicine",
    experienceYears: 10,
    rating: 4.9,
    availability: "online",
    hospital: "Max Hospital, Ghaziabad",
    profileImageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "doc-003",
    name: "Dr. Rajesh Mehta",
    email: "rajesh.mehta@mediconnect.in",
    phone: "9876543210",
    specialization: "Orthopedic Surgeon",
    experienceYears: 15,
    rating: 4.7,
    availability: "busy",
    clinic: "Bone Care Clinic, Noida",
    profileImageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: false,
    },
  },
  {
    _id: "doc-004",
    name: "Dr. Sneha Kapoor",
    email: "sneha.kapoor@mediconnect.in",
    phone: "9123456789",
    specialization: "Cardiologist",
    experienceYears: 14,
    rating: 4.9,
    availability: "online",
    hospital: "Fortis Hospital, Noida",
    profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "doc-005",
    name: "Dr. Vikram Singh",
    email: "vikram.singh@mediconnect.in",
    phone: "9988776655",
    specialization: "Pediatrician",
    experienceYears: 8,
    rating: 4.6,
    availability: "online",
    hospital: "Rainbow Children's Hospital, Delhi",
    profileImageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "doc-006",
    name: "Dr. Anjali Reddy",
    email: "anjali.reddy@mediconnect.in",
    phone: "8899001122",
    specialization: "Dermatologist",
    experienceYears: 9,
    rating: 4.7,
    availability: "offline",
    clinic: "Skin Care Clinic, Ghaziabad",
    profileImageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: false,
      video: true,
    },
  },
];

// Local storage keys
const STORAGE_KEYS = {
  CONSULTATIONS: "mediconnect_consultations",
  CURRENT_USER: "mediconnect_current_user",
  DOCTOR_AUTH: "mediconnect_doctor_auth",
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
    const initialConsultations: Consultation[] = [
      {
        _id: "cons-001",
        patientId: "patient-demo",
        patientName: "Rahul Kumar",
        patientPhone: "9876543210",
        doctorId: "doc-001",
        mode: "chat",
        symptoms: "Fever - High fever since yesterday, body ache, and headache",
        messages: [
          {
            sender: "system",
            text: "Consultation started. Dr. Amit Sharma will be with you shortly.",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            sender: "doctor",
            text: "Hello Rahul, I can see you have a fever. How high is your temperature?",
            timestamp: new Date(Date.now() - 3500000).toISOString(),
          },
          {
            sender: "patient",
            text: "It's around 102°F doctor. Started yesterday evening.",
            timestamp: new Date(Date.now() - 3400000).toISOString(),
          },
        ],
        status: "active",
        isEmergency: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        acceptedAt: new Date(Date.now() - 3550000).toISOString(),
      },
      {
        _id: "cons-002",
        patientId: "patient-demo-2",
        patientName: "Priya Sharma",
        patientPhone: "8765432109",
        doctorId: "doc-002",
        mode: "video",
        symptoms: "Chest Pain - Sudden chest pain and difficulty breathing",
        messages: [
          {
            sender: "system",
            text: "Emergency consultation started.",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        status: "pending",
        isEmergency: true,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(initialConsultations));
  }
};

// Get all consultations
export const getConsultations = (): Consultation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
  return data ? JSON.parse(data) : [];
};

// Get consultation by ID
export const getConsultationById = (id: string): Consultation | null => {
  const consultations = getConsultations();
  return consultations.find((c) => c._id === id) || null;
};

// Create new consultation
export const createConsultation = (data: {
  doctorId: string;
  mode: "chat" | "audio" | "video";
  symptoms: string;
  patientName: string;
  patientPhone: string;
}): Consultation => {
  const consultations = getConsultations();
  const newConsultation: Consultation = {
    _id: `cons-${Date.now()}`,
    patientId: "patient-demo",
    patientName: data.patientName || "Anonymous",
    patientPhone: data.patientPhone,
    doctorId: data.doctorId,
    mode: data.mode,
    symptoms: data.symptoms,
    messages: [
      {
        sender: "system",
        text: "Consultation request sent. Waiting for doctor to accept...",
        timestamp: new Date().toISOString(),
      },
    ],
    status: "pending",
    isEmergency: false,
    createdAt: new Date().toISOString(),
  };
  
  consultations.push(newConsultation);
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  
  // Auto-accept after 2 seconds (simulate doctor accepting)
  setTimeout(() => {
    acceptConsultation(newConsultation._id);
  }, 2000);
  
  return newConsultation;
};

// Accept consultation
export const acceptConsultation = (consultationId: string) => {
  const consultations = getConsultations();
  const consultation = consultations.find((c) => c._id === consultationId);
  if (consultation && consultation.status === "pending") {
    consultation.status = "active";
    consultation.acceptedAt = new Date().toISOString();
    consultation.messages.push({
      sender: "system",
      text: "Doctor has joined the consultation.",
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }
};

// Add message to consultation
export const addMessage = (consultationId: string, message: Message) => {
  const consultations = getConsultations();
  const consultation = consultations.find((c) => c._id === consultationId);
  if (consultation) {
    consultation.messages.push(message);
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }
};

// Update consultation
export const updateConsultation = (
  consultationId: string,
  updates: Partial<Consultation>
) => {
  const consultations = getConsultations();
  const index = consultations.findIndex((c) => c._id === consultationId);
  if (index !== -1) {
    consultations[index] = { ...consultations[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }
};

// End consultation
export const endConsultation = (consultationId: string) => {
  updateConsultation(consultationId, {
    status: "ended",
    endedAt: new Date().toISOString(),
  });
};

// Get consultations by doctor ID
export const getConsultationsByDoctor = (doctorId: string) => {
  const consultations = getConsultations();
  return consultations.filter((c) => c.doctorId === doctorId);
};

// Get pending consultations for doctor
export const getPendingConsultations = (doctorId: string) => {
  const consultations = getConsultationsByDoctor(doctorId);
  return consultations.filter((c) => c.status === "pending");
};

// Get active consultations for doctor
export const getActiveConsultations = (doctorId: string) => {
  const consultations = getConsultationsByDoctor(doctorId);
  return consultations.filter((c) => c.status === "active");
};

// Get doctor stats
export const getDoctorStats = (doctorId: string) => {
  const consultations = getConsultationsByDoctor(doctorId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    activeConsultations: consultations.filter((c) => c.status === "active").length,
    todayConsultations: consultations.filter(
      (c) => new Date(c.createdAt) >= today
    ).length,
    emergencyConsultations: consultations.filter(
      (c) => c.isEmergency && c.status !== "ended"
    ).length,
  };
};

// Get doctor by ID
export const getDoctorById = (id: string): Doctor | null => {
  return MOCK_DOCTORS.find((d) => d._id === id) || null;
};

// Mock doctor login
export const mockDoctorLogin = (email: string, password: string) => {
  // Simple mock authentication - any doctor email works with password "doctor123"
  const doctor = MOCK_DOCTORS.find((d) => d.email === email);
  if (doctor && password === "doctor123") {
    const authData = {
      doctor,
      token: `mock-token-${doctor._id}`,
    };
    localStorage.setItem(STORAGE_KEYS.DOCTOR_AUTH, JSON.stringify(authData));
    return authData;
  }
  return null;
};

// Get current doctor auth
export const getCurrentDoctorAuth = () => {
  const data = localStorage.getItem(STORAGE_KEYS.DOCTOR_AUTH);
  return data ? JSON.parse(data) : null;
};

// Logout doctor
export const logoutDoctor = () => {
  localStorage.removeItem(STORAGE_KEYS.DOCTOR_AUTH);
};

// Update doctor availability
export const updateDoctorAvailability = (
  doctorId: string,
  availability: "online" | "busy" | "offline"
) => {
  const authData = getCurrentDoctorAuth();
  if (authData && authData.doctor._id === doctorId) {
    authData.doctor.availability = availability;
    localStorage.setItem(STORAGE_KEYS.DOCTOR_AUTH, JSON.stringify(authData));
  }
};

// Initialize on module load
if (typeof window !== "undefined") {
  initializeMockData();
}
