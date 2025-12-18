import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  border-bottom: 4px solid ${props => props.color || '#E2E8F0'};
  
  h3 { font-size: 1.5rem; margin-top: 8px; color: #1E293B; }
  p { color: #64748B; font-size: 0.9rem; font-weight: 600; }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 18px 24px;
  background: #F8FAFC;
  color: #64748B;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 18px 24px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.95rem;
`;

const TransactionType = styled.span<{ isEntry: boolean }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.isEntry ? '#DCFCE7' : '#FEE2E2'};
  color: ${props => props.isEntry ? '#166534' : '#991B1B'};
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 24px;
  width: 100%; max-width: 450px;
`;

const Financeiro: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const transacoes = [
    { id: 1, descricao: "Consulta Particular - Ricardo", data: "18/12/2023", valor: "R$ 350,00", tipo: "Entrada" },
    { id: 2, descricao: "Aluguel Sala 204", data: "15/12/2023", valor: "R$ 2.100,00", tipo: "Saída" },
    { id: 3, descricao: "Repasse Convênio Unimed", data: "14/12/2023", valor: "R$ 1.850,00", tipo: "Entrada" },
    { id: 4, descricao: "Material de Escritório", data: "12/12/2023", valor: "R$ 120,00", tipo: "Saída" },
  ];

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Financeiro</h1>
            <p style={{ color: '#64748B' }}>Controle seu fluxo de caixa e faturamento mensal</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            + Novo Lançamento
          </button>
        </header>

        <StatsGrid>
          <StatCard color="#10B981">
            <p>Receitas (Mês)</p>
            <h3>R$ 14.250,00</h3>
          </StatCard>
          <StatCard color="#EF4444">
            <p>Despesas (Mês)</p>
            <h3>R$ 4.120,00</h3>
          </StatCard>
          <StatCard color="#4F46E5">
            <p>Saldo Líquido</p>
            <h3>R$ 10.130,00</h3>
          </StatCard>
        </StatsGrid>

        <h2 style={{ fontSize: '1.2rem', marginBottom: 20, fontWeight: 700 }}>Últimas Transações</h2>
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Descrição</Th>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map(t => (
                <tr key={t.id}>
                  <Td style={{ fontWeight: 600 }}>{t.descricao}</Td>
                  <Td color="#64748B">{t.data}</Td>
                  <Td><TransactionType isEntry={t.tipo === "Entrada"}>{t.tipo}</TransactionType></Td>
                  <Td style={{ fontWeight: 700, color: t.tipo === "Entrada" ? '#10B981' : '#EF4444' }}>{t.valor}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <AnimatePresence>
          {showModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                <h2 style={{ marginBottom: '24px' }}>Novo Lançamento</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Descrição</label>
                    <input style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} placeholder="Ex: Pagamento Internet" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Valor</label>
                      <input style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} placeholder="R$ 0,00" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tipo</label>
                      <select style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <option>Entrada</option>
                        <option>Saída</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', marginTop: '12px' }}
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