import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [user,setUser]=useState({email:"",password:""})
    const navigate=useNavigate()

    const handleChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }

    const handleLogin = (e) => {
        e.preventDefault()

        axios.post('http://localhost:6060/login', user)
    .then((response) => {
        console.log(response.data);
        if (response.data.message === 'Login Successful') {
            // If login is successful, navigate to the dashboard
            navigate('/dashboard');
            alert("Login successful");
        } else {
            // Handle login failure
            alert("Login failed: " + response.data.message);
        }
    })
    .catch((error) => {
        console.log(error);
        alert("An error occurred during login.");
    });


    }
  return (
    <div className='h-[80vh] flex justify-center items-center w-full'>
        <form onSubmit={handleLogin} className='border border-gray-300 rounded-md p-4 w-1/3'>
            <div className="mb-6 flex gap-2">
                <label for="email" className="block mb-2 text-sm font-medium w-1/3 text-gray-900 dark:text-white text-end">Your email:</label>
                <input type="email" name="email" id="email" className='border w-1/2' onChange={handleChange}/>
            </div>
            <div className="mb-6 flex gap-2">
                <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-1/3 text-end">Your password:</label>
                <input type="password" name="password" id="password" className='border w-1/2' onChange={handleChange}/>
            </div>
            <div className="mb-6">
                <button type="submit" className='p-2 border rounded-md bg-blue-300 text-white font-[Inter]  font-semibold'>Login</button>
            </div>
        </form>
      
    </div>
  )
}

export default Login
