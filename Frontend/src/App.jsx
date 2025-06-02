import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Login from './Components/Login'
import Services from './Components/Services'
import Servicesouterview from './Components/Servicesouterview'
import WaitingForAdminApproval from './Components/Waitingforadminapproval'
import AdminProvidersRequest from './Components/AdminProvidersRequest'
import ProviderRequestRejected from './Components/ProviderRequestRejected'
import MakeBookings from './Components/MakeBookings'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
  
    <Navbar />
    <Routes>
    
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login />}/>
     <Route path='/services' element={<Services />}/>
     <Route path='/servicesouterview' element={<Servicesouterview />}/>
     <Route path='/providerwaiting' element={<WaitingForAdminApproval />} />
     <Route path='/providersrequest' element={<AdminProvidersRequest />} />
     <Route path='/providerrequestrejected' element={<ProviderRequestRejected />} />
     <Route path='/makebooking' element={<MakeBookings />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
