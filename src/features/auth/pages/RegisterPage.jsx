import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cargar fuente Rajdhani de Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(true);
      
      // Redirigir automáticamente después de 10 segundos
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 10000);
      
    } catch (error) {
      setError(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
              background: rgba(139, 0, 139, 0.4);
              top: 10%;
              left: 10%;
              animation-name: float;
              animation-duration: 20s;
            }
            
            .bg-light-circle:nth-child(2) {
              width: 350px;
              height: 350px;
              background: rgba(220, 20, 60, 0.3);
              top: 60%;
              right: 15%;
              animation-name: float2;
              animation-duration: 25s;
            }
            
            .bg-light-circle:nth-child(3) {
              width: 450px;
              height: 450px;
              background: rgba(75, 0, 130, 0.25);
              bottom: 10%;
              left: 50%;
              animation-name: float3;
              animation-duration: 30s;
            }
            
            .bg-light-circle:nth-child(4) {
              width: 300px;
              height: 300px;
              background: rgba(139, 0, 139, 0.35);
              top: 30%;
              right: 30%;
              animation-name: float;
              animation-duration: 22s;
              animation-delay: -5s;
            }

            #name::placeholder,
            #email::placeholder,
            #password::placeholder,
            #confirmPassword::placeholder {
              color: rgba(180, 180, 180, 0.4);
              font-family: 'Rajdhani', sans-serif;
              font-weight: 400;
              letter-spacing: 0.03em;
            }
            
            #name:not(:placeholder-shown),
            #email:not(:placeholder-shown),
            #password:not(:placeholder-shown),
            #confirmPassword:not(:placeholder-shown) {
              background: rgba(15, 10, 20, 0.85) !important;
              color: #d0d0d0 !important;
            }
            
            #name:-webkit-autofill,
            #name:-webkit-autofill:hover,
            #name:-webkit-autofill:focus,
            #email:-webkit-autofill,
            #email:-webkit-autofill:hover,
            #email:-webkit-autofill:focus,
            #password:-webkit-autofill,
            #password:-webkit-autofill:hover,
            #password:-webkit-autofill:focus,
            #confirmPassword:-webkit-autofill,
            #confirmPassword:-webkit-autofill:hover,
            #confirmPassword:-webkit-autofill:focus {
              -webkit-box-shadow: 0 0 0px 1000px rgba(15, 10, 20, 0.9) inset !important;
              -webkit-text-fill-color: #d0d0d0 !important;
              border: 1px solid rgba(139, 0, 139, 0.3) !important;
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
            backgroundColor: '#000000',
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(220, 20, 60, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(139, 0, 139, 0.25) 0%, transparent 45%),
              radial-gradient(ellipse at 40% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(220, 20, 60, 0.2) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 50%, rgba(128, 0, 128, 0.15) 0%, transparent 60%),
              linear-gradient(180deg, #0a0a0f 0%, #1a0a14 50%, #0a0a0f 100%)
            `,
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
              backgroundColor: 'rgba(15, 15, 20, 0.25)',
              backdropFilter: 'blur(25px) saturate(140%)',
              WebkitBackdropFilter: 'blur(25px) saturate(140%)',
              borderRadius: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(139, 0, 139, 0.2), 0 0 120px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
              padding: '3rem 2.5rem',
              textAlign: 'center'
            }}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full" style={{ margin: '0 auto', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <svg className="h-8 w-8" style={{ color: '#86efac' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 
              style={{
                marginTop: '1.5rem',
                fontSize: '2rem',
                fontWeight: '900',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontFamily: "'Orbitron', 'Rajdhani', 'Exo 2', 'Arial Black', sans-serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.9)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))'
              }}
            >
              ¡Registro Exitoso!
            </h2>

            <p style={{ marginTop: '1rem', color: '#d0d0d0', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>
              Te hemos enviado un email de verificación a <strong style={{ color: '#e0e0e0', fontFamily: "'Rajdhani', sans-serif" }}>{formData.email}</strong>
            </p>

            <div 
              style={{
                marginTop: '1.5rem',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '0.75rem',
                padding: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#da70d6', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>
                📧 Revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
              </p>
              <p style={{ fontSize: '0.75rem', color: '#ff1493', marginTop: '0.5rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>
                ⏰ El enlace expira en 24 horas. Si no recibes el email, revisa tu carpeta de spam.
              </p>
              <p style={{ fontSize: '0.75rem', color: '#ff1493', marginTop: '0.5rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>
                🔄 Serás redirigido automáticamente al login en unos segundos...
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/login"
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(90deg, #dc143c 0%, #c71585 30%, #8b008b 70%, #4b0082 100%)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                  background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)',
                  border: '1px solid rgba(220, 20, 60, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.5) 0%, rgba(139, 0, 139, 0.6) 50%, rgba(75, 0, 130, 0.5) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(220, 20, 60, 0.2)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                }}
              >
                Ir al Login
              </Link>

              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  border: '1px solid rgba(147, 51, 234, 0.4)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#d4d4d8',
                  backgroundColor: 'rgba(15, 15, 25, 0.8)',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 30, 0.95)';
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 15, 25, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)';
                }}
              >
                Registrarse de Nuevo
              </button>
            </div>
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

          #name::placeholder,
          #email::placeholder,
          #password::placeholder,
          #confirmPassword::placeholder {
            color: rgba(180, 180, 180, 0.4);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 400;
            letter-spacing: 0.03em;
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
          backgroundColor: '#000000',
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(220, 20, 60, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 0, 139, 0.25) 0%, transparent 45%),
            radial-gradient(ellipse at 40% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(220, 20, 60, 0.2) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(128, 0, 128, 0.15) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0f 0%, #1a0a14 50%, #0a0a0f 100%)
          `,
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
            backgroundColor: 'rgba(15, 15, 20, 0.25)',
            backdropFilter: 'blur(25px) saturate(140%)',
            WebkitBackdropFilter: 'blur(25px) saturate(140%)',
            borderRadius: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(139, 0, 139, 0.2), 0 0 120px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
            padding: '3rem 2.5rem',
            margin: '0 auto'
          }}
        >
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full" style={{ margin: '0 auto', backgroundColor: 'rgba(147, 51, 234, 0.15)', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
              <svg className="h-6 w-6" style={{ color: '#c084fc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 
              style={{
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: '900',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontFamily: "'Orbitron', 'Rajdhani', 'Exo 2', 'Arial Black', sans-serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.9)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))'
              }}
            >
              Crear Cuenta
            </h2>
            <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#d0d0d0', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                style={{
                  fontWeight: '500',
                  color: '#ff1493',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.04em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff69b4';
                  e.target.style.textShadow = '0 0 10px rgba(255, 20, 147, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#ff1493';
                  e.target.style.textShadow = 'none';
                }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            style={{
              marginTop: '2rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                      e.target.style.color = '#d0d0d0';
                    } else {
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                      e.target.style.color = '#d0d0d0';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid rgba(139, 0, 139, 0.3)',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    color: '#d0d0d0',
                    backgroundColor: 'rgba(10, 10, 15, 0.7)',
                    outline: 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '400'
                  }}
                  placeholder="Tu nombre completo"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                    e.target.style.color = '#e0e0e0';
                    e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                    e.target.style.boxShadow = 'none';
                    if (e.target.value) {
                      e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                      e.target.style.color = '#d0d0d0';
                    } else {
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                      e.target.style.color = '#d0d0d0';
                    }
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                      e.target.style.color = '#d0d0d0';
                    } else {
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                      e.target.style.color = '#d0d0d0';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '1px solid rgba(139, 0, 139, 0.3)',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    color: '#d0d0d0',
                    backgroundColor: 'rgba(10, 10, 15, 0.7)',
                    outline: 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '400'
                  }}
                  placeholder="tu@email.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                    e.target.style.color = '#e0e0e0';
                    e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                    e.target.style.boxShadow = 'none';
                    if (e.target.value) {
                      e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                      e.target.style.color = '#d0d0d0';
                    } else {
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                      e.target.style.color = '#d0d0d0';
                    }
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                        e.target.style.color = '#d0d0d0';
                      } else {
                        e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                        e.target.style.color = '#d0d0d0';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.875rem 3rem 0.875rem 1rem',
                      border: '1px solid rgba(139, 0, 139, 0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      color: '#d0d0d0',
                      backgroundColor: 'rgba(10, 10, 15, 0.7)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: '400'
                    }}
                    placeholder="Mínimo 6 caracteres"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                      e.target.style.color = '#e0e0e0';
                      e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                      e.target.style.boxShadow = 'none';
                      if (e.target.value) {
                        e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                        e.target.style.color = '#d0d0d0';
                      } else {
                        e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                        e.target.style.color = '#d0d0d0';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#da70d6',
                      transition: 'color 0.3s ease'
                    }}
                    tabIndex={-1}
                    onMouseEnter={(e) => e.target.style.color = '#ff1493'}
                    onMouseLeave={(e) => e.target.style.color = '#da70d6'}
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
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                  Confirmar contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                        e.target.style.color = '#d0d0d0';
                      } else {
                        e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                        e.target.style.color = '#d0d0d0';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.875rem 3rem 0.875rem 1rem',
                      border: '1px solid rgba(139, 0, 139, 0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      color: '#d0d0d0',
                      backgroundColor: 'rgba(10, 10, 15, 0.7)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: '400'
                    }}
                    placeholder="Repite tu contraseña"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                      e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                      e.target.style.color = '#e0e0e0';
                      e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                      e.target.style.boxShadow = 'none';
                      if (e.target.value) {
                        e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                        e.target.style.color = '#d0d0d0';
                      } else {
                        e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                        e.target.style.color = '#d0d0d0';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#da70d6',
                      transition: 'color 0.3s ease'
                    }}
                    tabIndex={-1}
                    onMouseEnter={(e) => e.target.style.color = '#ff1493'}
                    onMouseLeave={(e) => e.target.style.color = '#da70d6'}
                  >
                    {showConfirmPassword ? (
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
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.875rem',
                  marginBottom: '1.5rem'
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#ff6b6b', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>{error}</p>
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  borderRadius: '0.75rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)',
                  border: '1px solid rgba(220, 20, 60, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.5) 0%, rgba(139, 0, 139, 0.6) 50%, rgba(75, 0, 130, 0.5) 100%)';
                    e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                    e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)';
                    e.target.style.borderColor = 'rgba(220, 20, 60, 0.4)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(220, 20, 60, 0.2)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Registrando...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
