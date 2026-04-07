import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ajustes from "./pages/Ajustes";
import Layout from "./layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ajustes" element={<Ajustes />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;