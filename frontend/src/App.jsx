import React from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
const router=createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/register',
    element:<Register/>
  },
  {
    path:'/verify',
    element:<VerifyEmail/>
  },
  {
    path:'/verify/:token',
    element:<Verify/>
  }

])
const App = () => {
  return (
    <div className='text-red-800'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App