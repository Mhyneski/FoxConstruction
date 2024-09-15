import { useState, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../components/Navbar";
import styles from '../css/Generator.module.css';
import { AuthContext } from "../context/AuthContext";

const Generator = () => {
    const [formData, setFormData] = useState({
        totalArea: '',
        numFloors: '',
        avgFloorHeight: '',
        templateTier: 'mid' // Default value
    });

    const [errors, setErrors] = useState({});
    const [bom, setBom] = useState(null); 
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['totalArea', 'numFloors', 'avgFloorHeight', 'templateTier'];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            Axios.post('http://localhost:4000/api/bom/generate', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            })
            .then(response => {
                console.log('Generated BOM:', response.data);
                setBom(response.data.bom);
            })
            .catch(error => {
                console.error('Error generating BOM:', error);
            });
        }
    };

    return (
        <>
        <Navbar/>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label>Total Area (sqm)</label>
                <input type="number" name="totalArea" value={formData.totalArea} onChange={handleChange} required />
                {errors.totalArea && <span className={styles.error}>{errors.totalArea}</span>}
            </div>
            <div className={styles.formGroup}>
                <label>Number of Floors</label>
                <input type="number" name="numFloors" value={formData.numFloors} onChange={handleChange} required />
                {errors.numFloors && <span className={styles.error}>{errors.numFloors}</span>}
            </div>
            <div className={styles.formGroup}>
                <label>Average Floor Height (meters)</label>
                <input type="number" name="avgFloorHeight" value={formData.avgFloorHeight} onChange={handleChange} required />
                {errors.avgFloorHeight && <span className={styles.error}>{errors.avgFloorHeight}</span>}
            </div>
            <div className={styles.formGroup}>
                <label>Template Tier</label>
                <select name="templateTier" value={formData.templateTier} onChange={handleChange} required>
                    <option value="low">Low</option>
                    <option value="mid">Mid</option>
                    <option value="high">High</option>
                </select>
                {errors.templateTier && <span className={styles.error}>{errors.templateTier}</span>}
            </div>
            <button type="submit" className={styles.submitButton}>Generate BOM</button>
        </form>

        {bom && (
            <div className={styles.bomContainer}>
                <h2>Generated BOM</h2>
                <h3>Project Details</h3>
                <p>Total Area: {bom.projectDetails.totalArea} sqm</p>
                <p>Number of Floors: {bom.projectDetails.numFloors}</p>
                <p>Average Floor Height: {bom.projectDetails.avgFloorHeight} meters</p>

                <h3>Materials</h3>
                <ul>
                    {Object.entries(bom.materials).map(([material, quantity]) => (
                        <li key={material}>{material}: {quantity}</li>
                    ))}
                </ul>
            </div>
        )}
        </>
    );
};

export default Generator;
