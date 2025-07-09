import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MultasPage } from "./pages/MultasPage";
import { Menu } from "./components/Menu";
import { Footer } from "./components/Footer";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Menu />
      <main className="container mx-auto py-6">
        <Routes>
          <Route path="/multas" element={<MultasPage />} />
          <Route index element={<MultasPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
