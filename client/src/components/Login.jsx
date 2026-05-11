import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { toast } from 'react-toastify'
import { BASE_URL } from '../config/api.js'

const Login = () => {

    const [state, setState] = useState('Login')
    const {setShowLogin, setToken, api} = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if(state === 'Login'){
                const response = await api.post(`${BASE_URL}/api/user/login`, {email, password})
                
                if(response.data.success){
                    const token = response.data.token || response.token;
                    localStorage.setItem("token", token);
                    setToken(token)
                    setShowLogin(false)
                    toast.success(`Welcome back, ${response.data.user.name}`)
                }else{
                    toast.error(response.data.message)
                }
            }else{
                const response = await api.post(`${BASE_URL}/api/user/register`, {name, email, password})
                
                if(response.data.success){
                    const token = response.data.token || response.token;
                    localStorage.setItem("token", token);
                    setToken(token)
                    setShowLogin(false)
                    toast.success(`Welcome, ${response.data.user.name}`)
                }else{
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            alert(error?.response?.data?.error?.message || error.message)
        }        
    }

    useEffect(()=>{
        document.body.style.overflow = 'hidden';
        return ()=>{
            document.body.style.overflow = 'unset';            
        }
    },[])

  return (
    <div className='fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 backdrop-blur-md'>
        <motion.form onSubmit={onSubmitHandler}
            initial={{ opacity: 0.2, y: 50 }}
            transition={{ duration: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}

        className='relative bg-white/95 border border-white p-10 rounded-2xl text-slate-500 shadow-2xl max-w-md w-[92vw]'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>

            {state !=='Login' && (
                <div className ='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src = {assets.profile_icon} alt="" className='w-5' />
                <input onChange={e => setName(e.target.value)} value={name}
                type = "text" placeholder='Full Name' required/>
            </div>
            )}

            <div className ='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src = {assets.email_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value={email}
                type = "email" placeholder='Email id' required/>
            </div>
            <div className ='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src = {assets.lock_icon} alt="" />
                <input onChange={e => setPassword(e.target.value)} value={password}
                type = "password" placeholder='Password' required/>
            </div>
            
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>
            
            <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state === 'Login' ? 'login':'create account'}</button>

            {state === 'Login' ? <p className='mt-5 text-center'> Don't have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign Up</span></p>
            :
            <p className='mt-5 text-center'> Already have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>}

            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer'/>
        </motion.form>

      
    </div>
  )
}

export default Login
