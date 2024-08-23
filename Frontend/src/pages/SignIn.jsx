import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function SignIn() {
  const initialValues = { name: '', email: '', number: '', password: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    number: Yup.string().required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  });

  const onSubmit = (values) => {
    console.log('Sign In form data', values);
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Name' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'number', type: 'tel', placeholder: 'Phone number' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div>
      <h2>Sign In</h2>
      <FormComponent initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} fields={fields} buttonLabel="Sign In" />
      <div className="navigation-links">
        <Link to="/login">Already have an account? Log In</Link>
      </div>
    </div>
  );
}

export default SignIn;
