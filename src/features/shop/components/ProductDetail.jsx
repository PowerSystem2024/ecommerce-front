import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { useCart } from '../../cart/context/useCart'
import ReviewsSection from './ReviewsSection'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetail({ product, open, onClose }) {
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  // Normalizar colores y tallas desde el producto (sin datos hardcodeados)
  // IMPORTANTE: Los hooks deben estar siempre antes de cualquier return condicional
  const colors = useMemo(() => {
    if (!product) return []
    
    // Normalizar colores: puede venir como array de strings o array de objetos
    const productColors = product.colors || []
    if (productColors.length === 0) {
      return [] // No hay colores, retornar array vacío
    }
    
    // Si es array de strings, convertirlos a objetos
    if (typeof productColors[0] === 'string') {
      // Mapeo de colores comunes a clases de Tailwind
      const colorClasses = {
        'gris': 'bg-gray-400 checked:outline-gray-400',
        'negro': 'bg-gray-900 checked:outline-gray-900',
        'blanco': 'bg-white checked:outline-gray-300',
        'azul': 'bg-blue-500 checked:outline-blue-500',
        'rojo': 'bg-red-500 checked:outline-red-500',
        'verde': 'bg-green-500 checked:outline-green-500',
        'amarillo': 'bg-yellow-500 checked:outline-yellow-500',
        'rosa': 'bg-pink-500 checked:outline-pink-500',
        'morado': 'bg-purple-500 checked:outline-purple-500',
        'naranja': 'bg-orange-500 checked:outline-orange-500',
      }
      
      return productColors.map((color) => {
        const colorLower = color.toLowerCase().trim()
        const classes = colorClasses[colorLower] || 'bg-gray-600 checked:outline-gray-600'
        return {
          id: colorLower.replace(/\s+/g, '-'),
          name: color,
          classes: classes
        }
      })
    }
    
    // Si ya es array de objetos, retornarlo tal cual
    return productColors
  }, [product?.colors, product?._id])

  const sizes = useMemo(() => {
    if (!product) return []
    
    // Normalizar tallas: puede venir como array de strings o array de objetos
    const productSizes = product.sizes || []
    if (productSizes.length === 0) {
      return [] // No hay talles, retornar array vacío
    }
    
    // Si es array de strings, convertirlos a objetos
    if (typeof productSizes[0] === 'string') {
      return productSizes.map(size => ({
        id: size.toLowerCase().replace(/\s+/g, '-'),
        name: size,
        inStock: true // Asumimos que están en stock si no se especifica
      }))
    }
    
    // Si ya es array de objetos, retornarlo tal cual
    return productSizes
  }, [product?.sizes, product?._id])

  // Inicializar selecciones por defecto cuando cambia el producto o se abre el modal
  useEffect(() => {
    if (!open || !product) {
      // Resetear cuando se cierra el modal o no hay producto
      setSelectedColor(null)
      setSelectedSize(null)
      return
    }

    // Establecer valores por defecto solo si hay opciones disponibles
    if (colors.length > 0) {
      setSelectedColor(colors[0].id)
    } else {
      setSelectedColor(null)
    }
    
    if (sizes.length > 0) {
      setSelectedSize(sizes.find(s => s.inStock)?.id || sizes[0].id)
    } else {
      setSelectedSize(null)
    }
  }, [open, product?._id, colors, sizes])

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!product || isAdding) return // Prevenir doble llamada
    
    setIsAdding(true)
    
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Agregar al carrito con la información seleccionada (solo si hay valores seleccionados)
      const cartItem = {
        ...product,
      }
      
      // Remover quantity si existe en el producto original
      delete cartItem.quantity
      
      if (selectedColor) {
        cartItem.selectedColor = colors.find(c => c.id === selectedColor)?.name
      }
      
      if (selectedSize) {
        cartItem.selectedSize = sizes.find(s => s.id === selectedSize)?.name
      }
      
      addItem(cartItem, 1) // Asegurar que siempre agregamos cantidad 1
      
      // Cerrar el modal después de agregar
      setTimeout(() => {
        onClose()
      }, 300)
    } finally {
      setIsAdding(false)
    }
  }

  // Si no hay producto, no renderizar nada (después de todos los hooks)
  if (!product) return null

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full flex-col max-h-[90vh] overflow-hidden backdrop-blur-md px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl border border-white/10"
              style={{
                background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
              }}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8 transition-colors z-10"
              >
                <span className="sr-only">Cerrar</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>

              <div className="overflow-y-auto flex-1 pr-2">
              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  alt={product.name}
                  src={product.image}
                  className="aspect-2/3 w-full rounded-lg object-cover sm:col-span-4 lg:col-span-5 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #0F0F10 0%, #1A0A15 100%)"
                  }}
                />
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-[#E11D74] sm:pr-12 font-['Quantico',_sans-serif] uppercase tracking-wide">
                    {product.name}
                  </h2>

                  <section aria-labelledby="information-heading" className="mt-3">
                    <h3 id="information-heading" className="sr-only">
                      Información del producto
                    </h3>

                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-3xl font-bold text-[#E11D74] font-['Orbitron',_sans-serif]">
                        ${product.price.toLocaleString()}
                      </p>
                      {product.originalPrice && (
                        <span className="text-lg text-[#CFCFCF]/60 line-through font-['Rajdhani',_sans-serif]">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    <p className="text-[#CFCFCF] font-['Rajdhani',_sans-serif] mb-4">
                      {product.description}
                    </p>

                    {/* Reviews - Solo mostrar si hay reseñas */}
                    {product.reviewsCount > 0 ? (
                      <div className="mt-4">
                        <h4 className="sr-only">Reseñas</h4>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-700 font-semibold">
                            {product.averageRating ? product.averageRating.toFixed(1) : '0'}
                            <span className="sr-only"> de 5 estrellas</span>
                          </p>
                          <div className="ml-1 flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => {
                              const ratingValue = product.averageRating || 0;
                              return (
                                <StarIcon
                                  key={rating}
                                  aria-hidden="true"
                                  className={classNames(
                                    ratingValue > rating ? 'text-yellow-400' : 'text-gray-200',
                                    'size-5 shrink-0',
                                  )}
                                />
                              );
                            })}
                          </div>
                          <div className="ml-4 flex items-center">
                            <span aria-hidden="true" className="text-gray-300">
                              &middot;
                            </span>
                            <span className="ml-2 text-sm text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                              {product.stock} disponibles
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <h4 className="sr-only">Reseñas</h4>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-700 font-semibold">
                            0
                            <span className="sr-only"> de 5 estrellas</span>
                          </p>
                          <div className="ml-1 flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                aria-hidden="true"
                                className={classNames(
                                  'text-gray-200',
                                  'size-5 shrink-0',
                                )}
                              />
                            ))}
                          </div>
                          <div className="ml-4 flex items-center">
                            <span aria-hidden="true" className="text-gray-300">
                              &middot;
                            </span>
                            <span className="ml-2 text-sm text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                              {product.stock} disponibles
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Categoría */}
                    <div className="mt-4">
                      <span className="inline-block bg-gradient-to-r from-[#E11D74]/20 to-[#6D28D9]/20 text-[#E11D74] px-3 py-1 rounded-full text-xs font-semibold font-['Quantico',_sans-serif] border border-[#E11D74]/30">
                        {product.category}
                      </span>
                    </div>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-6">
                    <h3 id="options-heading" className="sr-only">
                      Opciones del producto
                    </h3>

                    <form onSubmit={handleAddToCart}>
                      {/* Color picker */}
                      {colors.length > 0 && (
                        <fieldset aria-label="Elegir un color" className="mb-6">
                          <legend className="text-sm font-semibold text-[#E11D74] mb-3 font-['Quantico',_sans-serif] uppercase tracking-wide">Color</legend>

                          <div className="mt-2 flex items-center gap-x-3">
                            {colors.map((color) => (
                              <div
                                key={color.id}
                                className={`flex rounded-full outline -outline-offset-1 transition-all ${
                                  selectedColor === color.id 
                                    ? 'outline-[#E11D74] outline-2' 
                                    : 'outline-white/20 hover:outline-[#E11D74]/50'
                                }`}
                              >
                                <input
                                  value={color.id}
                                  checked={selectedColor === color.id}
                                  onChange={(e) => setSelectedColor(e.target.value)}
                                  name="color"
                                  type="radio"
                                  aria-label={color.name}
                                  className={classNames(
                                    color.classes,
                                    'size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3 cursor-pointer transition-all',
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      )}

                      {/* Size picker */}
                      {sizes.length > 0 && (
                        <fieldset aria-label="Elegir una talla" className="mt-6">
                          <legend className="text-sm font-semibold text-[#E11D74] mb-3 block font-['Quantico',_sans-serif] uppercase tracking-wide">Talla</legend>
                          <div className="mt-2 grid grid-cols-4 gap-3">
                            {sizes.map((size) => (
                              <label
                                key={size.id}
                                aria-label={size.name}
                                className="group relative flex items-center justify-center rounded-md border border-white/20 bg-[#0F0F10]/90 backdrop-blur-sm p-3 has-checked:border-[#E11D74] has-checked:bg-gradient-to-r has-checked:from-[#E11D74] has-checked:to-[#6D28D9] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#E11D74] has-disabled:border-white/10 has-disabled:bg-[#0F0F10]/50 has-disabled:opacity-25 cursor-pointer hover:border-[#E11D74] transition-all"
                              >
                                <input
                                  value={size.id}
                                  checked={selectedSize === size.id}
                                  onChange={(e) => setSelectedSize(e.target.value)}
                                  name="size"
                                  type="radio"
                                  disabled={!size.inStock}
                                  className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                                />
                                <span className="text-sm font-medium text-[#CFCFCF] uppercase group-has-checked:text-white font-['Quantico',_sans-serif] transition-colors">
                                  {size.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isAdding}
                        whileHover={{ scale: isAdding ? 1 : 1.02 }}
                        whileTap={{ scale: isAdding ? 1 : 0.98 }}
                        className={`mt-8 flex w-full items-center justify-center rounded-lg border border-transparent px-8 py-3 text-base font-medium text-white transition-all font-['Quantico',_sans-serif] uppercase tracking-wide shadow-lg ${
                          isAdding
                            ? 'bg-[#0F0F10]/30 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#8B5CF6] focus:ring-2 focus:ring-[#E11D74] focus:ring-offset-2'
                        }`}
                      >
                        {isAdding ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Agregando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Agregar al carrito
                          </div>
                        )}
                      </motion.button>
                    </form>
                  </section>

                  {/* Sección de Reseñas - Solo visualización */}
                  <ReviewsSection
                    productId={product._id || product.id}
                    reviews={null}
                    averageRating={0}
                    reviewsCount={product.reviewsCount || 0}
                    ratingSummary={product.meta?.ratingSummary || null}
                    reviewsPerPage={5}
                  />
                </div>
              </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}