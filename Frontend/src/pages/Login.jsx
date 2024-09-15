import { useState } from "react";
import styles from "../css/Login.module.css";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className={styles.Container}>
      <div className={styles.TopSide}>
        <h5>Get Ready.</h5>
        <h5>We&#39;re Finishing!</h5>
        <p>Please enter your details.</p>
      </div>

      <div className={styles.form1}>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="enter your email" />
          <label>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="enter your password" />
          <a href="">Forgot password</a>
          <button type="submit" disabled={isLoading}>LOG IN</button>
        </form>
        {error && <p className={styles.error1}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
