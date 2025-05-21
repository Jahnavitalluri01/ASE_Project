import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import { BrowserRouter, Routes,Route } from 'react-router-dom'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
    
    <Route path='/' element={<Home />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
