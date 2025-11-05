import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      setMessage(res?.message || 'Hemos enviado un email con instrucciones.');  
    } catch (err) {
      setError(err.message || 'No pudimos enviar el email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <style>
          {`
            @keyframes float {
              0%, 100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(30px, -30px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
            }
            
            @keyframes float2 {
              0%, 100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(-40px, 40px) scale(1.15);
              }
              66% {
                transform: translate(30px, -20px) scale(0.85);
              }
            }
            
            @keyframes float3 {
              0%, 100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(25px, 35px) scale(0.95);
              }
              66% {
                transform: translate(-35px, -25px) scale(1.1);
              }
            }
            
            .bg-light {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              z-index: 0;
              pointer-events: none;
            }
            
            .bg-light-circle {
              position: absolute;
              border-radius: 50%;
              filter: blur(80px);
              opacity: 0.6;
              animation: float 20s ease-in-out infinite;
            }
            
            .bg-light-circle:nth-child(1) {
              width: 400px;
              height: 400px;
              background: #a78bfa;
              top: 10%;
              left: 10%;
              animation-name: float;
              animation-duration: 20s;
            }
            
            .bg-light-circle:nth-child(2) {
              width: 350px;
              height: 350px;
              background: #f9a8d4;
              top: 60%;
              right: 15%;
              animation-name: float2;
              animation-duration: 25s;
            }
            
            .bg-light-circle:nth-child(3) {
              width: 450px;
              height: 450px;
              background: #60a5fa;
              bottom: 10%;
              left: 50%;
              animation-name: float3;
              animation-duration: 30s;
            }
            
            .bg-light-circle:nth-child(4) {
              width: 300px;
              height: 300px;
              background: #c084fc;
              top: 30%;
              right: 30%;
              animation-name: float;
              animation-duration: 22s;
              animation-delay: -5s;
            }

            #email::placeholder {
              color: #9ca3af;
            }
          `}
        </style>
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#faf5ff',
            zIndex: 0
          }}
        >
          <div className="bg-light">
            <div className="bg-light-circle"></div>
            <div className="bg-light-circle"></div>
            <div className="bg-light-circle"></div>
            <div className="bg-light-circle"></div>
          </div>
        </div>
        <div 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
              padding: '3rem 2.5rem',
              textAlign: 'center'
            }}
          >
            <h2 
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '1rem'
              }}
            >
              Email enviado
            </h2>   
            <p 
              style={{
                color: '#4b5563',
                marginBottom: '2rem',
                fontSize: '0.875rem'
              }}
            >
              {message || 'Revisa tu bandeja de entrada (y spam). Sigue el enlace para restablecer tu contraseña.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.1s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Volver al Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          
          @keyframes float2 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(-40px, 40px) scale(1.15);
            }
            66% {
              transform: translate(30px, -20px) scale(0.85);
            }
          }
          
          @keyframes float3 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(25px, 35px) scale(0.95);
            }
            66% {
              transform: translate(-35px, -25px) scale(1.1);
            }
          }
          
          .bg-light {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
            pointer-events: none;
          }
          
          .bg-light-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.6;
            animation: float 20s ease-in-out infinite;
          }
          
          .bg-light-circle:nth-child(1) {
            width: 400px;
            height: 400px;
            background: #a78bfa;
            top: 10%;
            left: 10%;
            animation-name: float;
            animation-duration: 20s;
          }
          
                       .bg-light-circle:nth-child(2) {
               width: 350px;
               height: 350px;
               background: #f9a8d4;
               top: 60%;
               right: 15%;
               animation-name: float2;
               animation-duration: 25s;
             }
          
          .bg-light-circle:nth-child(3) {
            width: 450px;
            height: 450px;
            background: #60a5fa;
            bottom: 10%;
            left: 50%;
            animation-name: float3;
            animation-duration: 30s;
          }
          
          .bg-light-circle:nth-child(4) {
            width: 300px;
            height: 300px;
            background: #c084fc;
            top: 30%;
            right: 30%;
            animation-name: float;
            animation-duration: 22s;
            animation-delay: -5s;
          }

          #email::placeholder {
            color: #9ca3af;
          }
        `}
      </style>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#faf5ff',
          zIndex: 0
        }}
      >
        <div className="bg-light">
          <div className="bg-light-circle"></div>
          <div className="bg-light-circle"></div>
          <div className="bg-light-circle"></div>
          <div className="bg-light-circle"></div>
        </div>
      </div>
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          style={{
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
            padding: '3rem 2.5rem'
          }}
        >
          <h2 
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}
          >
            Recuperar contraseña
          </h2>
          <p 
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}
          >
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  color: '#111827',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                placeholder="tu@email.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.75rem',
                  padding: '0.875rem'
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s, transform 0.1s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Volver al Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


