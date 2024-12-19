import React, { useContext, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import WelcomeHeader from "../../components/WelcomeHeader/WelcomeHeader";
import FeedCard from "../../components/FeedsCard/FeedsCard";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import { Container, Spinner } from "react-bootstrap";
import { AuthContext } from "../../components/AppContext/AppContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../_auth/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, startAfter, getDocs, doc, deleteDoc, arrayUnion, updateDoc } from "firebase/firestore";

const Feeds = () => {
  const { user, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initial fetch of posts
    const postsCollectionRef = collection(db, "posts");
    const postsQuery = query(postsCollectionRef, orderBy("createdOn", "desc"), limit(10));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } else {
        setHasMore(false);
    }
      if (snapshot.docs.length < 10) {
        setHasMore(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchMorePosts = async () => {
    if (!lastDoc) return;

    const postsCollectionRef = collection(db, "posts");
    const postsQuery = query(
      postsCollectionRef,
      orderBy("createdOn", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    try {
      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.docs.length < 10) {
        setHasMore(false);
      }
      return;
    } catch (err) {
      console.error("Error fetching more posts:", err);
    }
  };

  const deletePost = async (id) => {
    try {
      const postDoc = doc(db, "posts", id);
      await deleteDoc(postDoc);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };
  const likePost = async (id, userId) => {
    try {
      const postDoc = doc(db, "posts", id);
      const post = posts.find((post) => post.id === id);
      
      if (!post) {
        console.error("Post not found");
        return;
      }

      const currentLikes = post.likes || [];
      const likes = currentLikes.includes(userId)
        ? currentLikes.filter((likeId) => likeId !== userId)
        : [...currentLikes, userId];

      await updateDoc(postDoc, { likes });
      
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === id ? { ...p, likes } : p))
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };


  return (
    <Container className="position-relative">
      <WelcomeHeader username={userData?.name} image={userData?.image} />
      <h4 className="mb-4 text-bold karla-font-800">Feeds</h4>

      <FloatingButton onClick={() => navigate('/create-post')} />
      <InfiniteScroll
        dataLength={posts.length} // Current number of posts
        next={fetchMorePosts}     // Function to load more data
        hasMore={hasMore}         // Determines whether more data can be loaded
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
          <FeedCard key={post.id} {...post} deletePost={deletePost} likePost={likePost}/>
        ))}
      </InfiniteScroll>
    </Container>
  );
};

export default Feeds;
