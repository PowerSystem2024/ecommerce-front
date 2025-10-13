import React from 'react'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import About from '../components/About'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </div>
  )
}


export default LandingPage
