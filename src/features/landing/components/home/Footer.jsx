import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  function handleSubscribe(e) {
    e.preventDefault();
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
    setTimeout(() => setStatus(null), 3000);
  }

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Branding */}
          <div className="space-y-4">
            <a href="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
                R
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">Ropa Moderna</div>
                <div className="text-sm text-gray-500">Calidad y estilo</div>
              </div>
            </a>

            <p className="text-sm text-gray-500 leading-relaxed">
              Moda responsable. Productos seleccionados y envío rápido.
            </p>

            <div className="flex items-center gap-3 mt-3">
              {["instagram", "facebook", "twitter"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="p-2 bg-gray-100 rounded-md hover:bg-rose-100 transition"
                >
                  <i className={`bi bi-${icon} text-gray-600 hover:text-rose-500`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Tienda */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase text-sm tracking-wide">
              Tienda
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/categoria/hombre" className="hover:text-rose-500 transition">Hombre</a></li>
              <li><a href="/categoria/mujer" className="hover:text-rose-500 transition">Mujer</a></li>
              <li><a href="/categoria/accesorios" className="hover:text-rose-500 transition">Accesorios</a></li>
              <li><a href="/ofertas" className="hover:text-rose-500 transition">Ofertas</a></li>
            </ul>
          </div>

          {/* Atención */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase text-sm tracking-wide">
              Atención
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/preguntas" className="hover:text-rose-500 transition">Preguntas frecuentes</a></li>
              <li><a href="/envios" className="hover:text-rose-500 transition">Envíos y devoluciones</a></li>
              <li><a href="/contacto" className="hover:text-rose-500 transition">Contacto</a></li>
              <li><a href="/tiendas" className="hover:text-rose-500 transition">Nuestras tiendas</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase text-sm tracking-wide">
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Recibí novedades, lanzamientos y descuentos exclusivos.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md shadow-md transition"
              >
                Suscribir
              </button>
            </form>

            {status === "ok" && (
              <p className="mt-3 text-sm text-emerald-500">¡Gracias! Te enviamos un correo.</p>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm text-rose-500">Email inválido.</p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ropa Moderna. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="/politica-privacidad" className="hover:text-gray-700 transition">Política de privacidad</a>
            <a href="/terminos" className="hover:text-gray-700 transition">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
