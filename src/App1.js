// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./folder/AuthProvider";
import Login from "./folder/Login";
import Signup from "./folder/Signup";
import Dashboard from "./folder/Dashboard";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
