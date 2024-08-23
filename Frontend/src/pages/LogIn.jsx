import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function LogIn() {
  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  });

  const onSubmit = (values) => {
    console.log('Log In form data', values);
  };

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div>
      <h2>Log In</h2>
      <FormComponent initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} fields={fields} buttonLabel="Log In" />
      <div className="navigation-links">
        <Link to="/sign-in">Don&#39;t have an account? Sign In</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
}

export default LogIn;
