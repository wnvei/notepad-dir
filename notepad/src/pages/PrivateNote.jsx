import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { io } from "socket.io-client";

const PrivateNote = () => {
  const { code } = useParams();
  const textareaRef = useRef(null);
  const socketRef = useRef(null);
  const [content, setContent] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem(`auth_${code}`) === "true";
    setIsAuthorized(isAuth);
  }, [code]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await supabase
          .from("locked_rooms")
          .select("content")
          .eq("code", code)
          .single();

        if (data) {
          setContent(data.content || "");
        } else {
          navigate("/");
          return;
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();

    socketRef.current = io(process.env.REACT_APP_API_URL);
    const socket = socketRef.current;

    socket.emit("join-private", code);

    socket.on("private-init-content", (initialContent) => {
      setContent(initialContent);
    });

    socket.on("private-text-update", (updatedContent) => {
      setContent(updatedContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [code, navigate]);


  const handleContentChange = (e) => {
    if (!isAuthorized) {
      console.log("Unauthorized edit attempt blocked");
      if (textareaRef.current) {
        textareaRef.current.value = content;
      }
      return;
    }
    
    const newContent = e.target.value;
    setContent(newContent);

    socketRef.current.emit("private-text-change", { code, content: newContent });
  };
  const saveToDatabase = () => {
    if (!isAuthorized) return;
    const saveInterval = setInterval(async () => {
      if (isAuthorized) {
        try {
          await supabase
            .from("locked_rooms")
            .update({ content })
            .eq("code", code);
        } catch (err) {
          console.error("Error saving to database:", err);
        }
      }
    }, 3000); 

    return () => clearInterval(saveInterval);
  };

  useEffect(saveToDatabase, [content, code, isAuthorized]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-white overflow-hidden">
        <div className="h-full w-full p-8 text-black font-serif text-lg overflow-auto whitespace-pre-wrap">
          {content || "This note is empty."}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        placeholder="Write your notes here..."
        className="h-full w-full bg-transparent border-0 resize-none p-8 text-black font-serif text-lg focus:outline-none scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
        autoFocus
      />
    </div>
  );
};

export default PrivateNote;
