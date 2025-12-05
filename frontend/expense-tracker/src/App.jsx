import React from 'react'
import { Routes,Route, Router, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './Dashboard/Home'
import SignUp from './pages/Auth/SignUp'
import Income from './Dashboard/Income'
import Expense from './Dashboard/Expense'

const App = () => {
  return (
    <div>
  
    <Routes>
    <Route path='/' element={<Root />} />
    <Route path='/login' exact element={<Login />} />
    <Route path='/signup' exact element={<SignUp />} />     
    <Route path='/dashboard' exact element={<Home />} />     
    <Route path='/income' exact element={<Income />} />     
    <Route path='/expense' exact element={<Expense />} />     
    </Routes>
    </div>
  )
}

export default App

const Root = ()=>{
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token")

  // Redirect to dashboard if authenticated , otherwise login
  return isAuthenticated ?(
    <Navigate to ="/dasboad" />
  ):(
    <Navigate to = "/login" />
  );
};
