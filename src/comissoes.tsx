import React, { useState, useMemo } from 'react';
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: ${Colors.cardBg};
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${Colors.border};
  border-bottom: 4px solid ${props => props.color || Colors.border};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  
  h3 { font-size: 1.6rem; margin-top: 12px; color: ${Colors.textMain}; font-weight: 800; letter-spacing: -0.02em; }
  p { color: ${Colors.textMuted}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
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
  text-align: left;
`;

const Th = styled.th`
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  color: ${Colors.textMuted};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${Colors.border};
`;

const Td = styled.td`
  padding: 18px 20px;
  border-bottom: 1px solid ${Colors.border};
  font-size: 0.9rem;
  color: ${Colors.textMain};
`;

const StatusBadge = styled.span<{ paid: boolean }>`
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.paid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
  color: ${props => props.paid ? Colors.success : Colors.warning};
  border: 1px solid ${props => props.paid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'outline' }>`
  background: ${props => props.variant === 'outline' ? 'transparent' : Colors.primary};
  color: ${Colors.textMain};
  border: ${props => props.variant === 'outline' ? `1px solid ${Colors.border}` : 'none'};
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: ${props => props.variant === 'outline' ? Colors.inputBg : Colors.primaryHover}; }
  &:disabled { background: ${Colors.border}; color: ${Colors.textMuted}; cursor: not-allowed; }
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 550px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Comissoes: React.FC = () => {
  const [filterProf, setFilterProf] = useState('Todos');
  const [showReport, setShowReport] = useState(false);
  
  const [data, setData] = useState([
    { id: 1, profissional: "Bia Silva", cliente: "Ana Jardim", servico: "Corte + Coloração", bruto: 180.00, taxas: 5.40, comissaoPerc: 40, liquido: 69.84, data: "30/12/2025", pago: false },
    { id: 2, profissional: "Marco Vedo", cliente: "Lucas Ferreira", servico: "Barba Premium", bruto: 65.00, taxas: 1.95, comissaoPerc: 50, liquido: 31.52, data: "29/12/2025", pago: true },
    { id: 3, profissional: "Bia Silva", cliente: "Carla Souza", servico: "Mechas", bruto: 350.00, taxas: 10.50, comissaoPerc: 40, liquido: 135.80, data: "28/12/2025", pago: false },
    { id: 4, profissional: "Duda Ramos", cliente: "Beatriz Costa", servico: "Manicure", bruto: 45.00, taxas: 0.00, comissaoPerc: 60, liquido: 27.00, data: "28/12/2025", pago: true },
  ]);

  const stats = useMemo(() => {
    const pendente = data.filter(c => !c.pago).reduce((acc, curr) => acc + curr.liquido, 0);
    const pago = data.filter(c => c.pago).reduce((acc, curr) => acc + curr.liquido, 0);
    const taxas = data.reduce((acc, curr) => acc + curr.taxas, 0);
    return { pendente, pago, taxas };
  }, [data]);

  const handlePay = (id: number) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, pago: true } : item));
  };

  const filteredData = useMemo(() => {
    return filterProf === 'Todos' ? data : data.filter(c => c.profissional === filterProf);
  }, [filterProf, data]);

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Comissões 💸</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão de repasses e descontos operacionais</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
                onChange={(e) => setFilterProf(e.target.value)}
                style={{ background: Colors.inputBg, color: Colors.primary, padding: '12px', borderRadius: '12px', border: `1px solid ${Colors.border}`, fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
                <option value="Todos">Todos Profissionais</option>
                <option value="Bia Silva">Bia Silva</option>
                <option value="Marco Vedo">Marco Vedo</option>
                <option value="Duda Ramos">Duda Ramos</option>
            </select>
            <ActionButton variant="outline" onClick={() => setShowReport(true)}>Relatório Completo</ActionButton>
          </div>
        </Header>

        <StatsGrid>
          <StatCard color={Colors.warning}>
            <p>Pendentes</p>
            <h3>R$ {stats.pendente.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color={Colors.success}>
            <p>Total Pago (Mês)</p>
            <h3>R$ {stats.pago.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color={Colors.danger}>
            <p>Taxas Retidas</p>
            <h3>R$ {stats.taxas.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color={Colors.primary}>
            <p>Média de Ganhos</p>
            <h3>R$ 450/dia</h3>
          </StatCard>
        </StatsGrid>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Profissional</Th>
                <Th>Serviço / Cliente</Th>
                <Th>Bruto</Th>
                <Th>Taxas</Th>
                <Th>Líquido</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(c => (
                <tr key={c.id}>
                  <Td style={{ color: Colors.textMuted, fontWeight: 600 }}>{c.data}</Td>
                  <Td style={{ fontWeight: 700 }}>{c.profissional}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{c.servico}</div>
                    <div style={{ fontSize: '0.75rem', color: Colors.textMuted }}>Cli: {c.cliente}</div>
                  </Td>
                  <Td style={{ color: Colors.textMuted }}>R$ {c.bruto.toFixed(2)}</Td>
                  <Td style={{ color: Colors.danger, fontWeight: 600 }}>- R$ {c.taxas.toFixed(2)}</Td>
                  <Td style={{ fontWeight: 800, color: Colors.primary }}>R$ {c.liquido.toFixed(2)}</Td>
                  <Td><StatusBadge paid={c.pago}>{c.pago ? 'Efetuado' : 'Pendente'}</StatusBadge></Td>
                  <Td>
                    <ActionButton 
                      whileTap={{ scale: 0.95 }}
                      disabled={c.pago} 
                      onClick={() => handlePay(c.id)}
                    >
                      {c.pago ? 'Recibo' : 'Pagar'}
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <AnimatePresence>
          {showReport && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReport(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>Fechamento Consolidado</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Resumo de repasses por profissional.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {["Bia Silva", "Marco Vedo", "Duda Ramos"].map(name => {
                    const total = data.filter(d => d.profissional === name).reduce((a, b) => a + b.liquido, 0);
                    return (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: Colors.inputBg, borderRadius: '12px', border: `1px solid ${Colors.border}` }}>
                        <span style={{ fontWeight: 700 }}>{name}</span>
                        <span style={{ fontWeight: 800, color: Colors.primary }}>R$ {total.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
                <ActionButton style={{ width: '100%', marginTop: '24px', padding: '16px' }} onClick={() => setShowReport(false)}>Fechar Relatório</ActionButton>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Comissoes;