import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
  
  .react-calendar {
    border: none;
    border-radius: 20px;
    padding: 10px;
    width: 100% !important;
  }
  .react-calendar__tile--active {
    background: #4F46E5 !important;
    border-radius: 12px;
  }
`;

// --- Estilos do Modal ---
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: white;
  padding: 32px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label { font-size: 0.9rem; font-weight: 600; color: #64748B; }
  input, select {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    font-size: 1rem;
    outline: none;
    &:focus { border-color: #4F46E5; }
  }
`;

// --- Estilos da Página (Layout igual ao anterior) ---
const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;
const AgendaLayout = styled.div` display: grid; grid-template-columns: 320px 1fr; gap: 32px; `;
const Card = styled.div` background: #FFF; padding: 20px; border-radius: 20px; border: 1px solid #E2E8F0; `;

const Agenda: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);

  // Estados da Configuração
  const [config, setConfig] = useState({
    inicio: "08:00",
    fim: "18:00",
    intervalo: "30",
    almoçoInicio: "12:00",
    almoçoFim: "13:00"
  });

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Agenda</h1>
            <p style={{ color: '#64748B' }}>{date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowConfig(true)}
              style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '12px 20px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              ⚙️ Configurar
            </button>
            <button style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Novo Agendamento
            </button>
          </div>
        </header>

        <AgendaLayout>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card><Calendar onChange={(val) => setDate(val as Date)} value={date} locale="pt-BR" /></Card>
          </div>
          
          <Card style={{ minHeight: '500px' }}>
            <p style={{ color: '#94A3B8', textAlign: 'center', marginTop: '40px' }}>
              Agenda configurada das {config.inicio} às {config.fim} (Intervalos de {config.intervalo} min)
            </p>
          </Card>
        </AgendaLayout>

        {/* --- MODAL DE CONFIGURAÇÃO --- */}
        <AnimatePresence>
          {showConfig && (
            <Overlay 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfig(false)}
            >
              <ModalCard 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              >
                <h2 style={{ marginBottom: '24px' }}>Configurações da Agenda</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Início do Expediente</label>
                    <input type="time" value={config.inicio} onChange={e => setConfig({...config, inicio: e.target.value})} />
                  </FormGroup>
                  <FormGroup>
                    <label>Fim do Expediente</label>
                    <input type="time" value={config.fim} onChange={e => setConfig({...config, fim: e.target.value})} />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Tempo de cada atendimento (minutos)</label>
                  <select value={config.intervalo} onChange={e => setConfig({...config, intervalo: e.target.value})}>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                </FormGroup>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: '#475569' }}>Bloqueio de Almoço</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input type="time" value={config.almoçoInicio} onChange={e => setConfig({...config, almoçoInicio: e.target.value})} />
                    <input type="time" value={config.almoçoFim} onChange={e => setConfig({...config, almoçoFim: e.target.value})} />
                  </div>
                </div>

                <button 
                  onClick={() => setShowConfig(false)}
                  style={{ width: '100%', background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Salvar Configurações
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Agenda;