import AuthLayout from "../../layout/AuthLayout";
import React, {useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthService } from "../../Services/AuthService";
import { useCart } from "../../Context/CartContext";
import { AuthContext } from "../../Context/AuthContext";
const CODE_LENGTH = 5;
const RESEND_SECONDS = 60;

const Verify = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
     const { loadCart } = useCart()
const { login } = useContext(AuthContext);

  const phone = location.state?.phone;

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!phone) {
      navigateTo("/login");
    }
  }, [phone, navigateTo]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {

    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    const fullCode = code.join("");

    if (fullCode.length < CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code.`);
      return;
    }

    setError("");
    setServerError("");
    setSuccessMsg("");
    setLoading(true);

    AuthService.VerifyService(phone, fullCode)
      .then((data) => {
        console.log(data);
        localStorage.setItem("user_info", JSON.stringify(data));
        // localStorage.setItem("auth_token", data.data.token);
          loadCart()
        login(data);
         sessionStorage.setItem("justLoggedIn", "yes");

        navigateTo("/");
      })
      .catch((err) => {
        console.log(err);

        if (err instanceof TypeError) {
          setServerError("Can't reach the server. Check your internet connection and try again.");
          return;
        }

        if (err.errors && err.errors.otp) {
          setError(err.errors.otp[0]);
        } else {
          setServerError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResend = () => {
    setError("");
    setServerError("");
    setSuccessMsg("");
    setResending(true);

    AuthService.ResendService(phone)
      .then((data) => {
        console.log(data);
        setSuccessMsg("A new code has been sent.");
        setCode(Array(CODE_LENGTH).fill(""));
        inputsRef.current[0].focus();
        setSeconds(RESEND_SECONDS);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof TypeError) {
          setServerError("Can't reach the server. Check your internet connection and try again.");
          return;
        }
        setServerError(err.message);
      })
      .finally(() => {
        setResending(false);
      });
  };

  return (
    <AuthLayout>
      <div className="verify">
        <h2 className="verify-title">Verification</h2>
        <p className="verify-subtitle">
          Enter the code we send to : <span className="verify-phone">{phone}</span>
        </p>

        <form onSubmit={handleVerify}>

          <div className="verify-code">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="-"
                autoFocus={index === 0}
                className={`verify-box ${digit ? "verify-box-filled" : ""} ${error ? "verify-box-error" : ""}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {error ? <div className="verify-error">{error}</div> : <></>}

          <p className="verify-timer">
            Didn't receive code ? <span>{formatTime(seconds)}</span>
          </p>
          <button
            type="button"
            className="verify-resend"
            onClick={handleResend}
            disabled={seconds > 0 || resending}
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>

          <button className="btn verify-btn w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Verifying...
              </>
            ) : (
              <>Verify</>
            )}
          </button>

          <div className="verify-or">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="btn verify-back w-100"
            onClick={() => navigateTo("/login", { state: { phone: phone } })}
          >
            Go back
          </button>

          {successMsg ? <div className="alert alert-success mt-3">{successMsg}</div> : <></>}
          {serverError ? <div className="alert alert-warning mt-3">{serverError}</div> : <></>}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Verify;