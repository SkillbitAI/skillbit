"use client";

import Editor, { loader } from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Socket, io } from "socket.io-client";
import { motion } from "framer-motion";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import Image from "next/image";
import Logo from "../../../public/assets/branding/logos/logo_mini_transparent_white.png";
import TerminalIcon from "../../../public/assets/icons/terminal.svg";
import WindowIcon from "../../../public/assets/icons/window.svg";
import HTMLIcon from "../../../public/assets/icons/html.svg";
import CSSIcon from "../../../public/assets/icons/css.svg";
import JSIcon from "../../../public/assets/icons/javascript.svg";
import SidebarIcon from "../../../public/assets/icons/sidebar.svg";
import DropdownIcon from "../../../public/assets/icons/dropdown.svg";
import SearchIcon from "../../../public/assets/icons/search.svg";
import ExitIcon from "../../../public/assets/icons/exit.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  theme: { background: "#0f172a00" },
};

export default function Tests({ params }: { params: { id: string } }) {
  const [fileName, setFileName] = useState("/project/src/App.js");
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [iframeKey, setIframeKey] = useState(1);
  const [webServerPort, setWebServerPort] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showBrowser, setShowBrowser] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  const path = usePathname();

  const handleEditorChange = (value, event) => {
    socket.emit("codeChange", { fileName, value });
  };

  useEffect(async () => {
    termRef.current = new Terminal(xtermOptions);
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

  //1e293b

  loader.init().then((monaco) => {
    monaco.editor.defineTheme("myTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e293b00",
      },
    });
  });

  return (
    <div className="max-w-screen text-white bg-slate-950 min-h-screen overflow-x-hidden flex">
      {showSidebar && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            duration: 0.2,
            delay: 0,
            ease: "backOut",
          }}
          className="bg-slate-900 h-screen border-slate-700 border-r w-72 z-20 relative"
        >
          <div className="fixed bg-slate-900 border-slate-700 border-r w-72 p-3">
            <div className="flex flex-col justify-between">
              <div className="flex-1 max-w-xl bg-white bg-opacity-5 p-2 rounded-lg flex justify-between border border-slate-700 mb-3">
                <input
                  className="text-white bg-transparent focus:outline-none w-full placeholder:text-white"
                  placeholder="Search Anything..."
                ></input>
                <Image src={SearchIcon} alt="" width={25} height={25}></Image>
              </div>
              <ul className="list-none text-white flex flex-col gap-1">
                <hr className="border-t-0 border-b border-b-slate-700 mt-1 mb-1" />
                <div className="flex justify-between items-center">
                  <p className="text-base">Project Information</p>
                  <Image
                    src={DropdownIcon}
                    alt=""
                    width={14}
                    height={14}
                  ></Image>
                </div>
                <hr className="border-t-0 border-b border-b-slate-700 mt-1 mb-1" />
                <h1 className="text-sm">Prompt:</h1>
                <p className="text-sm">
                  You are tasked with building a simple To-Do list application
                  in React. The application should allow users to add and remove
                  tasks from their to-do list...
                </p>
                <Link href="" className="text-sm">
                  See more
                </Link>
              </ul>
              <ul className="list-none text-white flex flex-col gap-1 mt-8">
                <hr className="border-t-0 border-b border-b-slate-700 mt-1 mb-1" />
                <div className="flex justify-between items-center">
                  <p className="text-base">Project Files</p>
                  <Image
                    src={DropdownIcon}
                    alt=""
                    width={14}
                    height={14}
                  ></Image>
                </div>
                <hr className="border-t-0 border-b border-b-slate-700 mt-1 mb-1" />
                <li
                  disabled={fileName === "/project/src/App.js"}
                  onClick={() => setFileName("/project/src/App.js")}
                  className={
                    fileName === "/project/src/App.js"
                      ? "p-1 rounded-lg flex items-center gap-2 bg-indigo-600 duration-100"
                      : "p-1 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100"
                  }
                >
                  <Image
                    src={JSIcon}
                    alt=""
                    width={15}
                    height={15}
                    className="ml-1 rounded-sm"
                  ></Image>
                  <p>script.js</p>
                </li>
                <li
                  disabled={fileName === "style.css"}
                  onClick={() => setFileName("style.css")}
                  className={
                    fileName === "style.css"
                      ? "p-1 rounded-lg flex items-center gap-2 bg-indigo-600 duration-100"
                      : "p-1 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100"
                  }
                >
                  <Image
                    src={CSSIcon}
                    alt=""
                    width={15}
                    height={15}
                    className="ml-1"
                  ></Image>
                  <p>style.css</p>
                </li>
                <li
                  disabled={fileName === "index.html"}
                  onClick={() => setFileName("index.html")}
                  className={
                    fileName === "index.html"
                      ? "p-1 rounded-lg flex items-center gap-2 bg-indigo-600 duration-100"
                      : "p-1 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100"
                  }
                >
                  <Image
                    src={HTMLIcon}
                    alt=""
                    width={15}
                    height={15}
                    className="ml-1"
                  ></Image>
                  <p>index.html</p>
                </li>
                <hr className="border-t-0 border-b border-b-slate-700 mt-1 mb-1" />
              </ul>
            </div>
          </div>
        </motion.div>
      )}
      <div className="flex-1 flex flex-col h-screen">
        <div className="bg-slate-900 border-b border-slate-700 flex justify-between p-3">
          <div className="flex-1 flex gap-2">
            <div
              className="flex justify-start p-2 rounded-md hover:bg-slate-700"
              onClick={() => {
                if (showSidebar) {
                  setShowSidebar(false);
                } else {
                  setShowSidebar(true);
                }
              }}
            >
              <Image src={SidebarIcon} alt="" width={20} height={20}></Image>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={Logo}
              alt=""
              width={80}
              height={80}
              style={{ margin: "-20px" }}
            ></Image>
            <h1 className="text-white text-2xl">Skillbit</h1>
          </div>
          <div className="flex-1 flex justify-end">
            <div
              className="flex p-2 rounded-md hover:bg-slate-700"
              onClick={() => {
                if (showTerminal) {
                  setShowTerminal(false);
                } else {
                  setShowTerminal(true);
                }
              }}
            >
              <Image src={TerminalIcon} alt="" width={20} height={20}></Image>
            </div>
            <div
              className="flex p-2 rounded-md hover:bg-slate-700"
              onClick={() => {
                if (showBrowser) {
                  setShowBrowser(false);
                } else {
                  setShowBrowser(true);
                }
              }}
            >
              <Image src={WindowIcon} alt="" width={20} height={20}></Image>
            </div>
          </div>
        </div>
        <div className="h-full flex relative">
          <div className="flex-1 relative">
            <Editor
              theme="myTheme"
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.value}
              onChange={handleEditorChange}
              className="absolute left-0 right-0 bottom-0 top-0 border-r border-r-slate-700"
            />
          </div>
          {showBrowser && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{
                duration: 0.2,
                delay: 0,
                ease: "backOut",
              }}
              className="flex-1 relative bg-slate-950"
            >
              <iframe
                className="w-full h-full"
                key={iframeKey}
                src={`http://localhost:${webServerPort}`}
              ></iframe>
            </motion.div>
          )}
          <div
            className="absolute left-0 right-0 bottom-0 z-30 p-6 bg-slate-950 bg-opacity-60 backdrop-blur-md drop-shadow-lg border-t border-slate-700"
            style={{ display: showTerminal ? "block" : "none" }}
          >
            <div ref={terminalRef}></div>
            <div
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-slate-700"
              onClick={() => {
                if (showTerminal) {
                  setShowTerminal(false);
                } else {
                  setShowTerminal(true);
                }
              }}
            >
              <Image src={ExitIcon} alt="" width={10} height={10}></Image>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
