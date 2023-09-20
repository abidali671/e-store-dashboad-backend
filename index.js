import express from "express";
import cors from "cors";
import morgan from "morgan";

import connect from "./database/conn.js";
import router from "./router/route.js";
import Config from "./utils/Config.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(Config.port, () => {
        console.log(`Server connected to http://localhost:${Config.port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => console.log("Invalid database connection", error));

export default app;
