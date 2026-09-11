import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Index';
import { Especialidades } from './pages/Especialidades';
import { Nosotros } from './pages/Nosotros';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;