import React from 'react';

/**
 * Componente de paginación para reseñas
 * 
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {function} onPageChange - Callback cuando cambia la página
 * @param {number} maxVisiblePages - Máximo de números de página visibles (default: 5)
 * @param {string} className - Clases CSS adicionales
 */
export default function ReviewsPagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  maxVisiblePages = 5,
  className = '' 
}) {
  // Si solo hay una página, no mostrar paginación
  if (totalPages <= 1) {
    return null;
  }

  // Calcular páginas visibles
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Ajustar si estamos cerca del inicio o fin
    if (endPage - startPage < maxVisiblePages - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Botón Anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium font-['Rajdhani',_sans-serif]
          transition-all duration-200
          ${hasPrevious 
            ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white hover:from-[#6D28D9] hover:to-[#8B5CF6] cursor-pointer shadow-lg' 
            : 'bg-white/30 text-[#CFCFCF] cursor-not-allowed'
          }
        `}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {/* Primera página si no está visible */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg text-sm font-medium font-['Rajdhani',_sans-serif] text-[#0F0F10] bg-white/80 hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white transition-colors border border-white/30"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-[#CFCFCF] font-['Rajdhani',_sans-serif]">...</span>
            )}
          </>
        )}

        {/* Páginas visibles */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium font-['Rajdhani',_sans-serif]
              transition-all duration-200
              ${page === currentPage
                ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white scale-105 shadow-lg'
                : 'text-[#0F0F10] bg-white/80 hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white border border-white/30'
              }
            `}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Última página si no está visible */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-[#CFCFCF] font-['Rajdhani',_sans-serif]">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-lg text-sm font-medium font-['Rajdhani',_sans-serif] text-[#0F0F10] bg-white/80 hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white transition-colors border border-white/30"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium font-['Rajdhani',_sans-serif]
          transition-all duration-200
          ${hasNext 
            ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white hover:from-[#6D28D9] hover:to-[#8B5CF6] cursor-pointer shadow-lg' 
            : 'bg-white/30 text-[#CFCFCF] cursor-not-allowed'
          }
        `}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </div>
  );
}

