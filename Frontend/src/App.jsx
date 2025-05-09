import React from 'react'
import RegisterPage from './pages/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './ components/PrivateRoute'
import DailySummary from './pages/DailySummary'

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={ <PrivateRoute>  <Dashboard/></PrivateRoute>} />
      <Route path="/summary" element={<PrivateRoute><DailySummary /></PrivateRoute>} />
    </Routes>
  )
}

export default App
