import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Disclaimer Banner */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Medical Disclaimer:</strong> This platform provides general health information and first-aid guidance only. 
              It does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers for medical concerns.
              In emergencies, call 108 (Ambulance) or 112 (Emergency) immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-semibold text-lg">MediConnect</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for 24×7 online health consultation and emergency first-aid guidance across India.
            </p>
            <p className="text-xs text-muted-foreground">
              Connecting patients with healthcare, anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link to="/first-aid" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  First-Aid Guide
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nearby Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Numbers */}
          <div>
            <h3 className="font-semibold mb-4">Emergency Helplines (India)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emergency" />
                <span><strong>108</strong> - Ambulance</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emergency" />
                <span><strong>112</strong> - Emergency / Police</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span><strong>104</strong> - Health Helpline</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span><strong>181</strong> - Women Helpline</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@mediconnect.in</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>New Delhi, India</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/contact">
                <span className="text-sm text-primary hover:underline">Contact Form →</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MediConnect India. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
