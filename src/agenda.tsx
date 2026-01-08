import { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';

// --- Variáveis de Design ---
const Colors = {
  primary: '#0046FF',
  bgDark: '#0B0D10',
  cardBg: '#16191E',
  inputBg: '#1E2229',
  textMain: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#2D343F',
  gridLines: 'rgba(45, 52, 63, 0.5)',
};

const HOUR_HEIGHT = 100;
const COLUMN_WIDTH = 250;

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: ${Colors.bgDark}; 
    font-family: 'Inter', sans-serif; 
    color: ${Colors.textMain}; 
  }

  /* Estilização Dark do Calendário */
  .react-calendar { 
    background: ${Colors.cardBg} !important; 
    border: 1px solid ${Colors.border} !important; 
    border-radius: 20px; 
    padding: 10px; 
    width: 100% !important; 
    color: white !important;
  }
  .react-calendar__tile { color: white !important; }
  .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: ${Colors.inputBg} !important; border-radius: 8px; }
  .react-calendar__tile--active { background: ${Colors.primary} !important; border-radius: 8px !important; }
  .react-calendar__navigation button { color: white !important; font-size: 1.2rem; }
  .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; color: ${Colors.textMuted}; }

  .agenda-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
  .agenda-scroll::-webkit-scrollbar-thumb { background: ${Colors.border}; border-radius: 10px; }
`;

// --- Styled Components ---
const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;
const AgendaLayout = styled.div` display: grid; grid-template-columns: 320px 1fr; gap: 24px; `;

const Card = styled.div` 
  background: ${Colors.cardBg}; 
  padding: 20px; 
  border-radius: 20px; 
  border: 1px solid ${Colors.border}; 
`;

const GridWrapper = styled.div`
  background: ${Colors.cardBg}; border-radius: 24px; border: 1px solid ${Colors.border};
  overflow: hidden; display: flex; flex-direction: column;
  height: calc(100vh - 200px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ScrollableArea = styled.div` overflow: auto; position: relative; flex: 1; background: ${Colors.bgDark}; `;

const GridHeader = styled.div`
  display: flex; position: sticky; top: 0; background: ${Colors.cardBg}; z-index: 40;
  border-bottom: 1px solid ${Colors.border}; padding-left: 80px;
`;

const ProfHeader = styled.div`
  flex: 1; min-width: ${COLUMN_WIDTH}px; padding: 16px; text-align: center;
  border-right: 1px solid ${Colors.border}; display: flex; flex-direction: column; align-items: center; gap: 8px;
`;

const TimeColumn = styled.div` 
  width: 80px; position: sticky; left: 0; background: ${Colors.cardBg}; z-index: 35; border-right: 1px solid ${Colors.border}; 
`;

const TimeSlotLabel = styled.div<{ $height: number }>`
  height: ${props => props.$height}px; display: flex; align-items: flex-start;
  justify-content: center; font-size: 0.75rem; font-weight: 600; padding-top: 10px;
  color: ${Colors.textMuted}; border-bottom: 1px solid ${Colors.gridLines};
`;

const ProfColumn = styled.div<{ $slotHeight: number }>`
  flex: 1; min-width: ${COLUMN_WIDTH}px; position: relative;
  border-right: 1px solid ${Colors.border};
  background-image: linear-gradient(${Colors.gridLines} 1px, transparent 1px);
  background-size: 100% ${props => props.$slotHeight}px;
`;

const LunchBlock = styled.div<{ $top: number; $height: number }>`
  position: absolute; top: ${props => props.$top}px; height: ${props => props.$height}px;
  left: 0; right: 0; background: rgba(30, 34, 41, 0.6); 
  border-top: 1px dashed ${Colors.border}; border-bottom: 1px dashed ${Colors.border};
  z-index: 5; display: flex; align-items: center; justify-content: center;
  color: ${Colors.textMuted}; font-size: 0.65rem; font-weight: 800; letter-spacing: 2px;
`;

const AppointmentBlock = styled(motion.div)<{ $top: number; $height: number; $color: string }>`
  position: absolute; top: ${props => props.$top + 4}px; height: ${props => props.$height - 8}px;
  left: 8px; right: 8px; background: ${props => props.$color}; border-radius: 12px;
  padding: 12px; color: white; font-size: 0.8rem; z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-left: 4px solid rgba(255,255,255,0.3);
  display: flex; flex-direction: column; justify-content: center;
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 24px;
  width: 95%; max-width: 600px; border: 1px solid ${Colors.border};
`;

const FormField = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 11px; font-weight: 700; color: ${Colors.textMuted}; margin-bottom: 8px; text-transform: uppercase; }
  input, select { 
    width: 100%; padding: 14px; border-radius: 10px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white; font-family: inherit; outline: none;
    &:focus { border-color: ${Colors.primary}; }
  }
`;

const PrimaryButton = styled.button`
  width: 100%; background: ${Colors.primary}; color: white; padding: 16px; 
  border-radius: 12px; border: none; font-weight: 700; cursor: pointer;
  transition: background 0.2s; &:hover { background: #0036C7; }
`;

// --- Interfaces ---
interface Profissional { id: number; nome: string; iniciais: string; color: string; inicio: string; fim: string; pausaIni: string; pausaFim: string; }
interface Agendamento { id: number; profId: number; cliente: string; servico: string; hora: string; duracao: number; color: string; }

const Agenda = () => {
  const [date, setDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [gridSettings] = useState({ horaInicioGeral: "07:00", horaFimGeral: "22:00", intervaloMinutos: 30 });

  const [profissionais] = useState<Profissional[]>([
    { id: 1, nome: 'Bia Silva', iniciais: 'BS', color: '#0046FF', inicio: "08:00", fim: "18:00", pausaIni: "12:00", pausaFim: "13:00" },
    { id: 2, nome: 'Marco Vedo', iniciais: 'MV', color: '#EC4899', inicio: "09:00", fim: "19:00", pausaIni: "13:00", pausaFim: "14:00" },
    { id: 3, nome: 'Duda Ramos', iniciais: 'DR', color: '#8B5CF6', inicio: "10:00", fim: "20:00", pausaIni: "14:00", pausaFim: "15:00" },
  ]);

  const [agendamentos] = useState<Agendamento[]>([
    { id: 1, profId: 1, cliente: 'Juliana P.', servico: 'Corte', hora: '09:00', duracao: 60, color: '#0046FF' },
    { id: 2, profId: 2, cliente: 'Ricardo M.', servico: 'Barba', hora: '10:30', duracao: 30, color: '#EC4899' },
  ]);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    let cur = new Date(`2025-01-01T${gridSettings.horaInicioGeral}`);
    const end = new Date(`2025-01-01T${gridSettings.horaFimGeral}`);
    while (cur <= end) {
      slots.push(cur.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      cur.setMinutes(cur.getMinutes() + gridSettings.intervaloMinutos);
    }
    return slots;
  }, [gridSettings]);

  const slotH = (gridSettings.intervaloMinutos / 60) * HOUR_HEIGHT;
  const getPos = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const [sh, sm] = gridSettings.horaInicioGeral.split(':').map(Number);
    return (((h * 60 + m) - (sh * 60 + sm)) / 60) * HOUR_HEIGHT;
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Agenda Online 📅</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão de horários e profissionais</p>
          </div>
          <PrimaryButton style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setShowAddModal(true)}>
            + Novo Agendamento
          </PrimaryButton>
        </header>

        <AgendaLayout>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card><Calendar onChange={(val) => setDate(val as Date)} value={date} locale="pt-BR" /></Card>
            <Card>
                <h4 style={{ fontSize: '0.8rem', color: Colors.textMuted, marginBottom: 15, textTransform: 'uppercase' }}>Equipe hoje</h4>
                {profissionais.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.nome}</span>
                    </div>
                ))}
            </Card>
          </div>

          <GridWrapper>
            <ScrollableArea className="agenda-scroll">
              <div style={{ minWidth: profissionais.length * COLUMN_WIDTH + 80 }}>
                <GridHeader>
                  {profissionais.map(p => (
                    <ProfHeader key={p.id}>
                      <div style={{ width: 36, height: 36, background: p.color, borderRadius: 10, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{p.iniciais}</div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.nome}</span>
                    </ProfHeader>
                  ))}
                </GridHeader>
                <div style={{ display: 'flex' }}>
                  <TimeColumn>
                    {timeSlots.map(s => <TimeSlotLabel key={s} $height={slotH}>{s}</TimeSlotLabel>)}
                  </TimeColumn>
                  {profissionais.map(p => (
                    <ProfColumn key={p.id} $slotHeight={slotH}>
                      <LunchBlock $top={getPos(p.pausaIni)} $height={getPos(p.pausaFim) - getPos(p.pausaIni)}>ALMOÇO</LunchBlock>
                      {agendamentos.filter(a => a.profId === p.id).map(a => (
                        <AppointmentBlock 
                            key={a.id} 
                            $top={getPos(a.hora)} 
                            $height={(a.duracao/60)*HOUR_HEIGHT} 
                            $color={a.color}
                            whileHover={{ scale: 1.02, zIndex: 20 }}
                        >
                          <strong style={{ fontSize: '0.85rem' }}>{a.cliente}</strong>
                          <span>{a.servico}</span>
                        </AppointmentBlock>
                      ))}
                    </ProfColumn>
                  ))}
                </div>
              </div>
            </ScrollableArea>
          </GridWrapper>
        </AgendaLayout>

        <AnimatePresence>
          {showAddModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: 24 }}>Novo Agendamento</h2>
                <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
                  <FormField><label>Cliente</label><input type="text" placeholder="Nome completo" required /></FormField>
                  <FormField><label>Serviço</label><input type="text" placeholder="Ex: Corte de Cabelo" required /></FormField>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <FormField><label>Hora</label><input type="time" required /></FormField>
                    <FormField><label>Duração</label>
                      <select><option>30 min</option><option>1 hora</option></select>
                    </FormField>
                  </div>
                  <PrimaryButton type="submit" style={{ marginTop: 10 }}>Confirmar Agendamento</PrimaryButton>
                </form>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Agenda;