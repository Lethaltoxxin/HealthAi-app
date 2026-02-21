import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import IntroModal from './pages/IntroModal';
import OnboardingFlow from './pages/OnboardingFlow';
import LoadingScreen from './pages/LoadingScreen';
import Home from './pages/Home';
import RecordsList from './pages/RecordsList';
import ScanScreen from './pages/ScanScreen';
import AnalysisResult from './pages/AnalysisResult';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import FamilySharing from './pages/FamilySharing';
import Nutrition from './pages/Nutrition';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import LabReport from './pages/LabReport';
import Prescription from './pages/Prescription';
import NutritionOnboarding from './pages/NutritionOnboarding';
import NutritionGenerating from './pages/NutritionGenerating';
import NutritionPlan from './pages/NutritionPlan';
import GroceryList from './pages/GroceryList';
import SymptomChecker from './pages/SymptomChecker';
import Mindfulness from './pages/Mindfulness';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Progress from './pages/Progress';

const Login = () => <IntroModal />; // Redirect to Intro for now

function AppRoutes() {
  const { currentUser } = useAuth();

  // Simple protection: if not onboarded/logged in, show Intro
  // For demo, we might want to be lenient or strict.
  // Assuming 'currentUser' is null initially.

  return (
    <Routes>
      <Route path="/intro" element={<IntroModal />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/loading" element={<LoadingScreen />} />

      {/* Protected Layout Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<RecordsList />} />
        <Route path="/records/:id" element={<AnalysisResult />} />
        <Route path="/scan" element={<ScanScreen />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/lab-report" element={<LabReport />} />
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/nutrition-onboarding" element={<NutritionOnboarding />} />
        <Route path="/nutrition-generating" element={<NutritionGenerating />} />
        <Route path="/nutrition/plan" element={<NutritionPlan />} />
        <Route path="/nutrition/grocery" element={<GroceryList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/family" element={<FamilySharing />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/mindfulness" element={<Mindfulness />} />
        <Route path="/workout" element={<WorkoutBuilder />} />
        <Route path="/progress" element={<Progress />} />
      </Route>

      {/* Redirects */}
      <Route path="/login" element={<Navigate to="/intro" replace />} />
      <Route path="*" element={<Navigate to={currentUser ? "/" : "/intro"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
