import express from "express";
import { config } from "dotenv";
import cors from "cors";

import { handler as ssrHandler } from "./client/dist/server/entry.mjs";

config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,POST",
};

app.use(cors(corsOptions));

app.use("/", express.static("./client/dist/client"));
app.use(ssrHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
