import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Missa from './pages/Missa.jsx'
import Terco from './pages/Terco.jsx'
import Oracoes from './pages/Oracoes.jsx'
import Biblia from './pages/Biblia.jsx'
import Catecismo from './pages/Catecismo.jsx'
import LectioDivina from './pages/LectioDivina.jsx'
import Igrejas from './pages/Igrejas.jsx'
import BoaNoite from './pages/BoaNoite.jsx'
import Exame from './pages/Exame.jsx'
import Notificacoes from './pages/Notificacoes.jsx'
import Calendario from './pages/Calendario.jsx'
import Paroquia from './pages/Paroquia.jsx'
import Settings from './pages/Settings.jsx'
import Notas from './pages/Notas.jsx'
import Salvos from './pages/Salvos.jsx'
import Busca from './pages/Busca.jsx'
import Novenas from './pages/Novenas.jsx'
import Oficio from './pages/Oficio.jsx'
import Onboarding from './pages/Onboarding.jsx'

function RequireOnboarding({ children }) {
  const location = useLocation()
  const onboarded = localStorage.getItem('verbum-onboarded')
  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

export default function App() {
  return (
    <RequireOnboarding>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
        <Route path="/missa" element={<Missa />} />
        <Route path="/terco" element={<Terco />} />
        <Route path="/oracoes" element={<Oracoes />} />
        <Route path="/biblia" element={<Biblia />} />
        <Route path="/catecismo" element={<Catecismo />} />
        <Route path="/lectio" element={<LectioDivina />} />
        <Route path="/igrejas" element={<Igrejas />} />
        <Route path="/boa-noite" element={<BoaNoite />} />
        <Route path="/exame" element={<Exame />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/paroquia" element={<Paroquia />} />
        <Route path="/settings" element={<Settings />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/salvos" element={<Salvos />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="/novenas" element={<Novenas />} />
          <Route path="/oficio" element={<Oficio />} />
      </Route>
      </Routes>
    </RequireOnboarding>
  )
}
