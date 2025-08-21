import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import dotenv from "dotenv";
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
