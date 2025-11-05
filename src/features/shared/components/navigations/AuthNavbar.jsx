import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/AuthContext';

export default function AuthNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm overflow-x-hidden">
      <nav className="flex items-center justify-between h-16 w-full px-6 md:px-12 overflow-hidden">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="font-semibold text-gray-800 text-lg tracking-wide">
            Ropa Moderna
          </span>
        </Link>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/about"
            className="text-gray-700 hover:text-gray-900 transition font-medium"
          >
            SOBRE NOSOTROS
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-gray-900 transition font-medium"
          >
            CONTACTO
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/shop"
                className="text-gray-700 hover:text-gray-900 transition font-medium"
              >
              </Link>
              <button
                onClick={handleLogout}
                className="border border-gray-700 hover:bg-gray-800 hover:text-white transition rounded-md px-4 py-2 text-sm font-medium"
              >
                CERRAR SESIÓN
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-gray-700 hover:bg-gray-800 hover:text-white transition rounded-md px-4 py-2 text-sm font-medium"
            >
              INICIAR SESIÓN
            </Link>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-md"
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3 shadow-lg">
          <Link
            to="/about"
            className="block w-full text-left text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            SOBRE NOSOTROS
          </Link>
          <Link
            to="/contact"
            className="block w-full text-left text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            CONTACTO
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/shop"
                className="block w-full text-left text-gray-700 hover:text-gray-900 transition"
                onClick={() => setMenuOpen(false)}
              >
                TIENDA
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-gray-900 transition"
              >
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-gray-700 hover:text-gray-900 font-medium border border-gray-700 rounded-md text-center py-2 transition"
              onClick={() => setMenuOpen(false)}
            >
              INICIAR SESIÓN
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
