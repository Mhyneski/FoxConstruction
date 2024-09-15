import { Link } from 'react-router-dom';
import styles from "../css/Homepage.module.css";
import picture from "../assets/asdasd.jpg";

const Homepage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.Header}>
        <div className={styles.leftSide}>
          <p className={styles.name1}>FOX</p>
          <p className={styles.name2}>CONSTRUCTION CO.</p>
        </div>
        <div className={styles.rightSide}>
          <a href="">ABOUT US</a>
          <a href="">COLLECTION</a>
          <a href="">SERVICES</a>
          <a href="">CONTACTS</a>
          <Link to="/Login" className={styles.loginBtn}>
            LOGIN
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.topSide}>
          <img src={picture} alt="" />
          <img src={picture} alt="" />
          <img src={picture} alt="" />
          <img src={picture} alt="" />
        </div>
        <div className={styles.bottomSide}>
          <img src={picture} alt="" />
          <img src={picture} alt="" />
          <img src={picture} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
