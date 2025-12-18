import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Video, BookOpen, MapPin, Bot, Shield, Clock, Users, Heart, ArrowRight, AlertTriangle } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const Home = () => {
  const services = [
    {
      icon: Video,
      title: "Online Consultation",
      description: "Connect with certified doctors via chat, call, or video consultation 24×7.",
      href: "/consultation",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: BookOpen,
      title: "Emergency First Aid",
      description: "Access step-by-step emergency first-aid guides for immediate help.",
      href: "/first-aid",
      color: "bg-emergency/10 text-emergency",
    },
    {
      icon: Bot,
      title: "AI First-Aid Assistant",
      description: "Get instant first-aid guidance from our intelligent chatbot assistant.",
      href: "#",
      color: "bg-accent/10 text-accent",
      onClick: () => {
        const event = new CustomEvent('openChatbot');
        window.dispatchEvent(event);
      },
    },
    {
      icon: MapPin,
      title: "Nearby Hospitals",
      description: "Locate the nearest hospitals, clinics, and pharmacies in your area.",
      href: "/nearby",
      color: "bg-success/10 text-success",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "24×7 Availability",
      description: "Round-the-clock access to medical professionals and emergency guidance",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry standards",
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Certified healthcare professionals ready to assist you anytime",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="h-4 w-4" fill="currentColor" />
                Your Healthcare 24×7
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Instant Medical Help,
                <span className="text-primary block">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with certified healthcare professionals for consultations, get emergency first-aid guidance, and access AI-powered medical assistance—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/consultation">
                  <Button size="lg" className="text-base px-8 gap-2 w-full sm:w-auto">
                    Book Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/first-aid">
                  <Button size="lg" variant="outline" className="text-base px-8 gap-2 w-full sm:w-auto">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency First Aid
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Healthcare professionals ready to help"
                className="rounded-2xl shadow-float w-full"
              />
              {/* Floating stats card */}
              <Card className="absolute -bottom-6 -left-6 p-4 shadow-float hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-full">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">10,000+</p>
                    <p className="text-sm text-muted-foreground">Patients Helped</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed to provide you with immediate medical support when you need it most
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.href}
              onClick={service.onClick}
              className="block group"
            >
              <Card className="p-6 h-full hover:shadow-float transition-all duration-300 group-hover:border-primary">
                <div className={`mb-4 p-3 rounded-xl w-fit ${service.color}`}>
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MediConnect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best healthcare experience for our patients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-8 md:p-12 bg-gradient-hero text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Medical Assistance?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't wait. Our healthcare professionals are available 24×7 to help you with any medical concerns.
            Book a consultation or access our first-aid guides now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="text-base px-8">
                Consult a Doctor Now
              </Button>
            </Link>
            <Link to="/first-aid">
              <Button size="lg" variant="outline" className="text-base px-8">
                View First-Aid Guides
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Disclaimer Section */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="p-6 bg-muted/30 border-dashed">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Important Notice</h4>
              <p className="text-sm text-muted-foreground">
                This platform provides emergency guidance and does not replace professional medical care. 
                For medical emergencies, please call 108 (Ambulance) or 112 (Emergency) immediately. Always consult with 
                qualified healthcare providers for medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;
