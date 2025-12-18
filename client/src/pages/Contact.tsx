import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 98765 43210",
      subtext: "Available 24×7",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@mediconnect.in",
      subtext: "Response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Connaught Place, New Delhi, India",
      subtext: "Visit our office",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "24×7 Online Support",
      subtext: "Always available for you",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question or need assistance? We're here to help. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What is your inquiry about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg h-fit">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-sm text-foreground mb-1">{info.details}</p>
                    <p className="text-xs text-muted-foreground">{info.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-emergency/5 border-emergency/20">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
              <h3 className="font-semibold">Emergency Helplines (India)</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li><strong>108</strong> - Ambulance</li>
              <li><strong>112</strong> - Emergency / Police</li>
              <li><strong>104</strong> - Health Helpline</li>
              <li><strong>181</strong> - Women Helpline</li>
            </ul>
            <a href="tel:108">
              <Button variant="destructive" className="w-full">
                Call 108 - Ambulance
              </Button>
            </a>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-2">Find Nearby Hospitals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use our hospital locator to find medical facilities near you.
            </p>
            <Link to="/nearby">
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 p-6 bg-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This platform provides emergency guidance and does not replace professional medical care. 
            For medical emergencies, please call 108 (Ambulance) or 112 (Emergency) immediately.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
