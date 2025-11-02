import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";

const PostCard = ({ post, updatePost }) => {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(post.likes?.includes("userId123")); // replace with real user id

  // ✅ Like Post
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "userId123" }), // your logged user id
      });
      const data = await res.json();
      updatePost(data);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Comment Post
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "userId123", text: comment }),
      });
      const data = await res.json();
      updatePost(data);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={
            post.author?.profilePicture?.url ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{post.author?.name}</p>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt="post"
          className="w-full h-[400px] object-cover"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-4 py-3 text-2xl">
        <button onClick={handleLike} className="text-red-500">
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <FaComment className="text-gray-600" />
        <FaShare className="text-gray-600" />
      </div>

      {/* Likes & Caption */}
      <div className="px-4">
        <p className="font-semibold">{post.likes?.length || 0} likes</p>
        <p className="mt-1">
          <span className="font-semibold mr-2">{post.author?.name}</span>
          {post.content}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Comments */}
      <div className="px-4 mt-2">
        {post.comments?.map((c, i) => (
          <p key={i} className="text-sm">
            <span className="font-semibold">{c.user?.name || "User"}:</span>{" "}
            {c.text}
          </p>
        ))}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleComment} className="flex px-4 py-3 border-t">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        <button
          type="submit"
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostCard;
