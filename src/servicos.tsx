import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

// --- Variáveis de Design (Identidade SAS) ---
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
  width: 300px;
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

const CategoryBadge = styled.span<{ color: string }>`
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.color + '25'}; /* Fundo com 15% de opacidade */
  color: ${props => props.color};
  border: 1px solid ${props => props.color + '40'};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: ${props => props.variant === 'edit' ? 'rgba(0, 70, 255, 0.1)' : Colors.inputBg};
  color: ${props => props.variant === 'edit' ? Colors.primary : Colors.textMuted};
  border: 1px solid ${props => props.variant === 'edit' ? 'rgba(0, 70, 255, 0.2)' : 'transparent'};
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { 
    background: ${Colors.primary}; 
    color: white; 
    transform: translateY(-1px);
  }
`;

// --- Modais ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 500px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
  label { font-size: 0.75rem; font-weight: 700; color: ${Colors.textMuted}; text-transform: uppercase; letter-spacing: 0.05em; }
  input, select { 
    padding: 12px; border-radius: 12px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white; outline: none;
    transition: 0.2s;
    &:focus { border-color: ${Colors.primary}; }
  }
  select option { background: ${Colors.cardBg}; }
`;

const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const servicosData = [
    { id: 1, nome: "Corte Feminino", categoria: "Cabelo", duracao: "60 min", preco: 120.00, color: "#0046FF" },
    { id: 2, nome: "Barba Premium", categoria: "Barbearia", duracao: "30 min", preco: 65.00, color: "#EC4899" },
    { id: 3, nome: "Coloração Global", categoria: "Cabelo", duracao: "120 min", preco: 250.00, color: "#0046FF" },
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Serviços 📝</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Gestão de procedimentos, preços e tempos</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Pesquisar serviço..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => { setSelectedService(null); setShowModal(true); }}
              style={{ background: Colors.primary, color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 70, 255, 0.3)' }}
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
                  <Td style={{ color: Colors.textMuted }}>{s.duracao}</Td>
                  <Td style={{ fontWeight: 700, color: Colors.success }}>
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>
                  {selectedService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Defina os parâmetros de execução e valor.</p>
                
                <FormGroup>
                  <label>Nome do Serviço</label>
                  <input type="text" defaultValue={selectedService?.nome} placeholder="Ex: Hidratação Profunda" />
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup>
                    <label>Preço Sugerido</label>
                    <input type="number" defaultValue={selectedService?.preco} placeholder="0.00" />
                  </FormGroup>
                  <FormGroup>
                    <label>Duração Estimada</label>
                    <select defaultValue={selectedService?.duracao.replace(' min', '')}>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1h</option>
                      <option value="120">2h</option>
                    </select>
                  </FormGroup>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  style={{ 
                    width: '100%', background: Colors.primary, color: 'white', border: 'none', 
                    padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '16px' 
                  }}
                >
                  Confirmar e Salvar
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