import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

// --- Estilos do Layout ---
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

const Grid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 3}, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

// --- Estilos de Componentes (Cards) ---
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

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 16px;
  background: #F8FAFC;
  border: 1px solid #F1F5F9;
  margin-bottom: 12px;
  transition: all 0.2s;
  &:hover { transform: translateX(5px); background: #FFF; border-color: #4F46E5; }
`;

const TimeTag = styled.div`
  background: #EEF2FF;
  color: #4F46E5;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  min-width: 65px;
  text-align: center;
`;

const ActionButton = styled.button`
  background: #4F46E5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #4338CA; }
`;

// --- Estilos do Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const SummaryBox = styled.div`
  background: #F8FAFC;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
`;

const PaymentOption = styled.button<{ selected: boolean }>`
  padding: 12px;
  border-radius: 12px;
  border: 2px solid ${props => props.selected ? '#4F46E5' : '#F1F5F9'};
  background: ${props => props.selected ? '#EEF2FF' : 'white'};
  color: ${props => props.selected ? '#4F46E5' : '#64748B'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
`;

const Dashboard: React.FC = () => {
  // --- Estados ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  // --- Mock de Dados ---
  const proximosAtendimentos = [
    { id: 1, hora: '14:30', cliente: 'Ana Paula Jardim', servico: 'Corte + Coloração', profissional: 'Bia Silva', preco: 180.00 },
    { id: 2, hora: '15:15', cliente: 'Lucas Ferreira', servico: 'Barba Premium', profissional: 'Marco Vedovato', preco: 65.00 },
    { id: 3, hora: '16:00', cliente: 'Beatriz Costa', servico: 'Manicure', profissional: 'Duda Ramos', preco: 45.00 },
  ];

  const categorias = [
    { label: 'Cabelo', valor: 'R$ 1.200', color: '#4F46E5' },
    { label: 'Barbearia', valor: 'R$ 450', color: '#EC4899' },
    { label: 'Estética', valor: 'R$ 890', color: '#8B5CF6' },
    { label: 'Produtos', valor: 'R$ 320', color: '#10B981' },
  ];

  // --- Funções ---
  const openCheckout = (appt: any) => {
    setSelectedAppt(appt);
    setIsModalOpen(true);
  };

  const closeCheckout = () => {
    setIsModalOpen(false);
    setSelectedAppt(null);
    setPaymentMethod('');
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      
      <MainContent>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Dashboard 💎</h1>
          <p style={{ color: '#64748B' }}>Gestão da Unidade Centro</p>
        </header>

        {/* KPIs Principais */}
        <Grid>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>Faturamento Hoje</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: 8 }}>R$ 1.840,50</h3>
          </Card>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>Ocupação da Agenda</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: 8 }}>78%</h3>
          </Card>
          <Card>
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>Novos Clientes</p>
            <h3 style={{ fontSize: '1.8rem', marginTop: 8 }}>12</h3>
          </Card>
        </Grid>

        {/* Resumo por Categoria (Usando o CategoryCard) */}
        <SectionTitle>Receita por Categoria</SectionTitle>
        <Grid cols={4}>
          {categorias.map((cat) => (
            <CategoryCard key={cat.label} borderColor={cat.color}>
              <span>{cat.label}</span>
              <strong>{cat.valor}</strong>
            </CategoryCard>
          ))}
        </Grid>

        {/* Lista de Atendimentos */}
        <Card style={{ marginTop: '32px' }}>
          <SectionTitle>Próximos Clientes</SectionTitle>
          {proximosAtendimentos.map((appt) => (
            <AppointmentItem key={appt.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <TimeTag>{appt.hora}</TimeTag>
                <div>
                  <p style={{ fontWeight: 700 }}>{appt.cliente}</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{appt.servico} • {appt.profissional}</p>
                </div>
              </div>
              <ActionButton onClick={() => openCheckout(appt)}>Checkout</ActionButton>
            </AppointmentItem>
          ))}
        </Card>

        {/* Modal de Checkout */}
        {isModalOpen && (
          <ModalOverlay onClick={closeCheckout}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Finalizar Venda</h2>
              <p style={{ color: '#64748B', marginBottom: '10px' }}>Cliente: {selectedAppt?.cliente}</p>

              <SummaryBox>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{selectedAppt?.servico}</span>
                  <strong>R$ {selectedAppt?.preco.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #E2E8F0', paddingTop: '10px' }}>
                  <span>Total</span>
                  <strong style={{ color: '#4F46E5', fontSize: '1.4rem' }}>R$ {selectedAppt?.preco.toFixed(2)}</strong>
                </div>
              </SummaryBox>

              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>Forma de Pagamento</p>
              <PaymentGrid>
                {['PIX', 'Crédito', 'Débito', 'Dinheiro'].map(method => (
                  <PaymentOption 
                    key={method} 
                    selected={paymentMethod === method}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </PaymentOption>
                ))}
              </PaymentGrid>

              <ActionButton 
                style={{ width: '100%', marginTop: '24px', padding: '16px', fontSize: '1rem' }}
                disabled={!paymentMethod}
                onClick={() => {
                  alert(`Recebido R$ ${selectedAppt?.preco.toFixed(2)} via ${paymentMethod}!`);
                  closeCheckout();
                }}
              >
                {paymentMethod ? 'Confirmar e Finalizar' : 'Selecione o Pagamento'}
              </ActionButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </Container>
  );
};

export default Dashboard;