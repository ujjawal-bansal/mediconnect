import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  AlertTriangle,
  FileText,
  Pill,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDoctorAuth } from "@/context/DoctorAuthContext";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

interface Message {
  sender: "patient" | "doctor" | "system";
  text: string;
  timestamp: Date;
}

interface Consultation {
  _id: string;
  patient: { name: string; email: string } | string;
  patientName?: string;
  patientPhone?: string;
  mode: "chat" | "audio" | "video";
  symptoms: string;
  messages: Message[];
  isEmergency?: boolean;
  doctorNotes?: string;
  prescription?: string;
  followUpInstructions?: string;
  status: "active" | "ended";
}

const DoctorConsultation = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();
  const { token } = useDoctorAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token || !consultationId) {
      navigate("/doctor/login");
      return;
    }
    loadConsultation();
    setupSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [consultationId, token, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConsultation = async () => {
    if (!token || !consultationId) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load consultation");
      }

      const data: Consultation = await res.json();
      setConsultation(data);
      setMessages(
        data.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      );
      setDoctorNotes(data.doctorNotes || "");
      setPrescription(data.prescription || "");
      setFollowUpInstructions(data.followUpInstructions || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load consultation");
    }
  };

  const setupSocket = () => {
    if (!consultationId) return;

    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinConsultation", consultationId);
    });

    socket.on("message:new", (payload: { consultationId: string; sender: string; text: string; timestamp: string }) => {
      if (payload.consultationId !== consultationId) return;
      setMessages((prev) => [
        ...prev,
        {
          sender: payload.sender as "patient" | "doctor" | "system",
          text: payload.text,
          timestamp: new Date(payload.timestamp),
        },
      ]);
    });
  };

  const handleSend = () => {
    if (!inputValue.trim() || !socketRef.current || !consultationId) return;

    const newMessage: Message = {
      sender: "doctor",
      text: inputValue,
      timestamp: new Date(),
    };

    socketRef.current.emit("message:send", {
      consultationId,
      sender: "doctor",
      text: inputValue,
    });

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  const handleSaveNotes = async () => {
    if (!token || !consultationId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorNotes,
          prescription,
          followUpInstructions,
        }),
      });

      if (res.ok) {
        toast.success("Notes saved successfully");
      } else {
        toast.error("Failed to save notes");
      }
    } catch (err) {
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkEmergency = async (isEmergency: boolean) => {
    if (!token || !consultationId) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}/emergency`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEmergency }),
      });

      if (res.ok) {
        setConsultation((prev) => prev ? { ...prev, isEmergency } : null);
        toast.success(isEmergency ? "Marked as emergency" : "Removed emergency status");
      }
    } catch (err) {
      toast.error("Failed to update emergency status");
    }
  };

  const handleEndConsultation = async () => {
    if (!token || !consultationId) return;

    try {
      const res = await fetch(`${API_BASE}/api/doctor/consultations/${consultationId}/end`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Consultation ended");
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      toast.error("Failed to end consultation");
    }
  };

  if (!consultation) {
    return <div className="p-8">Loading consultation...</div>;
  }

  const patientName =
    typeof consultation.patient === "object"
      ? consultation.patient.name
      : consultation.patientName || "Patient";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctor/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-lg">{patientName}</h2>
            <div className="flex items-center gap-2">
              {consultation.isEmergency && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Emergency
                </Badge>
              )}
              <Badge variant="outline">{consultation.mode}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultation.mode === "audio" && (
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
          )}
          {consultation.mode === "video" && (
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMarkEmergency(!consultation.isEmergency)}
          >
            {consultation.isEmergency ? "Remove Emergency" : "Mark Emergency"}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleEndConsultation}>
            End Consultation
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-border">
          <Card className="m-4 mb-0 p-4">
            <h3 className="font-semibold mb-2">Symptoms</h3>
            <p className="text-sm text-muted-foreground">{consultation.symptoms}</p>
            {consultation.patientPhone && (
              <p className="text-xs text-muted-foreground mt-2">📞 {consultation.patientPhone}</p>
            )}
          </Card>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === "doctor"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-[10px] mt-1 ${
                        message.sender === "doctor" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-card">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Panel */}
        <div className="w-96 bg-card border-l border-border overflow-y-auto">
          <Tabs defaultValue="notes" className="h-full flex flex-col">
            <TabsList className="m-4 mb-0">
              <TabsTrigger value="notes" className="flex-1">
                <FileText className="h-4 w-4 mr-1" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="prescription" className="flex-1">
                <Pill className="h-4 w-4 mr-1" />
                Prescription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="flex-1 p-4 space-y-4">
              <div className="space-y-2">
                <Label>Diagnosis & Notes</Label>
                <Textarea
                  placeholder="Enter diagnosis and medical notes..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label>Follow-up Instructions</Label>
                <Textarea
                  placeholder="Enter follow-up instructions for the patient..."
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSaveNotes} className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Notes"}
              </Button>
            </TabsContent>

            <TabsContent value="prescription" className="flex-1 p-4 space-y-4">
              <div className="space-y-2">
                <Label>Prescription</Label>
                <Textarea
                  placeholder="Enter prescription details, medications, dosage, etc..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows={12}
                />
              </div>
              <Button onClick={handleSaveNotes} className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Prescription"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultation;

