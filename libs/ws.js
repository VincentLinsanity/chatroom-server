const WebSocket = require("ws");
const config = require("../config");
const HashMap = require("hashmap");
const sockets = new HashMap();
const cleanTasks = new HashMap();

const createCleanTask = (wss, type, name, message) => {
  const task = setTimeout(() => {
    const data = {
      type,
      name,
      message
    };
    wss.broadcast(JSON.stringify(data));
    const socket = sockets.get(name);
    socket.terminate();
    sockets.delete(name);
  }, config.timeout);
  return task;
};

module.exports = {
  sockets,
  setup: server => {
    wss = new WebSocket.Server({ server });

    wss.broadcast = data => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };

    wss.on("connection", socket => {
      socket.on("message", message => {
        const user = JSON.parse(message);
        if (user.login === true) {
          const data = {
            type: "system",
            name: user.name,
            message: `${user.name} enter the chat`
          };
          wss.broadcast(JSON.stringify(data));
          sockets.set(user.name, socket);
          cleanTasks.set(
            user.name,
            createCleanTask(
              wss,
              "system",
              user.name,
              `${user.name} was disconnected due to inactivity`
            )
          );
        }
        if (user.logout === true) {
          sockets.delete(user.name);
          clearTimeout(cleanTasks.get(user.name));
          cleanTasks.delete(user.name);
          const data = {
            type: "system",
            name: user.name,
            message: `${user.name} left the chat, connection lost`
          };
          wss.broadcast(JSON.stringify(data));
        }
        if (user.message) {
          clearTimeout(cleanTasks.get(user.name));
          cleanTasks.delete(user.name);
          cleanTasks.set(
            user.name,
            createCleanTask(
              wss,
              "system",
              user.name,
              `${user.name} was disconnected due to inactivity`
            )
          );
          wss.broadcast(JSON.stringify(user));
        }
      });
    });
  }
};
