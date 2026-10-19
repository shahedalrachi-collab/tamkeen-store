import AuthLayout from "../../layout/AuthLayout";
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { Form, Button } from "react-bootstrap";
import { FiPhone } from "react-icons/fi";
import { AuthService } from "../../Services/AuthService";

const Login = () => {
  const navigateTo = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState(location.state?.phone || "");

  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError("Enter your phone number to log in.");
      return;
    }

    setError("");
    setServerError("");
    setLoading(true);

    AuthService.LoginService(phone)
      .then((data) => {
        console.log(data);

        navigateTo("/verify", { state: { phone: phone } });
      })
      .catch((err) => {
        console.log(err);

        if (err instanceof TypeError) {
          setServerError("Can't reach the server. Check your internet connection and try again.");
          return;
        }

        if (err.errors && err.errors.phone) {
          setError(err.errors.phone[0]);
        } else {
          setServerError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout>
      <div className="login-box">
        <h1 className="login-title">Welcome!</h1>
        <p className="login-subtitle">Please log in to continue</p>

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="login-field" controlId="loginPhone">
            <Form.Label visuallyHidden>Phone number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Add number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!error}
              className="login-input"
            />
            <span className="login-input-icon">
              <FiPhone />
            </span>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="login-btn w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              <>Log in</>
            )}
          </Button>

          {serverError ? (
            <div className="alert alert-warning mt-3">{serverError}</div>
          ) : (
            <></>
          )}
        </Form>

                <p className="text-center mt-4 mb-0">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="fw-semibold text-decoration-none"
            style={{ color: "#f0345d" }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;