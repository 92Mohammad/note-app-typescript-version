import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { NotePage } from "./pages/NotePage";
import { SignUpPage } from "./pages/SignUpPage";

import { Provider } from "react-redux";
import { store } from "./app/store";



function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notes" element={<NotePage />} />
        </Routes>
      </BrowserRouter>

    </Provider>
    
  )
  
}

export default App
