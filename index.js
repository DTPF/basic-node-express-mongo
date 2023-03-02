const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER } = require("./config");
const http = require("http");
const server = http.createServer(app);

try {
  mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/amazen`);
  server.listen(PORT_SERVER, () => {
    console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`);
  });
} catch (error) {
  console.log(error)
}