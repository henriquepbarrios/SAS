import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 260px;
  background: #FFFFFF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto; // Garante scroll se a lista crescer
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  color: #4F46E5;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionTitle = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94A3B8;
  font-weight: 700;
  margin: 20px 0 10px 16px;
  letter-spacing: 0.05em;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 4px;
  color: ${props => props.active ? '#4F46E5' : '#64748B'};
  background: ${props => props.active ? '#EEF2FF' : 'transparent'};
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #F1F5F9;
    color: #4F46E5;
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
        <div style={{ width: 32, height: 32, background: '#4F46E5', borderRadius: 8 }} />
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