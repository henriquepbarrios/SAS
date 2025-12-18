import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
`;

const Container = styled.div` display: flex; min-height: 100vh; `;
const MainContent = styled.main` flex: 1; margin-left: 260px; padding: 40px; `;

// --- Componentes de UI ---
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
  width: 300px;
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
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 20px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.95rem;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'history' }>`
  background: ${props => props.variant === 'edit' ? '#EEF2FF' : '#F8FAFC'};
  color: ${props => props.variant === 'edit' ? '#4F46E5' : '#64748B'};
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

// --- Modais ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 24px;
  width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
`;

const Pacientes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewHistory, setViewHistory] = useState<any>(null);

  // Mock de dados dos pacientes
  const pacientesMock = [
    { id: 1, nome: "Ricardo Almeida", cpf: "123.456.789-00", ultimaConsulta: "12/12/2023", status: "Ativo" },
    { id: 2, nome: "Carla Souza", cpf: "987.654.321-11", ultimaConsulta: "15/12/2023", status: "Ativo" },
    { id: 3, nome: "Marcos Pires", cpf: "456.789.123-22", ultimaConsulta: "01/12/2023", status: "Inativo" },
  ];

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Pacientes</h1>
            <p style={{ color: '#64748B' }}>Gerencie o prontuário e histórico dos seus pacientes</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar placeholder="Buscar paciente por nome ou CPF..." />
            <button 
              onClick={() => setShowModal(true)}
              style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              + Novo Paciente
            </button>
          </div>
        </Header>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Nome do Paciente</Th>
                <Th>CPF</Th>
                <Th>Última Consulta</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {pacientesMock.map(p => (
                <tr key={p.id}>
                  <Td style={{ fontWeight: 600 }}>{p.nome}</Td>
                  <Td color="#64748B">{p.cpf}</Td>
                  <Td>{p.ultimaConsulta}</Td>
                  <Td>
                    <span style={{ 
                      background: p.status === 'Ativo' ? '#DCFCE7' : '#F1F5F9',
                      color: p.status === 'Ativo' ? '#166534' : '#64748B',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
                    }}>{p.status}</span>
                  </Td>
                  <Td>
                    <ActionButton variant="edit">Editar</ActionButton>
                    <ActionButton onClick={() => setViewHistory(p)}>Histórico</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        {/* --- MODAL DE CADASTRO / EDIÇÃO --- */}
        <AnimatePresence>
          {showModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <h2 style={{ marginBottom: '24px' }}>Cadastrar Novo Paciente</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nome Completo</label>
                    <input style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} type="text" placeholder="Ex: João Silva" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>CPF</label>
                    <input style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} type="text" placeholder="000.000.000-00" />
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ width: '100%', background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}
                >
                  Salvar Paciente
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>

        {/* --- MODAL DE HISTÓRICO (PRONTUÁRIO) --- */}
        <AnimatePresence>
          {viewHistory && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewHistory(null)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: 100 }} style={{ maxWidth: '700px' }}>
                <header style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '20px', marginBottom: '20px' }}>
                  <h2>Histórico do Paciente</h2>
                  <p style={{ color: '#64748B' }}>{viewHistory.nome} • {viewHistory.cpf}</p>
                </header>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ padding: '20px', border: '1px solid #F1F5F9', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#4F46E5' }}>Consulta de Rotina</span>
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>10/10/2023</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                        Paciente apresentou melhora nos sintomas relatados anteriormente. Recomendado manter medicação e retornar em 3 meses.
                      </p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setViewHistory(null)}
                  style={{ width: '100%', background: '#F1F5F9', color: '#475569', border: 'none', padding: '14px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', marginTop: '30px' }}
                >
                  Fechar Prontuário
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Pacientes;