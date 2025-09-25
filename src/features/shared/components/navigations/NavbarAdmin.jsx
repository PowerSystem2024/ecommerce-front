import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NavbarAdmin = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/admin');
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-6 transition-colors duration-300">
      {/* Logo y título */}
      <div className="flex items-center space-x-4">
        {/* Botón hamburguesa para móvil */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">La Tiendita</h1>
          {/* Badge de Administrador */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
            <span>ADMIN</span>
          </div>
        </div>
      </div>

      {/* Elementos del lado derecho */}
      <div className="flex items-center space-x-4">
        {/* Dropdown del usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-red-600">
              <span className="text-sm leading-none text-white">👑</span>
            </div>
            
            {/* Información del usuario */}
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Administrador
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                Admin
              </div>
            </div>
            
            <svg className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl py-4 z-50 border border-gray-200 dark:border-gray-700">
              {/* Header con información del usuario */}
              <div className="px-6 pb-4 border-b border-gray-100/50 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-500/20 bg-red-600 flex items-center justify-center">
                    <span className="text-lg text-white">👑</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Administrador
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Admin • La Tiendita
                    </div>
                  </div>
                </div>
              </div>

              {/* Menú de navegación */}
              <div className="px-2">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Mi Perfil</span>
                </button>
              </div>

              {/* Separador */}
              <div className="px-6 py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* Botón de salir */}
              <div className="px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
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
