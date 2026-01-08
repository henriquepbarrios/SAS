import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- Global Styles (Identidade VEDD) ---
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
    background-color: #0B0D10; /* Cor da sidebar do print */
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #FFFFFF;
  }
`;

// --- Variáveis de Design Extraídas da Imagem ---
const Colors = {
  primary: '#0046FF',      // Azul vibrante do logo e botões
  primaryHover: '#0036C7',
  bgDark: '#0B0D10',       // Fundo mais escuro
  cardBg: '#16191E',       // Fundo do card de login
  inputBg: '#1E2229',      // Fundo dos inputs
  textMain: '#FFFFFF',     
  textMuted: '#94A3B8',    
  border: '#2D343F',       // Bordas discretas do sistema dark
};

// --- Estilos de UI ---
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1d23 0%, #0b0d10 100%);
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: ${Colors.cardBg};
  padding: 3rem 2.5rem;
  border-radius: 16px;
  border: 1px solid ${Colors.border};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const LogoWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  
  svg {
    filter: drop-shadow(0px 0px 12px rgba(0, 70, 255, 0.4));
  }
`;

const Title = styled.h2`
  color: ${Colors.textMain};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  color: ${Colors.textMuted};
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${Colors.textMuted};
  margin-bottom: 0.5rem;
  margin-left: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: ${Colors.inputBg};
  border: 1px solid ${Colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${Colors.textMain};
  transition: all 0.2s ease-in-out;
  outline: none;

  &::placeholder {
    color: #4A5568;
  }

  &:focus {
    border-color: ${Colors.primary};
    background: #232831;
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
  display: flex;
  align-items: center;
  transition: color 0.2s;

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
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: ${Colors.primaryHover};
  }
`;

const FooterLink = styled.div`
  text-align: center;
  margin-top: 2rem;
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
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submetido:", { email, password });
    navigate('/dashboard');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header>
            <LogoWrapper>
              <svg width="50" height="50" viewBox="0 0 44 44" fill="none">
                <path d="M10 10L22 34L34 10" stroke={Colors.primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LogoWrapper>
            <Title>Acesse sua conta</Title>
            <Subtitle>Bem-vindo ao SAS</Subtitle>
          </Header>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>E-mail corporativo</Label>
              <Input 
                type="email" 
                placeholder="nome@empresa.com" 
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
              whileHover={{ translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              Entrar no Sistema
            </LoginButton>
          </form>

          <FooterLink>
            Esqueceu sua senha? <a href="#">Recuperar acesso</a>
          </FooterLink>
        </LoginCard>
      </Container>
    </>
  );
};

export default Login;