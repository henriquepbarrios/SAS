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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  border-bottom: 4px solid ${props => props.color || '#E2E8F0'};
  
  h3 { font-size: 1.4rem; margin-top: 8px; color: #1E293B; font-weight: 800; }
  p { color: #64748B; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
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
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 18px 24px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.9rem;
`;

const MethodBadge = styled.span`
  background: #F1F5F9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
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
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 24px;
  width: 100%; max-width: 500px;
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Financeiro 💰</h1>
            <p style={{ color: '#64748B' }}>Gestão de fluxo de caixa e faturamento</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '12px 20px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}>Exportar PDF</button>
             <button 
                onClick={() => setShowModal(true)}
                style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                + Novo Lançamento
              </button>
          </div>
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
            <p>Saldo em Caixa</p>
            <h3>R$ 10.130,00</h3>
          </StatCard>
          <StatCard color="#F59E0B">
            <p>A Receber (Agenda)</p>
            <h3>R$ 2.450,00</h3>
          </StatCard>
        </StatsGrid>

        <FilterBar>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Período:</span>
          <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}>
            <option>Últimos 30 dias</option>
            <option>Mês Atual</option>
            <option>Semana Atual</option>
            <option>Personalizado</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <MethodBadge>Todos os Meios</MethodBadge>
            <MethodBadge>Filtrar Entradas</MethodBadge>
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
                  <Td style={{ color: '#64748B' }}>{t.data}</Td>
                  <Td><MethodBadge>{t.metodo}</MethodBadge></Td>
                  <Td><TransactionType isEntry={t.tipo === "Entrada"}>{t.tipo}</TransactionType></Td>
                  <Td style={{ fontWeight: 700, color: t.tipo === "Entrada" ? '#10B981' : '#EF4444' }}>
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>Novo Lançamento</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Descrição</label>
                    <input style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} placeholder="Ex: Fornecedor de Toalhas" />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Valor (R$)</label>
                      <input type="number" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} placeholder="0,00" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Data</label>
                      <input type="date" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tipo</label>
                      <select style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <option>Entrada</option>
                        <option>Saída</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Meio de Pagamento</label>
                      <select style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <option>Pix</option>
                        <option>Cartão de Crédito</option>
                        <option>Cartão de Débito</option>
                        <option>Dinheiro</option>
                        <option>Boleto</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', marginTop: '12px', fontSize: '1rem' }}
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