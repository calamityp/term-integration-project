import React from 'react'

import { Button, Card } from '@mui/material'
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import AutoGraphSharpIcon from '@mui/icons-material/AutoGraphSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { useNavigate, useLocation } from 'react-router-dom';

import './Main.css'

const Main = () => {
    const navigate = useNavigate();
    let location = useLocation();
    let username = location.state.username;
    let id = location.state.id;

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    }
    const newData = () => {
        navigate("/file_uploading", { state: { "username": username, "id": id } })
    }
    const dataFromHistory = () => {
        navigate("/all-documents", { state: { "username": username, "id": id } })
    }
    return (
        <div className='container'>
            <div className='top-bar'>
                <div className='row' id='top'>
                    <div className='col'>
                        <div className='username'>
                            <span id='uname'>{username}</span>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='logout'>
                            <Button onClick={logout} id='btn-logout' style={{ 'backgroundColor': 'red' }} startIcon={<LogoutSharpIcon />} variant='contained'><span>Logout</span></Button>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className='mt-5' style={{ 'color': 'white', 'marginBottom': '2%' }}>Select Dataset for Dashboard</h3>
            <Card>
                <div className='row' id='cont'>
                    <div className='col' >
                        <Button onClick={dataFromHistory} id='visual' startIcon={<AutoGraphSharpIcon />} variant='contained'>Data from Previous Data Files</Button>
                    </div>
                    <div className='col'>
                        <Button onClick={newData} id='upload' startIcon={<CloudUploadSharpIcon />} variant='contained'>Upload New Files</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Main