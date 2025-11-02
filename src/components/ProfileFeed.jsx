// src/components/ProfileFeed.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // ya aapka deployed API base
const USER_ID = localStorage.getItem("userId"); // login ke time set hua hoga

function ProfileFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts`); // sabhi posts fetch karo
        const myPosts = res.data.filter((p) => p.userId === USER_ID); // sirf meri
        setPosts(myPosts);
      } catch (err) {
        console.error("Error fetching my posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Posts ✨
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-400">You haven’t posted anything yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-300 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-3">🕒 {new Date(post.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileFeed;
