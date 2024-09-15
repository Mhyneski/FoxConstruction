import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import ProjectProgress from './components/ProjectProgress';
import ContractorDashboard from './pages/ContractorDashboard';
import ProjectList from './pages/ProjectList';
import AdminDashboard from './pages/AdminDashboard';
import Generator from './pages/Generator';

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/UserDashboard" element={<UserDashboard/>}/>
      <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
      <Route path="/project/:projectId" element={<ProjectProgress />} />
      <Route path="/ContractorDashboard" element={<ContractorDashboard/>} />
      <Route path="/ProjectList" element={<ProjectList/>} />
      <Route path="/Generator" element={<Generator/>} />
      <Route path="/" element={<Homepage/>}/>
      </Routes>
    </Router>
  )
}

export default App
