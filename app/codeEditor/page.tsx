"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Socket, io } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const files: {
  [key: string]: { name: string; language: string; value: string };
} = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "console.log('hello')",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "body { background-color: red; }",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<h1>hello world</h1>",
  },
};

const xtermOptions = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 100,
};

export default function CodeEditor() {
  const [fileName, setFileName] = useState("script.js");
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const handleEditorChange = (value, event) => {
    socket.emit("codeChange", { fileName, value });
  };

  useEffect(async () => {
    termRef.current = new Terminal();
    fitAddonRef.current = new FitAddon();
    termRef.current.loadAddon(fitAddonRef.current);
    termRef.current.open(terminalRef.current);
    fitAddonRef.current.fit();
    termRef.current.focus();

    await fetch("http://localhost:3000/api/codeEditor/start");
    const newSocket = io("http://localhost:9999");
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (socket) {
      Object.entries(files).forEach(([fileName, file]) => {
        socket.emit("codeChange", { fileName, value: file.value });
      });
      socket.on("data", (data) => {
        console.log(data);
        termRef.current.write(
          String.fromCharCode.apply(null, new Uint8Array(data))
        );
      });

      termRef.current.onData((data) => {
        socket.emit("data", data);
      });
    }
  }, [socket]);

  const file = files[fileName];
  return (
    <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center justify-center overflow-x-hidden">
      <div className="flex flex-col space-y-2 px-4">
        <button
          disabled={fileName === "script.js"}
          onClick={() => setFileName("script.js")}
        >
          script.js
        </button>
        <button
          disabled={fileName === "style.css"}
          onClick={() => setFileName("style.css")}
        >
          style.css
        </button>
        <button
          disabled={fileName === "index.html"}
          onClick={() => setFileName("index.html")}
        >
          index.html
        </button>
      </div>
      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onChange={handleEditorChange}
      />
      <div ref={terminalRef} style={{ height: "90%" }}></div>
    </div>
  );
}
