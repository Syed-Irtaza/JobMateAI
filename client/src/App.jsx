import React, { useEffect } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import AuthLayout from './pages/AuthLayout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api.js'
import { login, setLoading } from './app/features/authSlice.js'
import {Toaster} from 'react-hot-toast'
import Profile from './pages/Profile.jsx'
import RecruiterDashboard from './pages/RecruiterDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import RoleGuard from './components/RoleGuard.jsx'

const App = () => {

  const dispatch=useDispatch()
  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if(token){
        const {data}=await api.get('/api/users/data',{headers:{Authorization:token}})
        if(data.user){
          dispatch(login({token,user:data.user}))
        }
        dispatch(setLoading(false))
      }
      else{
        dispatch(setLoading(false))
      }
    } catch (error) {
        dispatch(setLoading(false))
      console.log(error.message);
      
    }
  }

  useEffect(()=>{
    getUserData()
  },[])

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={<Home/>}/>

      {/* Candidate routes - uses Layout with shared Navbar */}
      <Route path="app" element={<Layout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>
      </Route>

      {/* Recruiter routes - uses AuthLayout (no navbar, dashboard has its own) */}
      <Route path="recruiter" element={
        <RoleGuard allowed={['recruiter','admin']}>
          <AuthLayout/>
        </RoleGuard>
      }>
        <Route index element={<RecruiterDashboard/>}/>
      </Route>

      {/* Admin routes - uses AuthLayout (no navbar, dashboard has its own) */}
      <Route path="admin" element={
        <RoleGuard allowed={['admin']}>
          <AuthLayout/>
        </RoleGuard>
      }>
        <Route index element={<AdminDashboard/>}/>
      </Route>

      <Route path='view/:resumeId' element={<Preview/>}/>
      

    </Routes>
    </>
  )
}

export default App
