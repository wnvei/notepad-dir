import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import supabase from "../utils/supabase";

const Notepad = () => {
  const { code } = useParams();
  const textareaRef = useRef(null);
  const socketRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState({});
  const cursorPositionRef = useRef(0);
  const isRemoteUpdateRef = useRef(false);
  const clientIdRef = useRef(`client-${Math.random().toString(36).substring(2, 10)}`);
  const contentRef = useRef(""); 

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL);
    const socket = socketRef.current;
    socket.emit("join", code);
    socket.emit("register-client", { code, clientId: clientIdRef.current });

    socket.on("init-content", (content) => {
      if (textareaRef.current) {
        textareaRef.current.value = content;
        contentRef.current = content; 
      }
    });

    socket.on("text-update", (content) => {
      if (textareaRef.current) {
        isRemoteUpdateRef.current = true;
        const cursorPosition = textareaRef.current.selectionStart;
        textareaRef.current.value = content;
        contentRef.current = content; 
        textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 0);
      }
    });

    socket.on("update-typing", (users) => {
      setTypingUsers(users);
    });

    socket.on("cursor-positions", (positions) => {
      setTypingUsers(positions);
    });

    const handleCursorChange = () => {
      if (textareaRef.current && !isRemoteUpdateRef.current) {
        const position = textareaRef.current.selectionStart;
        if (position !== cursorPositionRef.current) {
          cursorPositionRef.current = position;

          socket.emit("cursor-position", {
            code,
            clientId: clientIdRef.current,
            position
          });
        }
      }
    };
    textareaRef.current?.addEventListener("click", handleCursorChange);
    textareaRef.current?.addEventListener("keyup", handleCursorChange);
    textareaRef.current?.addEventListener("select", handleCursorChange);

    return () => {
      socket.disconnect();
      textareaRef.current?.removeEventListener("click", handleCursorChange);
      textareaRef.current?.removeEventListener("keyup", handleCursorChange);
      textareaRef.current?.removeEventListener("select", handleCursorChange);
    };
  }, [code]);

  const handleTyping = (event) => {
    if (isRemoteUpdateRef.current) return;
    const content = event.target.value;
    cursorPositionRef.current = event.target.selectionStart;
    contentRef.current = content;
    socketRef.current.emit("text-change", { code, content });
    socketRef.current.emit("cursor-position", {
      code,
      clientId: clientIdRef.current,
      position: cursorPositionRef.current
    });

    saveContent(content);
  };

  const saveContent = async (content) => {
    await supabase.from("notes").upsert({ code, content });
  };

  const renderCursors = () => {
    if (!textareaRef.current) return null;
    const textarea = textareaRef.current;
    const text = textarea.value;
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;
    const paddingTop = parseInt(style.paddingTop) || 8;
    const paddingLeft = parseInt(style.paddingLeft) || 8;
    return Object.entries(typingUsers).map(([clientId, data]) => {
      if (clientId === clientIdRef.current) return null;
      const position = data.position || 0;
      const color = data.color || `hsl(${Math.random() * 360}, 80%, 60%)`;
      const textBeforeCursor = text.substring(0, position);
      const lines = textBeforeCursor.split('\n');
      const lineIndex = lines.length - 1;
      const measureDiv = document.createElement('div');
      measureDiv.style.position = 'absolute';
      measureDiv.style.visibility = 'hidden';
      measureDiv.style.whiteSpace = 'pre';
      measureDiv.style.fontFamily = style.fontFamily;
      measureDiv.style.fontSize = style.fontSize;
      measureDiv.style.fontWeight = style.fontWeight;
      measureDiv.textContent = lines[lineIndex];
      document.body.appendChild(measureDiv);
      const textWidth = measureDiv.getBoundingClientRect().width;
      document.body.removeChild(measureDiv);
      const cursorX = paddingLeft + textWidth;
      const cursorY = paddingTop + (lineIndex * lineHeight);
      return (
        <div
          key={clientId}
          className="absolute pointer-events-none"
          style={{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
            width: '2px',
            height: `${lineHeight}px`,
            backgroundColor: color,
            zIndex: 10
          }}
        >
          <div
            className="absolute top-0 left-0 text-xs px-1 py-0.5 rounded-sm whitespace-nowrap"
            style={{
              transform: 'translateY(-100%)',
              backgroundColor: color,
              color: '#fff'
            }}
          ></div>
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden relative">
      <div className="flex justify-center"></div>
      <textarea
        ref={textareaRef}
        placeholder="Write your notes here..."
        className="h-full w-full bg-transparent border-0 resize-none p-8 text-black font-serif text-lg focus:outline-none scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
        autoFocus
        onChange={handleTyping}
      />
      {renderCursors()}
    </div>
  );
};

export default Notepad;
