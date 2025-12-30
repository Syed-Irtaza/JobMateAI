import React from 'react'
import { Lock, Mail, User2Icon, Building2, Globe } from "lucide-react";
import api from '../configs/api.js';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice.js';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
   const query = new URLSearchParams(window.location.search);
   const urlState = query.get("state");
   const [state, setState] = React.useState(urlState || "login")
   const [googleLoading, setGoogleLoading] = React.useState(false)
   const [role, setRole] = React.useState("candidate")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyWebsite: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {...formData, role}
            const {data} = await api.post(`/api/users/${state}`,payload)
            dispatch(login(data))
            localStorage.setItem('token',data.token)
            toast.success(data.message)
            const dest = data?.user?.role === "admin"
              ? "/admin"
              : data?.user?.role === "recruiter"
                ? "/recruiter"
                : "/app";
            navigate(dest, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message||error.message)
        }

    }

    const handleGoogleSuccess = async (credentialResponse) => {
        if (googleLoading) return
        const credential = credentialResponse?.credential
        if(!credential){
            toast.error("Google authentication failed. Please try again.")
            return
        }
        try {
            setGoogleLoading(true)
            const {data} = await api.post(`/api/users/google`,{credential})
            dispatch(login(data))
            localStorage.setItem('token',data.token)
            toast.success(data.message)
            const dest = data?.user?.role === "admin"
              ? "/admin"
              : data?.user?.role === "recruiter"
                ? "/recruiter"
                : "/app";
            navigate(dest, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message||error.message)
        }
        finally{
            setGoogleLoading(false)
        }
    }

    const handleGoogleError = () => {
        toast.error("Google sign-in was cancelled. Please try again.")
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-[#1568ab]/10'>
      <form onSubmit={handleSubmit} className="sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-lg">
                <img src="/logo.png" alt="JobMate AI" className="h-28 mx-auto mt-8" />
                <h1 className="text-gray-900 text-2xl mt-4 font-medium">{state === "login" ? "Welcome Back" : "Join JobMate AI"}</h1>
                <p className="text-gray-500 text-sm mt-2">{state === "login" ? "Sign in to continue" : "Create your account"}</p>
                {state !== "login" && (
                    <>
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2Icon size={16} color='#6B7280'/>
                        <input type="text" name="name" placeholder="Full Name" className="border-none outline-none ring-0 w-full" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mt-4 text-left">
                        <label className="text-xs text-gray-600 font-medium">I am a</label>
                        <select
                          value={role}
                          onChange={(e)=>setRole(e.target.value)}
                          className="w-full mt-1 border border-gray-300/80 h-11 rounded-full px-4 text-sm focus:ring-2 focus:ring-[#1568ab] focus:border-[#1568ab]"
                        >
                          <option value="candidate">Candidate (Job Seeker)</option>
                          <option value="recruiter">Recruiter (Hiring)</option>
                        </select>
                    </div>
                    {role === "recruiter" && (
                        <>
                        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
                            <Building2 size={16} color='#6B7280'/>
                            <input type="text" name="companyName" placeholder="Company Name" className="border-none outline-none ring-0 w-full text-sm" value={formData.companyName} onChange={handleChange} required />
                        </div>
                        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-4 gap-2">
                            <Globe size={16} color='#6B7280'/>
                            <input type="text" name="companyWebsite" placeholder="Company Website" className="border-none outline-none ring-0 w-full text-sm" value={formData.companyWebsite} onChange={handleChange} required />
                        </div>
                        </>
                    )}
                    </>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={13} color='#6B7280'/>
                    <input type="email" name="email" placeholder="Email Address" className="border-none outline-none ring-0 w-full" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color='#6B7280' />
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0 w-full" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mt-4 text-left text-[#1568ab]">
                    <button className="text-sm hover:underline" type="button">Forgot password?</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-[#1568ab] hover:bg-[#0d4f82] transition-colors">
                    {state === "login" ? "Sign In" : "Create Account"}
                </button>
                <div className="flex items-center gap-2 my-4">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-xs text-gray-400">or continue with</span>
                    <hr className="flex-1 border-gray-200" />
                </div>
                <div className="flex justify-center mb-4">
                    <GoogleLogin
                    size="large"
                    text={state === "login" ? "continue_with" : "signup_with"}
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    shape="pill"
                    width="300"
                    />
                </div>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-8 cursor-pointer">{state === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-[#1568ab] hover:underline font-medium">Click here</span></p>
            </form>
            </div>
  )
}

export default Login
