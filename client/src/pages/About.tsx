import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "We put patients first, ensuring compassionate and personalized healthcare for everyone.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our network includes certified healthcare professionals with years of experience.",
    },
    {
      icon: Target,
      title: "Accessible Healthcare",
      description: "Making quality medical care accessible to everyone, anytime, anywhere.",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "Committed to maintaining the highest standards in telehealth services.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Patients Served" },
    { number: "500+", label: "Expert Doctors" },
    { number: "24×7", label: "Available" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About HealthCare 24×7</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          We're on a mission to make quality healthcare accessible to everyone through innovative telehealth solutions and emergency guidance.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="p-12 mb-16 bg-gradient-hero">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            To provide instant, reliable, and compassionate healthcare services to individuals 
            regardless of their location or time constraints. We believe that everyone deserves 
            access to quality medical care when they need it most.
          </p>
          <p className="text-lg text-muted-foreground">
            Through our 24×7 online consultation platform and comprehensive first-aid guides, 
            we're bridging the gap between patients and healthcare providers, making medical 
            expertise just a click away.
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-float transition-all duration-300">
              <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <Card className="p-12 bg-muted/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              HealthCare 24×7 was founded with a simple yet powerful vision: to ensure that no one 
              has to face a medical emergency alone or wait for hours to consult a doctor.
            </p>
            <p>
              Our team of healthcare professionals and technology experts came together to create 
              a platform that combines the expertise of certified doctors with the convenience of 
              modern technology. Whether it's a late-night fever, a sudden injury, or a chronic 
              condition that needs management, we're here to help.
            </p>
            <p>
              We've built a comprehensive first-aid guide that puts life-saving information at your 
              fingertips, helping you respond effectively in emergencies while professional help is 
              on the way. Our platform has helped thousands of patients get timely medical advice 
              and treatment, often making a crucial difference in their health outcomes.
            </p>
            <p className="font-semibold text-foreground">
              Today, we continue to grow and evolve, always keeping our core mission at heart: 
              making quality healthcare accessible, affordable, and available to all.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default About;
