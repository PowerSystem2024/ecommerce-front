import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/AuthContext';
import userService from '../../../user-profile/services/userService';
import { useCart } from '../../../cart/context/useCart';
import logo from '/src/assets/logo.png';

export const NavbarUser = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { totalCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getAvatarUrl = useCallback(() => {
    const ctx = user?.avatar || user?.photoURL || user?.image || user?.picture || user?.profileImage || user?.profilePhoto || user?.profile?.avatar || user?.profile?.image || '';
    if (ctx) return ctx;
    try {
      const saved = JSON.parse(localStorage.getItem('userData') || 'null');
      return saved?.avatar || '';
    } catch { return ''; }
  }, [user]);
  const getInitial = () => (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hidratar avatar si el contexto no lo tiene aún (navegación directa a /shop, etc.)
  useEffect(() => {
    const avatarNow = getAvatarUrl();
    if (!avatarNow) {
      userService.getProfile().then((res) => {
        const profile = res?.data || res;
        if (profile?.avatar) {
          if (updateUser) updateUser({ avatar: profile.avatar });
          try {
            localStorage.setItem('userData', JSON.stringify({ avatar: profile.avatar }));
          } catch (e) {
            console.warn('No se pudo persistir avatar en localStorage', e);
          }
        }
      }).catch(() => null);
    }
  }, [getAvatarUrl, updateUser, user]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F0F10] backdrop-blur-lg border-b border-[#2A2A2A] h-16 flex items-center justify-between px-4 lg:px-8 text-[#FFFFFF] font-['Orbitron',_sans-serif] shadow-[0_2px_20px_rgba(15,15,16,0.8)]">
      {/* Logo - Solo en desktop */}
          <button 
            onClick={() => navigate('/shop')}
        className="hidden md:flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="h-8 w-8 object-cover rounded-md" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-[#FFFFFF] tracking-[0.1em] uppercase font-['Orbitron',_sans-serif]">
              La Tiendita
            </h1>
          </button>

      {/* Menú hamburguesa - Solo en móvil */}
      <div className="md:hidden relative" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#2A2A2A] transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </button>

        {/* Dropdown del menú móvil */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 mt-3 w-64 bg-[#0F0F10]/95 text-[#FFFFFF] rounded-2xl shadow-xl py-3 z-50 border border-[#2A2A2A] backdrop-blur-md">
            <div className="px-4 pb-3 border-b border-[#2A2A2A]/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Logo" className="h-9 w-9 object-cover rounded-md" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#FFFFFF] font-['Orbitron',_sans-serif] tracking-[0.1em] uppercase">
                    La Tiendita
                  </div>
                  <div className="text-xs text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                    Navegación
                  </div>
                </div>
              </div>
            </div>

            <div className="px-2 py-2 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/shop');
                }}
                className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <svg className="w-5 h-5 text-[#E11D74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-bold text-[#FFFFFF] tracking-[0.1em] uppercase font-['Quantico',_sans-serif]">Tienda</span>
              </button>

              

              {/* Separador */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent my-2"></div>

              {/* Enlaces de usuario */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <svg className="w-5 h-5 text-[#E11D74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-bold text-[#FFFFFF] tracking-[0.1em] uppercase font-['Quantico',_sans-serif]">Mi Perfil</span>
              </button>

              

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/cart');
                }}
                className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <svg className="w-5 h-5 text-[#E11D74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-bold text-[#FFFFFF] tracking-[0.1em] uppercase font-['Quantico',_sans-serif]">Carrito</span>
              </button>
            </div>
          </div>
        )}
      </div>

       {/* Navegación principal */}
       <div className="hidden md:flex items-center space-x-6">
         <button 
           onClick={() => navigate('/shop')} 
          className="text-lg font-bold text-[#CFCFCF] hover:text-[#E11D74] transition-all duration-300 hover:scale-105 tracking-[0.1em] uppercase font-['Quantico',_sans-serif]"
         >
           Tienda
         </button>
         
       </div>

      {/* Acciones lado derecho */}
      <div className="flex items-center space-x-3">

        

        {/* Carrito */}
          <button
            onClick={() => navigate('/cart')}
          className="relative p-2 rounded-lg text-[#CFCFCF] hover:text-[#E11D74] hover:bg-[#2A2A2A] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E11D74] text-[#FFFFFF] text-xs font-bold rounded-full flex items-center justify-center">
              {totalCount ?? 0}
            </span>
          </button>

        {/* Dropdown usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#2A2A2A] transition-all"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6]">
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()} alt={user?.name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm leading-none text-[#FFFFFF] font-bold">{getInitial()}</span>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-[#CFCFCF] transition-transform hidden sm:block ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-[#0F0F10]/95 text-[#FFFFFF] rounded-2xl shadow-xl py-3 z-50 border border-[#2A2A2A] backdrop-blur-md">
              <div className="px-4 pb-3 border-b border-[#2A2A2A]/60">
                  <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#6D28D9]/30 bg-[#6D28D9] flex items-center justify-center">
                    {getAvatarUrl() ? (
                      <img src={getAvatarUrl()} alt={user?.name || 'Avatar'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg text-[#FFFFFF] font-bold">{getInitial()}</span>
                    )}
                    </div>
                    <div>
                    <div className="text-sm font-semibold text-[#FFFFFF] font-['Rajdhani',_sans-serif]">{user?.name || 'Usuario'}</div>
                    <div className="text-xs text-[#CFCFCF] font-['Rajdhani',_sans-serif]">{user?.email || 'usuario@email.com'}</div>
                  </div>
                  </div>
                </div>

              <div className="px-2 py-2 space-y-1">
                {/* Sección principal */}
                <DropdownItem icon="user" label="Mi Perfil" onClick={() => navigate('/profile')} />
                <DropdownItem icon="bag" label="Mis Pedidos" onClick={() => navigate('/order-history')} />
                
                </div>

                <div className="px-4 py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent"></div>
                </div>

                <div className="px-2">
                  <button
                    onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-[#E11D74] hover:bg-[#E11D74]/10 rounded-lg transition-all font-['Rajdhani',_sans-serif]"
                  >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

    </nav>
  );
};

/* 🔧 Componente auxiliar para items del dropdown */
const DropdownItem = ({ icon, label, onClick }) => {
  const icons = {
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    bag: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    map: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
    history: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm hover:bg-[#2A2A2A] hover:scale-[1.02] rounded-lg transition-all duration-200 font-['Rajdhani',_sans-serif] group"
    >
      <svg className="w-5 h-5 text-[#E11D74] group-hover:text-[#FFFFFF] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
      <span className="font-medium text-[#FFFFFF] group-hover:text-[#E11D74] transition-colors duration-200">{label}</span>
    </button>
  );
};
