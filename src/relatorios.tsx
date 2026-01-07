import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

// --- Styled Components ---
const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Grid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 3}, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const ReportCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const ChartPlaceholder = styled.div<{ height?: string }>`
  width: 100%;
  height: ${props => props.height || '200px'};
  background: #F8FAFC;
  border-radius: 16px;
  margin-top: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 20px;
  border: 1px dashed #E2E8F0;
`;

// Correção: Usando Transient Props ($) para evitar erro TS2769
const Bar = styled(motion.div)<{ $height: string; $color: string }>`
  width: 30px;
  background: ${props => props.$color};
  border-radius: 6px 6px 0 0;
  position: relative;
  
  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 700;
    color: #94A3B8;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  &:last-child { border: none; }
  span { color: #64748B; font-size: 0.9rem; font-weight: 600; }
  strong { color: #1E293B; font-weight: 700; }
`;

const Badge = styled.span<{ type: 'up' | 'down' }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.type === 'up' ? '#DCFCE7' : '#FEE2E2'};
  color: ${props => props.type === 'up' ? '#166534' : '#991B1B'};
  margin-left: 8px;
`;

const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState('Este Mês');

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Inteligência de Negócio 📈</h1>
            <p style={{ color: '#64748B' }}>Análise de performance, retenção e lucratividade</p>
          </div>
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', background: 'white' }}
          >
            <option>Últimos 7 dias</option>
            <option>Este Mês</option>
            <option>Último Trimestre</option>
            <option>Ano Completo</option>
          </select>
        </Header>

        <Grid cols={2}>
          <ReportCard>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Faturamento Bruto</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>R$ 42.850,00 <Badge type="up">↑ 12%</Badge></h2>
            </div>
            
            <ChartPlaceholder height="250px">
              <Bar initial={{ height: 0 }} animate={{ height: '40%' }} $height="40%" $color="#4F46E5" data-label="Sem 1" />
              <Bar initial={{ height: 0 }} animate={{ height: '65%' }} $height="65%" $color="#4F46E5" data-label="Sem 2" />
              <Bar initial={{ height: 0 }} animate={{ height: '85%' }} $height="85%" $color="#4F46E5" data-label="Sem 3" />
              <Bar initial={{ height: 0 }} animate={{ height: '55%' }} $height="55%" $color="#4F46E5" data-label="Sem 4" />
            </ChartPlaceholder>
          </ReportCard>

          <ReportCard>
            <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>Distribuição de Receita</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <StatRow><span>Serviços de Cabelo</span><strong>R$ 24.500,00 (57%)</strong></StatRow>
              <StatRow><span>Venda de Produtos (PDV)</span><strong>R$ 8.120,00 (19%)</strong></StatRow>
              <StatRow><span>Barbearia</span><strong>R$ 6.400,00 (15%)</strong></StatRow>
              <StatRow><span>Estética / Manicure</span><strong>R$ 3.830,00 (9%)</strong></StatRow>
            </div>
            <div style={{ marginTop: '30px', padding: '20px', background: '#EEF2FF', borderRadius: '16px' }}>
              <p style={{ color: '#4F46E5', fontSize: '0.85rem', fontWeight: 800 }}>Insight do Sistema 💡</p>
              <p style={{ fontSize: '0.85rem', color: '#312E81', marginTop: '4px', lineHeight: '1.4' }}>
                Suas vendas de produtos aumentaram 15% após o novo PDV. Tente combos de serviços.
              </p>
            </div>
          </ReportCard>
        </Grid>

        <Grid cols={3}>
          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Top Profissionais</h3>
            <StatRow><span>Bia Silva</span><strong>R$ 12.400</strong></StatRow>
            <StatRow><span>Marco Vedo</span><strong>R$ 9.800</strong></StatRow>
            <StatRow><span>Duda Ramos</span><strong>R$ 5.200</strong></StatRow>
          </ReportCard>

          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Retenção</h3>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#10B981' }}>74%</h2>
              <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>Clientes que retornaram</p>
            </div>
            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} style={{ height: '100%', background: '#10B981' }} />
            </div>
          </ReportCard>

          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Estoque Crítico</h3>
            <StatRow><span style={{ color: '#EF4444' }}>Shampoo 1L</span><strong style={{ color: '#EF4444' }}>2 un.</strong></StatRow>
            <StatRow><span style={{ color: '#F59E0B' }}>Tinta 9.1</span><strong style={{ color: '#F59E0B' }}>3 un.</strong></StatRow>
            <StatRow><span>Cera Matte</span><strong>24 un.</strong></StatRow>
          </ReportCard>
        </Grid>

        <ReportCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 800 }}>Histórico Anual</h3>
            <button style={{ background: '#F1F5F9', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, color: '#475569' }}>PDF</button>
          </div>
          <ChartPlaceholder height="150px">
              <Bar initial={{ height: 0 }} animate={{ height: '30%' }} $height="30%" $color="#CBD5E1" data-label="Jan" />
              <Bar initial={{ height: 0 }} animate={{ height: '45%' }} $height="45%" $color="#CBD5E1" data-label="Fev" />
              <Bar initial={{ height: 0 }} animate={{ height: '40%' }} $height="40%" $color="#CBD5E1" data-label="Mar" />
              <Bar initial={{ height: 0 }} animate={{ height: '60%' }} $height="60%" $color="#CBD5E1" data-label="Abr" />
              <Bar initial={{ height: 0 }} animate={{ height: '75%' }} $height="75%" $color="#CBD5E1" data-label="Mai" />
              <Bar initial={{ height: 0 }} animate={{ height: '90%' }} $height="90%" $color="#4F46E5" data-label="Jun" />
          </ChartPlaceholder>
        </ReportCard>
      </MainContent>
    </Container>
  );
};

export default Relatorios;