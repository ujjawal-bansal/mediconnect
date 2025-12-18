import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  BookOpen, 
  Bot, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  User,
  Bell,
  Heart
} from "lucide-react";

const Dashboard = () => {
  const actionCards = [
    {
      icon: Video,
      title: "Book Consultation",
      description: "Connect with expert doctors via chat, call, or video",
      href: "/consultation",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: BookOpen,
      title: "Emergency First Aid",
      description: "Access step-by-step emergency guides",
      href: "/first-aid",
      color: "bg-emergency/10 text-emergency",
    },
    {
      icon: Bot,
      title: "AI First-Aid Assistant",
      description: "Get instant first-aid guidance from our AI chatbot",
      href: "#",
      color: "bg-accent/10 text-accent",
      onClick: () => {
        // Trigger chatbot open (handled by chatbot component)
        const event = new CustomEvent('openChatbot');
        window.dispatchEvent(event);
      },
    },
    {
      icon: MapPin,
      title: "Nearby Help",
      description: "Find hospitals, clinics & pharmacies near you",
      href: "/nearby",
      color: "bg-success/10 text-success",
    },
  ];

  const recentActivity = [
    {
      type: "consultation",
      title: "Consultation with Dr. Sarah",
      date: "Dec 15, 2024",
      time: "10:30 AM",
      status: "Completed",
    },
    {
      type: "firstaid",
      title: "Viewed: Burns First Aid",
      date: "Dec 14, 2024",
      time: "3:45 PM",
      status: "Viewed",
    },
    {
      type: "chatbot",
      title: "AI Assistant: CPR Steps",
      date: "Dec 13, 2024",
      time: "9:00 PM",
      status: "Helped",
    },
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Michael Chen",
      specialty: "Cardiologist",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      mode: "Video Call",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground">
              Your health dashboard is ready. How can we help you today?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCards.map((card, index) => (
            <Link
              key={index}
              to={card.href}
              onClick={card.onClick}
              className="block"
            >
              <Card className="p-6 hover:shadow-float transition-all duration-300 hover:border-primary h-full">
                <div className={`p-3 rounded-xl w-fit mb-4 ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Card className="divide-y divide-border">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'consultation' ? 'bg-primary/10' :
                    activity.type === 'firstaid' ? 'bg-emergency/10' :
                    'bg-accent/10'
                  }`}>
                    {activity.type === 'consultation' ? <Video className="h-4 w-4 text-primary" /> :
                     activity.type === 'firstaid' ? <BookOpen className="h-4 w-4 text-emergency" /> :
                     <Bot className="h-4 w-4 text-accent" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.date} at {activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary">{activity.status}</Badge>
              </div>
            ))}
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <Card className="p-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Video className="h-3 w-3 mr-1" />
                    {appointment.mode}
                  </Badge>
                  <Button className="w-full mt-2" size="sm">
                    Join Consultation
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <div className="p-3 bg-muted rounded-full w-fit mx-auto mb-3">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No upcoming appointments</p>
              <Link to="/consultation">
                <Button variant="outline" size="sm" className="mt-3">
                  Book Now
                </Button>
              </Link>
            </Card>
          )}

          {/* Health Tips Card */}
          <Card className="p-4 mt-4 bg-gradient-hero">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Health Tip of the Day</h3>
                <p className="text-sm text-muted-foreground">
                  Stay hydrated! Drink at least 8 glasses of water daily for optimal health.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
