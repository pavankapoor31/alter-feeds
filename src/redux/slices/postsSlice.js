import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../_auth/firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

// Async Thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const postsCollectionRef = collection(db, 'posts');
    const postsQuery = query(postsCollectionRef, orderBy('createdOn', 'desc'), limit(10));
    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { posts, lastDoc };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMorePosts = createAsyncThunk('posts/fetchMorePosts', async (lastDoc, { rejectWithValue }) => {
  try {
    if (!lastDoc) return { posts: [], lastDoc: null };

    const postsCollectionRef = collection(db, 'posts');
    const postsQuery = query(postsCollectionRef, orderBy('createdOn', 'desc'), startAfter(lastDoc), limit(10));
    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { posts, lastDoc: newLastDoc };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const likePost = createAsyncThunk('posts/likePost', async ({ id, userId }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const post = state.posts.items.find((post) => post.id === id);

    if (!post) throw new Error('Post not found');

    const currentLikes = post.likes || [];
    const likes = currentLikes.includes(userId)
      ? currentLikes.filter((likeId) => likeId !== userId)
      : [...currentLikes, userId];

    const postDoc = doc(db, 'posts', id);
    await updateDoc(postDoc, { likes });

    return { id, likes };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Posts Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    lastDoc: null,
    hasMore: true,
    status: 'idle',
    error: null,
  },
  reducers: {
    addRealtimePost: (state, action) => {
      const postExists = state.items.find((post) => post.id === action.payload.id);
      if (!postExists) {
        state.items = [action.payload, ...state.items];
      }
    },
    updateRealtimePost: (state, action) => {
      const index = state.items.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeRealtimePost: (state, action) => {
      state.items = state.items.filter((post) => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload.posts;
        state.lastDoc = action.payload.lastDoc;
        state.hasMore = action.payload.posts.length > 0;
        state.status = 'succeeded';
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.posts];
        state.lastDoc = action.payload.lastDoc;
        state.hasMore = action.payload.posts.length > 0;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { id, likes } = action.payload;
        const post = state.items.find((post) => post.id === id);
        if (post) post.likes = likes;
      });
  },
});

export const { addRealtimePost, updateRealtimePost, removeRealtimePost } = postsSlice.actions;


export default postsSlice.reducer;
