import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login'
import Dashboard from './dashboard'
import Agenda from './agenda'
import Paciente from './paciente'
import Financeiro from './financeiro'
import Profissionais from './profissionais'
import Servicos from './servicos'
import Estoque from './estoque'
import Comissoes from './comissoes'
import Vendas from './pdv'
import Relatorios from './relatorios'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/paciente" element={<Paciente />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/profissionais" element={<Profissionais />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/comissoes" element={<Comissoes />} />
        <Route path="/pdv" element={<Vendas />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)