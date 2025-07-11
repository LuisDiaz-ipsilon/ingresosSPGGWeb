import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MultasPage } from "./pages/MultasPage";
import { Menu } from "./components/Menu";
import { Footer } from "./components/Footer";
import { PredialesPage } from "./pages/PredialesPage";
import DashboardPage from './pages/DashboardPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Menu />
        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/multas" element={<MultasPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/predial" element={<PredialesPage />} />
            <Route index element={<MultasPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
