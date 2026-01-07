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

// --- UI Components ---
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SearchBar = styled.input`
  padding: 12px 20px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  width: 350px;
  outline: none;
  transition: all 0.2s;
  &:focus { border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
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

const Avatar = styled.div<{ src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #E2E8F0;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748B;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'history' | 'danger' }>`
  background: ${props => 
    props.variant === 'edit' ? '#EEF2FF' : 
    props.variant === 'danger' ? '#FEF2F2' : '#F8FAFC'};
  color: ${props => 
    props.variant === 'edit' ? '#4F46E5' : 
    props.variant === 'danger' ? '#EF4444' : '#64748B'};
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.8; transform: translateY(-1px); }
`;

const Badge = styled.span<{ type?: 'success' | 'warning' }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.type === 'success' ? '#DCFCE7' : '#FFF7ED'};
  color: ${props => props.type === 'success' ? '#166534' : '#9A3412'};
`;

// --- Modals ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1E293B;
  margin: 24px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after { content: ''; flex: 1; height: 1px; background: #F1F5F9; }
`;

const PhotoUploadZone = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: #F8FAFC;
  border: 2px dashed #E2E8F0;
  border-radius: 20px;

  .preview-box {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    background: #FFF;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    img { width: 100%; height: 100%; object-fit: cover; }
    span { font-size: 1.5rem; }
  }

  .upload-info {
    flex: 1;
    h4 { font-size: 0.9rem; margin-bottom: 4px; }
    p { font-size: 0.75rem; color: #64748B; margin-bottom: 8px; }
    label {
      background: #4F46E5; color: white; padding: 6px 14px;
      border-radius: 8px; font-size: 0.75rem; font-weight: 600;
      cursor: pointer; display: inline-block;
      &:hover { background: #4338CA; }
    }
    input { display: none; }
  }
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
  label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  input, select, textarea { 
    padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; font-size: 0.95rem;
    &:focus { outline: none; border-color: #4F46E5; }
  }
`;

const Pacientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [viewHistory, setViewHistory] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Dados iniciais com campo de nascimento adicionado
  const [pacientes] = useState([
    { 
        id: 1, 
        nome: "Juliana Peixoto", 
        foto: null, 
        nascimento: "1992-05-15",
        telefone: "(11) 98877-6655", 
        ultimaVisita: "12/12/2025", 
        proximoAgendamento: "15/01/2026", 
        totalGasto: 1250.00, 
        email: "ju.peixoto@email.com", 
        observacoes: "Alérgica a esmalte com formaldeído." 
    },
    { 
        id: 2, 
        nome: "Marcos Vinicius", 
        foto: null, 
        nascimento: "1988-10-20",
        telefone: "(11) 97766-5544", 
        ultimaVisita: "28/11/2025", 
        proximoAgendamento: "Sem data", 
        totalGasto: 450.00, 
        email: "marcos.v@email.com", 
        observacoes: "" 
    },
  ]);

  // Função para formatar data (YYYY-MM-DD para DD/MM/YYYY)
  const formatarDataBR = (data: string) => {
    if(!data) return "Não informada";
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const filteredPacientes = useMemo(() => {
    return pacientes.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.telefone.includes(searchTerm)
    );
  }, [searchTerm, pacientes]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEdit = (p: any) => {
    setSelectedPatient(p);
    setPhotoPreview(p.foto);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedPatient(null);
    setPhotoPreview(null);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Gestão de Clientes</h1>
            <p style={{ color: '#64748B' }}>Fichas técnicas, endereço e histórico</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Buscar por nome ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
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
                <Th>Nascimento</Th>
                <Th>Contato</Th>
                <Th>Última Visita</Th>
                <Th>Próximo Agendamento</Th>
                <Th>Total Gasto</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.map(p => (
                <tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={p.foto || undefined}>
                        {!p.foto && p.nome[0]}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{p.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{p.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color: '#64748B' }}>{formatarDataBR(p.nascimento)}</Td>
                  <Td>{p.telefone}</Td>
                  <Td>{p.ultimaVisita}</Td>
                  <Td>
                    <Badge type={p.proximoAgendamento === 'Sem data' ? 'warning' : 'success'}>
                      {p.proximoAgendamento}
                    </Badge>
                  </Td>
                  <Td style={{ fontWeight: 700, color: '#10B981' }}>
                    {p.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                  <Td>
                    <ActionButton variant="edit" onClick={() => handleOpenEdit(p)}>Ficha</ActionButton>
                    <ActionButton onClick={() => setViewHistory(p)}>Histórico</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        {/* --- MODAL DE CADASTRO / EDIÇÃO --- */}
        <AnimatePresence>
          {(showAddModal || selectedPatient) && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ y: 50 }} animate={{ y: 0 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>{selectedPatient ? 'Editar Ficha' : 'Novo Cadastro'}</h2>
                
                <PhotoUploadZone>
                  <div className="preview-box">
                    {photoPreview ? <img src={photoPreview} alt="Preview" /> : <span>👤</span>}
                  </div>
                  <div className="upload-info">
                    <h4>Foto do Cliente</h4>
                    <p>PNG ou JPG até 2MB</p>
                    <label htmlFor="client-photo">Escolher Imagem</label>
                    <input id="client-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                </PhotoUploadZone>

                <SectionTitle>Dados Pessoais</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Nome Completo</label>
                    <input type="text" defaultValue={selectedPatient?.nome} placeholder="Nome do cliente" />
                  </FormGroup>
                  <FormGroup>
                    <label>Data de Nascimento</label>
                    <input type="date" defaultValue={selectedPatient?.nascimento} />
                  </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                   <FormGroup>
                    <label>CPF</label>
                    <input type="text" placeholder="000.000.000-00" />
                  </FormGroup>
                  <FormGroup>
                    <label>Telefone / WhatsApp</label>
                    <input type="text" defaultValue={selectedPatient?.telefone} placeholder="(00) 00000-0000" />
                  </FormGroup>
                  <FormGroup>
                    <label>E-mail</label>
                    <input type="email" defaultValue={selectedPatient?.email} placeholder="email@exemplo.com" />
                  </FormGroup>
                </div>

                <SectionTitle>Endereço</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 100px', gap: '16px' }}>
                  <FormGroup>
                    <label>CEP</label>
                    <input type="text" placeholder="00000-000" />
                  </FormGroup>
                  <FormGroup>
                    <label>Rua / Logradouro</label>
                    <input type="text" placeholder="Ex: Av. Paulista" />
                  </FormGroup>
                  <FormGroup>
                    <label>Nº</label>
                    <input type="text" placeholder="123" />
                  </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Bairro</label>
                    <input type="text" placeholder="Ex: Centro" />
                  </FormGroup>
                  <FormGroup>
                    <label>Cidade</label>
                    <input type="text" placeholder="Ex: São Paulo" />
                  </FormGroup>
                  <FormGroup>
                    <label>Estado (UF)</label>
                    <select>
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                    </select>
                  </FormGroup>
                </div>

                <SectionTitle>Informações Adicionais</SectionTitle>
                <FormGroup>
                  <label>Observações Técnicas / Restrições</label>
                  <textarea rows={4} defaultValue={selectedPatient?.observacoes} placeholder="Ex: Alergias, produtos preferidos, restrições médicas..." />
                </FormGroup>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    onClick={handleCloseModal}
                    style={{ flex: 1, background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Salvar Ficha do Cliente
                  </button>
                  {selectedPatient && <ActionButton variant="danger" style={{ padding: '16px' }}>Excluir</ActionButton>}
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
                    <p style={{ color: '#64748B' }}>{viewHistory.nome}</p>
                   </div>
                </div>
                <button onClick={() => setViewHistory(null)} style={{ width: '100%', background: '#F1F5F9', color: '#475569', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '30px' }}>Fechar</button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Pacientes;