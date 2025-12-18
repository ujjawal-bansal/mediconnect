import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  Heart,
  Flame,
  Droplet,
  Bone,
  AlertCircle,
  Wind,
  Bandage,
  CheckCircle,
} from "lucide-react";
import cprChest from "@/assets/firstaid-cpr-chest.svg";
import cprHands from "@/assets/firstaid-cpr-hands.svg";
import cprRate from "@/assets/firstaid-cpr-rate.svg";
import bleedingPressure from "@/assets/firstaid-bleeding-pressure.svg";
import burnsCoolWater from "@/assets/firstaid-burns-coolwater.svg";
import fractureSplint from "@/assets/firstaid-fracture-splint.svg";
import unconsciousRecovery from "@/assets/firstaid-unconscious-recovery.svg";
import chokingHeimlich from "@/assets/firstaid-choking-heimlich.svg";

const emergencyData: Record<
  string,
  {
    title: string;
    icon: any;
    severity: string;
    description: string;
    warning: string;
    steps: { step: number; title: string; description: string }[];
    doNot: string[];
    callWhen: string[];
    diagrams?: { src: string; alt: string; caption: string }[];
  }
> = {
  "heart-attack": {
    title: "Heart Attack",
    icon: Heart,
    severity: "critical",
    description: "A heart attack occurs when blood flow to the heart is blocked. Quick action can save lives.",
    warning: "Call 108 immediately if you suspect a heart attack!",
    steps: [
      { step: 1, title: "Call Emergency Services", description: "Dial 108 (Ambulance) or 112 (Emergency) immediately. Time is critical during a heart attack." },
      { step: 2, title: "Have Person Sit Down", description: "Help them sit in a comfortable position, usually sitting up with knees bent." },
      { step: 3, title: "Give Aspirin", description: "If not allergic, have them chew one adult aspirin (325mg) or four low-dose aspirins." },
      { step: 4, title: "Loosen Tight Clothing", description: "Remove ties, unbuckle belt, unbutton shirt to ease breathing." },
      { step: 5, title: "Stay Calm & Monitor", description: "Keep the person calm. Monitor breathing and consciousness." },
      { step: 6, title: "Be Ready for CPR", description: "If the person becomes unresponsive and stops breathing, begin CPR." },
    ],
    doNot: [
      "Don't leave the person alone",
      "Don't let them walk or move unnecessarily",
      "Don't give them anything to eat or drink (except aspirin)",
      "Don't delay calling emergency services",
    ],
    callWhen: [
      "Chest pain or discomfort lasting more than a few minutes",
      "Pain spreading to shoulders, neck, jaw, or arms",
      "Shortness of breath with or without chest pain",
      "Cold sweats, nausea, or lightheadedness",
    ],
    diagrams: [
      {
        src: cprChest,
        alt: "Chest compressions on the centre of the chest",
        caption: "Place your hands in the centre of the chest for compressions.",
      },
      {
        src: cprHands,
        alt: "Correct hand placement for CPR",
        caption: "Interlock your fingers and keep your elbows straight over the chest.",
      },
      {
        src: cprRate,
        alt: "CPR compression rate 100-120 per minute",
        caption: "Give 100–120 compressions per minute – similar to a fast heartbeat.",
      },
    ],
  },
  "burns": {
    title: "Burns Treatment",
    icon: Flame,
    severity: "urgent",
    description: "Burns can range from minor to severe. Proper first aid can prevent further damage and promote healing.",
    warning: "Seek immediate medical help for severe burns, chemical burns, or burns on face/hands/feet.",
    steps: [
      { step: 1, title: "Remove from Heat Source", description: "Move the person away from the source of the burn immediately." },
      { step: 2, title: "Cool the Burn", description: "Run cool (not cold) water over the burn for 10-20 minutes." },
      { step: 3, title: "Remove Constrictive Items", description: "Remove jewelry, belts, and tight clothing before swelling starts." },
      { step: 4, title: "Cover with Sterile Bandage", description: "Apply a sterile, non-stick bandage loosely over the burn." },
      { step: 5, title: "Pain Management", description: "Take over-the-counter pain relievers if needed." },
      { step: 6, title: "Watch for Infection", description: "Monitor for signs of infection like increased pain, redness, or fever." },
    ],
    doNot: [
      "Don't apply ice directly to the burn",
      "Don't use butter, oil, or toothpaste",
      "Don't break blisters",
      "Don't remove clothing stuck to the burn",
      "Don't use adhesive bandages",
    ],
    callWhen: [
      "Burns covering large areas or deep burns",
      "Burns on face, hands, feet, genitals, or joints",
      "Chemical or electrical burns",
      "Difficulty breathing if inhaled smoke",
    ],
    diagrams: [
      {
        src: burnsCoolWater,
        alt: "Running cool water over a burn",
        caption: "Keep the burned area under cool running water for 10–20 minutes.",
      },
    ],
  },
  "bleeding": {
    title: "Severe Bleeding",
    icon: Droplet,
    severity: "critical",
    description: "Severe bleeding can be life-threatening. Quick action to control blood loss is essential.",
    warning: "Call 108 if bleeding is severe, spurting, or doesn't stop after 10 minutes of pressure.",
    steps: [
      { step: 1, title: "Call for Help", description: "If bleeding is severe, call 108 or have someone else call." },
      { step: 2, title: "Apply Direct Pressure", description: "Use a clean cloth or bandage and press firmly on the wound." },
      { step: 3, title: "Maintain Pressure", description: "Don't lift the cloth to check. If blood soaks through, add more layers." },
      { step: 4, title: "Elevate the Wound", description: "If possible, raise the injured area above the heart level." },
      { step: 5, title: "Apply Pressure Points", description: "If direct pressure doesn't work, apply pressure to arterial points." },
      { step: 6, title: "Use Tourniquet if Necessary", description: "Only as a last resort for limbs if bleeding won't stop." },
    ],
    doNot: [
      "Don't remove the original cloth if soaked",
      "Don't apply tourniquet unless absolutely necessary",
      "Don't remove embedded objects",
      "Don't give food or water to the patient",
    ],
    callWhen: [
      "Blood is spurting or pooling",
      "Bleeding doesn't stop after 10 minutes",
      "There's a deep wound or embedded object",
      "Person shows signs of shock",
    ],
    diagrams: [
      {
        src: bleedingPressure,
        alt: "Hand applying firm pressure on a bleeding wound",
        caption: "Use a clean cloth and press firmly on the wound to control bleeding.",
      },
    ],
  },
  "fractures": {
    title: "Fractures (Broken Bones)",
    icon: Bone,
    severity: "urgent",
    description: "A fracture requires proper immobilization to prevent further injury. Never try to realign a broken bone.",
    warning: "Don't move the person if you suspect a spine injury. Call 108 immediately.",
    steps: [
      { step: 1, title: "Keep Still", description: "Don't move the injured area. Movement can cause more damage." },
      { step: 2, title: "Call for Help", description: "Contact emergency services (108) or transport to hospital if possible." },
      { step: 3, title: "Immobilize the Area", description: "Use a splint (boards, magazines, rolled towels) to prevent movement." },
      { step: 4, title: "Apply Ice", description: "Wrap ice in a cloth and apply to reduce swelling (20 minutes on/off)." },
      { step: 5, title: "Elevate if Possible", description: "Raise the injured limb above heart level if it doesn't cause more pain." },
      { step: 6, title: "Treat for Shock", description: "Keep the person warm and calm while waiting for help." },
    ],
    doNot: [
      "Don't try to straighten or realign the bone",
      "Don't move if spine injury is suspected",
      "Don't apply ice directly to skin",
      "Don't give food or drink (surgery may be needed)",
    ],
    callWhen: [
      "Bone is visible through skin (open fracture)",
      "Limb looks deformed or at unnatural angle",
      "There's numbness, tingling, or no pulse below injury",
      "Unable to move the injured area at all",
    ],
    diagrams: [
      {
        src: fractureSplint,
        alt: "Limb supported with a temporary splint",
        caption: "Immobilise the injured limb using a firm splint and padding.",
      },
    ],
  },
  "choking": {
    title: "Choking Response",
    icon: Wind,
    severity: "critical",
    description: "Choking occurs when an object blocks the airway. Quick response using the Heimlich maneuver can save lives.",
    warning: "If the person can cough forcefully, let them try to cough up the object. Act immediately if they can't breathe!",
    steps: [
      { step: 1, title: "Assess the Situation", description: "Ask 'Are you choking?' If they can't speak or cough, act immediately." },
      { step: 2, title: "Stand Behind Person", description: "Position yourself behind them, wrap your arms around their waist." },
      { step: 3, title: "Make a Fist", description: "Make a fist with one hand, place it above the navel, below ribcage." },
      { step: 4, title: "Grasp Your Fist", description: "Grab your fist with your other hand." },
      { step: 5, title: "Give Abdominal Thrusts", description: "Pull inward and upward with quick, forceful thrusts." },
      { step: 6, title: "Repeat Until Object Dislodges", description: "Continue until object is expelled or person becomes unconscious." },
    ],
    doNot: [
      "Don't do abdominal thrusts on pregnant women or infants",
      "Don't perform blind finger sweeps",
      "Don't slap the back while person is upright (do for infants)",
      "Don't give up until help arrives or object is removed",
    ],
    callWhen: [
      "Person becomes unconscious",
      "You cannot remove the object",
      "Person is pregnant (use chest thrusts instead)",
      "It's an infant under 1 year old",
    ],
    diagrams: [
      {
        src: chokingHeimlich,
        alt: "Heimlich manoeuvre abdominal thrusts for choking adult",
        caption: "Stand behind the person and give quick upward abdominal thrusts.",
      },
    ],
  },
  "cuts-wounds": {
    title: "Cuts & Wounds",
    icon: Bandage,
    severity: "moderate",
    description: "Proper wound care prevents infection and promotes healing. Clean wounds thoroughly before bandaging.",
    warning: "Seek medical attention for deep cuts, wounds that won't stop bleeding, or signs of infection.",
    steps: [
      { step: 1, title: "Wash Your Hands", description: "Clean your hands thoroughly before treating the wound." },
      { step: 2, title: "Stop the Bleeding", description: "Apply gentle pressure with a clean cloth until bleeding stops." },
      { step: 3, title: "Clean the Wound", description: "Rinse gently with clean running water. Remove debris carefully." },
      { step: 4, title: "Apply Antibiotic", description: "Apply a thin layer of antibiotic ointment to prevent infection." },
      { step: 5, title: "Cover the Wound", description: "Use a sterile bandage or clean cloth to cover the wound." },
      { step: 6, title: "Change Dressing Daily", description: "Replace bandage daily and watch for signs of infection." },
    ],
    doNot: [
      "Don't use hydrogen peroxide or iodine (delays healing)",
      "Don't remove large embedded objects",
      "Don't use cotton balls (fibers stick to wound)",
      "Don't ignore signs of infection",
    ],
    callWhen: [
      "Wound is deep, gaping, or jagged",
      "Bleeding doesn't stop after 10-15 minutes",
      "Signs of infection appear (redness, swelling, pus)",
      "Wound was caused by animal bite or dirty object",
    ],
    diagrams: [
      {
        src: unconsciousRecovery,
        alt: "Person lying in recovery position",
        caption: "If the person becomes unconscious but is breathing, use the recovery position.",
      },
    ],
  },
};

const FirstAidDetail = () => {
  const { emergencyType } = useParams();
  const data = emergencyData[emergencyType || ""] || emergencyData["heart-attack"];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-emergency text-emergency-foreground";
      case "urgent":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const Icon = data.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/first-aid">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to First-Aid Guide
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`p-4 rounded-xl ${getSeverityColor(data.severity)}`}>
          <Icon className="h-10 w-10" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">{data.title}</h1>
            <Badge className={getSeverityColor(data.severity)}>
              {data.severity}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{data.description}</p>
        </div>
      </div>

      {/* Emergency Warning */}
      <Card className="p-4 mb-8 bg-emergency/10 border-emergency/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-emergency shrink-0" />
          <div>
            <p className="font-semibold text-emergency">{data.warning}</p>
            <a href="tel:108">
              <Button variant="destructive" size="sm" className="mt-2 gap-2">
                <Phone className="h-4 w-4" />
                Call 108 - Ambulance
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Steps */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-semibold mb-6">Step-by-Step Instructions</h2>
          <div className="space-y-4">
            {data.steps.map((step) => (
              <Card key={step.step} className="p-5 hover:shadow-card transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {data.diagrams && data.diagrams.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visual Guide</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.diagrams.map((diagram, index) => (
                  <Card key={index} className="overflow-hidden">
                    <img
                      src={diagram.src}
                      alt={diagram.alt}
                      className="w-full h-40 object-contain bg-muted"
                    />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{diagram.caption}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* What NOT to Do */}
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              What NOT to Do
            </h3>
            <ul className="space-y-2">
              {data.doNot.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-destructive font-bold">✕</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* When to Call Emergency */}
          <Card className="p-5 bg-emergency/5 border-emergency/20">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-emergency" />
              Call 108 When
            </h3>
            <ul className="space-y-2">
              {data.callWhen.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emergency shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* AI Assistant Card */}
          <Card className="p-5 bg-accent/10">
            <h3 className="font-semibold mb-2">Need More Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our AI First-Aid Assistant can provide additional guidance.
            </p>
            <Button 
              className="w-full"
              onClick={() => {
                const event = new CustomEvent('openChatbot');
                window.dispatchEvent(event);
              }}
            >
              Ask AI Assistant
            </Button>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="mt-12 p-6 bg-muted/50 border-2 border-border">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This information is provided for educational purposes only and does not replace professional medical advice. 
              In case of any emergency, always call emergency services (108 or 112) immediately. First aid should be administered 
              by trained individuals when possible. MediConnect is not responsible for any outcomes resulting from the use of this information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FirstAidDetail;
