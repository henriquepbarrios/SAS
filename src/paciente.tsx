import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

// --- Variáveis de Design Atualizadas ---
const Colors = {
  primary: '#0046FF',
  primaryHover: '#0036C7', // Adicionado para corrigir o erro 2339
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

const SearchBar = styled.input`
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid ${Colors.border};
  background: ${Colors.cardBg};
  color: white;
  width: 350px;
  outline: none;
  transition: all 0.2s;
  &::placeholder { color: ${Colors.textMuted}; }
  &:focus { border-color: ${Colors.primary}; box-shadow: 0 0 0 3px rgba(0, 70, 255, 0.1); }
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

const Avatar = styled.div<{ src?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${Colors.inputBg};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: ${Colors.primary};
  border: 1px solid ${Colors.border};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'history' | 'danger' }>`
  background: ${props => 
    props.variant === 'edit' ? 'rgba(0, 70, 255, 0.1)' : 
    props.variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : Colors.inputBg};
  color: ${props => 
    props.variant === 'edit' ? Colors.primary : 
    props.variant === 'danger' ? Colors.danger : Colors.textMuted};
  border: 1px solid ${props => 
    props.variant === 'edit' ? 'rgba(0, 70, 255, 0.2)' : 'transparent'};
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { 
    transform: translateY(-1px);
    background: ${props => props.variant === 'danger' ? Colors.danger : Colors.primary};
    color: white;
  }
`;

const Badge = styled.span<{ type?: 'success' | 'warning' }>`
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.type === 'success' ? Colors.success : Colors.warning};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
  border: 1px solid ${Colors.border};
`;

const SectionTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${Colors.primary};
  margin: 32px 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 12px;
  &::after { content: ''; flex: 1; height: 1px; background: ${Colors.border}; }
`;

const PhotoUploadZone = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 24px;
  background: ${Colors.inputBg};
  border: 2px dashed ${Colors.border};
  border-radius: 20px;

  .preview-box {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    background: ${Colors.cardBg};
    border: 1px solid ${Colors.border};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    img { width: 100%; height: 100%; object-fit: cover; }
    span { font-size: 2rem; }
  }

  .upload-info {
    h4 { font-size: 1rem; margin-bottom: 4px; }
    p { font-size: 0.8rem; color: ${Colors.textMuted}; margin-bottom: 12px; }
    label {
      background: ${Colors.primary}; color: white; padding: 8px 16px;
      border-radius: 8px; font-size: 0.75rem; font-weight: 600;
      cursor: pointer; transition: 0.2s;
      &:hover { background: ${Colors.primaryHover}; }
    }
    input { display: none; }
  }
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
  label { font-size: 0.75rem; font-weight: 700; color: ${Colors.textMuted}; text-transform: uppercase; }
  input, select, textarea { 
    padding: 14px; border-radius: 12px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white; font-size: 0.95rem; outline: none;
    transition: 0.2s;
    &:focus { border-color: ${Colors.primary}; }
  }
`;

const Pacientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [viewHistory, setViewHistory] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [pacientes] = useState([
    { id: 1, nome: "Juliana Peixoto", foto: null, nascimento: "1992-05-15", telefone: "(11) 98877-6655", ultimaVisita: "12/12/2025", proximoAgendamento: "15/01/2026", totalGasto: 1250.00, email: "ju.peixoto@email.com", observacoes: "Alérgica a esmalte com formaldeído." },
    { id: 2, nome: "Marcos Vinicius", foto: null, nascimento: "1988-10-20", telefone: "(11) 97766-5544", ultimaVisita: "28/11/2025", proximoAgendamento: "Sem data", totalGasto: 450.00, email: "marcos.v@email.com", observacoes: "" },
  ]);

  const filteredPacientes = useMemo(() => {
    return pacientes.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.telefone.includes(searchTerm));
  }, [searchTerm, pacientes]);

  // Função handlePhotoChange implementada para usar setPhotoPreview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Gestão de Clientes 👥</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Fichas técnicas e histórico financeiro</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Buscar por nome ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ background: Colors.primary, color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 70, 255, 0.3)' }}
            >
              + Novo Cliente
            </button>
          </div>
        </Header>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Contato</Th>
                <Th>Última Visita</Th>
                <Th>Status</Th>
                <Th>Total Gasto</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.map(p => (
                <tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Avatar src={p.foto || undefined}>{!p.foto && p.nome[0]}</Avatar>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: Colors.textMuted }}>{p.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color: Colors.textMuted }}>{p.telefone}</Td>
                  <Td style={{ color: Colors.textMuted }}>{p.ultimaVisita}</Td>
                  <Td>
                    <Badge type={p.proximoAgendamento === 'Sem data' ? 'warning' : 'success'}>
                      {p.proximoAgendamento === 'Sem data' ? 'Inativo' : 'Agendado'}
                    </Badge>
                  </Td>
                  <Td style={{ fontWeight: 700, color: Colors.success }}>
                    {p.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                  <Td>
                    <ActionButton variant="edit" onClick={() => setSelectedPatient(p)}>Ficha</ActionButton>
                    <ActionButton onClick={() => setViewHistory(p)}>Histórico</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        {/* --- MODAL CADASTRO --- */}
        <AnimatePresence>
          {(showAddModal || selectedPatient) && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddModal(false); setSelectedPatient(null); setPhotoPreview(null); }}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>{selectedPatient ? 'Ficha do Cliente' : 'Novo Cadastro'}</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 32 }}>Preencha os dados técnicos e de contato.</p>
                
                <PhotoUploadZone>
                  <div className="preview-box">
                    {photoPreview ? <img src={photoPreview} alt="Preview" /> : <span>👤</span>}
                  </div>
                  <div className="upload-info">
                    <h4>Foto de Perfil</h4>
                    <p>Formatos aceitos: PNG ou JPG.</p>
                    <label htmlFor="client-photo">Alterar Foto</label>
                    <input id="client-photo" type="file" hidden onChange={handlePhotoChange} />
                  </div>
                </PhotoUploadZone>

                <SectionTitle>Dados Principais</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <FormGroup><label>Nome Completo</label><input type="text" defaultValue={selectedPatient?.nome} /></FormGroup>
                  <FormGroup><label>Nascimento</label><input type="date" defaultValue={selectedPatient?.nascimento} /></FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup><label>WhatsApp</label><input type="text" defaultValue={selectedPatient?.telefone} /></FormGroup>
                  <FormGroup><label>E-mail</label><input type="email" defaultValue={selectedPatient?.email} /></FormGroup>
                </div>

                <SectionTitle>Endereço e Localização</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 80px', gap: '20px' }}>
                  <FormGroup><label>CEP</label><input type="text" placeholder="00000-000" /></FormGroup>
                  <FormGroup><label>Rua</label><input type="text" /></FormGroup>
                  <FormGroup><label>Nº</label><input type="text" /></FormGroup>
                </div>

                <SectionTitle>Ficha Técnica / Observações</SectionTitle>
                <FormGroup>
                  <label>Alergias ou Restrições</label>
                  <textarea rows={4} defaultValue={selectedPatient?.observacoes} placeholder="Digite aqui observações importantes para o atendimento..." />
                </FormGroup>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button 
                    onClick={() => { setShowAddModal(false); setSelectedPatient(null); setPhotoPreview(null); }}
                    style={{ flex: 1, background: Colors.primary, color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Salvar Alterações
                  </button>
                  {selectedPatient && <ActionButton variant="danger" style={{ padding: '0 24px' }}>Excluir Cliente</ActionButton>}
                </div>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>

        {/* --- MODAL DE HISTÓRICO --- */}
        <AnimatePresence>
          {viewHistory && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewHistory(null)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ x: 50 }} animate={{ x: 0 }} style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                   <Avatar src={viewHistory.foto} style={{ width: '60px', height: '60px', borderRadius: '18px' }}>
                     {!viewHistory.foto && viewHistory.nome[0]}
                   </Avatar>
                   <div>
                    <h2 style={{ fontWeight: 800 }}>Histórico</h2>
                    <p style={{ color: Colors.textMuted }}>{viewHistory.nome}</p>
                   </div>
                </div>
                {/* Aqui você pode adicionar o conteúdo do histórico consumindo 'viewHistory' */}
                <p style={{ color: Colors.textMain }}>Carregando histórico de visitas...</p>
                <button onClick={() => setViewHistory(null)} style={{ width: '100%', background: Colors.inputBg, color: Colors.textMuted, border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '30px' }}>Fechar</button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Pacientes;