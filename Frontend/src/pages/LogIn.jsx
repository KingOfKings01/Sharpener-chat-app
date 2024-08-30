import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import FormComponent from '../components/FormComponent';
import { login } from '../API/userApis';
import { useState } from 'react';

function LogIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const {token, email, username} = await login(values);
      localStorage.setItem('token', token)
      localStorage.setItem('email', email)
      localStorage.setItem('username', username)
      alert('Log In successful');
      navigate("/")
      // Handle successful login, e.g., redirect or store token
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div className='form-page'>
      <h2>Log In</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FormComponent initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} fields={fields} buttonLabel="Log In" />
      
      <div className="navigation-links">
        <Link to="/sign-in">Don&#39;t have an account? Sign In</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
}

export default LogIn;