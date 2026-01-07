import { useState, useMemo, type FormEvent} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces de Tipagem ---
interface Profissional {
  id: number;
  nome: string;
  iniciais: string;
  color: string;
  inicio: string;
  fim: string;
  pausaIni: string;
  pausaFim: string;
}

interface Agendamento {
  id: number;
  profId: number;
  cliente: string;
  servico: string;
  hora: string;
  duracao: number;
  color: string;
}

// --- Design e Estilos Globais ---
const HOUR_HEIGHT = 100; 
const COLUMN_WIDTH = 250;

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
  .react-calendar { border: none; border-radius: 20px; padding: 10px; width: 100% !important; }
  .react-calendar__tile--active { background: #4F46E5 !important; border-radius: 12px; }
  .agenda-scroll::-webkit-scrollbar { height: 10px; width: 8px; }
  .agenda-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
`;

// --- Styled Components ---
const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;
const AgendaLayout = styled.div` display: grid; grid-template-columns: 300px 1fr; gap: 24px; `;
const Card = styled.div` background: #FFF; padding: 20px; border-radius: 20px; border: 1px solid #E2E8F0; `;

const GridWrapper = styled.div`
  background: white; border-radius: 24px; border: 1px solid #E2E8F0;
  overflow: hidden; display: flex; flex-direction: column;
  height: calc(100vh - 200px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const ScrollableArea = styled.div` overflow: auto; position: relative; flex: 1; `;
const GridContent = styled.div<{ $totalProfs: number }>` display: flex; flex-direction: column; min-width: ${props => props.$totalProfs * COLUMN_WIDTH}px; `;

const GridHeader = styled.div`
  display: flex; position: sticky; top: 0; background: white; z-index: 40;
  border-bottom: 2px solid #F1F5F9; padding-left: 80px;
`;

const ProfHeader = styled.div`
  flex: 1; width: ${COLUMN_WIDTH}px; padding: 20px; text-align: center;
  border-right: 1px solid #F1F5F9; display: flex; flex-direction: column; align-items: center; gap: 8px;
`;

const TimeColumn = styled.div` width: 80px; position: sticky; left: 0; background: #FDFDFD; z-index: 30; border-right: 2px solid #F1F5F9; `;

const TimeSlotLabel = styled.div<{ $height: number }>`
  height: ${props => props.$height}px; display: flex; align-items: center;
  justify-content: center; font-size: 0.75rem; font-weight: 700;
  color: #94A3B8; border-bottom: 1px solid #F8FAFC;
`;

const ProfColumn = styled.div<{ $slotHeight: number }>`
  flex: 1; width: ${COLUMN_WIDTH}px; position: relative;
  border-right: 1px solid #F1F5F9;
  background-image: linear-gradient(#F1F5F9 1px, transparent 1px);
  background-size: 100% ${props => props.$slotHeight}px;
`;

const UnavailableBlock = styled.div<{ $top: number; $height: number }>`
  position: absolute; top: ${props => props.$top}px; height: ${props => props.$height}px;
  left: 0; right: 0; background: #f1f5f9; opacity: 0.5; z-index: 2;
`;

const LunchBlock = styled.div<{ $top: number; $height: number }>`
  position: absolute; top: ${props => props.$top}px; height: ${props => props.$height}px;
  left: 0; right: 0; background: #F1F5F9; border-top: 1px dashed #CBD5E1; border-bottom: 1px dashed #CBD5E1;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(203, 213, 225, 0.2) 10px, rgba(203, 213, 225, 0.2) 20px);
  z-index: 5; display: flex; align-items: center; justify-content: center;
  color: #94A3B8; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
`;

const AppointmentBlock = styled.div<{ $top: number; $height: number; $color: string }>`
  position: absolute; top: ${props => props.$top + 4}px; height: ${props => props.$height - 8}px;
  left: 8px; right: 8px; background: ${props => props.$color}; border-radius: 12px;
  padding: 12px; color: white; font-size: 0.8rem; z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-left: 5px solid rgba(0,0,0,0.2);
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 24px;
  width: 95%; max-width: 650px; max-height: 90vh; overflow-y: auto;
`;

const FormField = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 12px; font-weight: 700; color: #64748B; margin-bottom: 6px; }
  input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #E2E8F0; font-family: inherit; }
`;

// --- Componente Principal ---
const Agenda = () => {
  const [date, setDate] = useState(new Date());
  const [showConfig, setShowConfig] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Configurações Gerais da Grade
  const [gridSettings, setGridSettings] = useState({
    horaInicioGeral: "07:00",
    horaFimGeral: "22:00",
    intervaloMinutos: 30,
  });

  // Configurações Individuais dos Profissionais
  const [profissionais, setProfissionais] = useState<Profissional[]>([
    { id: 1, nome: 'Bia Silva', iniciais: 'BS', color: '#4F46E5', inicio: "08:00", fim: "18:00", pausaIni: "12:00", pausaFim: "13:00" },
    { id: 2, nome: 'Marco Vedo', iniciais: 'MV', color: '#10B981', inicio: "09:00", fim: "19:00", pausaIni: "13:00", pausaFim: "14:00" },
    { id: 3, nome: 'Duda Ramos', iniciais: 'DR', color: '#EC4899', inicio: "10:00", fim: "20:00", pausaIni: "14:00", pausaFim: "15:00" },
  ]);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    { id: 1, profId: 1, cliente: 'Juliana P.', servico: 'Corte', hora: '09:00', duracao: 60, color: '#4F46E5' },
  ]);

  const [newAppt, setNewAppt] = useState({ cliente: '', servico: '', profId: 1, hora: '09:00', duracao: 60 });

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

  const handleAddAppointment = (e: FormEvent) => {
    e.preventDefault();
    const prof = profissionais.find(p => p.id === Number(newAppt.profId));
    
    if (!prof) return;

    setAgendamentos([...agendamentos, { 
      ...newAppt, 
      id: Date.now(), 
      profId: Number(newAppt.profId), 
      color: prof.color 
    }]);
    
    setShowAddModal(false);
    setNewAppt({ cliente: '', servico: '', profId: 1, hora: '09:00', duracao: 60 });
  };

  const updateProf = (index: number, field: keyof Profissional, value: string) => {
    const newProfs = [...profissionais];
    (newProfs[index] as any)[field] = value;
    setProfissionais(newProfs);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Agenda Diária</h1>
            <p style={{ color: '#64748B' }}>Unidade Matriz • Gestão Completa</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowConfig(true)} style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '12px 20px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}>Configurar Agenda</button>
            <button onClick={() => setShowAddModal(true)} style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>+ Novo Agendamento</button>
          </div>
        </header>

        <AgendaLayout>
          <Card><Calendar onChange={(val) => setDate(val as Date)} value={date} locale="pt-BR" /></Card>
          <GridWrapper>
            <ScrollableArea className="agenda-scroll">
              <GridContent $totalProfs={profissionais.length}>
                <GridHeader>
                  {profissionais.map(p => (
                    <ProfHeader key={p.id}>
                      <div style={{ width: 35, height: 35, background: p.color, borderRadius: 10, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{p.iniciais}</div>
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
                      <UnavailableBlock $top={0} $height={getPos(p.inicio)} />
                      <UnavailableBlock $top={getPos(p.fim)} $height={getPos(gridSettings.horaFimGeral) - getPos(p.fim)} />
                      <LunchBlock $top={getPos(p.pausaIni)} $height={getPos(p.pausaFim) - getPos(p.pausaIni)}>ALMOÇO</LunchBlock>
                      {agendamentos.filter(a => a.profId === p.id).map(a => (
                        <AppointmentBlock key={a.id} $top={getPos(a.hora)} $height={(a.duracao/60)*HOUR_HEIGHT} $color={a.color}>
                          <strong>{a.cliente}</strong><br/><small>{a.servico}</small>
                        </AppointmentBlock>
                      ))}
                    </ProfColumn>
                  ))}
                </div>
              </GridContent>
            </ScrollableArea>
          </GridWrapper>
        </AgendaLayout>

        {/* --- MODAL DE CONFIGURAÇÃO --- */}
        <AnimatePresence>
          {showConfig && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfig(false)}>
              <ModalCard onClick={e => e.stopPropagation()}>
                <h2 style={{ marginBottom: 20 }}>Configurações de Horários</h2>
                <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
                  <FormField><label>Início da Grade</label><input type="time" value={gridSettings.horaInicioGeral} onChange={e => setGridSettings({...gridSettings, horaInicioGeral: e.target.value})} /></FormField>
                  <FormField><label>Fim da Grade</label><input type="time" value={gridSettings.horaFimGeral} onChange={e => setGridSettings({...gridSettings, horaFimGeral: e.target.value})} /></FormField>
                  <FormField><label>Intervalo</label>
                    <select value={gridSettings.intervaloMinutos} onChange={e => setGridSettings({...gridSettings, intervaloMinutos: Number(e.target.value)})}>
                      <option value={15}>15 min</option><option value={30}>30 min</option><option value={60}>1 hora</option>
                    </select>
                  </FormField>
                </div>
                {profissionais.map((p, i) => (
                  <div key={p.id} style={{ border: '1px solid #E2E8F0', padding: 15, borderRadius: 16, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>{p.nome}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <FormField><label>Entrada</label><input type="time" value={p.inicio} onChange={e => updateProf(i, 'inicio', e.target.value)}/></FormField>
                      <FormField><label>Saída</label><input type="time" value={p.fim} onChange={e => updateProf(i, 'fim', e.target.value)}/></FormField>
                      <FormField><label>Almoço Início</label><input type="time" value={p.pausaIni} onChange={e => updateProf(i, 'pausaIni', e.target.value)}/></FormField>
                      <FormField><label>Almoço Fim</label><input type="time" value={p.pausaFim} onChange={e => updateProf(i, 'pausaFim', e.target.value)}/></FormField>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowConfig(false)} style={{ width: '100%', background: '#4F46E5', color: '#FFF', padding: 16, borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Salvar Configurações</button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>

        {/* --- MODAL NOVO AGENDAMENTO --- */}
        <AnimatePresence>
          {showAddModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()}>
                <h2 style={{ marginBottom: 24 }}>Novo Agendamento</h2>
                <form onSubmit={handleAddAppointment}>
                  <FormField><label>Cliente</label><input type="text" required value={newAppt.cliente} onChange={e => setNewAppt({...newAppt, cliente: e.target.value})} /></FormField>
                  <FormField><label>Serviço</label><input type="text" required value={newAppt.servico} onChange={e => setNewAppt({...newAppt, servico: e.target.value})} /></FormField>
                  <FormField><label>Profissional</label>
                    <select value={newAppt.profId} onChange={e => setNewAppt({...newAppt, profId: Number(e.target.value)})}>
                      {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </FormField>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <FormField><label>Hora</label><input type="time" required value={newAppt.hora} onChange={e => setNewAppt({...newAppt, hora: e.target.value})} /></FormField>
                    <FormField><label>Duração (min)</label>
                      <select value={newAppt.duracao} onChange={e => setNewAppt({...newAppt, duracao: Number(e.target.value)})}>
                        <option value={30}>30 min</option><option value={60}>1 hora</option><option value={90}>1h 30min</option>
                      </select>
                    </FormField>
                  </div>
                  {/* Corrigido erro 2304: 'white' agora é string literal */}
                  <button type="submit" style={{ width: '100%', background: '#4F46E5', color: 'white', padding: 16, borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Confirmar Agendamento</button>
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