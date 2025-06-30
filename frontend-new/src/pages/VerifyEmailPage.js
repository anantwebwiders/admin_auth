import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ApiUrls } from '../constants/api_urls';
import axios from 'axios';

// === STYLES ===

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${gradientBackground};
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  background: ${gradientBackground};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Message = styled.p`
  color: ${props => (props.error ? '#e74c3c' : '#2ecc71')};
  font-size: 18px;
  margin: 20px 0;
  line-height: 1.6;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${gradientBackground};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  &:after {
    content: '✓';
    color: white;
    font-size: 40px;
    font-weight: bold;
  }
`;

const Button = styled.button`
  background: ${gradientBackground};
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// === COMPONENT ===

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Ref to prevent multiple API calls
  const hasRequested = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasRequested.current) return; // ✅ avoid duplicate API call

      hasRequested.current = true;

      try {
        const response = await axios.get(`${ApiUrls.VERIFY_EMAIL}${token}`);
        console.log(response.data);

        if (response.data?.status === 1) {
          setMessage('Your email has been successfully verified!');
          setIsSuccess(true);

          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setMessage(response.data?.message || 'Invalid or expired verification link.');
          setIsSuccess(false);
        }
      } catch (error) {
        const errMsg = error?.response?.data?.message || 'Something went wrong.';
        setMessage(errMsg);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage('Invalid or missing token.');
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [token, navigate]);

  return (
    <Container>
      <Card>
        <Title>Email Verification</Title>

        {isLoading ? (
          <>
            <Spinner />
            <Message>{message}</Message>
          </>
        ) : isSuccess ? (
          <>
            <SuccessIcon />
            <Message>{message}</Message>
            <p style={{ fontSize: '14px', color: '#555' }}>
              Redirecting to login in 3 seconds...
            </p>
          </>
        ) : (
          <>
            <Message error>{message}</Message>
            <Button onClick={() => navigate('/')}>Go to Homepage</Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default VerifyEmailPage;
