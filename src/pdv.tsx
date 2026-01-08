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
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)'
};

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: ${Colors.bgDark}; 
    font-family: 'Inter', sans-serif; 
    color: ${Colors.textMain}; 
    overflow: hidden;
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

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  flex: 1;
  min-height: 0;
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
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid ${Colors.border};
  background: ${Colors.cardBg};
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  &:focus { border-color: ${Colors.primary}; }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${Colors.border}; border-radius: 10px; }
`;

const ProductCard = styled(motion.div)`
  background: ${Colors.cardBg};
  padding: 20px;
  border-radius: 18px;
  border: 1px solid ${Colors.border};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: ${Colors.inputBg};
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    border: 1px solid ${Colors.border};
  }

  h4 { font-size: 0.9rem; font-weight: 600; color: ${Colors.textMain}; line-height: 1.3; }
  strong { color: ${Colors.primary}; font-size: 1.1rem; font-weight: 800; }

  &:hover { border-color: ${Colors.primary}; background: #1c2026; }
`;

// --- Área do Carrinho ---
const CartContainer = styled.div`
  background: ${Colors.cardBg};
  border-radius: 24px;
  border: 1px solid ${Colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const CartHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${Colors.border};
  h3 { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${Colors.border}; border-radius: 10px; }
`;

const CartItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${Colors.border};

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    span { font-size: 0.9rem; font-weight: 600; color: ${Colors.textMain}; }
    small { font-size: 0.8rem; color: ${Colors.textMuted}; font-weight: 500; }
  }

  button {
    background: ${Colors.dangerBg};
    color: ${Colors.danger};
    border: 1px solid rgba(239, 68, 68, 0.2);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    &:hover { background: ${Colors.danger}; color: white; }
  }
`;

const CartFooter = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid ${Colors.border};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SummaryRow = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span { color: ${Colors.textMuted}; font-size: 1rem; font-weight: 600; }
  strong { 
    color: ${Colors.textMain}; 
    font-size: ${props => props.total ? '1.8rem' : '1.1rem'};
    font-weight: 800;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: ${Colors.primary};
  color: white;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 70, 255, 0.3);
  transition: all 0.2s;

  &:hover { background: ${Colors.primaryHover}; transform: translateY(-1px); }
  &:disabled { background: ${Colors.border}; color: ${Colors.textMuted}; cursor: not-allowed; box-shadow: none; transform: none; }
`;

const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalCard = styled(motion.div)`
  background: ${Colors.cardBg}; padding: 32px; border-radius: 28px;
  width: 100%; max-width: 440px; border: 1px solid ${Colors.border};
`;

const Select = styled.select`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${Colors.border};
  background: ${Colors.inputBg};
  color: white;
  margin: 16px 0 24px 0;
  font-size: 1rem;
  outline: none;
  &:focus { border-color: ${Colors.primary}; }
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

  return (
    <Container>
      <GlobalStyle />
      <Sidebar />
      <MainContent>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Vendas / PDV 🛒</h1>
          <p style={{ color: Colors.textMuted, marginTop: 4 }}>Frente de caixa operacional rápida</p>
        </header>

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
                  <strong>{money.format(p.preco)}</strong>
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
                  <div style={{ color: Colors.textMuted, textAlign: 'center', marginTop: 60, fontSize: '0.9rem' }}>
                    <p>Carrinho vazio.</p>
                    <p style={{ opacity: 0.6, marginTop: 4 }}>Selecione os produtos ao lado.</p>
                  </div>
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
                      <small>{money.format(item.preco)}</small>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)}>✕</button>
                  </CartItem>
                ))}
              </AnimatePresence>
            </CartList>
            <CartFooter>
              <SummaryRow total>
                <span>Total</span>
                <strong>{money.format(total)}</strong>
              </SummaryRow>
              <ActionButton disabled={cart.length === 0} onClick={() => setShowModal(true)}>
                Finalizar Venda
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
              <ModalCard onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <h2 style={{ fontWeight: 800 }}>Finalizar Venda</h2>
                <p style={{ color: Colors.textMuted, marginTop: 8 }}>Vincular itens ao histórico do cliente</p>
                
                <div style={{ background: Colors.inputBg, padding: 20, borderRadius: 16, margin: '24px 0' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: Colors.textMuted }}>Total a pagar:</span>
                      <strong style={{ color: Colors.primary, fontSize: '1.2rem' }}>{money.format(total)}</strong>
                   </div>
                </div>

                <Select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>

                <ActionButton onClick={() => setShowModal(false)}>Confirmar Recebimento</ActionButton>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ width: '100%', background: 'none', border: 'none', color: Colors.textMuted, marginTop: 20, cursor: 'pointer', fontWeight: 600 }}
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