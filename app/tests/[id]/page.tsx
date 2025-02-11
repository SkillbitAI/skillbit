/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-async-client-component */
// @ts-nocheck

"use client";

import Editor, { loader } from "@monaco-editor/react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import Image from "next/image";
import Logo from "../../../public/assets/branding/logos/logo_mini_transparent_white.png";
import TerminalIcon from "../../../public/assets/icons/terminal.svg";
import WindowIcon from "../../../public/assets/icons/window.svg";
import RefreshIcon from "../../../public/assets/icons/refresh.svg";
import CSSIcon from "../../../public/assets/icons/css.svg";
import JSIcon from "../../../public/assets/icons/javascript.svg";
import SidebarIcon from "../../../public/assets/icons/sidebar.svg";
import DropdownIcon from "../../../public/assets/icons/dropdown.svg";
import SearchIcon from "../../../public/assets/icons/search.svg";
import ExitIcon from "../../../public/assets/icons/exit.svg";
import Arrow from "../../../public/assets/icons/arrow.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { files as initialFiles } from "./files";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

// Import react-hot-toast components
import { toast, Toaster } from "react-hot-toast";
import path from "path";
import { WebContainer } from "@webcontainer/api";

const DOCKER_EC2_TOGGLE = true;

const xtermOptions = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  theme: { background: "#0f172a00" },
};

function useDebouncedEffect(callback, dependencies, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [...dependencies, delay]);
}

export default function Tests({ params }: { params: { id: string } }) {
  const [fileName, setFileName] = useState("");
  // const [filesState, setFilesState] = useState(initialFiles);
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [webcontainerInstance, setWebcontainerInstance] = useState(null);
  const [socket, setSocket] = useState(null);
  const [iframeKey, setIframeKey] = useState(1);
  const [webServerUrl, setWebServerUrl] = useState("");
  const [webServerPort, setWebServerPort] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showBrowser, setShowBrowser] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const router = useRouter();
  const [filesState, setFilesState] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); // Initialized to null
  // const [file, setFile] = useState("");
  const file = filesState[fileName];
  const shellWriterRef = useRef(null);

  const fetchFilesFromS3 = async () => {
    try {
      const response = await fetch("/api/getFilesFromS3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId: params.id, recruiter: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files from S3");
      }

      const data = await response.json();
      const files = data.files;

      // Format files for WebContainer
      const formattedFiles = {};
      let firstFilename = "";
      let count = 0;
      for (const file of files) {
        const name = file.fileName.split("/").pop();
        if (count == 0) {
          firstFilename = name;
        }
        count++;
        formattedFiles[name] = {
          name: name,
          value: file.content,
        };
      }
      setFilesState(formattedFiles);
      setFileName(firstFilename);
    } catch (error) {
      console.error("Error fetching files from S3:", error);
      toast.error("Failed to load files from S3!");
    }
  };

  // Start the editor and initialize WebContainer
  const startEditor = async () => {
    try {
      console.log("Starting editor with test ID:", params.id);
      // Get test info first
      const testResponse = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getTestById",
          id: params.id,
        }),
      });

      const testData = await testResponse.json();
      console.log("Test data response:", testData);

      if (!testData.message) {
        console.log("No test data found, redirecting to /not-found");
        router.push("/not-found");
        return;
      }

      // Set time if not already set
      if (!testData.message.startTime) {
        console.log("No start time, initializing test timer");
        const startResponse = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "startTest",
            testId: params.id,
          }),
        });
        const startData = await startResponse.json();
        console.log("Start test response:", startData);
        const endTime = new Date(startData.message.endTime);
        const currentTime = new Date();
        const remainingTime = Math.floor(
          (endTime.getTime() - currentTime.getTime()) / 1000
        );
        setTimeLeft(remainingTime);
      } else {
        console.log("Test already started, calculating remaining time");
        const endTime = new Date(testData.message.endTime);
        const currentTime = new Date();
        const remainingTime = Math.floor(
          (endTime.getTime() - currentTime.getTime()) / 1000
        );
        setTimeLeft(remainingTime);
      }

      try {
        console.log("Booting WebContainer");
        // Check for cross-origin isolation
        if (!crossOriginIsolated) {
          throw new Error(
            "Cross-Origin Isolation is not enabled. Please refresh the page."
          );
        }

        // Boot WebContainer
        const instance = await WebContainer.boot();
        setWebcontainerInstance(instance);

        // Create project structure
        await instance.fs.mkdir("src");

        // Mount initial files
        const files = {
          "package.json": {
            file: {
              contents: JSON.stringify(
                {
                  name: "test-project",
                  type: "module",
                  dependencies: {
                    react: "^18.2.0",
                    "react-dom": "^18.2.0",
                    "react-scripts": "5.0.1",
                    ajv: "^6.12.6",
                    "ajv-keywords": "^3.5.2",
                  },
                  scripts: {
                    start: "react-scripts start",
                  },
                },
                null,
                2
              ),
            },
          },
        };

        // Add source files to src directory
        for (const [key, fileData] of Object.entries(filesState)) {
          files[`${fileData.name}`] = {
            file: {
              contents: fileData.value,
            },
          };
        }

        await instance.mount(files);

        // Start a shell process
        const shellProcess = await instance.spawn("jsh", {
          terminal: {
            cols: termRef.current?.cols || 80,
            rows: termRef.current?.rows || 24,
          },
        });

        // Pipe shell output to terminal
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              termRef.current?.write(data);
            },
          })
        );

        // Store shell writer
        shellWriterRef.current = shellProcess.input.getWriter();

        // Handle terminal input
        termRef.current.onData((data) => {
          shellWriterRef.current?.write(data);
        });

        // Install dependencies and start the app
        const installProcess = await instance.spawn("bash", [
          "-c",
          "y | npx create-react-app my-react-app",
        ]);

        const installExitCode = await installProcess.exit;
        console.log("Installed create-react-app");

        const installWebVitals = await instance.spawn("bash", [
          "-c",
          "cd my-react-app && npm install web-vitals",
        ]);
        console.log("Installed web-vitals");

        // Copy the files into the React app structure
        for (const [key, fileData] of Object.entries(filesState)) {
          const filePath = `my-react-app/src/${fileData.name}`;
          console.log(`Writing file to: ${filePath}`);
          await instance.fs.writeFile(filePath, fileData.value);
        }

        // Listen for server-ready event before starting the server
        instance.on("server-ready", (port, url) => {
          console.log("Server is ready on port:", port);
          console.log("Server URL:", url);
          setWebServerPort(port);
          setWebServerUrl(url);
          setIsAppReady(true);
        });

        // Start the development server
        const startServer = await instance.spawn("bash", [
          "-c",
          "cd my-react-app && npm start",
        ]);
        console.log("Started server");

        if (installExitCode !== 0) {
          throw new Error("Installation failed");
        }

        setIsLoading(false);
      } catch (webContainerError) {
        console.error("WebContainer initialization error:", webContainerError);
        toast.error(
          "Failed to initialize WebContainer. Please try again or contact support."
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Detailed error in startEditor:", error);
      toast.error(`Editor initialization failed: ${error.message}`);
      router.push("/not-found");
    }
  };

  // Handle editor changes
  const handleEditorChange = async (value, event) => {
    if (!webcontainerInstance || !fileName) return;

    try {
      const filePath = `src/${fileName}`;
      await webcontainerInstance.fs.writeFile(filePath, value);
      setFilesState((prevFiles) => ({
        ...prevFiles,
        [fileName]: { ...prevFiles[fileName], value },
      }));
    } catch (error) {
      console.error("Error writing file:", error);
      toast.error("Failed to save changes!");
    }
  };

  const uploadToS3 = async () => {
    console.log(filesState);
    const filesToUpload = Object.keys(filesState).map((key) => ({
      filename: filesState[key].name,
      content: filesState[key].value,
    }));

    if (filesToUpload.length === 0) return;

    console.log("Auto-save triggered.");

    try {
      const response = await fetch("/api/uploadS3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId: params.id, files: filesToUpload }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Auto-save successful:", data.message);
        toast.success("Auto-saved successfully!");
      } else {
        console.error("Auto-save failed:", data.error);
        toast.error("Auto-save failed!");
      }
    } catch (error) {
      console.error("Error uploading to S3:", error);
      toast.error("Auto-save encountered an error!");
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft === null) return; // Do not do anything if timeLeft is not set
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useDebouncedEffect(
    () => {
      uploadToS3();
    },
    [filesState],
    3000
  ); // Debounce saveToS3 function with 3-second delay

  useEffect(() => {
    const initializeEditor = async () => {
      console.log(
        "Starting initialization with filesState:",
        Object.keys(filesState).length
      );
      const submitted = await getIsSubmitted();
      console.log("Test submitted status:", submitted);
      if (submitted) {
        router.push("/submission_screen");
        return;
      }

      const expired = await getIsExpired();
      console.log("Test expired status:", expired);
      if (expired) {
        router.push("/testExpired");
        return;
      }

      if (Object.keys(filesState).length > 0) {
        console.log("Files loaded, checking webcontainer");
        if (!webcontainerInstance) {
          console.log("Starting editor initialization");
          startEditor();
        }
      }
    };

    initializeEditor();
  }, [filesState]);

  // Initialize the terminal and fetch files
  useEffect(() => {
    if (termRef.current == null) {
      console.log("Initializing terminal and fetching files");
      termRef.current = new Terminal(xtermOptions);
      fitAddonRef.current = new FitAddon();
      termRef.current.loadAddon(fitAddonRef.current);
      termRef.current.open(terminalRef.current);
      fitAddonRef.current.fit();
      termRef.current.focus();

      fetchFilesFromS3();
    }
  }, []);

  // Set up socket event listeners after both terminal and socket are ready
  useEffect(() => {
    if (socket && termRef.current && !termRef.current._onDataAttached) {
      socket.on("data", (data) => {
        termRef.current.write(
          String.fromCharCode.apply(null, new Uint8Array(data))
        );
      });

      termRef.current.onData((data) => {
        socket.emit("data", data);
      });

      termRef.current._onDataAttached = true; // Flag to prevent multiple listeners
    }
  }, [socket]);

  // Check if the web server is ready
  useEffect(() => {
    if (webServerPort) {
      const checkAppReady = async () => {
        try {
          const response = await fetch(`http://localhost:${webServerPort}`);
          if (response.ok) {
            setIsAppReady(true);
          } else {
            setTimeout(checkAppReady, 1000);
          }
        } catch (error) {
          setTimeout(checkAppReady, 1000);
        }
      };
      checkAppReady();
    }
  }, [webServerPort]);

  // Initialize Monaco Editor theme
  useEffect(() => {
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
  }, []);

  // Handle refresh button click
  const handleRefreshClick = () => {
    console.log("Refresh icon clicked");
    setIframeKey((prevKey) => prevKey + 1);
  };

  // Delete container (additional functionality if needed)
  const deleteContainer = async () => {
    try {
      const response = await fetch("/api/codeEditor/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testID: params.id }),
      });

      const ports = await response.json();

      console.log("Delete container response:", ports);

      // Optionally, you can add additional logic here
    } catch (error) {
      console.error("Error deleting container:", error);
    }
  };

  const markSubmitted = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "markSubmitted",
          id: params.id,
        }),
      });
      // const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to mark testID as submitted.");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to mark testID as submitted.");
    }
  };

  // Handle submit button click
  const handleSubmit = async () => {
    toast.loading("Submitting...");
    await uploadToS3();
    await markSubmitted();
    await deleteContainer();
    router.push("/submission_screen");
  };

  const getIsSubmitted = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getIsSubmitted",
          id: params.id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to get testID submitted.");
      }
      return data.message.submitted;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get testID submitted.");
    }
  };

  const getIsExpired = async () => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getIsExpired",
          id: params.id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to get testID expired.");
      }
      return data.message;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get testID expired.");
    }
  };

  return (
    <div className="max-w-screen text-white bg-slate-950 min-h-screen overflow-x-hidden flex">
      {/* Toast Container for notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            zIndex: 9999,
          },
        }}
      />

      {!isLoading && timeLeft !== null && (
        <div
          className={`absolute top-3 right-60 text-xl ${
            timeLeft <= 300 ? "text-red-500" : "text-white"
          } bg-black bg-opacity-50 px-3 py-2 rounded-md`}
        >
          Time Left: {formatTime(timeLeft)}
        </div>
      )}

      {isLoading && (
        <div className="fixed left-0 right-0 top-0 bottom-0 z-50">
          <div className="graphPaper bg-slate-900 text-white h-screen w-screen flex items-center justify-center flex-col">
            {/* LOGO */}
            <div className="flex">
              <motion.div className="w-12 h-12 bg-white rounded-xl rotate-45 -mr-1"></motion.div>
              <motion.div className="w-12 h-12 bg-white rounded-xl rotate-45 -ml-1"></motion.div>
            </div>
            <motion.p
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mt-10"
            >
              Loading...
            </motion.p>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "18rem" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              duration: 0.2,
              delay: 0,
              ease: "backOut",
            }}
            className="bg-slate-900 h-screen border-slate-700 border-r w-72 z-20 relative"
          >
            <div className="fixed bg-slate-900 border-slate-700 border-r w-72 p-3 flex flex-col justify-between h-screen">
              <div className="flex flex-col justify-between">
                {/* <div className="flex-1 max-w-xl bg-white bg-opacity-5 p-2 rounded-lg flex justify-between border border-slate-700 mb-3">
                <input
                  className="text-white bg-transparent focus:outline-none w-full placeholder:text-white"
                  placeholder="Search..."
                ></input>
                <Image src={SearchIcon} alt="" width={25} height={25}></Image>
              </div> */}
                <ul className="list-none text-white flex flex-col gap-1 bg-slate-800 border-slate-700 border p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-base">Project Information</p>
                    {/* <Image
                    src={DropdownIcon}
                    alt=""
                    width={14}
                    height={14}
                  ></Image> */}
                  </div>
                  <hr className="border-t-0 border-b border-b-slate-700 mb-1" />
                  <h1 className="text-sm">Prompt:</h1>
                  <p className="text-sm">
                    You are tasked with building a simple To-Do list application
                    in React. The application should allow users to add and
                    remove tasks from their to-do list...
                  </p>
                  <Link href="" className="text-sm">
                    See more
                  </Link>
                </ul>
                <ul className="list-none text-white flex flex-col gap-1 bg-slate-800 border-slate-700 border p-3 rounded-lg mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-base">Project Files</p>
                  </div>
                  <hr className="border-t-0 border-b border-b-slate-700 mb-1" />
                  <ul className="flex flex-col gap-1">
                    {Object.keys(filesState).map((key) => {
                      const file = filesState[key];
                      let icon;
                      if (file.name.endsWith(".js")) {
                        icon = JSIcon;
                      } else if (file.name.endsWith(".css")) {
                        icon = CSSIcon;
                      }

                      return (
                        <li
                          key={key}
                          onClick={() => setFileName(key)}
                          className={
                            fileName === key
                              ? "p-1 rounded-lg flex items-center gap-2 bg-indigo-600 duration-100"
                              : "p-1 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100"
                          }
                        >
                          {icon && (
                            <Image
                              src={icon}
                              alt=""
                              width={15}
                              height={15}
                              className="ml-1 rounded-sm"
                            />
                          )}
                          <p>{file.name}</p>
                        </li>
                      );
                    })}
                  </ul>
                </ul>
              </div>
              <div className="flex flex-col justify-between">
                <motion.button
                  className="w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
                  onClick={handleSubmit}
                >
                  Submit{" "}
                  <div className="arrow flex items-center justify-center">
                    <div className="arrowMiddle"></div>
                    <div>
                      <Image
                        src={Arrow}
                        alt=""
                        width={14}
                        height={14}
                        className="arrowSide"
                      ></Image>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col h-screen">
        <div className="bg-slate-900 border-b border-slate-700 flex justify-between p-3">
          <div className="flex-1 flex gap-2">
            <div
              className="flex p-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
              style={{
                backgroundColor: showSidebar ? "#1e293b" : "",
                border: showSidebar ? "1px solid #334155" : "",
              }}
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Image src={SidebarIcon} alt="" width={20} height={20}></Image>
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src={Logo}
              alt=""
              width={80}
              height={80}
              style={{ margin: "-20px" }}
            ></Image>
            <h1 className="text-white text-2xl">Skillbit</h1>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2">
            <div
              className="flex p-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
              style={{
                backgroundColor: showTerminal ? "#1e293b" : "",
                border: showTerminal ? "1px solid #334155" : "",
              }}
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <Image
                src={TerminalIcon}
                alt="Terminal"
                width={20}
                height={20}
              ></Image>
            </div>
            <div
              className="flex p-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
              style={{
                backgroundColor: showBrowser ? "#1e293b" : "",
                border: showBrowser ? "1px solid #334155" : "",
              }}
              onClick={() => setShowBrowser(!showBrowser)}
            >
              <Image
                src={WindowIcon}
                alt="Window"
                width={20}
                height={20}
              ></Image>
            </div>
            <div
              className="flex p-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
              onClick={handleRefreshClick}
            >
              <Image
                src={RefreshIcon}
                alt="Refresh"
                width={20}
                height={20}
              ></Image>
            </div>
          </div>
        </div>
        <div className="h-full flex relative">
          <div className="flex-1 relative">
            {file && (
              <Editor
                theme="myTheme"
                path={`src/${file.name}`}
                defaultLanguage={file.language}
                defaultValue={file.value}
                onChange={handleEditorChange}
                className="absolute left-0 right-0 bottom-0 top-0 border-r border-r-slate-700"
              />
            )}
          </div>
          {isAppReady && showBrowser && (
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
                src={webServerUrl || ""}
              />
            </motion.div>
          )}
          <div
            className="absolute left-0 right-0 bottom-0 z-30 p-6 bg-slate-950 bg-opacity-60 backdrop-blur-md drop-shadow-lg border-t border-slate-700"
            style={{ display: showTerminal ? "block" : "none" }}
          >
            <div ref={terminalRef} className="overflow-hidden"></div>
            <div
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer"
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
