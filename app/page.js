"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  fetchComments,
  addComment,
  deleteComment,
} from "../redux/slices/blogSlice";
import Providers from "../components/Providers";
import { toast } from "react-toastify";
import "./globals.css";
import Modal from "../components/Modal";

const getRandomImage = (title) => `https://picsum.photos/seed/${title}/500/300`;

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.blog.posts);
  const comments = useSelector((state) => state.blog.comments);
  const status = useSelector((state) => state.blog.status);
  const currentPage = useSelector((state) => state.blog.currentPage);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const postsToShow = showAll ? posts : posts.slice(0, 5);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const auth = useSelector((state) => state.auth); 
  const handleLogin = () => {
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
      })
      .catch(() => {
        toast.error("Login failed.");
      });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts()); 
    }
  }, [status, dispatch]);

  const handleAddPost = () => {
    if (title && content) {
      dispatch(addPost({ title, body: content, userId: 1 }))
        .unwrap()
        .then(() => {
          toast.success("Post added successfully!");
          setTitle("");
          setContent("");
          setIsModalOpen(false);
        })
        .catch(() => {
          toast.error("Failed to add post.");
        });
    } else {
      toast.error("Title and content cannot be empty.");
    }
  };

  const handleUpdatePost = () => {
    if (updateId && title && content) {
      dispatch(updatePost({ id: updateId, title, body: content }))
        .unwrap()
        .then(() => {
          toast.success("Post updated successfully!");
          setTitle("");
          setContent("");
          setUpdateId(null);
          setIsModalOpen(false);
        })
        .catch(() => {
          toast.error("Failed to update post.");
        });
    }
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id))
      .unwrap()
      .then(() => {
        toast.success("Post deleted successfully!");
      })
      .catch(() => {
        toast.error("Failed to delete post.");
      });
  };

  const handleAddComment = () => {
    if (currentPostId && comment) {
      dispatch(
        addComment({
          postId: currentPostId,
          comment: { body: comment, userId: 1 },
        })
      )
        .then(() => {
          toast.success("Comment added successfully!");
          setComment("");
        })
        .catch(() => {
          toast.error("Failed to add comment.");
        });
    }
  };
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
      .then(() => {
        toast.success("Comment deleted successfully!");
      })
      .catch(() => {
        toast.error("Failed to delete comment.");
      });
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ page: currentPage }));
    }
  }, [status, dispatch, currentPage]);

  useEffect(() => {
    if (currentPostId) {
      dispatch(fetchComments(currentPostId));
    }
  }, [currentPostId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-8 mx-auto xl:px-5 max-w-screen-lg py-5 lg:py-8">
        <nav>
          <div className="flex flex-wrap justify-between items-center">
            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle Menu"
              className="ml-auto md:hidden rounded-md px-2 py-1 text-gray-500 focus:text-blue-500 focus:outline-none dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>

            {/* Links - Primary (Left) */}
            <div
              className={`w-full md:flex md:w-auto ${
                isMenuOpen ? "block" : "hidden"
              } order-1 md:order-none md:flex-1 md:justify-end`}
            >
              <div className="flex flex-col md:flex-row">
                <a
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="/"
                >
                  Home
                </a>
                <a
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="/"
                >
                  About
                </a>
                <a
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="/"
                >
                  Contact
                </a>
              </div>
            </div>

            <a
              className="hidden md:block w-28 order-2 md:order-none mx-auto"
              href="/"
            >
              <img
                alt="Logo"
                fetchpriority="high"
                width="132"
                height="52"
                decoding="async"
                data-nimg="1"
                sizes="(max-width: 640px) 100vw, 200px"
                srcset="https://th.bing.com/th/id/R.7d792d710c406f46a1c39559c0d93f1a?rik=%2feTQZ8m0rFfc3A&pid=ImgRaw&r=0"
                src="https://th.bing.com/th/id/R.7d792d710c406f46a1c39559c0d93f1a?rik=%2feTQZ8m0rFfc3A&pid=ImgRaw&r=0"
              />
            </a>

            <div
              className={`w-full md:flex md:w-auto ${
                isMenuOpen ? "block" : "hidden"
              } order-3 md:order-none md:flex-1`}
            >
              <div className="flex flex-col md:flex-row md:justify-start">
                <a
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setUpdateId(null);
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="#"
                >
                  <span>Create Post</span>
                </a>
                <a
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="#"
                >
                  <span>Become a Writer</span>
                </a>
                <a
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                  href="#"
                >
                  <span>Login</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <h1 class="text-center text-3xl font-semibold lg:text-4xl lg:leading-snug mt-20">
        Elevate Your Knowledge
      </h1>

      <div class="text-center">
        <p class="mt-2 text-lg">
          Fetching Blog Post from{" "}
          <a href="https://dummyjson.com/docs">dummyjson.com</a>
        </p>
      </div>

      <div className="container px-8 mx-auto xl:px-5 max-w-screen-lg py-5 lg:py-8 divide-y divide-gray-300">
        {status === "loading" && <p>Loading...</p>}
        {status === "succeeded" &&
          postsToShow.map((post) => (
            <div
              key={post.id}
              className="py-12 cursor-pointer grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="md:col-span-1">
                <div class="overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800">
                  <img
                    alt="Thumbnail"
                    fetchpriority="high"
                    decoding="async"
                    data-nimg="fill"
                    class="object-cover transition-all"
                    sizes="(max-width: 768px) 30vw, 33vw"
                    src={getRandomImage(post.title)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="mt-4">
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(post.tags && post.tags.length > 0
                      ? post.tags
                      : ["tag1", "tag2", "tag3"]
                    ).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h1 class="text-lg font-semibold leading-snug  mt-2">
                  <span class="bg-gradient-to-r from-green-200 to-green-100 line-clamp-1 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-grey-800 dark:to-grey-900">
                    {post.title}
                  </span>
                </h1>
                <div>
                  <p class="mt-2 line-clamp-3 text-sm text-gray-500 ">
                    {post.body}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setUpdateId(post.id);
                      setTitle(post.title);
                      setContent(post.body);
                      setIsModalOpen(true);
                    }}
                    className="bg-transparent text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 uppercase"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-transparent text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 uppercase"
                  >
                    delete
                  </button>
                  <button
                    onClick={() => setCurrentPostId(post.id)}
                    className="bg-transparent text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 uppercase"
                  >
                    comment(s)
                  </button>
                </div>
                <div class="mt-3 flex items-center space-x-3 text-gray-500 ">
                  <time
                    class="truncate text-sm"
                    datetime="2022-10-21T15:48:00.000Z"
                  >
                    July 17, 2024
                  </time>
                </div>
                {currentPostId === post.id && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-black text-white py-2 px-4 rounded"
                    >
                      Add Comment
                    </button>
                    <ul className="mt-4">
                      {comments.map((comment) => (
                        <li
                          key={comment.id}
                          className="mb-2 p-2 border border-gray-200 rounded"
                        >
                          {comment.body}
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-transparent text-gray-700 text-sm px-3 py-1 ml-4 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 uppercase"
                          >
                            delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div className="mt-4 flex justify-center">
          {showAll ? (
            <button
              onClick={() => setShowAll(false)}
              className="bg-gray-800 m-10 text-white py-2 px-4 rounded"
            >
              Show Less
            </button>
          ) : (
            <button
              onClick={() => setShowAll(true)}
              className="bg-gray-800 m-10 text-white py-2 px-4 rounded"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPost}
        onUpdate={handleUpdatePost}
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        updateId={updateId}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Providers>
      <Home />
    </Providers>
  );
}
