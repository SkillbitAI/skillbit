const app = require("express")();
const pty = require("node-pty");
const server = require("http").createServer(app);
const fs = require("fs");
const os = require("os");
const path = require("path");

const options = {
  shell: "bash",
  port: 9999,
};

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let socket;
let term = pty.fork(options.shell, [], {
  cols: 100,
  name: "xterm",
  cwd: "/home/",
});
term.on("data", (data) => {
  if (socket) socket.emit("data", Buffer.from(data, "utf-8"));
});

io.on("connection", (s) => {
  socket = s;
  socket.on("data", (data) => {
    console.log("Received data: ", data);
    term.write(data);
  });

  socket.on("codeChange", (data) => {
    const filePath = path.join("/home/", data.fileName);
    console.log(filePath);
    fs.writeFile(filePath, data.value, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  socket.on("disconnect", () => (socket = null));
});

server.listen(options.port, () => {
  console.log(`App ready on :${options.port}`);
});
