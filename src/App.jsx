import {
  BrowserRouter,Navigate,Route,Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/:projectId/board" element={<ProjectBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;