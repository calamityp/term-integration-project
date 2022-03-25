import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/login/Login'
import Register from './components/register/Register'
import FileUploading from './components/file-upload/FileUploading';
import AllDocumentsTable from './components/all-documents/AllDocumentsTable';
import Main from './components/main/Main';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/file_uploading' element={<FileUploading />} />
          <Route exact path='/all-documents' element={<AllDocumentsTable />} />
          <Route exact path='/main' element={<Main />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
