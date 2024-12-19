import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AppContext/AppContext';
import { fetchUserDetails } from '../../api/api';
import ProfilePage from '../pages/ProfilePage';
import { toast } from 'react-toastify';
import { toastConfig } from '../../config/config';

const ProfileWrapper = () => {
    const { id } = useParams();
    const { user, userData } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(data,'data')
    },[data])
    const getUserDetails = async (id) => {
        try {
            if (user?.uid === id) {
                setData(userData);
                console.log(userData,'userData')
            } else {
                const userDetails = await fetchUserDetails(id);
                if (!userDetails) {
                    toast.error("Could not find user details", toastConfig);
                    navigate('/home');
                } else {
                    setData(userDetails);
                }
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("An error occurred while fetching user details", toastConfig);
        }
    };

    useEffect(() => {
        if (id) {
            getUserDetails(id);
        }
    }, [id,userData]);

    return (
        <>
            {data && <ProfilePage userData={data} />}
        </>
    );
};

export default ProfileWrapper;
