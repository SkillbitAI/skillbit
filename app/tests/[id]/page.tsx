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
  "/project/src/App.js": {
    name: "App.js",
    language: "javascript",
    value: `import logo from './logo.svg';
    import './App.css';
    
    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
    }
    
    export default App;`,
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

export default function Tests({ params }: { params: { id: string } }) {
  const [fileName, setFileName] = useState("/project/src/App.js");
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [iframeKey, setIframeKey] = useState(1);
  const [webServerPort, setWebServerPort] = useState(null);

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

    const response = await fetch("http://localhost:3000/api/codeEditor/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testID: params.id }),
    });

    const ports = await response.json();

    const newSocket = io(`http://localhost:${ports.socketServer}`);
    setSocket(newSocket);
    setWebServerPort(ports.webServer);

    newSocket.on("connect", () => {
      newSocket.emit("data", "\n");
      newSocket.emit("data", "cd project\n");
      newSocket.emit("data", "npm run start\n");
      setTimeout(() => {
        setIframeKey(iframeKey + 1);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      Object.entries(files).forEach(([fileName, file]) => {
        socket.emit("codeChange", { fileName, value: file.value });
      });
      socket.on("data", (data) => {
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
      <div className="w-3/4">
        <div className="flex flex-row justify-between">
          <button
            disabled={fileName === "/project/src/App.js"}
            onClick={() => setFileName("/project/src/App.js")}
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
      </div>
      <div>
        <div ref={terminalRef} style={{ height: "90%" }}></div>
        <div className="flex flex-col">
          <button onClick={() => setIframeKey(iframeKey + 1)}>Reload</button>
          <iframe
            key={iframeKey}
            src={`http://localhost:${webServerPort}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
