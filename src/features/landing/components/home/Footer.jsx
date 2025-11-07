import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0F0F10] text-gray-300 border-t border-gray-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col items-center gap-6">
          
          {/* Logo e información de contacto */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <a href="/" className="inline-flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
                  R
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">Fatal Store</div>
                  <div className="text-sm text-gray-400">Calidad y estilo</div>
                </div>
              </a>
            </div>

            {/* Información de contacto */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">fatalstore@gmail.com</p>
              <p className="text-sm text-gray-400 mt-1">+11 45893762</p>
              <p className="text-sm text-gray-400 mt-1">Buenos Aires, Argentina</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 border-t border-gray-800 pt-6 text-center w-full">
            <p className="text-sm text-gray-400">
              {new Date().getFullYear()} Fatal Store. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}