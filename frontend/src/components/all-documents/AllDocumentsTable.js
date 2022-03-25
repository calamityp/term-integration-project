import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import AutoGraphSharpIcon from '@mui/icons-material/AutoGraphSharp';
import KeyboardReturnSharpIcon from '@mui/icons-material/KeyboardReturnSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { Button, Card } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './AllDocumentsTable.css';

const AllDocumentsTable = () => {
    let location = useLocation();
    let username = location.state.username;
    let id = location.state.id;
    const [documentsObj, setDocumentsObj] = useState([]);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    }

    const navigateReturn = () => {
        navigate("/file_uploading", { state: { "username": username, "id": id } })
    }


    useEffect(() => {
        axios.get(`http://localhost:5000/allDoc`, {
            params: {
                id,
            }
        }).then((res) => {
            if (res.data['response']) {
                console.log("success");
                toast.success("Successfully Loaded..",
                    { autoClose: 5000 })
                setDocumentsObj(res.data["docs"])
            } else {
                console.log("Error");
                toast.error("Failed to load docs",
                    { autoClose: 5000 })
            }
        }).catch((err) => {
            console.log("Error");
            toast.error("Failed to load docs",
                { autoClose: 5000 })
            console.log(err)
        });
    }, [id]);

    const selectDoc = (e) => {
        let docId = e.target.value;
        navigate("/dashboard", { state: { "username": username, "docId": docId, "userId": id } })
    }

    return (
        <div className='container'>
            <div className='top-bar'>
                <div className='row' id='top'>
                    <div className='col'>
                        <div className='username' style={{ 'width': '200px' }}>
                            <span id='uname'>{username}</span>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='logout'>
                            <Button id='btn-logout' onClick={logout} style={{ 'backgroundColor': 'red' }} startIcon={<LogoutSharpIcon />} variant='contained'><span id='log'>Logout</span></Button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <h3 className='mt-5 mb-5' id='table-topic'>All Documents</h3>
            <Card className='mt-3 mb-3' style={{ 'backgroundColor': 'white', 'padding': '10px', 'borderRadius': '10px' }}>
                <Table responsive style={{ 'color': 'black' }}>
                    <thead>
                        <tr>
                            <th><span>Document #</span></th>
                            <th><span>Document ID</span></th>
                            <th><span>Document Name</span></th>
                            <th><span>Action</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentsObj.map((itm, index) => {
                            return (
                                <tr>
                                    <td><span>{index + 1}</span></td>
                                    <td><span>{itm[0]}</span></td>
                                    <td><span>{itm[2]}</span></td>
                                    <td><Button value={itm[0]} onClick={selectDoc} variant="contained" startIcon={<AutoGraphSharpIcon />}>Visualize</Button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card>
            <div className='btn-return'>
                <Button variant='contained' startIcon={<KeyboardReturnSharpIcon />} onClick={navigateReturn} >
                    Return to Upload a New File
                </Button>
            </div>
        </div>
    )
}

export default AllDocumentsTable;







