import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("https://dummyjson.com/posts");
  return response.data.posts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  ); // Ensure sorting by date
});

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (post, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/posts/add",
        {
          title: post.title,
          body: post.body,
          userId: post.userId || 1, // Default userId if not provided
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async (post, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://dummyjson.com/posts/${post.id}`,
        post,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const fetchComments = createAsyncThunk(
  "blog/fetchComments",
  async (postId) => {
    const response = await axios.get(
      `https://dummyjson.com/posts/${postId}/comments`
    );
    return response.data.comments;
  }
);

export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/comments/add",
        {
          body: comment.body,
          postId: postId,
          userId: comment.userId || 1, // Default userId if not provided
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);
export const deleteComment = createAsyncThunk(
  "blog/deleteComment",
  async (commentId) => {
    await axios.delete(`https://dummyjson.com/comments/${commentId}`);
    return commentId;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    posts: [],
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts]; // Add new post to the beginning of the array
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      // Comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      });
  },
});

export default blogSlice.reducer;
