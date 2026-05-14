import React, { useContext, useEffect, useRef, useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const inFlight = useRef(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (inFlight.current) return;
        inFlight.current = true;
        setLoading(true);

        try {
            const url = state === 'Login'
                ? `${BASE_URL}/api/user/login`
                : `${BASE_URL}/api/user/register`;
            const payload = state === 'Login'
                ? { email, password }
                : { name, email, password };

            const response = await api.post(url, payload);

            if (response.data.success) {
                const token = response.data.token || response.token;
                localStorage.setItem("token", token);
                setToken(token);
                setShowLogin(false);
                toast.success(
                    state === 'Login'
                        ? `Welcome back, ${response.data.user.name}`
                        : `Welcome, ${response.data.user.name}`,
                    { toastId: 'welcome-toast' }
                );
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error(error?.response?.data?.error?.message || error?.message || 'Network error');
        } finally {
            inFlight.current = false;
            setLoading(false);
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
                type = "text" placeholder='Full Name' required
                disabled={loading}/>
            </div>
            )}

            <div className ='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src = {assets.email_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value={email}
                type = "email" placeholder='Email id' required
                disabled={loading}/>
            </div>
            <div className ='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src = {assets.lock_icon} alt="" />
                <input onChange={e => setPassword(e.target.value)} value={password}
                type = "password" placeholder='Password' required
                disabled={loading}/>
            </div>
            
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>
            
            <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70'
            >
                {loading ? (
                    <>
                        <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white'></span>
                        {state === 'Login' ? 'Signing you in…' : 'Creating account…'}
                    </>
                ) : (
                    state === 'Login' ? 'Login' : 'Create account'
                )}
            </button>

            {state === 'Login' ? <p className='mt-5 text-center'> Don't have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={() => !loading && setState('Sign Up')}>Sign Up</span></p>
            :
            <p className='mt-5 text-center'> Already have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={() => !loading && setState('Login')}>Login</span></p>}

            <img onClick={() => !loading && setShowLogin(false)} src={assets.cross_icon} alt="" className={`absolute top-5 right-5 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}/>
        </motion.form>

      
    </div>
  )
}

export default Login
