import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./_auth/Register";
import ErrorPage from "./_root/pages/ErrorPage";
import Home from "./_root/pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { useState } from "react";
import AppContext from "./components/AppContext/AppContext";
import CreatePost from "./components/CreatePost/CreatePost";
function App() {
    return (
        <main className="main-container" >
            <BrowserRouter>
                <AppContext>
                        <div className="child-container">
                    <Routes>
                            <Route path="*" element={<ErrorPage />} />
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/create-post" element={<CreatePost />} />
                    </Routes>
                        </div>
                </AppContext>
            </BrowserRouter>
        </main >
    );
}

export default App;
