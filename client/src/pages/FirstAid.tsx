import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Heart, Flame, Bandage, Droplet, Bone, AlertCircle, Wind, ArrowRight } from "lucide-react";

const FirstAid = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const firstAidGuides = [
    { icon: Heart, title: "Heart Attack", severity: "critical", slug: "heart-attack", description: "Immediate steps for suspected heart attack" },
    { icon: Flame, title: "Burns", severity: "urgent", slug: "burns", description: "Treatment for minor to moderate burns" },
    { icon: Bandage, title: "Cuts & Wounds", severity: "moderate", slug: "cuts-wounds", description: "Basic wound care and bleeding control" },
    { icon: Droplet, title: "Bleeding", severity: "critical", slug: "bleeding", description: "How to control severe bleeding" },
    { icon: Bone, title: "Fractures", severity: "urgent", slug: "fractures", description: "Immediate care for broken bones" },
    { icon: Wind, title: "Choking", severity: "critical", slug: "choking", description: "Heimlich maneuver and choking response" },
  ];

  const filteredGuides = firstAidGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-emergency text-emergency-foreground";
      case "urgent": return "bg-accent text-accent-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Emergency First-Aid Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Quick reference for common medical emergencies. For life-threatening situations, always call emergency services first.
        </p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search emergency type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, index) => (
          <Link key={index} to={`/first-aid/${guide.slug}`}>
            <Card className="p-6 hover:shadow-float transition-all duration-300 hover:border-primary h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <guide.icon className="h-8 w-8 text-primary" />
                </div>
                <Badge className={getSeverityColor(guide.severity)}>{guide.severity}</Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
              <Button variant="ghost" className="p-0 h-auto text-primary">
                View Guide <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-12 p-6 bg-muted/50 border-2 border-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-emergency shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This guide is for informational purposes only and does not replace professional medical advice. In case of serious injury or emergency, always call emergency services (911) immediately.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FirstAid;
