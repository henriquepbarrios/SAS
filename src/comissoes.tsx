import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

// --- GRID DE CARDS CONFORME A IMAGEM ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  border-bottom: 4px solid ${props => props.color || '#E2E8F0'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  
  h3 { font-size: 1.6rem; margin-top: 8px; color: #1E293B; font-weight: 800; }
  p { color: #64748B; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; }
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
  text-align: left;
`;

const Th = styled.th`
  padding: 20px;
  background: #F8FAFC;
  color: #64748B;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 20px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ paid: boolean }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.paid ? '#DCFCE7' : '#FEF3C7'};
  color: ${props => props.paid ? '#166534' : '#92400E'};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'outline' }>`
  background: ${props => props.variant === 'outline' ? '#FFF' : '#4F46E5'};
  color: ${props => props.variant === 'outline' ? '#475569' : '#FFF'};
  border: ${props => props.variant === 'outline' ? '1px solid #E2E8F0' : 'none'};
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { background: #CBD5E1; cursor: not-allowed; transform: none; }
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 550px;
`;

const Comissoes: React.FC = () => {
  const [filterProf, setFilterProf] = useState('Todos');
  const [showReport, setShowReport] = useState(false);
  
  // Dados simulados
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Comissões</h1>
            <p style={{ color: '#64748B' }}>Gestão de repasses e descontos operacionais</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
                onChange={(e) => setFilterProf(e.target.value)}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}
            >
                <option value="Todos">Todos Profissionais</option>
                <option value="Bia Silva">Bia Silva</option>
                <option value="Marco Vedo">Marco Vedo</option>
                <option value="Duda Ramos">Duda Ramos</option>
            </select>
            <ActionButton variant="outline" onClick={() => setShowReport(true)}>Relatório Completo</ActionButton>
          </div>
        </Header>

        {/* --- CARDS CONFORME A IMAGEM ENVIADA --- */}
        <StatsGrid>
          <StatCard color="#FFA500"> {/* Laranja */}
            <p>Comissões Pendentes</p>
            <h3>R$ {stats.pendente.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color="#10B981"> {/* Verde */}
            <p>Total Pago (Mês)</p>
            <h3>R$ {stats.pago.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color="#EF4444"> {/* Vermelho */}
            <p>Descontos (Taxas)</p>
            <h3>R$ {stats.taxas.toFixed(2)}</h3>
          </StatCard>
          
          <StatCard color="#4F46E5"> {/* Roxo/Azul */}
            <p>Produtividade Média</p>
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
                  <Td style={{ color: '#64748B', fontWeight: 600 }}>{c.data}</Td>
                  <Td style={{ fontWeight: 800 }}>{c.profissional}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{c.servico}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Cli: {c.cliente}</div>
                  </Td>
                  <Td>R$ {c.bruto.toFixed(2)}</Td>
                  <Td style={{ color: '#EF4444', fontWeight: 600 }}>- R$ {c.taxas.toFixed(2)}</Td>
                  <Td style={{ fontWeight: 800, color: '#4F46E5' }}>R$ {c.liquido.toFixed(2)}</Td>
                  <Td><StatusBadge paid={c.pago}>{c.pago ? 'Efetuado' : 'Pendente'}</StatusBadge></Td>
                  <Td>
                    <ActionButton 
                      disabled={c.pago} 
                      onClick={() => handlePay(c.id)}
                    >
                      {c.pago ? 'Recibo' : 'Pagar Agora'}
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        {/* --- MODAL DE RELATÓRIO --- */}
        <AnimatePresence>
          {showReport && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReport(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ y: 20 }} animate={{ y: 0 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>Fechamento Consolidado</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {["Bia Silva", "Marco Vedo", "Duda Ramos"].map(name => {
                    const total = data.filter(d => d.profissional === name).reduce((a, b) => a + b.liquido, 0);
                    return (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontWeight: 700 }}>{name}</span>
                        <span style={{ fontWeight: 800, color: '#4F46E5' }}>R$ {total.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
                <ActionButton style={{ width: '100%', marginTop: '24px' }} onClick={() => setShowReport(false)}>Fechar</ActionButton>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Comissoes;