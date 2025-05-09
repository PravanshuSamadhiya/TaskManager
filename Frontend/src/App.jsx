import React from 'react'
import RegisterPage from './pages/RegisterPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './ components/PrivateRoute'
import DailySummary from './pages/DailySummary'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={ <PrivateRoute>  <Dashboard/></PrivateRoute>} />
      <Route path="/summary" element={<PrivateRoute><DailySummary /></PrivateRoute>} />
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
