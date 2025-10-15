/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, User } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/contants";
import { validateEmail, validatePassword } from "../utils/validation";

const CreateAccountComponent = ({ onClose }) => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const modalRef = useRef();
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUpToggle, setSignUpToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      // console.log(res.data);
      dispatch(addUser(res.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const handleSignup = async () => {
    // final client-side validation before sending
    const isEmailValid = validateEmail(emailId);
    const isPasswordValid = validatePassword(password);
    const isFirstValid = firstName && firstName.trim().length > 0;
    const isLastValid = lastName && lastName.trim().length > 0;

    if (!isFirstValid || !isLastValid || !isEmailValid || !isPasswordValid) {
      setFirstNameError(isFirstValid ? "" : "Please enter your first name.");
      setLastNameError(isLastValid ? "" : "Please enter your last name.");
      setEmailError(isEmailValid ? "" : "Please enter a valid email address.");
      setPasswordError(isPasswordValid ? "" : "Password must be at least 8 characters, include a number and a letter.");

      // focus the first invalid field for accessibility
      if (!isFirstValid && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (!isLastValid && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (!isEmailValid && emailRef.current) {
        emailRef.current.focus();
      } else if (!isPasswordValid && passwordRef.current) {
        passwordRef.current.focus();
      }

      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      // On success: show toast, clear sensitive fields and dispatch user
      setSuccessMessage("Account created successfully");
      setPassword("");
      setEmailId("");
      setFirstName("");
      setLastName("");
      setEmailError("");
      setPasswordError("");
      setFirstNameError("");
      setLastNameError("");

      if (res?.data?.data) dispatch(addUser(res.data.data));

      // navigate after short delay so user sees the toast
      setTimeout(() => navigate("/profile"), 800);

    } catch (err) {
      // Reset field errors before mapping
      setEmailError("");
      setPasswordError("");
      setFirstNameError("");
      setLastNameError("");

      const resp = err?.response?.data;
      if (resp && resp.errors && typeof resp.errors === 'object') {
        const errs = resp.errors;
        if (errs.emailId) setEmailError(errs.emailId);
        if (errs.password) setPasswordError(errs.password);
        if (errs.firstName) setFirstNameError(errs.firstName);
        if (errs.lastName) setLastNameError(errs.lastName);
        if (resp.message) setError(resp.message);
      } else if (resp && resp.message) {
        setError(resp.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // validation helpers imported from ../utils/validation

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-auto mt-5 "
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-bold flex justify-center">
            Welcome to Trawell
          </h2>
        </div>
        <div className="space-y-4">
          {successMessage && (
            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm text-center">
              {successMessage}
            </div>
          )}
          <div className="space-y-2">
            {signUpToggle && (
              <>
                <div>
                  <label className="text-black font-semibold mx-3">
                    First Name
                  </label>
                  <div className="w-auto flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      id="firstName"
                      ref={firstNameRef}
                      type="text"
                      placeholder="Tyler"
                      className={`flex-1 outline-none ${firstNameError ? 'border border-red-500 rounded-sm' : ''}`}
                      value={firstName}
                      aria-invalid={!!firstNameError}
                      aria-describedby={firstNameError ? 'firstName-error' : undefined}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (firstNameError) setFirstNameError('');
                        if (error) setError('');
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-black font-semibold mx-3">
                    Last Name
                  </label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      id="lastName"
                      ref={lastNameRef}
                      type="text"
                      placeholder="Durden"
                      className={`flex-1 outline-none ${lastNameError ? 'border border-red-500 rounded-sm' : ''}`}
                      value={lastName}
                      aria-invalid={!!lastNameError}
                      aria-describedby={lastNameError ? 'lastName-error' : undefined}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (lastNameError) setLastNameError('');
                        if (error) setError('');
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-black font-semibold mx-3">
                Email Address
              </label>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <input
                  id="emailId"
                  ref={emailRef}
                  type="email"
                  placeholder="hellskitchen25@gmail.com"
                  className={`flex-1 outline-none ${emailError ? 'border border-red-500 rounded-sm' : ''}`}
                  value={emailId}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'emailId-error' : undefined}
                  onChange={(e) => {
                    setEmailId(e.target.value);
                    if (emailError) setEmailError("");
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
            {/* <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <input type="tel" placeholder="Phone number" className="flex-1 outline-none" />
            </div> */}
            <div>
              <label className="text-black font-semibold mx-3">Password</label>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                <KeyRound className="w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className={`flex-1 outline-none ${passwordError ? 'border border-red-500 rounded-sm' : ''}`}
                  value={password}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
            {(firstNameError || lastNameError || emailError || passwordError || error) && (
              <div className="text-red-500 font-bold text-sm ml-2 space-y-1">
                {firstNameError && <div id="firstName-error">{firstNameError}</div>}
                {lastNameError && <div id="lastName-error">{lastNameError}</div>}
                {emailError && <div id="emailId-error">{emailError}</div>}
                {passwordError && <div id="password-error">{passwordError}</div>}
                {error && <div>{error}</div>}
              </div>
            )}
          </div>
          <button
            className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
              loading
                ? 'bg-blue-400 text-white cursor-wait'
                : (!signUpToggle && 'bg-blue-500 text-white') ||
                  (signUpToggle && validateEmail(emailId) && validatePassword(password)
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-300 text-white cursor-not-allowed')
            }`}
            onClick={!signUpToggle ? handleLogin : handleSignup}
            disabled={loading || (signUpToggle && (!validateEmail(emailId) || !validatePassword(password)))}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : null}
            <span>Continue</span>
          </button>
          <div>
            {!signUpToggle ? (
              <>
                <h1 className="text-black text-sm ml-3 -mt-2">
                  Don&apos;t have an account?
                  <span
                    className="mx-1 cursor-pointer underline text-blue-500"
                    onClick={() => setSignUpToggle((value) => !value)}
                  >
                    Sign up
                  </span>{" "}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-black text-sm ml-3 -mt-2">
                  Have Account
                  <span
                    className=" mx-1 cursor-pointer underline text-blue-500"
                    onClick={() => setSignUpToggle((value) => !value)}
                  >
                    Login
                  </span>{" "}
                </h1>{" "}
              </>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <div className=" flex justify-center gap-3">
            <button className="text-2xl text-black ">
              <FaGithub />
            </button>
            <button className="text-black text-2xl">
              <FaGoogle />
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            By tapping{!signUpToggle ? " Log in" : " Sign Up"} or Continue, you
            agree to our Terms. Learn how we process your data in our Privacy
            Policy, and Cookie Policy.
          </p>
          {!signUpToggle && (
            <>
              <div className="text-center">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Trouble Logging In? Forget password
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAccountComponent;
