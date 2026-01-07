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

const StockBadge = styled.span<{ low: boolean }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.low ? '#FEF2F2' : '#DCFCE7'};
  color: ${props => props.low ? '#EF4444' : '#166534'};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'adjust' }>`
  background: ${props => props.variant === 'adjust' ? '#F8FAFC' : '#EEF2FF'};
  color: ${props => props.variant === 'adjust' ? '#64748B' : '#4F46E5'};
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.8; transform: translateY(-1px); }
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 550px;
  max-height: 90vh; overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
  label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  input, select { 
    padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; 
    &:focus { outline: none; border-color: #4F46E5; }
  }
`;

const Estoque: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Dados Mock atualizados com Código e Marca
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Estoque</h1>
            <p style={{ color: '#64748B' }}>Controle de custos, margens e reposição</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar 
              placeholder="Produto, marca ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => handleOpenModal()}
              style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}
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
                <Th>Qtd Atual</Th>
                <Th>P. Custo</Th>
                <Th>P. Venda</Th>
                <Th>Margem (%)</Th>
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
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>#{p.codigo}</div>
                    </Td>
                    <Td>
                      <span style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {p.marca}
                      </span>
                    </Td>
                    <Td><StockBadge low={p.qtd <= p.min}>{p.qtd} un.</StockBadge></Td>
                    <Td style={{ color: '#64748B' }}>R$ {p.custo.toFixed(2)}</Td>
                    <Td style={{ fontWeight: 600 }}>{p.venda > 0 ? `R$ ${p.venda.toFixed(2)}` : "Uso Interno"}</Td>
                    <Td style={{ color: p.venda > 0 ? '#10B981' : '#94A3B8', fontWeight: 700 }}>
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>{selectedProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Código SKU / Referência</label>
                    <input type="text" defaultValue={selectedProduct?.codigo} placeholder="Ex: PRD-001" />
                  </FormGroup>
                  <FormGroup>
                    <label>Marca</label>
                    <input type="text" defaultValue={selectedProduct?.marca} placeholder="Ex: L'Oréal" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Nome do Produto</label>
                  <input type="text" defaultValue={selectedProduct?.nome} placeholder="Ex: Shampoo Especial" />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Preço de Custo (R$)</label>
                    <input type="number" defaultValue={selectedProduct?.custo} placeholder="0.00" />
                  </FormGroup>
                  <FormGroup>
                    <label>Preço de Venda (R$)</label>
                    <input type="number" defaultValue={selectedProduct?.venda} placeholder="0.00 (0 para uso interno)" />
                  </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <label>Quantidade em Estoque</label>
                    <input type="number" defaultValue={selectedProduct?.qtd} placeholder="0" />
                  </FormGroup>
                  <FormGroup>
                    <label>Quantidade Mínima</label>
                    <input type="number" defaultValue={selectedProduct?.min} placeholder="Aviso de reposição" />
                  </FormGroup>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  style={{ width: '100%', background: '#4F46E5', color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}
                >
                  Salvar Produto
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