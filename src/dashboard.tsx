import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './sidebar';

// --- Variáveis de Design (Alinhadas com o Login) ---
const Colors = {
  primary: '#0046FF',      
  primaryHover: '#0036C7',
  bgDark: '#0B0D10',       // Fundo principal (conforme sua imagem)
  cardBg: '#16191E',       // Fundo dos cards
  inputBg: '#1E2229',      // Fundo de itens secundários
  textMain: '#FFFFFF',     
  textMuted: '#94A3B8',    
  border: '#2D343F',       // Bordas sutis
  accent: {
    cabelo: '#0046FF',
    barba: '#EC4899',
    estetica: '#8B5CF6',
    produtos: '#10B981'
  }
};

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: ${Colors.bgDark}; 
    font-family: 'Inter', -apple-system, sans-serif; 
    color: ${Colors.textMain}; 
    -webkit-font-smoothing: antialiased;
  }
`;

// --- Layout ---
const Container = styled.div` display: flex; min-height: 100vh; `;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 40px;
  background: radial-gradient(circle at top right, #16191e 0%, #0b0d10 100%);
`;

// --- Componentes de UI Dark ---
const Card = styled.div`
  background: ${Colors.cardBg};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${Colors.textMain};
`;

const Grid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 3}, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const CategoryCard = styled.div<{ borderColor: string }>`
  background: ${Colors.cardBg};
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${Colors.border};
  border-left: 4px solid ${props => props.borderColor};
  
  span { color: ${Colors.textMuted}; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  strong { font-size: 1.5rem; color: ${Colors.textMain}; display: block; margin-top: 4px; }
`;

const AppointmentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  background: ${Colors.inputBg};
  border: 1px solid ${Colors.border};
  margin-bottom: 12px;
  
  &:hover { border-color: ${Colors.primary}; background: #232831; }
`;

const TimeTag = styled.div`
  background: rgba(0, 70, 255, 0.15);
  color: ${Colors.primary};
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 70, 255, 0.3);
`;

const ActionButton = styled(motion.button)`
  background: ${Colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: ${Colors.primaryHover}; }
  &:disabled { background: #2D343F; color: #64748B; cursor: not-allowed; }
`;

// --- Modal Design ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled(motion.div)`
  background: ${Colors.cardBg};
  width: 90%;
  max-width: 450px;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const PaymentOption = styled.button<{ selected: boolean }>`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${props => props.selected ? Colors.primary : Colors.border};
  background: ${props => props.selected ? 'rgba(0, 70, 255, 0.1)' : Colors.inputBg};
  color: ${props => props.selected ? Colors.primary : Colors.textMuted};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${Colors.primary}; }
`;

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const categorias = [
    { label: 'Cabelo', valor: 'R$ 1.200', color: Colors.accent.cabelo },
    { label: 'Barbearia', valor: 'R$ 450', color: Colors.accent.barba },
    { label: 'Estética', valor: 'R$ 890', color: Colors.accent.estetica },
    { label: 'Produtos', valor: 'R$ 320', color: Colors.accent.produtos },
  ];

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      
      <MainContent>
        <header style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Dashboard 💎</h1>
          <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão da Unidade Centro</p>
        </header>

        {/* KPIs Principais com novo contraste */}
        <Grid>
          <Card>
            <p style={{ color: Colors.textMuted, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Faturamento Hoje</p>
            <h3 style={{ fontSize: '2rem', marginTop: 12, fontWeight: 700 }}>R$ 1.840,50</h3>
          </Card>
          <Card>
            <p style={{ color: Colors.textMuted, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Ocupação</p>
            <h3 style={{ fontSize: '2rem', marginTop: 12, fontWeight: 700, color: Colors.primary }}>78%</h3>
          </Card>
          <Card>
            <p style={{ color: Colors.textMuted, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Novos Clientes</p>
            <h3 style={{ fontSize: '2rem', marginTop: 12, fontWeight: 700 }}>12</h3>
          </Card>
        </Grid>

        <SectionTitle>Receita por Categoria</SectionTitle>
        <Grid cols={4}>
          {categorias.map((cat) => (
            <CategoryCard key={cat.label} borderColor={cat.color}>
              <span>{cat.label}</span>
              <strong>{cat.valor}</strong>
            </CategoryCard>
          ))}
        </Grid>

        <Card style={{ marginTop: '32px' }}>
          <SectionTitle>Próximos Clientes</SectionTitle>
          {[
            { id: 1, hora: '14:30', cliente: 'Ana Paula Jardim', servico: 'Corte + Coloração', preco: 180 },
            { id: 2, hora: '15:15', cliente: 'Lucas Ferreira', servico: 'Barba Premium', preco: 65 },
          ].map((appt) => (
            <AppointmentItem 
              key={appt.id}
              whileHover={{ x: 4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <TimeTag>{appt.hora}</TimeTag>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>{appt.cliente}</p>
                  <p style={{ fontSize: '0.85rem', color: Colors.textMuted }}>{appt.servico}</p>
                </div>
              </div>
              <ActionButton 
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedAppt(appt); setIsModalOpen(true); }}
              >
                Checkout
              </ActionButton>
            </AppointmentItem>
          ))}
        </Card>

        <AnimatePresence>
          {isModalOpen && (
            <ModalOverlay 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <ModalContent 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Finalizar Venda</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Cliente: {selectedAppt?.cliente}</p>

                <div style={{ background: Colors.inputBg, padding: 20, borderRadius: 16, marginBottom: 24 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.textMuted }}>
                      <span>Subtotal</span>
                      <span>R$ {selectedAppt?.preco.toFixed(2)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${Colors.border}` }}>
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <strong style={{ color: Colors.primary, fontSize: '1.4rem' }}>R$ {selectedAppt?.preco.toFixed(2)}</strong>
                   </div>
                </div>

                <Grid cols={2} style={{ gap: 10, marginBottom: 24 }}>
                  {['PIX', 'Crédito', 'Débito', 'Dinheiro'].map(m => (
                    <PaymentOption key={m} selected={paymentMethod === m} onClick={() => setPaymentMethod(m)}>
                      {m}
                    </PaymentOption>
                  ))}
                </Grid>

                <ActionButton 
                  style={{ width: '100%', padding: 16 }} 
                  disabled={!paymentMethod}
                  onClick={() => setIsModalOpen(false)}
                >
                  {paymentMethod ? 'Confirmar Recebimento' : 'Selecione o Pagamento'}
                </ActionButton>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Dashboard;