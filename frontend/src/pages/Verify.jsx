import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Verify = () => {
    const {token} = useParams()
    const [status,setStatus]=useState('Verifying...')
    const navigate=useNavigate()
    useEffect(()=>{
        const verifyEmail=async()=>{
            try {
                const res=await axios.post(`http://localhost:8000/user/verify`,{},{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if(res.data.success){
                    setStatus("✅ Email verified successfully.")
                    setTimeout(()=>{
                        navigate('/login')
                    },3000)
                }else{
                    setStatus("❌ Invalid or expired token.")
                }
            } catch (error) {
                console.log(error);
                setStatus("❌ Verification failed. Please try again.")
                
            }
        }
        verifyEmail()
    },[token,navigate])
  return (
    <div className='relative w-full h-[760px] bg-green-100 overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md text-center'>
                <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
            </div>
        </div>
    </div>
  )
}

export default Verify