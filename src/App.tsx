import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstituteRegister from "./pages/InstituteRegister";
import InstituteDashboard from "./pages/InstituteDashboard";
import DepartmentManagement from "./pages/DepartmentManagement";
import DepartmentDetail from "./pages/DepartmentDetail";
import BranchTimetableSetup from "./pages/BranchTimetableSetup";
import GeneratedBranchTimetable from "./pages/GeneratedBranchTimetable";
import ProfessorManagement from "./pages/ProfessorManagement";
import Dashboard from "./pages/Dashboard";
import TimetableOptions from "./pages/TimetableOptions";
import DailySetup from "./pages/DailySetup";
import SkillsRecommendation from "./pages/SkillsRecommendation";
import GeneratedTimetable from "./pages/GeneratedTimetable";
import TaskDetail from "./pages/TaskDetail";
import MonthlyTimetable from "./pages/MonthlyTimetable";
import WeeklySetup from "./pages/WeeklySetup";
import TaskBasedSetup from "./pages/TaskBasedSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/institute-register" element={<PublicRoute><InstituteRegister /></PublicRoute>} />
        <Route path="/institute-dashboard" element={<ProtectedRoute><InstituteDashboard /></ProtectedRoute>} />
        <Route path="/institute/departments" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
        <Route path="/institute/departments/:departmentId" element={<ProtectedRoute><DepartmentDetail /></ProtectedRoute>} />
        <Route path="/institute/branches/:branchId/timetable-setup" element={<ProtectedRoute><BranchTimetableSetup /></ProtectedRoute>} />
        <Route path="/institute/branches/:branchId/timetable" element={<ProtectedRoute><GeneratedBranchTimetable /></ProtectedRoute>} />
        <Route path="/institute/professors" element={<ProtectedRoute><ProfessorManagement /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/timetable-options" element={<ProtectedRoute><TimetableOptions /></ProtectedRoute>} />
        <Route path="/daily-setup" element={<ProtectedRoute><DailySetup /></ProtectedRoute>} />
        <Route path="/skills-recommendation" element={<ProtectedRoute><SkillsRecommendation /></ProtectedRoute>} />
        <Route path="/generated-timetable" element={<ProtectedRoute><GeneratedTimetable /></ProtectedRoute>} />
        <Route path="/task-detail" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/monthly-timetable" element={<ProtectedRoute><MonthlyTimetable /></ProtectedRoute>} />
        <Route path="/weekly-setup" element={<ProtectedRoute><WeeklySetup /></ProtectedRoute>} />
        <Route path="/task-based-setup" element={<ProtectedRoute><TaskBasedSetup /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
