import CartList from "./CartList";
import CartSummary from "./cartSummary";

export default function Cart() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10 text-white">
      {/* Sección izquierda: lista de productos */}
      <div className="lg:col-span-2 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
        }}
      >
        <h2 className="text-2xl font-['Orbitron',sans-serif] text-[#E11D74] mb-6 uppercase tracking-widest">
          Tu Carrito
        </h2>
        <div className="border-t border-white/10 pt-4">
          <CartList />
        </div>
      </div>

      {/* Sección derecha: resumen */}
      <div className="backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
        }}
      >
        <CartSummary />
      </div>
    </div>
  );
}

