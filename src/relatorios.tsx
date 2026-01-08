import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion } from 'framer-motion';

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
  warning: '#F59E0B',
  insightBg: 'rgba(0, 70, 255, 0.1)',
  insightText: '#82AAFF'
};

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: ${Colors.bgDark}; 
    font-family: 'Inter', sans-serif; 
    color: ${Colors.textMain}; 
    -webkit-font-smoothing: antialiased;
  }
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
  background: ${Colors.cardBg};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ChartPlaceholder = styled.div<{ height?: string }>`
  width: 100%;
  height: ${props => props.height || '200px'};
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  margin-top: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 20px;
  border: 1px dashed ${Colors.border};
`;

const Bar = styled(motion.div)<{ $height: string; $color: string }>`
  width: 30px;
  background: ${props => props.$color};
  border-radius: 6px 6px 0 0;
  position: relative;
  box-shadow: 0 4px 15px ${props => props.$color}44;
  
  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 700;
    color: ${Colors.textMuted};
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid ${Colors.border};
  &:last-child { border: none; }
  span { color: ${Colors.textMuted}; font-size: 0.9rem; font-weight: 600; }
  strong { color: ${Colors.textMain}; font-weight: 700; }
`;

const Badge = styled.span<{ type: 'up' | 'down' }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${props => props.type === 'up' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.type === 'up' ? Colors.success : Colors.danger};
  margin-left: 8px;
  border: 1px solid ${props => props.type === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const Select = styled.select`
  padding: 12px 20px;
  border-radius: 14px;
  border: 1px solid ${Colors.border};
  font-weight: 700;
  cursor: pointer;
  background: ${Colors.cardBg};
  color: ${Colors.textMain};
  outline: none;
  &:focus { border-color: ${Colors.primary}; }
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Inteligência de Negócio 📈</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Análise de performance e lucratividade</p>
          </div>
          <Select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option>Últimos 7 dias</option>
            <option>Este Mês</option>
            <option>Último Trimestre</option>
            <option>Ano Completo</option>
          </Select>
        </Header>

        <Grid cols={2}>
          <ReportCard>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faturamento Bruto</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
                {money.format(42850.00)} <Badge type="up">↑ 12%</Badge>
              </h2>
            </div>
            
            <ChartPlaceholder height="250px">
              <Bar initial={{ height: 0 }} animate={{ height: '40%' }} $height="40%" $color={Colors.primary} data-label="Sem 1" />
              <Bar initial={{ height: 0 }} animate={{ height: '65%' }} $height="65%" $color={Colors.primary} data-label="Sem 2" />
              <Bar initial={{ height: 0 }} animate={{ height: '85%' }} $height="85%" $color={Colors.primary} data-label="Sem 3" />
              <Bar initial={{ height: 0 }} animate={{ height: '55%' }} $height="55%" $color={Colors.primary} data-label="Sem 4" />
            </ChartPlaceholder>
          </ReportCard>

          <ReportCard>
            <h3 style={{ marginBottom: '20px', fontWeight: 800, fontSize: '1.2rem' }}>Distribuição de Receita</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <StatRow><span>Serviços de Cabelo</span><strong>{money.format(24500.00)} (57%)</strong></StatRow>
              <StatRow><span>Venda de Produtos</span><strong>{money.format(8120.00)} (19%)</strong></StatRow>
              <StatRow><span>Barbearia</span><strong>{money.format(6400.00)} (15%)</strong></StatRow>
              <StatRow><span>Estética / Manicure</span><strong>{money.format(3830.00)} (9%)</strong></StatRow>
            </div>
            
            <div style={{ marginTop: '30px', padding: '24px', background: Colors.insightBg, borderRadius: '20px', border: `1px solid ${Colors.primary}33` }}>
              <p style={{ color: Colors.insightText, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insight do Sistema 💡</p>
              <p style={{ fontSize: '0.9rem', color: Colors.textMain, marginTop: '8px', lineHeight: '1.5', opacity: 0.9 }}>
                Suas vendas de produtos aumentaram 15% após o novo PDV. Tente combos de serviços para alavancar a estética.
              </p>
            </div>
          </ReportCard>
        </Grid>

        <Grid cols={3}>
          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: Colors.textMuted, textTransform: 'uppercase' }}>Top Profissionais</h3>
            <StatRow><span>Bia Silva</span><strong>{money.format(12400)}</strong></StatRow>
            <StatRow><span>Marco Vedo</span><strong>{money.format(9800)}</strong></StatRow>
            <StatRow><span>Duda Ramos</span><strong>{money.format(5200)}</strong></StatRow>
          </ReportCard>

          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: Colors.textMuted, textTransform: 'uppercase' }}>Taxa de Retenção</h3>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h2 style={{ fontSize: '3rem', color: Colors.success, fontWeight: 900 }}>74%</h2>
              <p style={{ color: Colors.textMuted, fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>Clientes que retornaram</p>
            </div>
            <div style={{ height: '10px', background: Colors.inputBg, borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} transition={{ duration: 1 }} style={{ height: '100%', background: Colors.success, boxShadow: `0 0 15px ${Colors.success}66` }} />
            </div>
          </ReportCard>

          <ReportCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: Colors.textMuted, textTransform: 'uppercase' }}>Estoque Crítico</h3>
            <StatRow><span style={{ color: Colors.danger }}>Shampoo 1L</span><strong style={{ color: Colors.danger }}>2 un.</strong></StatRow>
            <StatRow><span style={{ color: Colors.warning }}>Tinta 9.1</span><strong style={{ color: Colors.warning }}>3 un.</strong></StatRow>
            <StatRow><span>Cera Matte</span><strong>24 un.</strong></StatRow>
          </ReportCard>
        </Grid>

        <ReportCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Evolução de Faturamento Anual</h3>
            <button style={{ background: Colors.inputBg, border: `1px solid ${Colors.border}`, padding: '8px 16px', borderRadius: '10px', fontWeight: 700, color: Colors.textMuted, fontSize: '0.8rem' }}>EXPORTAR PDF</button>
          </div>
          <ChartPlaceholder height="150px">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((mes, i) => (
                  <Bar 
                    key={mes}
                    initial={{ height: 0 }} 
                    animate={{ height: `${[30, 45, 40, 60, 75, 90][i]}%` }} 
                    $height="0%" 
                    $color={i === 5 ? Colors.primary : Colors.border} 
                    data-label={mes} 
                  />
              ))}
          </ChartPlaceholder>
        </ReportCard>
      </MainContent>
    </Container>
  );
};

export default Relatorios;