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
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  color: #4F46E5;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
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

  return (
    <SidebarContainer>
      <Logo>
        <div style={{ width: 32, height: 32, background: '#4F46E5', borderRadius: 8 }} />
        NOME
      </Logo>

      <NavItem active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')}>
        <i>📊</i> Dashboard
      </NavItem>

      <NavItem active={location.pathname === '/agenda'} onClick={() => navigate('/agenda')}>
        <i>📅</i> Agenda
      </NavItem>

      <NavItem active={location.pathname === '/paciente'} onClick={() => navigate('/paciente')}>
        <i>👥</i> Pacientes
      </NavItem>

      <NavItem active={location.pathname === '/financeiro'} onClick={() => navigate('/financeiro')}>
        <i>💰</i> Financeiro
      </NavItem>
    </SidebarContainer>
  );
};

export default Sidebar;