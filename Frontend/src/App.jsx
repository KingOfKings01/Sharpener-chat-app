import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';
import "../public/css/form.css"

function App() {
  // Define initial form values
  const initialValues = {
    name: '',
    email: '',
    number: '',
    password: '',
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    number: Yup.string().required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  });

  // Handle form submission
  const onSubmit = (values) => {
    console.log('Form data', values);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
        <Form method="post">
        <h2 className='title'>Sign In</h2>
          <div className="form-controller">
            <label>
              <Field type="text" name="name" placeholder="Name" />
              <ErrorMessage name="name" component="div" className="error" />
            </label>
          </div>
          <div className="form-controller">
            <label>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error" />
            </label>
          </div>
          <div className="form-controller">
            <label>
              <Field type="tel" name="number" placeholder="Phone number" />
              <ErrorMessage name="number" component="div" className="error" />
            </label>
          </div>
          <div className="form-controller">
            <label>
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error" />
            </label>
          </div>
          <button type="submit">Sign In</button>
        </Form>
      </Formik>
    </div>
  );
}

export default App;
