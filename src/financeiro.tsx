import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

// --- Variáveis de Design (Alinhadas ao SAS Dark) ---
const Colors = {
  primary: '#0046FF',
  primaryHover: '#0036C7',
  bgDark: '#0B0D10',
  cardBg: '#16191E',
  inputBg: '#1E2229',
  textMain: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#2D343F',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B'
};

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: ${Colors.bgDark}; 
    font-family: 'Inter', sans-serif; 
    color: ${Colors.textMain}; 
    -webkit-font-smoothing: antialiased;
  }
`;

const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: ${Colors.cardBg};
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${Colors.border};
  border-bottom: 4px solid ${props => props.color || Colors.border};
  
  h3 { font-size: 1.6rem; margin-top: 12px; color: ${Colors.textMain}; font-weight: 800; letter-spacing: -0.02em; }
  p { color: ${Colors.textMuted}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  background: ${Colors.cardBg};
  padding: 16px 24px;
  border-radius: 16px;
  border: 1px solid ${Colors.border};
`;

const TableCard = styled.div`
  background: ${Colors.cardBg};
  border-radius: 24px;
  border: 1px solid ${Colors.border};
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.02);
  color: ${Colors.textMuted};
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${Colors.border};
`;

const Td = styled.td`
  padding: 18px 24px;
  border-bottom: 1px solid ${Colors.border};
  font-size: 0.9rem;
`;

const MethodBadge = styled.span`
  background: ${Colors.inputBg};
  color: ${Colors.textMuted};
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${Colors.border};
`;

const TransactionType = styled.span<{ isEntry: boolean }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.isEntry ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.isEntry ? Colors.success : Colors.danger};
  border: 1px solid ${props => props.isEntry ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 500px;
  border: 1px solid ${Colors.border};
`;

const Financeiro: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const transacoes = [
    { id: 1, descricao: "Venda: Corte + Coloração (Ana Jardim)", data: "30/12/2025", valor: 180.00, tipo: "Entrada", metodo: "PIX" },
    { id: 2, descricao: "Compra de Estoque: Shampoos L'Oréal", data: "29/12/2025", valor: 850.00, tipo: "Saída", metodo: "Boleto" },
    { id: 3, descricao: "Venda: Barba Premium (Lucas Ferreira)", data: "29/12/2025", valor: 65.00, tipo: "Entrada", metodo: "Crédito" },
    { id: 4, descricao: "Energia Elétrica - Dezembro", data: "28/12/2025", valor: 420.00, tipo: "Saída", metodo: "Débito" },
  ];

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Financeiro 💰</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão de fluxo de caixa e faturamento</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button style={{ background: Colors.inputBg, color: Colors.textMain, border: `1px solid ${Colors.border}`, padding: '12px 20px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}>Exportar PDF</button>
             <button 
                onClick={() => setShowModal(true)}
                style={{ background: Colors.primary, color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 70, 255, 0.3)' }}
              >
                + Novo Lançamento
              </button>
          </div>
        </header>

        <StatsGrid>
          <StatCard color={Colors.success}>
            <p>Receitas (Mês)</p>
            <h3>R$ 14.250,00</h3>
          </StatCard>
          <StatCard color={Colors.danger}>
            <p>Despesas (Mês)</p>
            <h3>R$ 4.120,00</h3>
          </StatCard>
          <StatCard color={Colors.primary}>
            <p>Saldo em Caixa</p>
            <h3>R$ 10.130,00</h3>
          </StatCard>
          <StatCard color={Colors.warning}>
            <p>A Receber</p>
            <h3>R$ 2.450,00</h3>
          </StatCard>
        </StatsGrid>

        <FilterBar>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: Colors.textMuted }}>Período:</span>
          <select style={{ background: Colors.inputBg, color: 'white', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${Colors.border}`, outline: 'none' }}>
            <option>Últimos 30 dias</option>
            <option>Mês Atual</option>
            <option>Semana Atual</option>
            <option>Personalizado</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <MethodBadge style={{ cursor: 'pointer' }}>Todos os Meios</MethodBadge>
            <MethodBadge style={{ cursor: 'pointer', borderColor: Colors.primary, color: Colors.primary }}>Filtrar Entradas</MethodBadge>
          </div>
        </FilterBar>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Descrição / Origem</Th>
                <Th>Data</Th>
                <Th>Meio</Th>
                <Th>Status</Th>
                <Th>Valor</Th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map(t => (
                <tr key={t.id}>
                  <Td style={{ fontWeight: 600 }}>{t.descricao}</Td>
                  <Td style={{ color: Colors.textMuted }}>{t.data}</Td>
                  <Td><MethodBadge>{t.metodo}</MethodBadge></Td>
                  <Td><TransactionType isEntry={t.tipo === "Entrada"}>{t.tipo}</TransactionType></Td>
                  <Td style={{ fontWeight: 800, color: t.tipo === "Entrada" ? Colors.success : Colors.danger }}>
                    {t.tipo === "Saída" && "- "} 
                    {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <AnimatePresence>
          {showModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>Novo Lançamento</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Registre uma movimentação no caixa.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase' }}>Descrição</label>
                    <input style={{ background: Colors.inputBg, color: 'white', padding: '14px', borderRadius: '12px', border: `1px solid ${Colors.border}`, outline: 'none' }} placeholder="Ex: Pagamento de Aluguel" />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase' }}>Valor (R$)</label>
                      <input type="number" style={{ background: Colors.inputBg, color: 'white', padding: '14px', borderRadius: '12px', border: `1px solid ${Colors.border}`, outline: 'none' }} placeholder="0,00" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase' }}>Data</label>
                      <input type="date" style={{ background: Colors.inputBg, color: 'white', padding: '14px', borderRadius: '12px', border: `1px solid ${Colors.border}`, outline: 'none' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase' }}>Tipo</label>
                      <select style={{ background: Colors.inputBg, color: 'white', padding: '14px', borderRadius: '12px', border: `1px solid ${Colors.border}`, outline: 'none' }}>
                        <option>Entrada</option>
                        <option>Saída</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase' }}>Pagamento</label>
                      <select style={{ background: Colors.inputBg, color: 'white', padding: '14px', borderRadius: '12px', border: `1px solid ${Colors.border}`, outline: 'none' }}>
                        <option>Pix</option>
                        <option>Cartão de Crédito</option>
                        <option>Dinheiro</option>
                        <option>Boleto</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ background: Colors.primary, color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', marginTop: '12px', fontSize: '1rem' }}
                  >
                    Confirmar Lançamento
                  </button>
                </div>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Financeiro;