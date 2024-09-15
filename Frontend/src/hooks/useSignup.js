import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const {dispatch} = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await axios.post('http://localhost:4000/api/user/signup', {
      email: email,
      password: password
    });

    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      setIsLoading(false)
    }
  }

  return {signup, isLoading, error}
}