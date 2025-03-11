import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import "tsconfig-paths/register";
import cookieParser from "cookie-parser";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
dotenv.config();

app.use(express.json());

const PORT = 3000;

app.use("/api/auth", require("./routes/auth_routes"));

app.listen(PORT, () => {
  console.log(`The server running on http://localhost:${PORT}`);
});
