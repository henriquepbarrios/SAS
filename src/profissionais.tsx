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
  successBg: 'rgba(16, 185, 129, 0.1)',
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

// --- Layout Estilizado ---
const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
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
`;

const Avatar = styled.div<{ color: string; src?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: ${props => props.color};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid ${Colors.border};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'schedule' }>`
  background: ${props => props.variant === 'edit' ? 'rgba(0, 70, 255, 0.1)' : Colors.inputBg};
  color: ${props => props.variant === 'edit' ? Colors.primary : Colors.textMuted};
  border: 1px solid ${props => props.variant === 'edit' ? 'rgba(0, 70, 255, 0.2)' : 'transparent'};
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { 
    transform: translateY(-1px);
    background: ${Colors.primary};
    color: white;
  }
`;

// --- Modais ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 650px;
  max-height: 90vh; overflow-y: auto;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
  label { font-size: 0.75rem; font-weight: 700; color: ${Colors.textMuted}; text-transform: uppercase; letter-spacing: 0.05em; }
  input, select, textarea { 
    padding: 12px; border-radius: 12px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white; outline: none;
    &:focus { border-color: ${Colors.primary}; }
  }
`;

const PhotoUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 24px;
  background: ${Colors.inputBg};
  border-radius: 20px;
  border: 2px dashed ${Colors.border};

  .preview-circle {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: ${Colors.cardBg};
    border: 1px solid ${Colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
    span { font-size: 2rem; }
  }

  .upload-controls {
    display: flex;
    flex-direction: column;
    gap: 4px;
    p { font-size: 0.95rem; font-weight: 700; color: white; }
    span { font-size: 0.8rem; color: ${Colors.textMuted}; margin-bottom: 8px; }
    label {
      background: ${Colors.primary};
      color: white;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      width: fit-content;
      &:hover { background: ${Colors.primaryHover}; }
    }
    input { display: none; }
  }
`;

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 1.2fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${Colors.border};
  input[type="time"] { 
    padding: 8px; border-radius: 8px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white;
  }
`;

const DayLabel = styled.span` font-weight: 700; font-size: 0.85rem; color: ${Colors.textMain}; `;

const Profissionais: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProf, setSelectedProf] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [profissionais] = useState([
    { id: 1, nome: "Bia Silva", especialidadeMaster: "Cabeleireira Master", outrasEspecialidades: "Química, Penteados", cpf: "123.456.789-00", telefone: "(11) 98877-6655", email: "bia@salao.com", comissao: "40%", status: "Ativo", cor: "#0046FF", foto: null },
    { id: 2, nome: "Marco Vedo", especialidadeMaster: "Barbeiro", outrasEspecialidades: "Colorimetria, Barboterapia", cpf: "987.654.321-11", telefone: "(11) 97766-5544", email: "marco@salao.com", comissao: "50%", status: "Ativo", cor: "#10B981", foto: null },
    { id: 3, nome: "Duda Ramos", especialidadeMaster: "Manicure", outrasEspecialidades: "Alongamento em Gel", cpf: "456.789.123-22", telefone: "(11) 96655-4433", email: "duda@salao.com", comissao: "60%", status: "Em Férias", cor: "#8B5CF6", foto: null },
  ]);

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEdit = (prof: any) => {
    setSelectedProf(prof);
    setPhotoPreview(prof?.foto || null);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setShowEditModal(false);
    setPhotoPreview(null);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profissionais ✂️</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão de equipe, comissões e horários</p>
          </div>
          <button 
            onClick={() => { setSelectedProf(null); setPhotoPreview(null); setShowEditModal(true); }}
            style={{ background: Colors.primary, color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 70, 255, 0.3)' }}
          >
            + Adicionar Profissional
          </button>
        </Header>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Profissional</Th>
                <Th>Especialidade Master</Th>
                <Th>Comissão</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map(p => (
                <tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Avatar color={p.cor} src={p.foto || undefined}>
                        {!p.foto && p.nome.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: Colors.textMuted }}>{p.telefone}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{p.especialidadeMaster}</div>
                    <div style={{ fontSize: '0.7rem', color: Colors.textMuted }}>{p.outrasEspecialidades}</div>
                  </Td>
                  <Td style={{ fontWeight: 700, color: Colors.primary }}>{p.comissao}</Td>
                  <Td>
                    <span style={{ 
                      padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                      background: p.status === 'Ativo' ? Colors.successBg : Colors.inputBg,
                      color: p.status === 'Ativo' ? Colors.success : Colors.textMuted,
                      border: `1px solid ${p.status === 'Ativo' ? 'rgba(16, 185, 129, 0.2)' : Colors.border}`
                    }}>
                      {p.status}
                    </span>
                  </Td>
                  <Td>
                    <ActionButton variant="edit" onClick={() => handleOpenEdit(p)}>Editar</ActionButton>
                    <ActionButton variant="schedule" onClick={() => { setSelectedProf(p); setShowScheduleModal(true); }}>Horários</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        {/* --- MODAL DE CADASTRO / EDIÇÃO --- */}
        <AnimatePresence>
          {showEditModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>
                  {selectedProf ? `Editar ${selectedProf.nome}` : 'Novo Profissional'}
                </h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Informações básicas e contratuais.</p>
                
                <PhotoUploadContainer>
                  <div className="preview-circle">
                    {photoPreview ? <img src={photoPreview} alt="Preview" /> : <span>👤</span>}
                  </div>
                  <div className="upload-controls">
                    <p>Foto do Perfil</p>
                    <span>JPEG ou PNG, máx 2MB</span>
                    <label htmlFor="file-upload">Carregar Foto</label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                </PhotoUploadContainer>

                <SectionTitle text="Dados Básicos" />
                <FormGroup>
                  <label>Nome Completo</label>
                  <input type="text" defaultValue={selectedProf?.nome} placeholder="Ex: Bia Silva" />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup><label>CPF</label><input type="text" defaultValue={selectedProf?.cpf} /></FormGroup>
                  <FormGroup><label>Telefone</label><input type="text" defaultValue={selectedProf?.telefone} /></FormGroup>
                </div>

                <SectionTitle text="Especialização e Ganhos" />
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Especialidade Master</label>
                    <input type="text" defaultValue={selectedProf?.especialidadeMaster} />
                  </FormGroup>
                  <FormGroup>
                    <label>Comissão (%)</label>
                    <input type="number" defaultValue={selectedProf?.comissao.replace('%', '')} />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Cor na Agenda</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="color" defaultValue={selectedProf?.cor || Colors.primary} style={{ height: '48px', width: '80px', padding: '4px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.85rem', color: Colors.textMuted }}>Esta cor identificará os serviços deste profissional na grade horária.</span>
                  </div>
                </FormGroup>

                <button onClick={handleSave} style={{ width: '100%', background: Colors.primary, color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '20px' }}>
                  Salvar Profissional
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>

        {/* --- MODAL DE HORÁRIOS --- */}
        <AnimatePresence>
          {showScheduleModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '750px' }}>
                <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Horários de Trabalho</h2>
                <p style={{ color: Colors.textMuted, marginBottom: '24px' }}>Defina o expediente de <strong>{selectedProf?.nome}</strong></p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1.2fr 1fr', paddingBottom: '8px', borderBottom: `1px solid ${Colors.border}`, color: Colors.textMuted, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <span>Dia</span>
                    <span>Entrada</span>
                    <span>Almoço</span>
                    <span>Saída</span>
                </div>

                {diasSemana.map((dia) => (
                  <ScheduleRow key={dia}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: Colors.primary }} />
                      <DayLabel>{dia}</DayLabel>
                    </div>
                    <input type="time" defaultValue="09:00" />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="time" defaultValue="12:00" />
                      <input type="time" defaultValue="13:00" />
                    </div>
                    <input type="time" defaultValue="18:00" />
                  </ScheduleRow>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, background: Colors.inputBg, color: Colors.textMuted, border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={() => setShowScheduleModal(false)} style={{ flex: 2, background: Colors.primary, color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Salvar Escala</button>
                </div>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

const SectionTitle = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 16px 0' }}>
    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: Colors.primary, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{text}</span>
    <div style={{ height: '1px', background: Colors.border, width: '100%' }} />
  </div>
);

export default Profissionais;