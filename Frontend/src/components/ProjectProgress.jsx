import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from "../css/ProjectProgress.module.css";
import { useAuthContext } from "../hooks/useAuthContext"; 
import Navbar from './Navbar';

const ProjectProgress = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/project/${projectId}`, {
          headers: {
            Authorization: `Bearer ${user.token}` // Include the token in the headers
          }
        });
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId, user.token]);

  const handleFloorClick = (floorId) => {
    if (selectedFloor === floorId) {
      setSelectedFloor(null); // Deselect the floor if it's already selected
    } else {
      setSelectedFloor(floorId); // Otherwise, select the clicked floor
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
      <h1>{project.name} Progress</h1>
      {project.floors.map(floor => (
        <div key={floor._id} className={styles.floor} onClick={() => handleFloorClick(floor._id)}>
          <h2>{floor.name}</h2>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${floor.progress}%` }}
            >
              {floor.progress}%
            </div>
          </div>
          {selectedFloor === floor._id && ( // Only show tasks if the floor is selected
            <div>
              <h3>Tasks:</h3>
              <ul>
                {floor.tasks.map(task => (
                  <li key={task._id}>
                    <span>{task.name}</span>
                    <span>{task.progress}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectProgress;
