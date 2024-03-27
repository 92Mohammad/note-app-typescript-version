import "../css/signup.css";
import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from '../hooks/useForm'
export default function LoginPage() {

  const { formData, handleForm } = useForm({
      username: "",
      password: "",
  });
  const navigate = useNavigate();
  console.log('form data: ', formData)
  const userLogin = async() => {
    try {

      const response = await fetch("http://localhost:8000/user/login",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });
      const data = await response.json();
      console.log(data)
      if (response.status === 201){
        localStorage.setItem("jwtToken", data.jwtToken);
        navigate('/notes')
      }
    } catch (error: any) {
      console.log(error.message);
    }

  }

  return (
    <>
      <Navbar isHome = {false}/>
      <div className="login-page">
        <h1 className="login">Please LogIn</h1>
        <div className="login-form">
          <label id="email-label" htmlFor="username"></label>
          <input
            name="username"
            id="username"
            type="text"
            placeholder="User name"
            value={formData.username}
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
            className="login-btn"
            onClick={() => userLogin()}
          >
            Login
          </button>
          <span className="account-availability">
            Account does not exist? <Link to="/signup">Register</Link>
          </span>
        </div>
      </div>
    </>
  );
}
