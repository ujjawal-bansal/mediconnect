import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Activity,
  Users,
  AlertTriangle,
  MessageSquare,
  Phone,
  Video,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDoctorAuth } from "@/context/DoctorAuthContext";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

interface Stats {
  activeConsultations: number;
  todayConsultations: number;
  emergencyConsultations: number;
}

interface Consultation {
  _id: string;
  patient: { name: string; email: string } | string;
  patientName?: string;
  patientPhone?: string;
  mode: "chat" | "audio" | "video";
  symptoms: string;
  isEmergency?: boolean;
  status: "active" | "ended";
  acceptedAt?: string;
  createdAt: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { doctor, token, logout, updateAvailability } = useDoctorAuth();
  const [stats, setStats] = useState<Stats>({
    activeConsultations: 0,
    todayConsultations: 0,
    emergencyConsultations: 0,
  });
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [activeConsultations, setActiveConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/doctor/login");
      return;
    }
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [token, navigate]);

  const loadData = async () => {
    if (!token) return;

    try {
      const [statsRes, pendingRes, activeRes] = await Promise.all([
        fetch(`${API_BASE}/api/doctor/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/doctor/consultations/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/doctor/consultations/active`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingConsultations(pendingData);
      }

      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setActiveConsultations(activeData);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setIsLoading(false);
    }
  };

  const handleAvailabilityChange = async (availability: "online" | "busy" | "offline") => {
    try {
      await updateAvailability(availability);
      toast.success(`Status updated to ${availability}`);
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  const handleAccept = async (consultationId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Consultation accepted");
        loadData();
      } else {
        toast.error("Failed to accept consultation");
      }
    } catch (err) {
      toast.error("Failed to accept consultation");
    }
  };

  const handleReject = async (consultationId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Consultation rejected");
        loadData();
      } else {
        toast.error("Failed to reject consultation");
      }
    } catch (err) {
      toast.error("Failed to reject consultation");
    }
  };

  const handleOpenConsultation = (consultationId: string) => {
    navigate(`/doctor/consultation/${consultationId}`);
  };

  if (!doctor) {
    return <div className="p-8">Loading...</div>;
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {doctor.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={doctor.availability === "online" ? "default" : "outline"}
              onClick={() => handleAvailabilityChange("online")}
            >
              Online
            </Button>
            <Button
              size="sm"
              variant={doctor.availability === "busy" ? "default" : "outline"}
              onClick={() => handleAvailabilityChange("busy")}
            >
              Busy
            </Button>
            <Button
              size="sm"
              variant={doctor.availability === "offline" ? "default" : "outline"}
              onClick={() => handleAvailabilityChange("offline")}
            >
              Offline
            </Button>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-6">
          <img
            src={doctor.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{doctor.name}</h2>
              <Badge className={getAvailabilityColor(doctor.availability)}>
                {doctor.availability}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-2">{doctor.specialization}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{doctor.experienceYears} years experience</span>
              {doctor.hospital && <span>🏥 {doctor.hospital}</span>}
              {doctor.clinic && <span>🏥 {doctor.clinic}</span>}
              <span>📞 {doctor.phone}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Consultations</p>
              <p className="text-3xl font-bold">{stats.activeConsultations}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's Patients</p>
              <p className="text-3xl font-bold">{stats.todayConsultations}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <Users className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Emergency Cases</p>
              <p className="text-3xl font-bold">{stats.emergencyConsultations}</p>
            </div>
            <div className="p-3 bg-emergency/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-emergency" />
            </div>
          </div>
        </Card>
      </div>

      {/* Consultations */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Requests ({pendingConsultations.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Consultations ({activeConsultations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : pendingConsultations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No pending consultation requests</p>
            </Card>
          ) : (
            pendingConsultations.map((consultation) => {
              const patientName =
                typeof consultation.patient === "object"
                  ? consultation.patient.name
                  : consultation.patientName || "Unknown";
              const modeIcon =
                consultation.mode === "chat" ? (
                  <MessageSquare className="h-4 w-4" />
                ) : consultation.mode === "audio" ? (
                  <Phone className="h-4 w-4" />
                ) : (
                  <Video className="h-4 w-4" />
                );

              return (
                <Card key={consultation._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{patientName}</h3>
                        {consultation.isEmergency && (
                          <Badge variant="destructive">Emergency</Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          {modeIcon}
                          {consultation.mode}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {consultation.symptoms}
                      </p>
                      {consultation.patientPhone && (
                        <p className="text-xs text-muted-foreground">📞 {consultation.patientPhone}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(consultation._id)}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(consultation._id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : activeConsultations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active consultations</p>
            </Card>
          ) : (
            activeConsultations.map((consultation) => {
              const patientName =
                typeof consultation.patient === "object"
                  ? consultation.patient.name
                  : consultation.patientName || "Unknown";

              return (
                <Card key={consultation._id} className="p-6 hover:shadow-float transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{patientName}</h3>
                        {consultation.isEmergency && (
                          <Badge variant="destructive">Emergency</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {consultation.symptoms}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Started {new Date(consultation.acceptedAt || consultation.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => handleOpenConsultation(consultation._id)}>
                      Open Consultation
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;

