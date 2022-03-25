import React, { useState } from 'react'

import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import TextField from '@mui/material/TextField';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button, Card } from '@mui/material';
import ReactLoading from 'react-loading';

import './FileUploading.css'

const FileUploading = () => {

  let location = useLocation();
  let username = location.state.username;
  let id = location.state.id;

  const navigate = useNavigate();
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [files3, setFiles3] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [fileSetName, setFileSetName] = useState('');

  const type = 'bars';
  const color = '#e39f00';
  const height = 150;
  const width = 150;

  const updateFiles1 = (incommingFiles1) => {
    console.log("incomming files1", incommingFiles1);
    setFiles1(incommingFiles1.target.files[0]);
  };

  const updateFiles2 = (incommingFiles2) => {
    console.log("incomming files2", incommingFiles2);
    setFiles2(incommingFiles2.target.files[0]);
  };

  const updateFiles3 = (incommingFiles3) => {
    console.log("incomming files3", incommingFiles3);
    setFiles3(incommingFiles3.target.files[0]);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  const uploadingData = () => {
    try {
      setLoaded(true)
      const formData = new FormData();
      formData.append("backlogIncidentFile", files1)
      formData.append("raisedIncidentFile", files3)
      formData.append("closedIncidentFile", files2)
      axios.post(
        `http://localhost:5000/upload_data`,
        formData,
        {
          params: {
            id,
            fileSetName
          }

        }).then((res) => {
          setLoaded(false)
          if (res.data['response']) {
            console.log("success");
            toast.success("Successfully Uploaded..",
              { autoClose: 5000 })
            navigate("/dashboard", { state: { "username": username, "docId": res.data['docId'], "userId": res.data['userId'] } })
          } else {
            console.log("Error");
            toast.error("Failed to Upload",
              { autoClose: 5000 })
          }
        }).catch((err) => {
          setLoaded(false)
          console.log("Error");
          toast.error("Failed to Upload",
            { autoClose: 5000 })
          console.log(err)
        });
    } catch (ex) {
      setLoaded(false)
      console.log(ex);
    }
  }

  return (


    <>
      {loaded ? <div className='mt-5' style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}><ReactLoading type={type} color={color} height={height} width={width} /></div>

        :
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
          <h3 className='mt-5' style={{ 'color': 'white', 'marginBottom': '2%' }}>Upload and fill the required data feilds</h3>
          <Card className='mb-5'>
            <div className='uploads'>

              <div className='container mt-5'>
                <Card style={{ 'backgroundColor': '#f7f6f2', 'padding': '10px' }}>

                  <label className='mb-1'><h4>Enter the Name of Your Set of Files</h4></label>
                  <TextField onChange={(e) => { setFileSetName(e.target.value) }} id="name-set" label="Set a name for the file set" variant="outlined" color='primary' style={{ 'width': '100%' }} />
                </Card>
              </div>
              <div className='row'>
                <div className='col'>
                  <div className='container mt-5' id='set1'>
                    <Card className='x' style={{ 'backgroundColor': '#f7f6f2', 'padding': '10px' }}>
                      <h4>Incidence Backlog File</h4>
                      <input onChange={updateFiles1} type="file" accept='.csv' />

                    </Card>
                  </div>
                </div>
                <div className='col'>
                  <div className='container mt-5' id='set2'>
                    <Card className='x' style={{ 'backgroundColor': '#f7f6f2', 'padding': '10px' }}>
                      <h4>Incidence Closed File</h4>
                      <input onChange={updateFiles2} type="file" accept='.csv' />
                    </Card>

                  </div>
                </div>

              </div>
              <div className='row'>
                <div className='col'>
                  <div className='container mt-5' id='set3'>
                    <Card className='x' style={{ 'backgroundColor': '#f7f6f2', 'padding': '10px' }}>
                      <h4>Incidence Raised File</h4>
                      <input onChange={updateFiles3} type="file" accept='.csv' />
                    </Card>

                  </div>
                </div>


              </div>
            </div>

            <ToastContainer />
            <div className='btn-upload-div mt-5 mb-3'>
              <button onClick={uploadingData} type="button" className="btn btn-info btn-block" id='btn-upload'><CloudUploadSharpIcon /> Upload</button>
            </div>
          </Card>

        </div>
      }
    </>
  )
}

export default FileUploading;






