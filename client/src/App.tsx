import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { DoctorAuthProvider } from "@/context/DoctorAuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmergencyButton from "./components/EmergencyButton";
import AIFirstAidChatbot from "./components/AIFirstAidChatbot";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Consultation from "./pages/Consultation";
import ConsultationChat from "./pages/ConsultationChat";
import FirstAid from "./pages/FirstAid";
import FirstAidDetail from "./pages/FirstAidDetail";
import NearbyHelp from "./pages/NearbyHelp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorConsultation from "./pages/DoctorConsultation";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/consultation/chat");
  const isDoctorPage = location.pathname.startsWith("/doctor");

  return (
    <div className="flex flex-col min-h-screen">
      {!isChatPage && !isDoctorPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Patient Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/consultation/chat/:id" element={<ConsultationChat />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/first-aid/:emergencyType" element={<FirstAidDetail />} />
          <Route path="/nearby" element={<NearbyHelp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/consultation/:consultationId" element={<DoctorConsultation />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatPage && !isDoctorPage && <Footer />}
      {!isDoctorPage && <EmergencyButton />}
      {!isDoctorPage && <AIFirstAidChatbot />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DoctorAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </DoctorAuthProvider>
  </QueryClientProvider>
);

export default App;
