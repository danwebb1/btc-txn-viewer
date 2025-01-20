import React, {useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import {LoadingProvider, useLoading} from './context/LoadingContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from "./components/Dashboard.jsx";
import LoadingSpinner from './components/LoadingSpinner';
import './styles/navbar.css';
import './styles/loading.css';

function App() {
  return (
    <AuthContextProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthContextProvider>
  );
}

function AppContent() {
  const { isLoading } = useLoading();
  return (
    <Router>
      <div className="app">
        {isLoading && <LoadingSpinner />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <Dashboard>
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Add more routes here */}
                </Routes>
              </>
            </Dashboard>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;