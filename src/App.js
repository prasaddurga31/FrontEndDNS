import "./App.css";
import Home from "./pages/home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pagenotfound from "./pages/pagenotfound";
import ADD_Domain from "./pages/ADD_Domain";
import Record from "./pages/Record";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/new-domain" element={<ADD_Domain />} />
          <Route path="/view-record/:id" element={<Record />} />
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
