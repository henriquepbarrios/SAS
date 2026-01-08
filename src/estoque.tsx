import React, { useState, useMemo } from 'react';
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
  danger: '#EF4444',
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

const StockBadge = styled.span<{ low: boolean }>`
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.low ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
  color: ${props => props.low ? Colors.danger : Colors.success};
  border: 1px solid ${props => props.low ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
`;

const ActionButton = styled.button`
  background: ${Colors.inputBg};
  color: ${Colors.textMuted};
  border: 1px solid transparent;
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

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 550px;
  max-height: 90vh; overflow-y: auto;
  border: 1px solid ${Colors.border};
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
  label { font-size: 0.75rem; font-weight: 700; color: ${Colors.textMuted}; text-transform: uppercase; letter-spacing: 0.05em; }
  input, select { 
    padding: 14px; border-radius: 12px; border: 1px solid ${Colors.border}; 
    background: ${Colors.inputBg}; color: white; outline: none;
    transition: 0.2s;
    &:focus { border-color: ${Colors.primary}; }
  }
`;

const Estoque: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const estoqueData = [
    { id: 1, codigo: "PRD-001", marca: "L'Oréal", nome: "Shampoo Pós-Química 1L", qtd: 5, min: 10, custo: 45.00, venda: 0.00 },
    { id: 2, codigo: "PRD-002", marca: "Keune", nome: "Cera Modeladora Matte", qtd: 24, min: 5, custo: 15.00, venda: 45.00 },
    { id: 3, codigo: "PRD-003", marca: "Wella", nome: "Tinta Louro Platinado 9.1", qtd: 3, min: 15, custo: 18.00, venda: 0.00 },
    { id: 4, codigo: "PRD-004", marca: "Moroccanoil", nome: "Óleo de Argan 60ml", qtd: 12, min: 4, custo: 35.00, venda: 78.00 },
  ];

  const filteredEstoque = useMemo(() => {
    return estoqueData.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOpenModal = (product: any = null) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Estoque 📦</h1>
            <p style={{ color: Colors.textMuted, marginTop: 4 }}>Controle de custos, margens e reposição</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Produto, marca ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => handleOpenModal()}
              style={{ background: Colors.primary, color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 70, 255, 0.3)' }}
            >
              + Novo Produto
            </button>
          </div>
        </Header>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Marca</Th>
                <Th>Status Estoque</Th>
                <Th>Custo</Th>
                <Th>Venda</Th>
                <Th>Margem</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filteredEstoque.map(p => {
                const margem = p.venda > 0 ? (((p.venda - p.custo) / p.venda) * 100).toFixed(0) : "0";
                return (
                  <tr key={p.id}>
                    <Td>
                      <div style={{ fontWeight: 700 }}>{p.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: Colors.textMuted, marginTop: 2 }}>#{p.codigo}</div>
                    </Td>
                    <Td>
                      <span style={{ background: Colors.inputBg, padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, border: `1px solid ${Colors.border}` }}>
                        {p.marca}
                      </span>
                    </Td>
                    <Td><StockBadge low={p.qtd <= p.min}>{p.qtd} un.</StockBadge></Td>
                    <Td style={{ color: Colors.textMuted }}>R$ {p.custo.toFixed(2)}</Td>
                    <Td style={{ fontWeight: 600 }}>{p.venda > 0 ? `R$ ${p.venda.toFixed(2)}` : <span style={{color: Colors.textMuted, fontSize: '0.8rem'}}>Uso Interno</span>}</Td>
                    <Td style={{ color: p.venda > 0 ? Colors.success : Colors.textMuted, fontWeight: 800 }}>
                        {p.venda > 0 ? `${margem}%` : "-"}
                    </Td>
                    <Td>
                      <ActionButton onClick={() => handleOpenModal(p)}>Editar</ActionButton>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableCard>

        <AnimatePresence>
          {showModal && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>{selectedProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Gerencie a entrada e precificação de itens.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup>
                    <label>Código SKU</label>
                    <input type="text" defaultValue={selectedProduct?.codigo} placeholder="PRD-000" />
                  </FormGroup>
                  <FormGroup>
                    <label>Marca</label>
                    <input type="text" defaultValue={selectedProduct?.marca} placeholder="Ex: Wella" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Nome do Produto</label>
                  <input type="text" defaultValue={selectedProduct?.nome} placeholder="Ex: Shampoo" />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup>
                    <label>Custo (R$)</label>
                    <input type="number" defaultValue={selectedProduct?.custo} />
                  </FormGroup>
                  <FormGroup>
                    <label>Venda (R$)</label>
                    <input type="number" defaultValue={selectedProduct?.venda} />
                  </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup>
                    <label>Qtd em Estoque</label>
                    <input type="number" defaultValue={selectedProduct?.qtd} />
                  </FormGroup>
                  <FormGroup>
                    <label>Alerta de Reposição (Min)</label>
                    <input type="number" defaultValue={selectedProduct?.min} />
                  </FormGroup>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  style={{ width: '100%', background: Colors.primary, color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}
                >
                  Salvar no Inventário
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default Estoque;