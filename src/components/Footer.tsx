export function Footer() {
    return (
      <footer className="bg-gray-100 text-gray-700 px-4 py-6 mt-16 shadow-inner">
        <div className="container mx-auto text-center space-y-1 text-sm">
          <p>© {new Date().getFullYear()} Ayuntamiento de San Pedro Garza García.</p>
          <p>Av. Constitución #300, Col. Centro, San Pedro, NL, C.P. 66240.</p>
          <p>Teléfono: (81) 1234-5678 · <a href="mailto:contacto@spgg.gob.mx" className="text-blue-600 hover:underline">contacto@spgg.gob.mx</a></p>
        </div>
      </footer>
    );
  }
  