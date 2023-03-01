const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER } = require("./config");
const http = require("http");
const server = http.createServer(app);

mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/recetasmsr`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Database running");
      server.listen(PORT_SERVER, () => {
        console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`);
      });
    }
  }
);