import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div
        className="
        p-4
        flex
        gap-4
        border-b
      "
      >
        <Link to="/">Login</Link>

        <Link to="/projects">Projects</Link>
      </div>

      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
