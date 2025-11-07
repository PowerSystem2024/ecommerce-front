import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    // Verificar si hay un token activo
    const token = localStorage.getItem('token');
    
    // No redirigir si no hay token
    if (!token) {
      return;
    }
    
    // Solo redirigir si hay un usuario autenticado
    if (isAuthenticated && user) {
      // Pequeño retraso para asegurar que todo esté listo
      const timer = setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/shop', { replace: true });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
    }
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('¡Registro exitoso! Verifica tu email para poder iniciar sesión.');
    }
  }, [searchParams]);

  // Cargar fuente Rajdhani de Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);

      // Redirigir según el rol del usuario
      if (result?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

    return (
    <>
      <style>
        {`
          #email::placeholder,
          #password::placeholder {
            color: rgba(180, 180, 180, 0.4);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 400;
            letter-spacing: 0.03em;
          }
          
          #email:not(:placeholder-shown),
          #password:not(:placeholder-shown) {
            background: rgba(15, 10, 20, 0.85) !important;
            color: #d0d0d0 !important;
          }
          
          #email:-webkit-autofill,
          #email:-webkit-autofill:hover,
          #email:-webkit-autofill:focus,
          #password:-webkit-autofill,
          #password:-webkit-autofill:hover,
          #password:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px rgba(15, 10, 20, 0.9) inset !important;
            -webkit-text-fill-color: #d0d0d0 !important;
            border: 1px solid rgba(139, 0, 139, 0.3) !important;
          }
          
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
          <h2
            style={{
              marginTop: '0',
              marginBottom: '2rem',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: '900',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: "'Orbitron', 'Rajdhani', 'Exo 2', 'Arial Black', sans-serif",
              background: 'linear-gradient(135deg,rgb(144, 144, 155) 0%,rgb(138, 133, 133) 50%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.9)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(42, 35, 35, 0.86)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))'
            }}
          >
            Iniciar Sesión
          </h2>
          {successMessage && (
            <div
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#90ee90', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>{successMessage}</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: '2rem'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              Email
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
              placeholder="Email"
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

          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
                placeholder="Contraseña"
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

          {error && (
            <div
              style={{
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

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '1rem',
                border: '1px solid rgba(220, 20, 60, 0.4)',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
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
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(147, 51, 234, 0.2)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <Link
              to="/register"
              style={{
                fontSize: '0.875rem',
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
              Crear cuenta
            </Link>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.875rem',
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
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


