import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorPage from "../_root/pages/ErrorPage";
import Register from '../_auth/Register';
import Home from '../_root/pages/Home';
import ViewPost from '../components/ViewPost/ViewPost';
import CreatePost from '../components/CreatePost/CreatePost';
import { AuthContext } from '../components/AppContext/AppContext';

const AppRoutes = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const loggedIn = !!user;

    return (
        <>
            <Routes>
                <Route path="*" element={<ErrorPage />} />
                <Route path="/" element={<Navigate to={loggedIn ? '/home' : '/register'} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/feeds/:id" element={<ViewPost />} />
                <Route path="/create-post" element={<CreatePost />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
