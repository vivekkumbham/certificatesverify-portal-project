import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SuperAdminRegister(){
  const nav = useNavigate()
  const [form,setForm] = useState({name:'',email:'',password:'',confirm:''})
  const [exists,setExists] = useState(true)

  useEffect(()=> {
    axios.get('http://localhost:4000/api/admin-auth/superadmin/exist').then(r=> setExists(r.data.exists)).catch(()=> setExists(true))
  },[])

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return alert('Passwords mismatch')
    try{
      const res = await axios.post('http://localhost:4000/api/admin-auth/superadmin-register', { name: form.name, email: form.email, password: form.password })
      localStorage.setItem('adminToken', res.data.token)
      nav('/dashboard')
    }catch(err){
      alert(err.response?.data?.error || 'Failed')
    }
  }

  if (exists) {
    return <div className="min-h-screen flex items-center justify-center"> <div className="p-6 bg-white shadow rounded"> <p>SuperAdmin already created. <a className="text-blue-600" href="/login">Go to login</a></p></div></div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl mb-4">Create SuperAdmin (one-time)</h2>
        <input className="w-full p-2 border mb-3" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="w-full p-2 border mb-3" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" className="w-full p-2 border mb-3" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <input type="password" className="w-full p-2 border mb-3" placeholder="Confirm" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
      </form>
    </div>
  )
}
