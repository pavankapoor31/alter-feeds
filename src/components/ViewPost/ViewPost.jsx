import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../_auth/firebaseConfig';
import FeedCard from '../FeedsCard/FeedsCard';
import { Button } from 'react-bootstrap';

const ViewPost = () => {
  const { id } = useParams(); // Destructure the id from useParams
  const [postData, setPostData] = useState(null); // State to store fetched post data
  const navigate = useNavigate(); // Hook to navigate between routes

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id); // Get document reference
        const docSnap = await getDoc(docRef); // Fetch document
        if (docSnap.exists()) {
          setPostData(docSnap.data()); // Set the document data to state
        } else {
          console.error('No such document!'); // Handle case where document does not exist
        }
      } catch (error) {
        console.error('Error fetching document:', error); // Handle errors
      }
    };

    fetchPost(); // Call the function to fetch data
  }, [id]);

  return (
    <div>
      {postData ? (
          <FeedCard {...postData} /> // Pass the post data to FeedCard
          ) : (
              <p>Loading...</p> // Show a loading state while fetching
              )}
       <Button variant='dark' onClick={() => navigate('/home')}>Click here to go back to all posts!</Button> {/* Close button to navigate */}
    </div>
  );
};

export default ViewPost;
