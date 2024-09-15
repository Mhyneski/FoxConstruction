import Navbar from "../components/Navbar"
import { Link } from 'react-router-dom';

const ContractorDashboard = () => {
  return (
    <>
    <Navbar/>
    <div>
      <Link to="/ProjectList">
        <h1>PROJECT LISTS</h1>
      </Link>
      <Link to="/Generator">
      <h1>Generate A Bom</h1>
      </Link>
    </div>
    </>
  )
}

export default ContractorDashboard