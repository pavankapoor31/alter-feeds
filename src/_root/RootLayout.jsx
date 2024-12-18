import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AppContext/AppContext';

const RootLayout = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const loggedIn = !!user;

    if(!loading && !loggedIn) {
        navigate('register')
    }

  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default RootLayout