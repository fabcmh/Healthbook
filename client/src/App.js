import React from 'react'
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Login />} path="/" />
        <Route element={<SignUp />} path="/SignUp" />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Home />} path="/Home" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

