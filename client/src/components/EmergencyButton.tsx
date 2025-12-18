import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Phone, Video, BookOpenText, MessageCircleMore } from "lucide-react";

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-float z-50 animate-pulse hover:animate-none transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emergency"
        size="icon"
        aria-label="Open Emergency Mode"
      >
        <AlertTriangle className="h-7 w-7" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 text-emergency">
              <AlertTriangle className="h-6 w-6" />
              Emergency Help
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              You are in <span className="font-semibold">Emergency Mode</span>. Choose one of the
              options below to get immediate help:
            </p>

            <div className="space-y-3">
              {/* Emergency First-Aid Guides */}
              <Button
                className="w-full justify-start gap-3 h-auto py-4"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/first-aid");
                }}
              >
                <BookOpenText className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Open Emergency First-Aid Guides</div>
                  <div className="text-xs text-muted-foreground">
                    Step-by-step help for CPR, bleeding, burns, fractures & more
                  </div>
                </div>
              </Button>

              {/* Call Ambulance */}
              <a href="tel:108">
                <Button className="w-full justify-start gap-3 h-auto py-4" variant="destructive">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Call 108 - Ambulance</div>
                    <div className="text-xs opacity-80">Available 24×7 across India</div>
                  </div>
                </Button>
              </a>

              {/* AI First-Aid Chat */}
              <Button
                className="w-full justify-start gap-3 h-auto py-4"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  const event = new CustomEvent("openChatbot");
                  window.dispatchEvent(event);
                }}
              >
                <MessageCircleMore className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <div className="font-semibold">AI First-Aid Assistant</div>
                  <div className="text-xs text-muted-foreground">
                    Get instant first-aid steps with visual diagrams
                  </div>
                </div>
              </Button>

              {/* Start Consultation */}
              <a href="tel:112">
                <Button className="w-full justify-start gap-3 h-auto py-4" variant="default">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Call 112 - Emergency</div>
                    <div className="text-xs text-primary-foreground/80">Police / Fire / Medical Emergency</div>
                  </div>
                </Button>
              </a>

              <Button
                className="w-full justify-start gap-3 h-auto py-4"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/consultation");
                }}
              >
                <Video className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Start Online Consultation</div>
                  <div className="text-xs text-muted-foreground">
                    Text, audio or video consultation with available doctors
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2">While you wait:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Stay calm and breathe</li>
                <li>Do not move if injured</li>
                <li>Keep the patient comfortable</li>
                <li>Note any symptoms or changes</li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              For life-threatening emergencies, call <strong>108</strong> or <strong>112</strong> immediately
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
