import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

const Container = styled.div` display: flex; min-height: 100vh; `;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1E293B;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: #FFF;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const CategoryCard = styled.div<{ borderColor: string }>`
  background: #FFF;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  border-left: 5px solid ${props => props.borderColor};
  display: flex;
  flex-direction: column;
  gap: 4px;
  span { color: #64748B; font-size: 0.85rem; font-weight: 600; }
  strong { font-size: 1.4rem; color: #1E293B; }
`;

// --- Novos Estilos para os Próximos Atendimentos ---

const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 16px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
    border-color: #E2E8F0;
  }
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TimeTag = styled.div`
  background: #EEF2FF;
  color: #4F46E5;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 65px;
  text-align: center;
`;

const StatusBadge = styled.span<{ type: 'confirmado' | 'pendente' }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.type === 'confirmado' ? '#DCFCE7' : '#FEF9C3'};
  color: ${props => props.type === 'confirmado' ? '#166534' : '#854D0E'};
`;

const Dashboard: React.FC = () => {
  // Mock de dados para os próximos atendimentos
  const proximosAtendimentos = [
    { id: 1, hora: '14:30', paciente: 'Ricardo Almeida', tipo: 'Consulta', status: 'confirmado' },
    { id: 2, hora: '15:15', paciente: 'Carla Souza', tipo: 'Exame de Rotina', status: 'confirmado' },
    { id: 3, hora: '16:00', paciente: 'Marcos Pires', tipo: 'Cirurgia Catarata', status: 'pendente' },
    { id: 4, hora: '17:00', paciente: 'Juliana Lima', tipo: 'Retorno Pós-Op', status: 'confirmado' },
  ];

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Olá, Usuário 👋</h1>
          <p style={{ color: '#64748B' }}>Resumo diário do seu consultório</p>
        </header>

        {/* KPIs Principais */}
        <Grid>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Atendimentos hoje</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: 8 }}>12</h3>
          </Card>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Novos pacientes</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: 8 }}>4</h3>
          </Card>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Receita estimada</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: 8, color: '#10B981' }}>R$ 2.450</h3>
          </Card>
        </Grid>

        {/* Resumo por Tipos */}
        <SectionTitle>Tipos de Atendimento (Hoje)</SectionTitle>
        <Grid style={{ marginBottom: 40 }}>
          <CategoryCard borderColor="#4F46E5">
            <span>Consultas</span>
            <strong>07</strong>
          </CategoryCard>
          <CategoryCard borderColor="#8B5CF6">
            <span>Exames</span>
            <strong>03</strong>
          </CategoryCard>
          <CategoryCard borderColor="#EC4899">
            <span>Cirurgias</span>
            <strong>02</strong>
          </CategoryCard>
        </Grid>

        {/* Lista Detalhada de Próximos Atendimentos */}
        <Card>
          <SectionTitle>
            Próximos da Agenda
          </SectionTitle>
          
          <AppointmentList>
            {proximosAtendimentos.map((appt) => (
              <AppointmentItem key={appt.id}>
                <PatientInfo>
                  <TimeTag>{appt.hora}</TimeTag>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>{appt.paciente}</p>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{appt.tipo}</p>
                  </div>
                </PatientInfo>
                <StatusBadge type={appt.status as any}>
                  {appt.status}
                </StatusBadge>
              </AppointmentItem>
            ))}
          </AppointmentList>
        </Card>
      </MainContent>
    </Container>
  );
};

export default Dashboard;