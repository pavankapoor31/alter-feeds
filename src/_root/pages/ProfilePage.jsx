import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../components/AppContext/AppContext';
import { db } from '../../_auth/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import defaultCoverImage from './../../assets/images/cover_image.svg';
import { Button } from 'react-bootstrap';
import FeedCard from '../../components/FeedsCard/FeedsCard';
import leftArrowSvg from "./../../assets/images/left_arrow.svg";
import { FaPencilAlt } from 'react-icons/fa';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../_auth/firebaseConfig';
const ProfilePage = ({userData}) => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [editingProfile, setEditingProfile] = useState(false);
    const [updatedName, setUpdatedName] = useState(userData?.name || '');
    const [updatedBio, setUpdatedBio] = useState(userData?.bio || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const toggleEditProfile = () => {
        setEditingProfile((prev) => !prev);
        // Reset form data when toggling
        if (!editingProfile) {
            setUpdatedName(userData?.name || '');
            setUpdatedBio(userData?.bio || '');
            setError(null);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) {
            setError('User not authenticated');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!updatedName.trim()) {
                throw new Error('Name cannot be empty');
            }

            // Query for the document using uid field
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('User profile not found');
            }

            // Get the actual document ID
            const userDoc = querySnapshot.docs[0];
            const docId = userDoc.id;

            // Prepare update data
            const updateData = {
                name: updatedName.trim(),
                bio: updatedBio.trim(),
                updatedAt: new Date().toISOString()
            };

            // Update using the correct document reference
            const userDocRef = doc(db, 'users', docId);
            await updateDoc(userDocRef, updateData);
            setEditingProfile(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };
    const getUserPosts = async () => {
        if (userData) {
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('creator.id', '==', userData.uid));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login if no user is authenticated
        } else {
            getUserPosts();
        }
    }, [user, navigate]);

    const handlePhotoUpload = async (e) => {
        if (!user) {
            setError('User not authenticated');
            return;
        }

        const file = e.target.files[0];
        const storageRef = ref(storage, `users/${user.uid}/profile_image`);
        setIsLoading(true);
        setError(null);

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                throw new Error('User profile not found');
            }
            const userDoc = querySnapshot.docs[0];
            const docId = userDoc.id;
            const updateData = {
                image: downloadURL,
                updatedAt: new Date().toISOString()
            };
            const userDocRef = doc(db, 'users', docId);
            await updateDoc(userDocRef, updateData);
            setError(null);
        } catch (err) {
            console.error('Error updating profile image:', err);
            setError(err.message || 'Failed to update profile image');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="profile-page position-relative" style={{ height: "calc(100vh)" }}>
            {!editingProfile ? (
                <>
                    <div className="profile-info">
                        <div className="cover-image">
                            <img
                                src={userData?.coverImage ?? defaultCoverImage}
                                alt="Cover"
                                className="profile-image"
                                style={{ objectFit: 'cover', width: '100%', height: '11.85rem' }}
                            />
                            <img src={leftArrowSvg} className='position-absolute start-0 fs-3 text-white ml-1 mt-1' role='button' onClick={() => navigate(-1)} />
                        </div>
                        <div className="d-flex gap-2">
                            <div>
                                <img
                                    src={userData?.image}
                                    alt="Profile Pic"
                                    className="rounded-circle"
                                    style={{
                                        width: '7.1rem',
                                        height: '7rem',
                                        position: 'relative',
                                        top: '-3.25rem',
                                        left: '1rem',
                                    }}
                                />
                            </div>
                            {user?.uid === userData?.uid &&
                                <div
                                className="btn h-fit btn-sm btn-outline-dark px-5 mx-3 bg-white border-radius-2 text-black w-100"
                                style={{ height: 'fit-content', marginTop: '1rem' }}
                                onClick={toggleEditProfile}
                            >
                                Edit Profile
                            </div>
                            }
                        </div>
                        <div className="karla-font-600 fs-1 mt-n1 ml-1">{userData?.name}</div>
                        <div className="ml-1">
                            {userData?.bio ? (
                                <p >{userData.bio}</p>
                            ) : (
                                <p>No bio</p>
                            )}
                        </div>
                    </div>
                    <div className="posts mt-1">
                        <h3 className="ml-1">{`${userData.uid===user.uid?'Your ':''}`} Posts</h3>
                        {posts.length > 0 ? (
                            <div className="mt-1">
                                {posts.map((post) => (
                                    <FeedCard key={post.id} {...post} allowDelete={false} likePost={() => { }} />
                                ))}
                            </div>
                        ) : (
                            <p>You have no posts yet.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="edit-profile ">
                    <div className="cover-image">
                        <img
                            src={userData?.coverImage ?? defaultCoverImage}
                            alt="Cover"
                            className="profile-image"
                            style={{ objectFit: 'cover', width: '100%', height: '11.85rem' }}
                        />
                        <img src={leftArrowSvg} className='position-absolute start-0 fs-3 text-white ml-1 mt-1' onClick={() => setEditingProfile(false)} />
                    </div>
                    <div className="profile-pic-edit ml-1">
                        <img
                            src={userData?.image}
                            alt="Profile Pic"
                            className="rounded-circle border border-gray "
                            style={{ width: '7.1rem', height: '7rem', position: 'relative', top: '-3.5rem' }}
                        />
                           
                         <label>
                        <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload}  />
                        <FaPencilAlt  className='text-white fs-5 ' style={{  position: 'relative', top: '-3rem','left':'-1.25rem' }} onClick={handlePhotoUpload}/>  
                         </label>

                    </div>
                    <div className="form-group ml-1">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 p-0 mx-1"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
                    </div>
                    <div className="form-group ml-1 my-2">
                        <label>Bio</label>
                        <textarea
                            className="form-control border-0 border-bottom rounded-0 p-0 mx-1"
                            value={updatedBio}
                            onChange={(e) => setUpdatedBio(e.target.value)}
                        />
                    </div>
                    <Button variant="dark" className='position-absolute w-75  rounded-5' onClick={handleSaveProfile}
                    style={{left:"1rem",right:"1rem",bottom:"1rem",margin:'auto'}}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
