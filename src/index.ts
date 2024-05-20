import express, { Express, Request, Response } from "express";
import cors from "cors";
require("./service/db");

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./controllers/uploadfile"));
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
