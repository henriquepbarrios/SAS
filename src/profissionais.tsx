import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
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
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'schedule' }>`
  background: ${props => props.variant === 'edit' ? '#EEF2FF' : '#F1F5F9'};
  color: ${props => props.variant === 'edit' ? '#4F46E5' : '#475569'};
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.8; transform: translateY(-1px); }
`;

// --- Modais ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 650px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
  label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  input, select, textarea { 
    padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; 
    &:focus { outline: none; border-color: #4F46E5; }
  }
`;

const PhotoUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: #F8FAFC;
  border-radius: 20px;
  border: 2px dashed #E2E8F0;

  .preview-circle {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: #E2E8F0;
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
    p { font-size: 0.85rem; font-weight: 700; color: #1E293B; }
    span { font-size: 0.75rem; color: #64748B; margin-bottom: 4px; }
    label {
      background: #4F46E5;
      color: white;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      width: fit-content;
      &:hover { background: #4338CA; }
    }
    input { display: none; }
  }
`;

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  input[type="time"] { padding: 6px; border-radius: 8px; border: 1px solid #E2E8F0; }
`;

const DayLabel = styled.span` font-weight: 700; font-size: 0.85rem; color: #1E293B; `;

const Profissionais: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProf, setSelectedProf] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [profissionais] = useState([
    { id: 1, nome: "Bia Silva", especialidadeMaster: "Cabeleireira Master", outrasEspecialidades: "Química, Penteados", cpf: "123.456.789-00", telefone: "(11) 98877-6655", email: "bia@salao.com", comissao: "40%", status: "Ativo", cor: "#4F46E5", foto: null },
    { id: 2, nome: "Marco Vedo", especialidadeMaster: "Barbeiro", outrasEspecialidades: "Colorimetria, Barboterapia", cpf: "987.654.321-11", telefone: "(11) 97766-5544", email: "marco@salao.com", comissao: "50%", status: "Ativo", cor: "#10B981", foto: null },
    { id: 3, nome: "Duda Ramos", especialidadeMaster: "Manicure", outrasEspecialidades: "Alongamento em Gel", cpf: "456.789.123-22", telefone: "(11) 96655-4433", email: "duda@salao.com", comissao: "60%", status: "Em Férias", cor: "#EC4899", foto: null },
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Profissionais</h1>
            <p style={{ color: '#64748B' }}>Gestão de equipe, comissões e horários de trabalho</p>
          </div>
          <button 
            onClick={() => { setSelectedProf(null); setPhotoPreview(null); setShowEditModal(true); }}
            style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar color={p.cor} src={p.foto || undefined}>
                        {!p.foto && p.nome.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{p.telefone}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{p.especialidadeMaster}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{p.outrasEspecialidades}</div>
                  </Td>
                  <Td style={{ fontWeight: 600, color: '#4F46E5' }}>{p.comissao}</Td>
                  <Td>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                      background: p.status === 'Ativo' ? '#DCFCE7' : '#F1F5F9',
                      color: p.status === 'Ativo' ? '#166534' : '#64748B'
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>
                  {selectedProf ? `Editar ${selectedProf.nome}` : 'Novo Profissional'}
                </h2>
                
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
                  <FormGroup>
                    <label>CPF</label>
                    <input type="text" defaultValue={selectedProf?.cpf} placeholder="000.000.000-00" />
                  </FormGroup>
                  <FormGroup>
                    <label>Telefone / WhatsApp</label>
                    <input type="text" defaultValue={selectedProf?.telefone} placeholder="(00) 00000-0000" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>E-mail</label>
                  <input type="email" defaultValue={selectedProf?.email} placeholder="email@exemplo.com" />
                </FormGroup>

                <SectionTitle text="Especialização e Ganhos" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Especialidade Master (Exibida na Tabela)</label>
                    <input type="text" defaultValue={selectedProf?.especialidadeMaster} placeholder="Ex: Cabeleireira Master" />
                  </FormGroup>
                  <FormGroup>
                    <label>Comissão (%)</label>
                    <input type="number" defaultValue={selectedProf?.comissao.replace('%', '')} placeholder="Ex: 40" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Outras Especialidades (Controle Interno)</label>
                  <textarea 
                    defaultValue={selectedProf?.outrasEspecialidades} 
                    placeholder="Ex: Química, Penteados, Noivas..."
                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontFamily: 'inherit' }}
                  />
                </FormGroup>

                <FormGroup>
                  <label>Cor na Agenda</label>
                  <input type="color" defaultValue={selectedProf?.cor || '#4F46E5'} style={{ height: '45px', padding: '4px', width: '100%', cursor: 'pointer' }} />
                </FormGroup>

                <button onClick={handleSave} style={{ width: '100%', background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: '750px' }}>
                <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Horários de Trabalho</h2>
                <p style={{ color: '#64748B', marginBottom: '24px' }}>Defina o expediente de <strong>{selectedProf?.nome}</strong></p>
                
                {diasSemana.map((dia) => (
                  <ScheduleRow key={dia}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" defaultChecked />
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

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={() => setShowScheduleModal(false)} style={{ flex: 2, background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Salvar Escala</button>
                </div>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

// Componente auxiliar para divisórias de seção no modal
const SectionTitle = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px 0' }}>
    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap' }}>{text}</span>
    <div style={{ height: '1px', background: '#E2E8F0', width: '100%' }} />
  </div>
);

export default Profissionais;