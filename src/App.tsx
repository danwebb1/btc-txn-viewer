import React from 'react'
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import {LoadingProvider, useLoading} from './context/LoadingContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from "./components/Dashboard";
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
        <div className="flex h-screen flex items-center justify-center">
          <div className="w-3/5 border-2 border-solid">
        {isLoading && <LoadingSpinner />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <Dashboard>
               <Navbar />
              <>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Add more routes here */}
                </Routes>
              </>
            </Dashboard>
          } />
        </Routes>
        </div>
        </div>
      </div>
    </Router>
  );
}

export default App;