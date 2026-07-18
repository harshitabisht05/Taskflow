import {
  BrowserRouter,Navigate,Route,Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import ThemeSettings from "./pages/ThemeSettings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ThemeDecorations from "./components/theme/ThemeDecorations";
import ThemeCompanion from "./components/theme/ThemeCompanion";
import ThemeCelebration from "./components/theme/ThemeCelebration";

function App() {
  return (
    <BrowserRouter>
      <ThemeDecorations />
      <ThemeCompanion />
      <ThemeCelebration />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/themes" element={<ThemeSettings />} />
            <Route path="/projects/:projectId/board" element={<ProjectBoard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
