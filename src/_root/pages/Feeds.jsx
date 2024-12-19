import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import WelcomeHeader from '../../components/WelcomeHeader/WelcomeHeader';
import FeedCard from '../../components/FeedsCard/FeedsCard';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, fetchMorePosts, deletePost, likePost } from '../../redux/slices/postsSlice';
import { AuthContext } from '../../components/AppContext/AppContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../_auth/firebaseConfig';
const Feeds = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts, lastDoc, hasMore, status } = useSelector((state) => state.posts);
  const {user,userData} = useContext(AuthContext)

  const fetchMore = () => {
    dispatch(fetchMorePosts(lastDoc));
  };

  useEffect(() => {
    // Initial fetch if status is idle
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
    // Real-time listener for /posts collection
    // const postsCollectionRef = collection(db, 'posts');
    // const postsQuery = query(postsCollectionRef, orderBy('createdOn', 'desc'));
    // const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
    //   const changes = snapshot.docChanges();
    //   changes.forEach((change) => {
    //     const post = { id: change.doc.id, ...change.doc.data() };

    //     if (change.type === 'added') {
    //       // Add new post to the top of the feed
    //       dispatch({ type: 'posts/addRealtimePost', payload: post });
    //     } else if (change.type === 'removed') {
    //       // Remove the deleted post
    //       dispatch({ type: 'posts/removeRealtimePost', payload: post.id });
    //     }
    //   });
    // });

    // return () => unsubscribe(); // Cleanup listener on unmount
  }, [dispatch, status]);

  return (
    <Container className="position-relative">
      <WelcomeHeader username={userData?.name} image={userData?.image} id={userData?.uid} />
      <h4 className="mb-2 text-bold karla-font-800">Feeds</h4>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className="text-center my-3">
            <Spinner animation="border" variant="primary" />
            <p>Loading...</p>
          </div>
        }
        endMessage={
          <p className="text-center my-3">
            <b>Yay! You have seen it all 🎉</b>
          </p>
        }
      >
        {posts.map((post) => (
          <FeedCard
            key={post.id}
            {...post}
            deletePost={(id) => dispatch(deletePost(id))}
            likePost={(id, userId) => dispatch(likePost({ id, userId }))}
          />
        ))}
      </InfiniteScroll>
      <FloatingButton onClick={() => navigate('/create-post')} />
    </Container>
  );
};

export default Feeds;
