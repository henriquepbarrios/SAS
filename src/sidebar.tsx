import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Variáveis de Identidade (Alinhadas ao Login/Dashboard) ---
const Colors = {
  primary: '#0046FF',      // Azul vibrante do logo
  primarySoft: 'rgba(0, 70, 255, 0.15)',
  bgSidebar: '#08090A',    // Preto mais profundo para contraste
  textMain: '#FFFFFF',
  textMuted: '#64748B',    // Texto inativo
  navHover: '#16191E',     // Cor de hover igual ao fundo dos cards
  border: '#1E2229'
};

const SidebarContainer = styled.aside`
  width: 260px;
  background: ${Colors.bgSidebar};
  border-right: 1px solid ${Colors.border};
  display: flex;
  flex-direction: column;
  padding: 24px 16px; /* Ajustado para melhor respiro */
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;

  /* Custom Scrollbar para manter o visual dark */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${Colors.border}; border-radius: 10px; }
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.4rem;
  color: ${Colors.textMain};
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 12px;
  letter-spacing: 1px;
`;

const SectionTitle = styled.p`
  font-size: 0.7rem;
  text-transform: uppercase;
  color: ${Colors.textMuted};
  font-weight: 700;
  margin: 24px 0 8px 12px;
  letter-spacing: 0.1em;
  opacity: 0.8;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 2px;
  color: ${props => props.active ? Colors.textMain : Colors.textMuted};
  background: ${props => props.active ? Colors.primarySoft : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  border-left: 3px solid ${props => props.active ? Colors.primary : 'transparent'};
  transition: all 0.2s ease;

  i {
    font-size: 1.1rem;
    filter: ${props => props.active ? 'grayscale(0)' : 'grayscale(1) opacity(0.7)'};
  }

  &:hover {
    background: ${props => props.active ? Colors.primarySoft : Colors.navHover};
    color: ${Colors.textMain};
    i { filter: grayscale(0) opacity(1); }
  }
`;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Principal', items: [
      { label: 'Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'Agenda Online', path: '/agenda', icon: '📅' },
    ]},
    { title: 'Gestão de Espaço', items: [
      { label: 'Clientes / Pacientes', path: '/paciente', icon: '👥' },
      { label: 'Profissionais', path: '/profissionais', icon: '✂️' },
      { label: 'Serviços', path: '/servicos', icon: '📝' },
      { label: 'Estoque', path: '/estoque', icon: '📦' },
    ]},
    { title: 'Financeiro', items: [
      { label: 'Fluxo de Caixa', path: '/financeiro', icon: '💰' },
      { label: 'Comissões', path: '/comissoes', icon: '💸' },
      { label: 'Vendas produtos', path: '/pdv', icon: '🛒' },
    ]},
    { title: 'Crescimento', items: [
      { label: 'Relatórios', path: '/relatorios', icon: '📈' },
    ]}
  ];

  return (
    <SidebarContainer>
      <Logo>
        <div style={{ 
          width: 32, 
          height: 32, 
          background: Colors.primary, 
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${Colors.primary}66`
        }}>
          <span style={{ fontSize: '12px', color: 'white' }}>V</span>
        </div>
        SAS
      </Logo>

      {menuItems.map((section) => (
        <div key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>
          {section.items.map((item) => (
            <NavItem 
              key={item.path}
              active={location.pathname === item.path} 
              onClick={() => navigate(item.path)}
            >
              <i>{item.icon}</i> {item.label}
            </NavItem>
          ))}
        </div>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;