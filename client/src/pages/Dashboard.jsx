import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const {user,token}=useSelector(state=>state.auth)

  const colors = ["#1568ab", "#9333ea", "#d97706", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [isloading, setIsLoading] = useState(false)
  const [showResumeArea, setShowResumeArea] = useState(false);

  const navigate = useNavigate();

  const createResume = async (event) => { 
    
   try {
    event.preventDefault();
    const { data } = await api.post('/api/resumes/create',{title},{headers:{Authorization:token}})
    setAllResumes([...allResumes,data.resume])
    setTitle('')
    setShowCreateResume(false)
    navigate(`/app/builder/${data.resume._id}`)
   } catch (error) {
    toast.error(error?.response?.data?.message||error.message)    
   }
    
  }

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } });
      // server returns {resumes: [...]}
      setAllResumes(Array.isArray(data.resumes) ? data.resumes : []);
    } catch (error) {
      setAllResumes([]);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (event) => { 
    event.preventDefault();
    if (isloading) return;
    if (!resume) {
      toast.error('Please select a PDF before uploading');
      return;
    }
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post('/api/ai/upload-resume',{title, resumeText},{headers:{Authorization:token}});
      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
    toast.error(error?.response?.data?.message||error.message);    
    } finally {
      setIsLoading(false);
    }
    
  }
 
  const editTitle = async (event) => { 
    try {
      event.preventDefault();
      const {data}=await api.put(`/api/resumes/update`,{resumeId:editResumeId,resumeData:{title}},{headers:{Authorization:token}})
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume,title} : resume));
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message||error.message)
    }
  }

  const deleteResume = async (resumeId) => { 
    
    try {
        const confirm = window.confirm("Are you sure you want to delete this resume?");
        if(confirm){
          const {data}=await api.delete(`/api/resumes/delete/${resumeId}`,{headers:{Authorization:token}})
          setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
          toast.success(data.message)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message||error.message)
      }
    }
  useEffect(() => {
    loadAllResumes();
  }, []);

  const dummyJobs = [
    { title: "Frontend Engineer", company: "TechCorp", location: "Remote", match: "82%", posted: "2 days ago" },
    { title: "Product Designer", company: "DesignHub", location: "New York, NY", match: "77%", posted: "5 days ago" },
    { title: "Data Engineer", company: "DataFlow", location: "San Francisco, CA", match: "74%", posted: "1 week ago" },
    { title: "Backend Engineer", company: "CloudOps", location: "Remote", match: "79%", posted: "3 days ago" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-slate-800">
                {user?.name || "Candidate"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track your job tools and resumes in one place.
              </p>
            </div>

            {showResumeArea ? (
              <>
                <div className="flex gap-4 ">
                  <button onClick={()=> setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-[#1568ab] hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-[#1568ab]/60 to-[#1568ab] text-white rounded-full" />
                    <p className="text-sm group-hover:text-[#1568ab] transition-all duration-300">
                      Create Resume
                    </p>
                  </button>
                  <button onClick={()=> setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
                    <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
                      Upload Existing
                    </p>
                  </button>
                </div>
                <hr className="my-6 border-slate-300 sm:w-[305px]" />

                <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 ">
                  {allResumes.map((resume, index) => {
                    const baseColor = colors[index % colors.length];
                    return (
                      <button
                        key={index} onClick={()=> navigate(`/app/builder/${resume._id}`)}
                        className="relative w-full sm:max-w-36 h-48 flex 
    flex-col items-center justify-center rounded-lg gap-2 border group 
    hover:shadow-lg transition-all duration-300 cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                          borderColor: baseColor + "40",
                        }}
                      >
                        <FilePenLineIcon
                          className="size-7 group-hover:scale-105 
      transition-all "
                          style={{ color: baseColor }}
                        />

                        <p
                          className="text-sm group-hover:scale-105 transition-all  px-2 
      text-center"
                          style={{ color: baseColor }}
                        >
                          {resume.title}
                        </p>

                        <p
                          className="absolute bottom-1 text-[11px] text-slate-400 
      group-hover:text-slate-500 transition-all duration-300 px-2 
      text-center"
                          style={{ color: baseColor + "90" }}
                        >
                          Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                        <div onClick={(e)=>e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex items-center hidden">
                          <TrashIcon onClick={()=> deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                          <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                          
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dummyJobs.map((job, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-xs text-slate-500">{job.posted}</p>
                    <h3 className="text-lg font-semibold text-slate-800 mt-1">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#1568ab]/10 text-[#1568ab] border border-[#1568ab]/20">Match {job.match}</span>
                      <button className="text-sm text-[#1568ab] hover:text-[#0d4f82]">View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-slate-500 mb-3">Quick Actions</p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowResumeArea(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1568ab]/10 text-[#1568ab] border border-[#1568ab]/20 hover:bg-[#1568ab]/20 transition"
                >
                  Resume Builder
                  <span className="text-xs bg-white px-2 py-1 rounded-full border border-[#1568ab]/20">Live</span>
                </button>
                {[
                  { label: "Resume Analyzer", note: "Coming soon" },
                  { label: "Mock Interview", note: "Coming soon" },
                  { label: "Interview Preparation", note: "Coming soon" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    disabled
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 cursor-not-allowed"
                  >
                    {item.label}
                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-slate-100">
                      {item.note}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => navigate("/app/profile")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                >
                  Profile
                  <span className="text-xs bg-white px-2 py-1 rounded-full border border-emerald-100">Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {
          showCreateResume && (
            <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur bg-opacity-50 z-10">
              <div onClick={e=>e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input onChange={(e)=> setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none" required />
              <button className="w-full py-2 bg-[#1568ab] text-white rounded-lg hover:bg-[#0d4f82] transition-colors">Create Resume</button>
              <XIcon className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => {setShowCreateResume(false); setTitle("")}} />
              </div>
              </form>
          )
        }

        {
          showUploadResume && (
            <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur bg-opacity-50 z-10">
              <div onClick={e=>e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
              <input onChange={(e)=> setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none" required />
              <div>
                <label htmlFor="resume-input" className={`block text-sm text-slate-700 ${isloading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  Select Resume File
                  <div className={`flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 transition-colors ${isloading ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'hover:border-[#1568ab] hover:text-[#1568ab] cursor-pointer'}`}>
                   {resume ?(
                    <p className="text-[#1568ab]">{resume.name}</p>
                   ): (
                    <>
                    <UploadCloud className="size-14 stroke-1" />
                    <p>Upload resume</p>
                    </>
                   )}
                  </div>
                </label>
                <input type="file" id="resume-input" accept=".pdf" hidden disabled={isloading} onChange={(e) => setResume(e.target.files[0])} />
              </div>
              <button disabled={isloading} className="w-full py-2 bg-[#1568ab] text-white rounded-lg hover:bg-[#0d4f82] transition-colors flex items-center justify-center gap-2">
              {isloading&&<LoaderCircleIcon className='animate-spin size-4 text-white'/>}
              {isloading?'Uploading...':'Upload Resume'}</button>
              <XIcon className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => {setShowUploadResume(false); setTitle("")}} />
              </div>
              </form>
          )
        }

        {
          editResumeId && (
            <form onSubmit={editTitle} onClick={()=> setEditResumeId("")} className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur bg-opacity-50 z-10">
              <div onClick={e=>e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input onChange={(e)=> setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg focus:border-[#1568ab] focus:ring-[#1568ab] focus:outline-none" required />
              <button className="w-full py-2 bg-[#1568ab] text-white rounded-lg hover:bg-[#0d4f82] transition-colors">Update</button>
              <XIcon className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => {setEditResumeId(""); setTitle("")}} />
              </div>
              </form>
          )
        }

      </div>
    </div>
  )
}


export default Dashboard;
