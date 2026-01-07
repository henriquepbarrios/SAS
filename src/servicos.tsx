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

const CategoryBadge = styled.span<{ color: string }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.color + '20'};
  color: ${props => props.color};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: ${props => props.variant === 'edit' ? '#EEF2FF' : '#F8FAFC'};
  color: ${props => props.variant === 'edit' ? '#4F46E5' : '#64748B'};
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

// --- Modais ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 500px;
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
  label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  input, select { 
    padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; 
    &:focus { outline: none; border-color: #4F46E5; }
  }
`;

const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const servicosData = [
    { id: 1, nome: "Corte Feminino", categoria: "Cabelo", duracao: "60 min", preco: 120.00, color: "#4F46E5" },
    { id: 2, nome: "Barba Premium", categoria: "Barbearia", duracao: "30 min", preco: 65.00, color: "#EC4899" },
    { id: 3, nome: "Coloração Global", categoria: "Cabelo", duracao: "120 min", preco: 250.00, color: "#4F46E5" },
    { id: 4, nome: "Manicure", categoria: "Estética", duracao: "45 min", preco: 45.00, color: "#8B5CF6" },
  ];

  const filteredServicos = useMemo(() => {
    return servicosData.filter(s => s.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleEdit = (servico: any) => {
    setSelectedService(servico);
    setShowModal(true);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Serviços</h1>
            <p style={{ color: '#64748B' }}>Cadastre procedimentos, preços e tempos de execução</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Pesquisar serviço..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => { setSelectedService(null); setShowModal(true); }}
              style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              + Novo Serviço
            </button>
          </div>
        </Header>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Serviço</Th>
                <Th>Categoria</Th>
                <Th>Duração</Th>
                <Th>Preço</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filteredServicos.map(s => (
                <tr key={s.id}>
                  <Td style={{ fontWeight: 700 }}>{s.nome}</Td>
                  <Td>
                    <CategoryBadge color={s.color}>{s.categoria}</CategoryBadge>
                  </Td>
                  <Td>{s.duracao}</Td>
                  <Td style={{ fontWeight: 700, color: '#10B981' }}>
                    {s.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                  <Td>
                    <ActionButton variant="edit" onClick={() => handleEdit(s)}>Editar</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <AnimatePresence>
          {showModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>
                  {selectedService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                
                <FormGroup>
                  <label>Nome do Serviço</label>
                  <input type="text" defaultValue={selectedService?.nome} placeholder="Ex: Corte Químico" />
                </FormGroup>

                <FormGroup>
                  <label>Categoria</label>
                  <select defaultValue={selectedService?.categoria}>
                    <option>Cabelo</option>
                    <option>Barbearia</option>
                    <option>Estética</option>
                    <option>Manicure</option>
                  </select>
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Preço (R$)</label>
                    <input type="number" defaultValue={selectedService?.preco} placeholder="0.00" />
                  </FormGroup>
                  <FormGroup>
                    <label>Duração (minutos)</label>
                    <select defaultValue={selectedService?.duracao.replace(' min', '')}>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1h</option>
                      <option value="90">1h 30min</option>
                      <option value="120">2h</option>
                    </select>
                  </FormGroup>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  style={{ 
                    width: '100%', background: '#4F46E5', color: 'white', border: 'none', 
                    padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '10px' 
                  }}
                >
                  Salvar Serviço
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Servicos;