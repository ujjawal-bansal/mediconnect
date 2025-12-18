import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Video, Star, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

type ConsultMode = "chat" | "call" | "video";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  phone: string;
  rating?: number;
  profileImageUrl?: string;
  availability?: "online" | "busy" | "offline";
  modeAvailability: {
    chat: boolean;
    audio: boolean;
    video: boolean;
  };
}

// Fallback doctors list - always available for demo
const FALLBACK_DOCTORS: Doctor[] = [
  {
    _id: "fallback-1",
    name: "Dr. Aman Sharma",
    specialization: "General Physician",
    experienceYears: 10,
    phone: "6396634403",
    rating: 4.8,
    availability: "online",
    profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "fallback-2",
    name: "Dr. Neha Verma",
    specialization: "Emergency Medicine",
    experienceYears: 8,
    phone: "8534062358",
    rating: 4.9,
    availability: "online",
    profileImageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
  {
    _id: "fallback-3",
    name: "Dr. Rohit Gupta",
    specialization: "Orthopedic",
    experienceYears: 9,
    phone: "8534062358",
    rating: 4.7,
    availability: "online",
    profileImageUrl: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&auto=format&fit=crop",
    modeAvailability: {
      chat: true,
      audio: true,
      video: true,
    },
  },
];

const Consultation = () => {
  const navigate = useNavigate();
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [symptomDetails, setSymptomDetails] = useState("");
  const [consultMode, setConsultMode] = useState<ConsultMode>("chat");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>(FALLBACK_DOCTORS);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);

  const symptoms = [
    "Fever",
    "Headache",
    "Cold & Cough",
    "Stomach Pain",
    "Skin Issues",
    "Chest Pain",
    "Anxiety / Stress",
    "Back Pain",
    "Allergies",
    "General Checkup",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        if (res.ok) {
          const data: Doctor[] = await res.json();
          if (data.length > 0) {
            setDoctors(data);
          } else {
            // Backend returned empty, use fallback
            setDoctors(FALLBACK_DOCTORS);
          }
        } else {
          // API error, use fallback
          setDoctors(FALLBACK_DOCTORS);
        }
      } catch (err) {
        // Network error or other issue, use fallback
        console.warn("Could not fetch doctors from backend, using fallback list:", err);
        setDoctors(FALLBACK_DOCTORS);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookConsultation = async (doctor: Doctor, mode: ConsultMode) => {
    if (!selectedSymptom && !symptomDetails) {
      toast.error("Please describe your symptoms before starting a consultation.");
      return;
    }

    if (!patientPhone.trim()) {
      toast.error("Please enter your phone number so the doctor can reach you if needed.");
      return;
    }

    const backendMode = mode === "call" ? "audio" : mode;

    setBookingDoctorId(doctor._id);

    try {
      const res = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          mode: backendMode,
          symptoms: `${selectedSymptom || "General concern"} - ${symptomDetails || "No additional details provided."}`,
          patientName: patientName || "Anonymous patient",
          patientPhone,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create consultation");
      }

      const consultation = await res.json();

      toast.success(`Starting ${mode} consultation with ${doctor.name}...`);

      if (mode === "chat") {
        navigate(
          `/consultation/chat/${consultation._id}?doctor=${encodeURIComponent(
            doctor.name,
          )}&mode=${backendMode}`,
        );
      } else {
        navigate(
          `/consultation/chat/${consultation._id}?doctor=${encodeURIComponent(
            doctor.name,
          )}&mode=${backendMode}`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to start consultation right now. Please try again.");
    } finally {
      setBookingDoctorId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Online Consultation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with expert doctors via chat, call, or video consultation. Describe your symptoms and choose your preferred consultation method.
        </p>
      </div>

      {/* Patient details & Symptom Selection */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Patient & Symptom Details</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Your Name (optional)</Label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number (required for emergency contact)</Label>
            <Input
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>
          <div className="space-y-2">
            <Label>Select Primary Symptom</Label>
            <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your primary symptom" />
              </SelectTrigger>
              <SelectContent>
                {symptoms.map((symptom) => (
                  <SelectItem key={symptom} value={symptom}>
                    {symptom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Consultation Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={consultMode === "chat" ? "default" : "outline"}
                onClick={() => setConsultMode("chat")}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={consultMode === "call" ? "default" : "outline"}
                onClick={() => setConsultMode("call")}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button
                variant={consultMode === "video" ? "default" : "outline"}
                onClick={() => setConsultMode("video")}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label>Additional Details (Optional)</Label>
          <Textarea
            placeholder="Describe your symptoms in detail, including when they started, severity, and any other relevant information..."
            value={symptomDetails}
            onChange={(e) => setSymptomDetails(e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      {/* Available Doctors */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Available Doctors</h2>
          {!isLoadingDoctors && doctors.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Doctors available for instant consultation
            </p>
          )}
        </div>
        {isLoadingDoctors && (
          <p className="text-sm text-muted-foreground mb-6">Loading doctors...</p>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              className="overflow-hidden hover:shadow-float transition-all duration-300"
            >
              <div className="flex gap-4 p-6">
                <img
                  src={
                    doctor.profileImageUrl ||
                    "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&auto=format&fit=crop"
                  }
                  alt={doctor.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                    <Badge
                      variant={
                        doctor.availability === "online"
                          ? "default"
                          : doctor.availability === "busy"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        doctor.availability === "online"
                          ? "bg-success text-success-foreground"
                          : doctor.availability === "busy"
                            ? "bg-accent text-accent-foreground"
                            : ""
                      }
                    >
                      {doctor.availability === "online"
                        ? "Available Now"
                        : doctor.availability === "busy"
                          ? "Busy"
                          : "Offline"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{doctor.experienceYears} years exp</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {doctor.rating && (
                        <span>
                          {doctor.rating.toFixed(1)} / 5
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm mb-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-primary font-medium">
                      Available Now
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!doctor.modeAvailability.chat || (bookingDoctorId === doctor._id && consultMode === "chat")}
                      onClick={() => handleBookConsultation(doctor, "chat")}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {bookingDoctorId === doctor._id && consultMode === "chat" ? "Starting..." : "Chat"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!doctor.modeAvailability.audio || (bookingDoctorId === doctor._id && consultMode === "call")}
                      onClick={() => handleBookConsultation(doctor, "call")}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      {bookingDoctorId === doctor._id && consultMode === "call" ? "Starting..." : "Audio"}
                    </Button>
                    <Button
                      size="sm"
                      disabled={!doctor.modeAvailability.video || (bookingDoctorId === doctor._id && consultMode === "video")}
                      onClick={() => handleBookConsultation(doctor, "video")}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      {bookingDoctorId === doctor._id && consultMode === "video" ? "Starting..." : "Video"}
                    </Button>
                    <a href={`tel:${doctor.phone}`}>
                      <Button size="sm" variant="secondary">
                        <Phone className="h-4 w-4 mr-1" />
                        Call {doctor.phone}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <Card className="mt-12 p-8 bg-muted/50">
        <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1</div>
            <h4 className="font-semibold mb-1">Select Symptoms</h4>
            <p className="text-sm text-muted-foreground">
              Choose your symptoms and describe your condition
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2</div>
            <h4 className="font-semibold mb-1">Choose Doctor & Mode</h4>
            <p className="text-sm text-muted-foreground">
              Select an available doctor and consultation method
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <h4 className="font-semibold mb-1">Get Consultation</h4>
            <p className="text-sm text-muted-foreground">
              Connect instantly and receive expert medical advice
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Consultation;
