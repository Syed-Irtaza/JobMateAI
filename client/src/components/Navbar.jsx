import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux'
import {logout} from '../app/features/authSlice.js'

const Navbar = () => {
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    // Determine the correct dashboard based on user role
    const getDashboardPath = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'recruiter') return '/recruiter';
        return '/app';
    };

    const logoutUser = () => {
        dispatch(logout())
        navigate('/');
    }

    return (
    <div className='shadow bg-white'>
        <nav className='flex items-center justify-between px-4 py-3.5 max-w-7xl mx-auto text-slate-800 transition-all'>
        <Link to={getDashboardPath()}>
        <img src="/logo.png" alt="JobMate AI" className='h-18 w-auto'/>
        </Link> 
        <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden'>Hi, {user?.name}</p>
            <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
        </div>

        </nav>
    </div>
  )
}

export default Navbar
