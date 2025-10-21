import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";

// Lazy load all pages for better performance
const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const InstituteRegister = lazy(() => import("./pages/InstituteRegister"));
const InstituteDashboard = lazy(() => import("./pages/InstituteDashboard"));
const DepartmentManagement = lazy(() => import("./pages/DepartmentManagement"));
const DepartmentDetail = lazy(() => import("./pages/DepartmentDetail"));
const BranchTimetableSetup = lazy(() => import("./pages/BranchTimetableSetup"));
const GeneratedBranchTimetable = lazy(() => import("./pages/GeneratedBranchTimetable"));
const ProfessorManagement = lazy(() => import("./pages/ProfessorManagement"));
const LectureHallsManagement = lazy(() => import("./pages/LectureHallsManagement"));
const BranchManagement = lazy(() => import("./pages/BranchManagement"));
const BlockManagement = lazy(() => import("./pages/BlockManagement"));
const RoomManagement = lazy(() => import("./pages/RoomManagement"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TimetableOptions = lazy(() => import("./pages/TimetableOptions"));
const DailySetup = lazy(() => import("./pages/DailySetup"));
const SkillsRecommendation = lazy(() => import("./pages/SkillsRecommendation"));
const GeneratedTimetable = lazy(() => import("./pages/GeneratedTimetable"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const MonthlyTimetable = lazy(() => import("./pages/MonthlyTimetable"));
const WeeklySetup = lazy(() => import("./pages/WeeklySetup"));
const TaskBasedSetup = lazy(() => import("./pages/TaskBasedSetup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/institute/lecture-halls" element={<ProtectedRoute><LectureHallsManagement /></ProtectedRoute>} />
          <Route path="/institute/departments/:departmentId/branches" element={<ProtectedRoute><BranchManagement /></ProtectedRoute>} />
          <Route path="/institute/branches/:branchId/blocks" element={<ProtectedRoute><BlockManagement /></ProtectedRoute>} />
          <Route path="/institute/blocks/:blockId/rooms" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
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
      </Suspense>
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
