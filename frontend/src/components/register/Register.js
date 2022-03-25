import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Register.css';

const Register = () => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();

    const navigate = useNavigate();

    const registerUser = () => {

        console.log(username)
        console.log(password)
        if (password === rePassword) {
            axios.post(`http://localhost:5000/register`, {
                "username": username,
                "password": password
            }).then((res) => {
                if (res.data['response']) {
                    console.log("success");
                    toast.success("Successfully Registered",
                        { autoClose: 5000 })
                    navigate("/")
                } else {
                    console.log("Error");
                    toast.error("Failed to register",
                        { autoClose: 5000 })
                }
            }).catch((err) => {
                console.log("Error");
                toast.error("Failed to register",
                    { autoClose: 5000 })
                console.log(err)
            });
        } else {
            toast.error("Password missmatch. Try Again",
                { autoClose: 5000 })
        }
    }

    return (
        <div className='box'>
            <div className='form-container'>
                <div className="register">
                    <h3>Register</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value) }} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" placeholder="Re Enter Password" onChange={(e) => { setRePassword(e.target.value) }} />
                    </div>
                    <div className='row' id='btn-row'>
                        <button className="btn btn-primary btn-block" id='btn-login' onClick={registerUser}>Register</button>
                    </div>
                    <ToastContainer />
                    <div className='row'>
                        <Link to='/'><p>If you have an account, please login !!!</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;