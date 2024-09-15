import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import image from "../assets/asdasd.jpg";
import styles from "../css/UserDashboard.module.css";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import axios from 'axios';

const UserDashboard = () => {
  const { email, user } = useAuthContext();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/project/projectuser`, {
          headers: {
            Authorization: `Bearer ${user.token}` // Assuming JWT token for auth
          }
        });
        setProjects(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [user]);


  return (
    <>
      <Navbar />
      <div className={styles.NameBanner}>
        <p>WELCOME BACK, {email}!</p>
      </div>
      <div className={styles.cardContainer}>
        {projects.map(project => (
          <Link to={`/project/${project._id}`} key={project._id} className={styles.card}>
            <img src={image} alt={project.name} />
            <div className={styles.cardContent}>
              <h1>{project.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
