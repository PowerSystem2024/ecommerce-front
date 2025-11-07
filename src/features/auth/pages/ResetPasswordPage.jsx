import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!token) {
      setError('Token inválido');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setMessage(res?.message || 'Contraseña actualizada correctamente');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message || 'No pudimos actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

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

          #password::placeholder,
          #confirm::placeholder {
            color: rgba(180, 180, 180, 0.4);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 400;
            letter-spacing: 0.03em;
          }
          
          #password:not(:placeholder-shown),
          #confirm:not(:placeholder-shown) {
            background: rgba(15, 10, 20, 0.85) !important;
            color: #d0d0d0 !important;
          }
          
          #password:-webkit-autofill,
          #password:-webkit-autofill:hover,
          #password:-webkit-autofill:focus,
          #confirm:-webkit-autofill,
          #confirm:-webkit-autofill:hover,
          #confirm:-webkit-autofill:focus {
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
        <div 
          className="max-w-md w-full space-y-6 p-8 rounded-lg"
          style={{
            backgroundColor: 'rgba(30, 30, 35, 0.25)',
            backdropFilter: 'blur(20px) saturate(120%)',
            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(139, 0, 139, 0.2), 0 0 120px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
          }}
        >
          <h2 className="text-2xl font-bold text-center" style={{ color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Orbitron', 'Rajdhani', 'Exo 2', 'Arial Black', sans-serif", fontWeight: '900', background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.9)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))' }}>Restablecer contraseña</h2>
          {message && (
            <div className="rounded-md p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <p className="text-sm" style={{ color: '#90ee90', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>{message}</p>
            </div>
          )}
          {error && (
            <div className="rounded-md p-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p className="text-sm" style={{ color: '#ff6b6b', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>Nueva contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
                required
                className="mt-1 block w-full rounded-md px-3 py-2 focus:outline-none transition-all duration-300"
                style={{
                  border: '1px solid rgba(139, 0, 139, 0.3)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  color: '#d0d0d0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '400',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease'
                }}
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
              <label htmlFor="confirm" className="block text-sm font-medium" style={{ color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>Confirmar contraseña</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
                required
                className="mt-1 block w-full rounded-md px-3 py-2 focus:outline-none transition-all duration-300"
                style={{
                  border: '1px solid rgba(139, 0, 139, 0.3)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  color: '#d0d0d0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '400',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease'
                }}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white disabled:opacity-60 transition-all duration-300"
              style={{
                fontWeight: '600',
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
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}


