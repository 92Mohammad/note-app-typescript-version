import NavBar from "./NavBar";
import "../css/home.css";
import background from "../images/student-study-table.jpg";
import { Link } from "react-router-dom";
import { useEffect } from 'react'
export default function Home() {
  // when user is login user close the tab and when user come back it should be on the notes page because it was not logout
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token){
      window.location.href = '/notes';
    }
  }, [])

  return (
    <>
      <NavBar isHome = {true}/>
      <main className="home-page">
        <div className="main-content">
          <div className="left-section">
            <h1>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sed
              perferendis reprehenderit debitis, deleniti fuga itaque esse
              voluptas eaque illo!
            </h1>
            <Link to="/login">Create Notes</Link>
          </div>
          <div className="right-section">
            <img src={background} alt="student" />
          </div>
        </div>
      </main>
    </>
  );
}
