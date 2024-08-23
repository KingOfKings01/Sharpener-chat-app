import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormComponent from '../components/FormComponent';

function ForgotPassword() {
  const initialValues = { email: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const onSubmit = (values) => {
    console.log('Forgot Password form data', values);
  };

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
  ];

  return (
    <div>
      <h2>Forgot Password</h2>
      <FormComponent initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} fields={fields} buttonLabel="Reset Password" />
      <div className="navigation-links">
        <Link to="/sign-in">Don&#39;t have an account? Sign In</Link>
        <Link to="/login">Remembered your password? Log In</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
