"use client";
import React, { useState, useRef } from "react";
import { Link, Image, Video, Send, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Page = () => {
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState({ image: null, video: null });
  const [isUploading, setIsUploading] = useState(false);
  const fileRefs = { image: useRef(null), video: useRef(null) };

  const uploadToSupabase = async (file, type) => {
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(type === "image" ? "images" : "videos")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Upload Error:", error.message);
      throw error;
    }
    const publicUrl = supabase.storage
      .from(type === "image" ? "images" : "videos")
      .getPublicUrl(filename).data.publicUrl;
    console.log(`${type} uploaded to Supabase:`, publicUrl);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (url) {
        console.log("URL submitted:", url);
        checkNews(url);
      }
      if (files.image) {
        const imageUrl = await uploadToSupabase(files.image, "image");
        console.log("Image uploaded to Supabase:", imageUrl);
        checkImage(imageUrl);
      }
      if (files.video) {
        const videoUrl = await uploadToSupabase(files.video, "video");
        console.log("Video uploaded to Supabase:", videoUrl);
        checkVideo(videoUrl);
      }
    } catch (error) {
      console.error("Upload Error:", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      console.log(`${type} file selected:`, file.name);
    }
  };

  const checkNews = async (url) => {
    try {
      const response = await fetch("../pages/api/newscheck.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      console.log("News Check Result:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkImage = async (imageUrl) => {
    try {
      const response = await fetch("../pages/api/newscheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const result = await response.json();
      console.log("Image Check Result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkVideo = async (videoUrl) => {
    try {
      const response = await fetch("../pages/api/videocheck.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      const result = await response.json();
      console.log("Video Check Result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-200">
      <header>
        <div className="logo">
          <AlertCircle size={24} />
          <span>Satya</span>
        </div>
        <nav>
          <a href="/Fact-Checking" className="active">Fact-Checking</a>
          <a href="/quiz">Quiz</a>
          <a href="/user_reporting">User Reporting</a>
          <a href="/profile">Profile</a>
        </nav>
      </header>
      <div className="w-screen bg-[#b3b3b3] h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Content Upload</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <Link className="text-gray-400" size={20} />
              <input
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => fileRefs.image.current?.click()} className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Image size={20} />
                <span>{files.image ? files.image.name.slice(0, 15) + "..." : "Upload Image"}</span>
              </button>
              <button type="button" onClick={() => fileRefs.video.current?.click()} className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Video size={20} />
                <span>{files.video ? files.video.name.slice(0, 15) + "..." : "Upload Video"}</span>
              </button>
              <input type="file" ref={fileRefs.image} onChange={(e) => handleFileChange("image", e)} accept="image/*" className="hidden" />
              <input type="file" ref={fileRefs.video} onChange={(e) => handleFileChange("video", e)} accept="video/*" className="hidden" />
            </div>
            <button type="submit" disabled={isUploading} className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              <Send size={20} />
              <span>{isUploading ? "Uploading..." : "Upload Content"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
