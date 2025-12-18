import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Image,
  Mic,
  Check,
  CheckCheck,
} from "lucide-react";
import { getConsultationById, addMessage, getDoctorById } from "@/lib/mockData";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const ConsultationChat = () => {
  const navigate = useNavigate();
  const { id: consultationId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const doctorName = searchParams.get("doctor") || "Doctor";
  const modeParam = (searchParams.get("mode") as "chat" | "audio" | "video") || "chat";
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);
  const [isMediaActive, setIsMediaActive] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean up local media on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  // Load existing consultation messages from mock data
  useEffect(() => {
    const loadConsultation = () => {
      if (!consultationId) return;
      try {
        const consultation = getConsultationById(consultationId);
        if (!consultation) {
          setError("Consultation not found.");
          return;
        }
        const mapped: Message[] = consultation.messages.map((m, index) => ({
          id: `${index}-${m.timestamp}`,
          sender: m.sender === "system" ? "doctor" : m.sender,
          content: m.text,
          timestamp: new Date(m.timestamp),
          status: "read",
        }));
        setMessages(mapped);
      } catch (err) {
        console.error(err);
        setError("We couldn't load your consultation history.");
      }
    };

    loadConsultation();
    
    // Poll for new messages every 2 seconds (simulate real-time)
    const interval = setInterval(loadConsultation, 2000);
    return () => clearInterval(interval);
  }, [consultationId]);

  const startLocalMedia = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError("Camera/microphone access is not supported in this browser.");
      return;
    }

    try {
      setMediaError(null);
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: modeParam === "video",
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      if (localVideoRef.current && constraints.video) {
        localVideoRef.current.srcObject = stream;
      }
      setIsMediaActive(true);
    } catch (err) {
      console.error(err);
      setMediaError("Unable to access camera/microphone. Please check permissions.");
      setIsMediaActive(false);
    }
  };

  const stopLocalMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setIsMediaActive(false);
  };

  const handleToggleCallPanel = async () => {
    if (isCallPanelOpen) {
      stopLocalMedia();
      setIsCallPanelOpen(false);
      return;
    }
    setIsCallPanelOpen(true);
    await startLocalMedia();
  };

  const handleSend = () => {
    if (!inputValue.trim() || !consultationId) return;

    const newMessage = {
      sender: "patient" as const,
      text: inputValue,
      timestamp: new Date().toISOString(),
    };

    addMessage(consultationId, newMessage);
    setInputValue("");

    // Simulate doctor typing after 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const doctorResponses = [
          "Thank you for sharing that information. Can you tell me more about when this started?",
          "I understand. Have you experienced this before?",
          "That's helpful to know. Are you taking any medications currently?",
          "I see. Let me check your symptoms. One moment please.",
          "Based on what you've told me, I'd like to ask a few more questions.",
          "Could you describe the intensity of your symptoms on a scale of 1-10?",
          "How long have you been experiencing these symptoms?",
          "Have you noticed any triggers that make it worse?",
          "Are there any other symptoms accompanying this?",
          "Let me review your information. Have you tried any remedies so far?",
          "I appreciate you providing these details. Any allergies I should know about?",
          "Does anything make the symptoms better or worse?",
          "Have you had any recent changes in your diet or lifestyle?",
          "Is this affecting your daily activities?",
          "Thank you for that information. Let me assess your situation further.",
        ];
        
        // Get a random response and ensure it's different from the last doctor message
        const consultation = getConsultationById(consultationId);
        const lastDoctorMessage = consultation?.messages
          .filter(m => m.sender === "doctor")
          .slice(-1)[0]?.text;
        
        let response;
        let attempts = 0;
        do {
          response = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
          attempts++;
        } while (response === lastDoctorMessage && attempts < 10);
        
        addMessage(consultationId, {
          sender: "doctor",
          text: response,
          timestamp: new Date().toISOString(),
        });
        setIsTyping(false);
      }, 1500);
    }, delay);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3" />;
      default:
        return <Check className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/consultation")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
            alt={doctorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{doctorName}</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={modeParam === "chat"}
            onClick={handleToggleCallPanel}
            aria-label="Start audio call"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={modeParam === "chat"}
            onClick={handleToggleCallPanel}
            aria-label="Start video call"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Optional call panel (demo WebRTC-style UI) */}
      {isCallPanelOpen && (
        <div className="border-b border-border bg-muted/40">
          <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">
                {modeParam === "video" ? "Video consultation (demo)" : "Audio consultation (demo)"}
              </p>
              <p className="text-xs text-muted-foreground">
                Camera and microphone are used locally for demo purposes. No media is sent over the
                network.
              </p>
              {mediaError && (
                <p className="text-xs text-destructive mt-1">
                  {mediaError}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {modeParam === "video" && (
                <div className="w-32 h-20 bg-black/80 rounded-md overflow-hidden border border-border">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Button
                variant={isMediaActive ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleCallPanel}
              >
                {isMediaActive ? "End Call" : "Retry"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {/* Date separator */}
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="text-xs font-normal">
            Today
          </Badge>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {error && (
            <Card className="p-3 mb-2 border-destructive/40 bg-destructive/5 text-xs text-destructive">
              {error}
            </Card>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "patient"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 ${
                    message.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-[10px]">{formatTime(message.timestamp)}</span>
                  {message.sender === "patient" && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* End Consultation Button */}
        <div className="max-w-3xl mx-auto mt-3 text-center">
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => navigate("/consultation")}
          >
            End Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChat;
