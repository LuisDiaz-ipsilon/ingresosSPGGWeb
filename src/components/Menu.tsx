import { Link } from "react-router-dom";

export function Menu() {
  return (
    <nav className="bg-blue-800 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo o título */}
        <div className="text-xl font-semibold">
          Ayuntamiento SPGG
        </div>
        {/* Enlaces de navegación */}
        <div className="space-x-6">
          <Link to="/multas" className="hover:underline">
            Pagar Multas
          </Link>
          <Link to="/predial" className="hover:underline">
            Pagar Predial
          </Link>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/contacto" className="hover:underline">
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
