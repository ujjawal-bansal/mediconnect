import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Building2, 
  Stethoscope, 
  Pill,
  Star,
  AlertTriangle
} from "lucide-react";

type FacilityType = "hospital" | "clinic" | "pharmacy";

interface NearbyFacility {
  id?: string;
  type: FacilityType;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  distance?: string;
  phone?: string;
  openHours?: string;
  rating?: number;
  services?: string[];
  isOpen?: boolean;
}

const NearbyHelp = () => {
  const [selectedType, setSelectedType] = useState("all");

  // Static facilities list - always shown for demo
  const facilities: NearbyFacility[] = [
    {
      type: "hospital",
      name: "Crossing Republik Multi Speciality Hospital",
      address: "Galleria Market Road, Crossing Republik, Ghaziabad",
      latitude: 28.6255,
      longitude: 77.4355,
      distance: "2.5 km",
      phone: "+91 11 4000 1000",
      openHours: "24×7 Emergency",
      rating: 4.8,
      services: ["Emergency", "ICU", "Surgery"],
      isOpen: true,
    },
    {
      type: "hospital",
      name: "Arogya Emergency Hospital",
      address: "NH24 Service Lane, Near Crossing Republik, Ghaziabad",
      latitude: 28.6282,
      longitude: 77.431,
      distance: "3.2 km",
      phone: "+91 11 4000 2000",
      openHours: "24×7 Emergency",
      rating: 4.6,
      services: ["Emergency", "Cardiology", "Pediatrics"],
      isOpen: true,
    },
    {
      type: "clinic",
      name: "Family Care Clinic",
      address: "Neighborhood Plaza, Crossing Republik, Ghaziabad",
      latitude: 28.6248,
      longitude: 77.438,
      distance: "1.5 km",
      phone: "+91 11 4000 3000",
      openHours: "8:00 AM - 8:00 PM",
      rating: 4.7,
      services: ["General Practice", "Vaccinations"],
      isOpen: true,
    },
    {
      type: "clinic",
      name: "Ortho Care Clinic",
      address: "CRS Residency Complex, Crossing Republik, Ghaziabad",
      latitude: 28.6273,
      longitude: 77.4372,
      distance: "2.0 km",
      phone: "+91 11 4000 4000",
      openHours: "9:00 AM - 6:00 PM",
      rating: 4.5,
      services: ["Family Medicine", "Lab Tests"],
      isOpen: false,
    },
    {
      type: "pharmacy",
      name: "24×7 Health Pharmacy",
      address: "Supertech Livingston Gate, Crossing Republik, Ghaziabad",
      latitude: 28.6265,
      longitude: 77.4335,
      distance: "0.5 km",
      phone: "+91 11 4000 5000",
      openHours: "24×7 Open",
      rating: 4.4,
      services: ["Prescriptions", "OTC Medicines"],
      isOpen: true,
    },
    {
      type: "pharmacy",
      name: "Neighborhood Pharmacy",
      address: "Residential Block C, Crossing Republik, Ghaziabad",
      latitude: 28.6239,
      longitude: 77.4361,
      distance: "1.2 km",
      phone: "+91 11 4000 6000",
      openHours: "7:00 AM - 11:00 PM",
      rating: 4.3,
      services: ["Prescriptions", "Health Products"],
      isOpen: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return Building2;
      case "clinic":
        return Stethoscope;
      case "pharmacy":
        return Pill;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-emergency/10 text-emergency";
      case "clinic":
        return "bg-primary/10 text-primary";
      case "pharmacy":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredFacilities = selectedType === "all" 
    ? facilities 
    : facilities.filter(f => f.type === selectedType);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Nearby Medical Help</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Healthcare facilities around Crossing Republik, Ghaziabad for immediate medical assistance.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hospital">Hospitals</TabsTrigger>
          <TabsTrigger value="clinic">Clinics</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacies</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Facilities List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFacilities.map((facility, index) => {
          const Icon = getIcon(facility.type);
          return (
            <Card key={index} className="p-5 hover:shadow-float transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getTypeColor(facility.type)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {facility.address}
                      </p>
                    </div>
                    <Badge variant={facility.isOpen ? "default" : "secondary"}>
                      {facility.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <Navigation className="h-3 w-3" />
                      {facility.distance}
                    </span>
                    {facility.openHours && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                        {facility.openHours}
                    </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {facility.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {facility.services.map((service, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {facility.phone && (
                      <a href={`tel:${facility.phone}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </a>
                    )}
                    <a
                      href={
                        facility.latitude && facility.longitude
                          ? `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${facility.name} ${facility.address}`,
                            )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Notice */}
      <Card className="mt-8 p-6 bg-emergency/5 border-emergency/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emergency/10 rounded-xl">
            <Phone className="h-6 w-6 text-emergency" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Emergency Helplines (India)</h3>
            <p className="text-muted-foreground mb-3">
              For life-threatening emergencies, call emergency services immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:108">
                <Button variant="destructive">
                  Call 108 - Ambulance
                </Button>
              </a>
              <a href="tel:112">
                <Button variant="outline">
                  Call 112 - Emergency
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>104</strong> - Health Helpline • <strong>181</strong> - Women Helpline
            </p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="mt-6 p-4 bg-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This platform provides emergency guidance and does not replace professional medical care. 
            Facility information may vary. Please verify details before visiting.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NearbyHelp;
