import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import AuthLayout from "../../layout/AuthLayout";
import { AuthService } from "../../Services/AuthService";

import { IoApertureOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";

const Signup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

    const  loadingCssDivStyle = { color: 'white', fontSize: "60px", display: 'flex', alignItems: "center", justifyContent: "center" , position: "fixed", inset: "0", zIndex: 100, background: "rgba(0,0,0,0.6)"}

  const navigateTo = useNavigate();

  const [registerData, setRegisterData] = useState({

    name: "",
    email: "",
    phone: "",
    image: null,

  });

  const handleRegisteration = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    AuthService.RegisterService(registerData)
      .then((data) => {
        console.log(data);

           const token = data?.token || data?.data?.token;
        if (token) {
          localStorage.setItem("token", token);
          console.log(" [Signup] Token saved:", localStorage.getItem("token"));
        } else {
          console.log("ℹ[Signup] No token in the register response");
        }

        navigateTo("/login", {
          state: { phone: registerData.phone, email: registerData.email },
        });
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(()=>{
       setLoading(false)

      }, 3000)

      });
  };

  return (
    <AuthLayout>

         {
        loading
          ? <div style={ loadingCssDivStyle }>Loading....</div>
          : <></>
      }
      <div className="signup">
        <h2 className="signup-title">Fill your information</h2>
        <p className="signup-subtitle">Enter your details</p>

        <form onSubmit={handleRegisteration}>

          <label htmlFor="image" className="signup-photo">
            {preview ? (
              <img src={preview} alt="Profile preview" className="signup-photo-img" />
            ) : (
              <>
                <span className="signup-photo-icon">
                  <IoApertureOutline size={34} />
                </span>
                <span className="signup-photo-text">Add photo</span>
              </>
            )}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e) => {
              const file = e.target.files[0];

              if (!file) return;

              setRegisterData({
                ...registerData,
                image: file,
              });
              setPreview(URL.createObjectURL(file));
            }}
          />

          <div className="signup-field">
            <input
              id="name"
              type="text"
              className="form-control signup-input"
              placeholder="Name..."
              required
              onInput={(e) => {
                setRegisterData({
                  ...registerData,
                  name: e.target.value,
                });
              }}

            />

            <span className="signup-icon">
              <FaRegUserCircle size={18} />
            </span>
          </div>

        <div className="signup-field">
  <input
    id="email"
    type="email"
    className="form-control signup-input"
    placeholder="Email"
    onInput={(e) => {
      setRegisterData({
        ...registerData,
        email: e.target.value,
      });
    }}
  />
  <span className="signup-icon">
    <HiOutlineMail size={18} />
  </span>
</div>

{error?.errors?.email && (
  <small className=" error-message text-danger d-block mt-1">{error.errors.email[0]}</small>
)}

          <div className="signup-field">
            <input
              id="phone"
              type="tel"
              className="form-control signup-input"
              placeholder="Add number"
              required
              onInput={(e) => {
                setRegisterData({
                  ...registerData,
                  phone: e.target.value,
                });
              }}
            />
            <span className="signup-icon">
              <FiPhone size={18} />
            </span>
          </div>
          {error?.errors?.phone && (
      <small className="  error-message text-danger d-block mt-1">{error.errors.phone[0]}</small>

)}

          <button className="btn signup-btn w-100" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

        </form>

        <p className="text-center mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: "#f0345d" }}>
            Log in
          </Link>
        </p>
      </div>

    </AuthLayout>
  );
};

export default Signup;