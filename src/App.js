import React from 'react'
import Login from './components/Login/Login'
import './App.css';
import {BrowserRouter, Routes, Route} from'react-router-dom'
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
       
        <Route path='/dashboard' element={<Dashboard />}></Route>


      </Routes>
    </BrowserRouter>
    
  )
}

export default App
