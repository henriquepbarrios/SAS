import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Sidebar from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: #F8FAFC; 
    font-family: 'Inter', sans-serif; 
    color: #1E293B;
    overflow: hidden; /* Evita scroll na página toda, usaremos nos containers */
  }
`;

const Container = styled.div` display: flex; height: 100vh; `;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 32px;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  flex: 1;
  min-height: 0; /* Importante para o scroll interno funcionar */
`;

// --- Área de Produtos ---
const ProductsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  &:focus { border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
`;

const ProductCard = styled(motion.div)`
  background: white;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: #F1F5F9;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
  }

  h4 { font-size: 0.85rem; font-weight: 600; color: #334155; line-height: 1.3; }
  strong { color: #4F46E5; font-size: 1rem; font-weight: 800; }

  &:hover { border-color: #4F46E5; }
`;

// --- Área do Carrinho ---
const CartContainer = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04);
`;

const CartHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #F1F5F9;
  h3 { font-size: 1.1rem; font-weight: 800; }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
`;

const CartItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F8FAFC;

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    span { font-size: 0.85rem; font-weight: 600; color: #1E293B; }
    small { font-size: 0.75rem; color: #64748B; font-weight: 500; }
  }

  button {
    background: #FFF1F2;
    color: #E11D48;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    &:hover { background: #FFE4E6; }
  }
`;

const CartFooter = styled.div`
  padding: 24px;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SummaryRow = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span { color: #64748B; font-size: 0.9rem; font-weight: 600; }
  strong { 
    color: ${props => props.total ? '#1E293B' : '#475569'}; 
    font-size: ${props => props.total ? '1.5rem' : '1rem'};
    font-weight: 800;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: #4F46E5;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  transition: all 0.2s;

  &:hover { background: #4338CA; transform: translateY(-1px); }
  &:disabled { background: #CBD5E1; cursor: not-allowed; box-shadow: none; transform: none; }
`;

// --- Modal ---
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: white; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  margin: 16px 0 24px 0;
  font-size: 1rem;
  outline: none;
  &:focus { border-color: #4F46E5; }
`;

const PDV: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');

  const produtos = [
    { id: 1, nome: "Cera Matte 80g", preco: 45.00, icon: "🧴" },
    { id: 2, nome: "Óleo de Argan 60ml", preco: 78.00, icon: "💧" },
    { id: 3, nome: "Shampoo Silver 300ml", preco: 92.00, icon: "🧼" },
    { id: 4, nome: "Pomada Modeladora", preco: 35.00, icon: "✨" },
    { id: 5, nome: "Spray Fixador", preco: 110.00, icon: "💨" },
    { id: 6, nome: "Corte Masculino", preco: 60.00, icon: "✂️" },
  ];

  const clientes = ["Juliana Peixoto", "Marcos Vinicius", "Ana Paula Silva", "Ricardo Almeida"];

  const addToCart = (prod: any) => setCart([...cart, { ...prod, cartId: Date.now() }]);
  const removeFromCart = (cartId: number) => setCart(cart.filter(item => item.cartId !== cartId));
  const total = useMemo(() => cart.reduce((acc, curr) => acc + curr.preco, 0), [cart]);

  const handleFinalize = () => {
    if (!selectedClient) return alert("Selecione um cliente!");
    alert(`Sucesso! Venda de R$ ${total.toFixed(2)} vinculada a ${selectedClient}`);
    setCart([]);
    setSelectedClient('');
    setShowModal(false);
  };

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <Header>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Vendas / PDV</h1>
            <p style={{ color: '#64748B', marginTop: 4 }}>Frente de caixa operacional rápida</p>
          </div>
        </Header>

        <ContentLayout>
          <ProductsArea>
            <SearchInput placeholder="🔎 Pesquisar produtos ou serviços..." />
            <ProductGrid>
              {produtos.map(p => (
                <ProductCard 
                  key={p.id} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(p)}
                >
                  <div className="icon-wrapper">{p.icon}</div>
                  <h4>{p.nome}</h4>
                  <strong>R$ {p.preco.toFixed(2)}</strong>
                </ProductCard>
              ))}
            </ProductGrid>
          </ProductsArea>

          <CartContainer>
            <CartHeader>
              <h3>Venda Atual</h3>
            </CartHeader>
            <CartList>
              <AnimatePresence>
                {cart.length === 0 && (
                  <p style={{ color: '#94A3B8', textAlign: 'center', marginTop: 40, fontSize: '0.9rem' }}>
                    Carrinho vazio.<br/>Selecione os produtos ao lado.
                  </p>
                )}
                {cart.map(item => (
                  <CartItem 
                    key={item.cartId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="info">
                      <span>{item.nome}</span>
                      <small>R$ {item.preco.toFixed(2)}</small>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)}>✕</button>
                  </CartItem>
                ))}
              </AnimatePresence>
            </CartList>
            <CartFooter>
              <SummaryRow total>
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </SummaryRow>
              <ActionButton disabled={cart.length === 0} onClick={() => setShowModal(true)}>
                Vincular Cliente
              </ActionButton>
            </CartFooter>
          </CartContainer>
        </ContentLayout>

        <AnimatePresence>
          {showModal && (
            <Overlay 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <ModalCard onClick={e => e.stopPropagation()}>
                <h2 style={{ fontWeight: 800 }}>Finalizar Venda</h2>
                <p style={{ color: '#64748B', marginTop: 8 }}>Vincular itens ao histórico do cliente</p>
                
                <Select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>

                <ActionButton onClick={handleFinalize}>Confirmar e Salvar</ActionButton>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#94A3B8', marginTop: 20, cursor: 'pointer', fontWeight: 600 }}
                >
                  Voltar ao carrinho
                </button>
              </ModalCard>
            </Overlay>
          )}
        </AnimatePresence>
      </MainContent>
    </Container>
  );
};

export default PDV;