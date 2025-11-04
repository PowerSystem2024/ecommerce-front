import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

/**
 * Componente reutilizable de estrellas de calificación
 * 
 * @param {number} rating - Calificación actual (0-5)
 * @param {boolean} editable - Si es true, permite editar la calificación
 * @param {string} size - Tamaño de las estrellas: 'sm', 'md', 'lg'
 * @param {function} onChange - Callback cuando cambia la calificación (solo si editable)
 * @param {string} className - Clases CSS adicionales
 */
export default function RatingStars({ 
  rating = 0, 
  editable = false, 
  size = 'md',
  onChange,
  className = ''
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Tamaños de estrellas
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  // Calcular calificación a mostrar (hover o actual)
  const displayRating = isHovering && editable ? hoveredRating : rating;

  // Manejar clic en estrella
  const handleClick = (starIndex) => {
    if (editable && onChange) {
      onChange(starIndex + 1);
    }
  };

  // Manejar hover sobre estrella
  const handleMouseEnter = (starIndex) => {
    if (editable) {
      setHoveredRating(starIndex + 1);
      setIsHovering(true);
    }
  };

  // Manejar salida del hover
  const handleMouseLeave = () => {
    if (editable) {
      setIsHovering(false);
      setHoveredRating(0);
    }
  };

  return (
    <div 
      className={`flex items-center gap-0.5 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = displayRating > index;
        const isHalfFilled = displayRating === index + 0.5;
        
        return (
          <button
            key={index}
            type={editable ? 'button' : undefined}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={!editable}
            className={`
              ${editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
              ${editable ? 'hover:text-yellow-400' : ''}
              transition-colors duration-150
            `}
            aria-label={`${index + 1} estrella${index !== 0 ? 's' : ''}`}
          >
            <StarIcon 
              className={`${starSize} ${isFilled ? 'fill-current' : ''}`}
            />
          </button>
        );
      })}
    </div>
  );
}

