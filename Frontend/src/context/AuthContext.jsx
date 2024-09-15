import {createContext, useReducer, useEffect} from 'react'
import PropTypes from 'prop-types';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, email: action.payload.email };
    case 'LOGOUT':
      return { user: null, email: null };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    email: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({type: 'LOGIN', payload: user})
    }
  }, [])

  console.log('authcontext state: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

