import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Send, AlertTriangle, Minimize2, Maximize2 } from "lucide-react";
import cprChest from "@/assets/firstaid-cpr-chest.svg";
import cprHands from "@/assets/firstaid-cpr-hands.svg";
import cprRate from "@/assets/firstaid-cpr-rate.svg";
import bleedingPressure from "@/assets/firstaid-bleeding-pressure.svg";
import burnsCoolWater from "@/assets/firstaid-burns-coolwater.svg";
import fractureSplint from "@/assets/firstaid-fracture-splint.svg";
import unconsciousRecovery from "@/assets/firstaid-unconscious-recovery.svg";
import chokingHeimlich from "@/assets/firstaid-choking-heimlich.svg";

type DiagramKey =
  | "cpr"
  | "bleeding"
  | "burns"
  | "fracture"
  | "unconscious"
  | "choking"
  | null;

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  diagramKey?: DiagramKey;
}

const AIFirstAidChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hello! I'm your AI First-Aid Assistant. I can help you with basic first-aid guidance only (no diagnosis or medicines).\n\nYou can ask about:\n• CPR steps\n• Severe bleeding\n• Burns treatment\n• Heart attack response\n• Fracture handling\n• Choking response\n• Fainting / unconscious patient\n\nFor any life‑threatening emergency in India, call 108 (Ambulance) or 112 (Emergency) immediately.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for custom event to open chatbot
  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getFirstAidResponse = (query: string): { text: string; diagramKey: DiagramKey } => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("cpr") || lowerQuery.includes("cardiac") || lowerQuery.includes("not breathing")) {
      return {
        diagramKey: "cpr",
        text: `**CPR Steps (Cardiopulmonary Resuscitation):**

1. **Check responsiveness** - Tap the person and shout "Are you okay?"
2. **Call for help** - Dial 108 (Ambulance) or 112 (Emergency)
3. **Check breathing** - Look for chest movement for no more than 10 seconds
4. **Start chest compressions:**
   - Place heel of hand on center of chest
   - Push hard and fast (2 inches deep)
   - 100-120 compressions per minute
5. **Give rescue breaths** (if trained):
   - Tilt head back, lift chin
   - Give 2 breaths, watch chest rise
6. **Continue cycles** of 30 compressions and 2 breaths

📞 In India, call **108 (Ambulance)** or **112 (Emergency)** immediately.

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always follow instructions from emergency services and doctors.`,
      };
    }

    if (lowerQuery.includes("bleeding") || lowerQuery.includes("blood") || lowerQuery.includes("wound")) {
      return {
        diagramKey: "bleeding",
        text: `**Severe Bleeding Control:**

1. **Apply direct pressure** - Use clean cloth or bandage
2. **Keep pressing firmly** - Don't lift to check
3. **Add more layers** if blood soaks through (don't remove original)
4. **Elevate the wound** above heart level if possible
5. **Apply pressure to pressure points** if direct pressure doesn't work
6. **Use a tourniquet** only as last resort for limbs

**Warning signs requiring immediate help:**
- Blood spurting or pooling
- Bleeding that won't stop after 10 minutes
- Deep wounds or embedded objects

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    if (lowerQuery.includes("burn") || lowerQuery.includes("fire") || lowerQuery.includes("scald")) {
      return {
        diagramKey: "burns",
        text: `**Burns Treatment:**

**For minor burns:**
1. **Cool the burn** - Run cool (not cold) water for 10-20 minutes
2. **Remove jewelry/clothing** near the burn before swelling
3. **Don't apply ice, butter, or toothpaste**
4. **Cover with sterile bandage** - Use non-stick gauze
5. **Take pain relievers** if needed

**For severe burns (call 108):**
- Burns larger than 3 inches
- Burns on face, hands, feet, joints
- Deep burns (white or charred skin)
- Chemical or electrical burns

**Do NOT:**
- Break blisters
- Apply adhesive bandages
- Use cotton balls (fibers stick)

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    if (lowerQuery.includes("heart attack") || lowerQuery.includes("chest pain") || lowerQuery.includes("heart")) {
      return {
        diagramKey: "cpr",
        text: `**Heart Attack Signs & Response:**

**Warning Signs:**
- Chest pain/pressure (may spread to arm, jaw, back)
- Shortness of breath
- Cold sweats, nausea
- Lightheadedness

**Immediate Actions:**
1. **Call 108 immediately** - Don't drive yourself
2. **Chew aspirin** (325mg) if not allergic
3. **Sit or lie down** in comfortable position
4. **Loosen tight clothing**
5. **Stay calm** and don't exert yourself
6. **Be ready for CPR** if person becomes unresponsive

**Remember:** Time is critical! Every minute matters.

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    if (lowerQuery.includes("fracture") || lowerQuery.includes("broken bone") || lowerQuery.includes("break")) {
      return {
        diagramKey: "fracture",
        text: `**Fracture First Aid:**

**Signs of a fracture:**
- Severe pain, swelling
- Deformity or abnormal angle
- Inability to move the area
- Numbness or tingling

**What to do:**
1. **Don't move** the injured area
2. **Call for medical help** (108)
3. **Immobilize the injury:**
   - Use splints (boards, magazines, rolled towels)
   - Pad the splint for comfort
   - Secure above and below injury
4. **Apply ice** wrapped in cloth (20 min on/off)
5. **Elevate** if possible without causing more pain

**Do NOT:**
- Try to straighten the bone
- Move if spine injury suspected
- Give food/drink (surgery may be needed)

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    if (lowerQuery.includes("chok") || lowerQuery.includes("heimlich") || lowerQuery.includes("can't breathe")) {
      return {
        diagramKey: "choking",
        text: `**Choking Response (Heimlich Maneuver):**

**For conscious adult/child:**
1. **Stand behind** the person
2. **Make a fist** with one hand
3. **Place fist** above navel, below ribcage
4. **Grasp fist** with other hand
5. **Give quick, upward thrusts**
6. **Repeat** until object is expelled

**For yourself (if alone):**
- Use the back of a chair
- Thrust your abdomen against the edge

**For infants:**
1. Place face-down on forearm
2. Give 5 back blows between shoulder blades
3. Turn over, give 5 chest thrusts
4. Repeat until object is expelled

**If person becomes unconscious:**
- Lower to ground, call 108
- Begin CPR

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    if (lowerQuery.includes("faint") || lowerQuery.includes("unconscious") || lowerQuery.includes("passed out")) {
      return {
        diagramKey: "unconscious",
        text: `**Fainting / Unconscious Patient Response:**

**When someone faints:**
1. **Catch and lower them safely** if possible
2. **Check for breathing** - call 108 if not breathing
3. **Lay them flat** on their back
4. **Elevate legs** 8-12 inches
5. **Loosen tight clothing**
6. **Check for injuries** from the fall

**When they wake up:**
- Keep them lying down for a few minutes
- Help them sit up slowly
- Give water if they're alert

**Call 108 if:**
- They don't regain consciousness within 1 minute
- They're not breathing
- They have chest pain or heart issues
- They're pregnant or diabetic

⚠️ **Safety disclaimer:** This is basic first-aid guidance only and not a diagnosis. Always contact emergency services (108 / 112 in India) or a doctor immediately.`,
      };
    }

    // Default response
    return {
      diagramKey: null,
      text: `I understand you need help with: "${query}"

I can provide guidance on these emergencies:
• **CPR** - Cardiopulmonary resuscitation steps
• **Bleeding** - How to control severe bleeding
• **Burns** - Treatment for burns and scalds
• **Heart Attack** - Warning signs and immediate actions
• **Fractures** - Broken bone first aid
• **Choking** - Heimlich maneuver steps
• **Fainting** - How to help someone who passed out

Please describe your situation or type one of these topics for detailed guidance.

⚠️ **Safety disclaimer:** I only provide basic first-aid guidance (no diagnosis or prescriptions). For any life‑threatening emergency in India, call **108 (Ambulance)** or **112 (Emergency)** immediately.`,
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { text, diagramKey } = getFirstAidResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: text,
        timestamp: new Date(),
        diagramKey,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderDiagramsForKey = (key?: DiagramKey) => {
    if (!key) return null;

    if (key === "cpr") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">CPR visual guide</p>
          <div className="grid grid-cols-3 gap-2">
            {[cprChest, cprHands, cprRate].map((src, index) => (
              <div key={index} className="rounded-md overflow-hidden bg-muted">
                <img src={src} alt="CPR diagram" className="w-full h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (key === "bleeding") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Bleeding control diagram</p>
          <div className="rounded-md overflow-hidden bg-muted">
            <img
              src={bleedingPressure}
              alt="Applying direct pressure on a bleeding wound"
              className="w-full h-24 object-contain"
            />
          </div>
        </div>
      );
    }

    if (key === "burns") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Burns cooling diagram</p>
          <div className="rounded-md overflow-hidden bg-muted">
            <img
              src={burnsCoolWater}
              alt="Cooling a burn under running water"
              className="w-full h-24 object-contain"
            />
          </div>
        </div>
      );
    }

    if (key === "fracture") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Fracture immobilisation diagram</p>
          <div className="rounded-md overflow-hidden bg-muted">
            <img
              src={fractureSplint}
              alt="Immobilising a fractured limb with a splint"
              className="w-full h-24 object-contain"
            />
          </div>
        </div>
      );
    }

    if (key === "unconscious") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Recovery position diagram</p>
          <div className="rounded-md overflow-hidden bg-muted">
            <img
              src={unconsciousRecovery}
              alt="Person lying in the recovery position"
              className="w-full h-24 object-contain"
            />
          </div>
        </div>
      );
    }

    if (key === "choking") {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Choking (Heimlich) diagram</p>
          <div className="rounded-md overflow-hidden bg-muted">
            <img
              src={chokingHeimlich}
              alt="Heimlich manoeuvre abdominal thrusts"
              className="w-full h-24 object-contain"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-float z-40 transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
        size="icon"
        aria-label="Open AI first-aid assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed right-6 z-40 shadow-float transition-all duration-300 ${
      isMinimized 
        ? "bottom-24 w-72 h-14" 
        : "bottom-24 w-[360px] sm:w-[400px] h-[500px] flex flex-col"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <span className="font-semibold text-sm">AI First-Aid Assistant</span>
            {!isMinimized && <p className="text-xs opacity-80">Online • Ready to help</p>}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Disclaimer */}
          <div className="px-3 py-2 bg-emergency/10 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-emergency shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              This provides basic first-aid guidance only. For emergencies, call 108 or 112.
            </span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.role === "bot" && renderDiagramsForKey(message.diagramKey)}
                    <div
                      className={`text-[10px] mt-1 ${
                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
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

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Describe your emergency..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIFirstAidChatbot;
