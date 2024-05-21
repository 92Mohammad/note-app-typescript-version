import "./index.css";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { NotePage } from "./pages/NotePage";
import { SignUpPage } from "./pages/SignUpPage";



function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/notes" element={<NotePage />} />
    </Routes>
  </BrowserRouter>
  )
  
}

export default App
