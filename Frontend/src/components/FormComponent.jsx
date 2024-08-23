import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import '../../public/css/form.css';

function FormComponent({ initialValues, validationSchema, onSubmit, fields, buttonLabel }) {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form>
        {fields.map((field, index) => (
          <div className="form-controller" key={index}>
            <label>
              <Field
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
              />
              <ErrorMessage name={field.name} component="div" className="error" />
            </label>
          </div>
        ))}
        <button type="submit">{buttonLabel}</button>
      </Form>
    </Formik>
  );
}

FormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired, // An object containing initial form values
  validationSchema: PropTypes.object.isRequired, // A validation schema object, typically from Yup
  onSubmit: PropTypes.func.isRequired, // A function to handle form submission
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired, // The type of the input field
      name: PropTypes.string.isRequired, // The name of the input field
      placeholder: PropTypes.string,     // The placeholder text for the input field (optional)
    })
  ).isRequired, // An array of field objects with type, name, and optional placeholder
  buttonLabel: PropTypes.string.isRequired, // A string for the submit button label
};

export default FormComponent;
