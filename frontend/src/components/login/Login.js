import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Login.css'

const Login = () => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleLogin = () => {
        console.log(username)
        console.log(password)

        axios.post(`http://localhost:5000/login`, {
            "username": username,
            "password": password
        }).then((res) => {
            if (res.data['response']) {
                console.log("success");
                toast.success("Successfully Logged..",
                    { autoClose: 5000 })
                navigate("/main", { state: { "username": res.data['username'], "id": res.data['id'] } })
            } else {
                console.log("Error");
                toast.error("Login Failed",
                    { autoClose: 5000 })
            }
        }).catch((err) => {
            console.log("Error");
            toast.error("Login Failed",
                { autoClose: 5000 })
            console.log(err)
        });
    }

    return (
        <div className='box'>
            <div className='form-container'>
                <div className='login'>
                    <h3>Login</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value) }} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className='row' id='btn-row'>
                        <button type="submit" className="btn btn-primary btn-block" id='btn-login' onClick={handleLogin}>Login</button>
                    </div>
                    <ToastContainer />
                    <div className='row'>
                        <Link to='/register'><p>If you haven't an account, please Register!</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;