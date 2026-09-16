import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Index';
import { Especialidades } from './pages/Especialidades';
import { Especialistas } from './pages/Especialistas';
import { Nosotros } from './pages/Nosotros';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Calendario, Usuario } from './pages/Usuario';
import { SacarTurno } from './pages/SacarTurno';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/especialistas" element={<Especialistas />} />
        <Route path="/profesionales" element={<Especialistas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/sacar-turno" element={<SacarTurno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;