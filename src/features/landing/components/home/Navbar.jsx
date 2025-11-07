import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '/src/assets/logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const handleEsc = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleScrollTo = (id) => {
    // Si el objetivo es contacto, siempre navegar a /contact
    if (id === '#contact') {
      navigate('/contact');
      setMenuOpen(false);
      return;
    }
    // Si estamos en la landing page, navegar a /about (sin hash para comenzar desde arriba)
    if (location.pathname === '/') {
      navigate('/about');
      setMenuOpen(false);
      return;
    }
    // Si estamos en /about, intentar hacer scroll si existe la sección
    if (location.pathname === '/about') {
      const section = document.querySelector(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
        return;
      }
    }
    // Si estamos en otra página, navegar a /about (sin hash para comenzar desde arriba)
    navigate('/about');
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black/70"
      }`}
    >
      <nav className="flex items-center justify-between h-16 w-full px-6 md:px-12">
        {/* LOGO */}
        <a href="/" className="flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
          <div className="h-12 w-12 rounded-md bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center shadow-md overflow-hidden">
            <img src={logo} alt="Logo" className="h-11 w-11 object-cover rounded-md" />
          </div>
          <span className="font-orbitron text-white text-lg tracking-wider uppercase">
            Fatal Store
          </span>
        </a>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleScrollTo("#about")}
            className="text-white hover:text-[#E11D74] font-rajdhani font-medium transition duration-300 transform hover:scale-105"
          >
            SOBRE NOSOTROS
          </button>
          <button
            onClick={() => handleScrollTo("#contact")}
            className="text-white hover:text-[#E11D74] font-rajdhani font-medium transition duration-300 transform hover:scale-105"
          >
            CONTACTO
          </button>
          <a
            href="/login"
            className="bg-[#2A2A2A] hover:bg:white hover:text-[#2A2A2A] transition duration-300 rounded-md px-4 py-2 font-quantico text-white font-semibold shadow hover:shadow-lg transform hover:scale-105"
          >
            INICIAR SESIÓN
          </a>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 rounded-md transition-transform duration-300 hover:scale-110"
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="md:hidden bg:black/95 backdrop-blur-md px-6 py-4 space-y-3 shadow-lg animate-fadeIn">
          <button
            onClick={() => handleScrollTo("#about")}
            className="block w-full text-left text-white hover:text-[#E11D74] font-rajdhani transition duration-300 transform hover:scale-105"
          >
            SOBRE NOSOTROS
          </button>
          <button
            onClick={() => handleScrollTo("#contact")}
            className="block w-full text-left text-white hover:text-[#E11D74] font-rajdhani transition duration-300 transform hover:scale-105"
          >
            CONTACTO
          </button>
          <a
            href="/login"
            className="block w-full text-center bg-[#2A2A2A] hover:bg:white hover:text-[#2A2A2A] font-quantico text-white py-2 rounded-md transition duration-300 shadow hover:shadow-lg transform hover:scale-105"
            onClick={() => setMenuOpen(false)}
          >
            INICIAR SESIÓN
          </a>
        </div>
      )}
    </header>
  );
}
