import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { ApiUrls } from '../constants/api_urls';

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
  color: #333;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  background: ${gradientBackground};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Message = styled.p`
  color: #555;
  font-size: 18px;
  margin: 20px 0;
  line-height: 1.6;
`;

const WarningIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f39c12;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  &:after {
    content: '!';
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
    background: #ccc;
  }
`;

const ResendMessage = styled.p`
  color: ${props => props.success ? '#2ecc71' : '#e74c3c'};
  font-size: 14px;
  margin-top: 10px;
`;

const RsendVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    setIsLoading(true);
    setResendStatus(null);
    
    try {
      // Replace with your actual API call
     
      const response = await axios.post(
        ApiUrls.RESEND_VERIFY_EMAIL,
        {}, // 👈 Empty request body (if you're not sending any data)
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (response.data.status === 1) {
        setResendStatus({ success: true, message: 'Verification email sent successfully!' });
      } else {
        const errorData = await response.json();
        setResendStatus({ success: false, message: errorData.message || 'Failed to send verification email' });
      }
    } catch (error) {
      setResendStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user session
localStorage.removeItem('auth_user');     
  localStorage.removeItem('auth_token');     
  navigate('/login');
  };

  return (
    <Container>
      <Card>
        <WarningIcon />
        <Title>Email Not Verified</Title>
        <Message>
          Your email address has not been verified yet. Please check your inbox for the verification email.
        </Message>
        <Message>
          Didn't receive the email? Click below to resend the verification link.
        </Message>
        
        <Button 
          onClick={handleResendVerification} 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </Button>
        
        {resendStatus && (
          <ResendMessage success={resendStatus.success}>
            {resendStatus.message}
          </ResendMessage>
        )}
        
        <Button 
          onClick={handleLogout}
          style={{ 
            background: 'transparent', 
            color: '#667eea',
            border: '1px solid #667eea',
            marginTop: '10px'
          }}
        >
          Logout
        </Button>
      </Card>
    </Container>
  );
};

export default RsendVerifyEmail;