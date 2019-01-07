const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage,generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", function(socket) {
  console.log("new user connected");

  socket.on("disconnect", function() {
    console.log("User was disconnected");
  });

  socket.emit("newMessage", generateMessage("Admin", "Welcome to chat app"));

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New User Joined")
  );

  socket.on("createLocationMessage", function(coords) {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("createMessage", function(newMessage, callback) {
    console.log("createMessage", newMessage);
    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));
    callback();
  });
});

io.on("disconnect", () => {
  console.log("Disconnected from server");
});
server.listen(port, () => {
  console.log(`Server is up and running at port ${port}`);
});
