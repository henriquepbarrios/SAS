import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Importação necessária para navegar

// --- Global Styles (Reset e Tipografia) ---
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    width: 100%;
    height: 100%;
    overflow: hidden; 
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`;

// --- Variáveis de Design ---
const Colors = {
  primary: '#4F46E5', 
  primaryHover: '#4338CA',
  bgGradient: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
  textMain: '#1E293B',
  textMuted: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

// --- Estilos de UI ---
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${Colors.bgGradient};
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 3rem 2.5rem;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const LogoIcon = styled.div`
  width: 52px;
  height: 52px;
  background: ${Colors.primary};
  border-radius: 14px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1rem;
  text-transform: uppercase;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
`;

const Title = styled.h2`
  color: ${Colors.textMain};
  font-size: 1.75rem;
  margin: 0;
  letter-spacing: -0.025em;
  font-weight: 800;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  color: ${Colors.textMuted};
  margin-top: 0.5rem;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${Colors.textMain};
  margin-bottom: 0.5rem;
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1.25rem;
  padding-right: 3.5rem; 
  background: ${Colors.white};
  border: 1.5px solid ${Colors.border};
  border-radius: 14px;
  font-size: 1rem;
  color: ${Colors.textMain};
  transition: all 0.2s ease-in-out;
  outline: none;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: ${Colors.primary};
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${Colors.textMuted};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 2;

  &:hover {
    color: ${Colors.primary};
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${Colors.primary};
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  transition: background 0.2s;

  &:hover {
    background: ${Colors.primaryHover};
  }
`;

const FooterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: ${Colors.textMuted};

  a {
    color: ${Colors.primary};
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// --- Componente Principal ---
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log para você conferir no console do navegador (F12)
    console.log("Login submetido:", { email, password });

    // Como você está sem backend, redirecionamos direto para o dashboard
    navigate('/dashboard');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <LoginCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Header>
            <LogoIcon>LOGO</LogoIcon>
            <Title>NOME</Title>
            <Subtitle>Excelência em gestão e controle</Subtitle>
          </Header>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>E-mail corporativo</Label>
              <Input 
                type="email" 
                placeholder="nome@clinica.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Senha</Label>
              <InputWrapper>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <TogglePasswordButton 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </TogglePasswordButton>
              </InputWrapper>
            </FormGroup>

            <LoginButton 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              Acessar Painel
            </LoginButton>
          </form>

          <FooterLink>
            Problemas com acesso? <a href="#">Contatar Suporte</a>
          </FooterLink>
        </LoginCard>
      </Container>
    </>
  );
};

export default Login;