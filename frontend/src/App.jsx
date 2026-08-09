import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import TopNavbar from './components/TopNavbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import MarketplaceItem from './pages/MarketplaceItem'
import MarketplaceSell from './pages/MarketplaceSell'
import LostFound from './pages/LostFound'
import LostFoundItem from './pages/LostFoundItem'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import Chat from './pages/Chat'
import Events from './pages/Events'
import EventRegistrants from './pages/EventRegistrants'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import HelpBot from './components/HelpBot'

function AppLayout() {
  const { user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {user ? (
        <>
          <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((v) => !v)} />
          <TopNavbar onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
          <main className={sidebarCollapsed ? 'ml-20 transition-all duration-300' : 'ml-64 transition-all duration-300'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/marketplace/:id" element={<MarketplaceItem />} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/marketplace/sell" element={<ProtectedRoute><MarketplaceSell /></ProtectedRoute>} />
              <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
              <Route path="/lost-found/:id" element={<ProtectedRoute><LostFoundItem /></ProtectedRoute>} />
              <Route path="/lost-found/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
              <Route path="/lost-found/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/events/:id/registrants" element={<ProtectedRoute><EventRegistrants /></ProtectedRoute>} />
            </Routes>
          </main>
          <HelpBot />
        </>
      ) : (
        <>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/marketplace/:id" element={<MarketplaceItem />} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/marketplace/sell" element={<ProtectedRoute><MarketplaceSell /></ProtectedRoute>} />
              <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
              <Route path="/lost-found/:id" element={<ProtectedRoute><LostFoundItem /></ProtectedRoute>} />
              <Route path="/lost-found/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
              <Route path="/lost-found/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/events/:id/registrants" element={<ProtectedRoute><EventRegistrants /></ProtectedRoute>} />
            </Routes>
          </main>
          <HelpBot />
          <Footer />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App
