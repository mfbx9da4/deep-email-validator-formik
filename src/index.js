import "./helper.css";
import React, { useState } from "react";
import { withFormik } from "formik";
import { render } from "react-dom";

const validate = async (values, { setIsValidating }) => {
  if (!(values.email && values.email.length)) return;
  const errors = {};
  setIsValidating(true);
  const res = await fetch(
    "https://deep-email-validator.herokuapp.com/email/validate",
    {
      body: JSON.stringify({ email: values.email }),
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  );
  setIsValidating(false);
  const json = await res.json();
  console.log(values.email, json);

  if (!json.valid) {
    errors.email = json.validators[json.reason].reason;
    return errors;
  }
};

const BasicForm = props => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValidating
  } = props;

  let feedback = null;

  if (isValidating) feedback = <div>Validating ...</div>;
  else if (errors.email)
    feedback = <div className="input-feedback">{errors.email}</div>;
  else if (values.email.length) feedback = <div>Email Valid ✅</div>;
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        placeholder="Email"
        name="email"
      />
      <div style={{ marginTop: "0.3rem" }}>{feedback}</div>
      {/* <pre>{JSON.stringify({ errors, values }, null, 2)}</pre> */}
    </form>
  );
};

const WrappedForm = withFormik({
  mapPropsToValues: () => ({ email: "" }),
  validate,
  handleSubmit: () => {},
  displayName: "BasicForm"
})(BasicForm);

const App = () => {
  const [isValidating, setIsValidating] = useState(false);
  return (
    <div className="app">
      <h1>
        Basic{" "}
        <a
          href="https://www.npmjs.com/package/deep-email-validator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deep Email Validator
        </a>{" "}
        Demo
      </h1>

      <WrappedForm
        isValidating={isValidating}
        setIsValidating={setIsValidating}
      />
    </div>
  );
};

render(<App />, document.getElementById("root"));
