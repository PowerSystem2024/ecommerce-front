"use client";  
  
import { useEffect, useRef } from "react";  
import { tsParticles } from "@tsparticles/engine";  
import { loadFull } from "tsparticles";  
import { loadTextShape } from "@tsparticles/shape-text";  
  
export default function GlobalBackground() {  
  const containerRef = useRef(null);  
  
  useEffect(() => {  
    const initParticles = async () => {  
      try {
        await loadFull(tsParticles);  
        await loadTextShape(tsParticles);  // Cargar soporte para caracteres
        
        if (containerRef.current) {  
          await tsParticles.load({  
            id: "tsparticles-shop",  
            element: containerRef.current,  
            options: {  
              fullScreen: {  
                enable: false  
              },  
              background: {  
                color: {  
                  value: "transparent",  // Transparente porque el gradiente está en el div contenedor
                },  
              },  
              fpsLimit: 60,  
              particles: {  
                number: {  
                  value: 35,
                  density: {  
                    enable: true,  
                    area: 800,  
                  },  
                },  
                color: {  
                  value: ["#E11D74", "#6D28D9", "#8B5CF6"],  // Paleta de colores: fucsia, violeta, lavanda
                },  
                opacity: {  
                  value: { min: 0.3, max: 0.6 },  
                },  
                shape: {  
                  type: "character",  
                  options: {  
                    character: {  
                      // Iconos góticos/alternativos acordes a la estética de la página
                      value: ["🖤", "🔥", "🦇", "💀", "👻", "★"],  
                      font: "Verdana",  
                      style: "",  
                      weight: "900",  
                      fill: true  
                    }  
                  }  
                },  
                size: {  
                  value: { min: 8, max: 16 },  
                },  
                move: {  
                  enable: true,  
                  speed: 0.4,  
                  direction: "none",  
                  random: true,  
                  straight: false,  
                  outModes: {  
                    default: "bounce",  
                  },  
                }  
              },  
              detectRetina: true,  
            }  
          });  
        }
      } catch (error) {
        console.error("Error cargando tsparticles:", error);
      }
    };  
  
    initParticles();  
  }, []);  
  
  return (  
    <div   
      ref={containerRef}  
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
      
        background: "linear-gradient(135deg, #0F0F10 0%, #4A0D2E 25%, #0F0F10 50%, #3D1A4A 75%, #0F0F10 100%)",
      }}
    />  
  );  
}