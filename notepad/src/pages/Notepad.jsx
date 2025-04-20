import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import supabase from "../utils/supabase";

const Notepad = () => {
  const { code } = useParams();
  const textareaRef = useRef(null);
  const socketRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    const socket = socketRef.current;

    socket.emit("join", code);

    socket.on("init-content", (content) => {
      if (textareaRef.current) {
        textareaRef.current.value = content;
      }
    });

    socket.on("text-update", (content) => {
      if (textareaRef.current) {
        textareaRef.current.value = content;
      }
    });

    socket.on("update-typing", (users) => {
      setTypingUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [code]);

  const handleTyping = (event) => {
    const content = event.target.value;
    socketRef.current.emit("text-change", { code, content });
    saveContent(content);
  };

  const saveContent = async (content) => {
    await supabase.from("notes").upsert({ code, content });
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <div className="flex justify-center">
      </div>
      <textarea
        ref={textareaRef}
        placeholder="Write your notes here..."
        className="h-full w-full bg-transparent border-0 resize-none p-8 text-black font-serif text-lg focus:outline-none  scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
        autoFocus
        onChange={handleTyping}
      />
    </div>
  );
};

export default Notepad;