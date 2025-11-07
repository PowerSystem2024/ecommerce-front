import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData)
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.')
  }

  return (
    <motion.div 
      className="relative isolate bg-[#0F0F10] px-6 py-24 sm:py-32 lg:px-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Pattern */}
      <svg
        aria-hidden="true"
        className="hidden"
      >
        <defs>
          <pattern
            x="50%"
            y={-64}
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-64} className="overflow-visible fill-gray-50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" width="100%" height="100%" strokeWidth={0} />
      </svg>

      <div className="mx-auto max-w-xl lg:max-w-4xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl mb-6">
            Hablemos sobre tu
            <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Proyecto de Moda
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Ayudamos a personas y empresas a desarrollar su estilo personal y crear 
            guardarrobas que reflejen su personalidad única.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="lg:flex-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* First Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label htmlFor="firstName" className="block text-sm/6 font-semibold text-gray-200 mb-2">
                  Nombre
                </label>
                <div className="mt-2.5">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    className="block w-full rounded-xl bg-[#1a1a1b] px-4 py-3 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 transition-all duration-300"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </motion.div>

              {/* Last Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label htmlFor="lastName" className="block text-sm/6 font-semibold text-gray-200 mb-2">
                  Apellido
                </label>
                <div className="mt-2.5">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className="block w-full rounded-xl bg-[#1a1a1b] px-4 py-3 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 transition-all duration-300"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-200 mb-2">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className="block w-full rounded-xl bg-[#1a1a1b] px-4 py-3 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 transition-all duration-300"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label htmlFor="phone" className="block text-sm/6 font-semibold text-gray-200 mb-2">
                  Teléfono
                </label>
                <div className="mt-2.5">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className="block w-full rounded-xl bg-[#1a1a1b] px-4 py-3 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 transition-all duration-300"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </motion.div>

              {/* Message */}
              <motion.div 
                className="sm:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-200 mb-2">
                  Mensaje
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl bg-[#1a1a1b] px-4 py-3 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 transition-all duration-300 resize-none"
                    placeholder="Cuéntanos sobre tu proyecto de moda o consulta..."
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.button
                type="submit"
                className="block w-full rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-4 text-center text-sm font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Enviar Mensaje
              </motion.button>
              
              <motion.p 
                className="mt-4 text-sm/6 text-gray-400 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                Al enviar este formulario, acepto la{' '}
                <a href="#" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                  política de privacidad
                </a>
                .
              </motion.p>
            </motion.div>
          </motion.form>

          {/* Side Content */}
          <motion.div 
            className="lg:mt-6 lg:w-80 lg:flex-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Logo */}
            <motion.div 
              className="mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div>
                  <div className="font-bold text-white text-xl">Ropa Moderna</div>
                  <div className="text-sm text-gray-400">Tu estilo, nuestra pasión</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.figure 
              className="bg-[#1a1a1b] rounded-2xl p-6 shadow-lg"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <blockquote className="text-lg/8 font-medium text-gray-100 mb-4">
                <p>
                  "Ropa Moderna transformó completamente mi guardarropa. Su asesoramiento 
                  personalizado y la calidad de sus prendas son excepcionales. 
                  ¡Altamente recomendado!"
                </p>
              </blockquote>
              <figcaption className="flex gap-x-4">
                <img
                  alt="María González"
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80"
                  className="size-12 flex-none rounded-full bg-gray-50 object-cover"
                />
                <div>
                  <div className="text-base font-semibold text-gray-100">María González</div>
                  <div className="text-sm/6 text-gray-400">Cliente desde 2022</div>
                </div>
              </figcaption>
            </motion.figure>

            {/* Contact Info */}
            <motion.div 
              className="mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contacto@ropamoderna.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+54 11 1234-5678</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}