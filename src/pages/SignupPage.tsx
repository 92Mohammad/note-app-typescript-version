import "../css/signup.css";
import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from '../hooks/useForm'

export default function SignupPage() {
  const { formData, handleForm } = useForm({
    username: "",
    email: "",
    password: "",
  })
  const navigate = useNavigate();

  const createNewUser = async () => {
    console.log('user form data: ', formData);
    try {
      const signUpUrl = 'http://localhost:8000/user/signup'
      const response = await fetch(signUpUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json();
      
      if (response.status === 201) {
        navigate('/login')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }


  return (
    <>
      <Navbar isHome = {false}/>
      <div className="signup-page">
        <h1 className="sign-up">Please Sign Up</h1>
        <div className="signup-form">
          <input
              value = {formData.username}
              id="username"
              name="username"
              type="text"
              placeholder="User Name"
              onChange={(e) => handleForm(e)}
          />
          <label id="email-label" htmlFor="email"></label>
          <input
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleForm(e)}
          />
          <label id="password-label" htmlFor="password"></label>
          <input
              name="password"
              id="password"
              type="password"
              placeholder="Password..."
              value={formData.password}
              onChange={(e) => handleForm(e)}
          />

          <button
              className="signup-btn"
              onClick={() => createNewUser()}
          >
            SignUp
          </button>
          <span className="account-availability">Already have an account? <Link to="/login">Login</Link></span>
        </div>
      </div>
    </>
  );
}
