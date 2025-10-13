import React, { useState, useEffect, useRef } from "react";

const images = [
  "https://i.pinimg.com/1200x/2b/04/a8/2b04a8efe5de289053ccf87daed3e096.jpg",
  "https://i.pinimg.com/736x/e0/43/ae/e043ae1e7d167670afebce951a8e5277.jpg",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = images.length;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!mounted.current) return;
      setCurrent((p) => (p + 1) % length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, length]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + length) % length);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [length]);

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  // Ajusta este valor si tu navbar tiene otra altura (h-16 = 4rem)
  const NAV_HEIGHT_REM = 4; // 4rem = 64px

  return (
    <section
  className="relative overflow-hidden select-none w-full"
  style={{
    width: "100%",
    marginLeft: 0,
    height: `calc(100vh - ${NAV_HEIGHT_REM}rem)`,
  }}


  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
  onFocus={() => setPaused(true)}
  onBlur={() => setPaused(false)}
  aria-roledescription="carousel"
>






      <div
        className="flex transition-transform duration-700 ease-in-out will-change-transform h-full"
        style={{ transform: `translateX(calc(-100vw * ${current}))` }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-screen h-full relative bg-gray-900"
            style={{ width: "100vw" }}
          >
            <img
              src={src}
              alt={`Colección ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="block w-full h-full object-cover object-center"
            />

            {/* overlay suave para contraste */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Controles (izq / der) */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition focus:outline-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <button
            onClick={next}
            aria-label="Siguiente"
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition focus:outline-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Centro / CTA */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div className="text-center text-white pointer-events-auto px-6 sm:px-8 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
            Nueva Colección 2025
          </h1>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90">
            Prendas con diseño atemporal y tejidos premium. Envíos a todo el país.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/catalogo"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition"
            >
              Ver catálogo
            </a>

            <a
              href="/catalogo?filter=new"
              className="inline-flex items-center justify-center border border-white/70 text-white px-5 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Comprar ahora
            </a>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-2 md:h-2.5 transition-all duration-300 rounded-full ${
              i === current ? "w-10 bg-white shadow-lg" : "w-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {`Slide ${current + 1} de ${length}`}
      </div>
    </section>
  );
}