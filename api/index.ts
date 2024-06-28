import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
config();

// Import Routers
import helloRoutes from "./routes/hello";
import authLoginRoute from "./routes/auth/login";
import userRoutes from "./routes/UserRoutes";
import emailRoute from "./routes/email";
import reportRoutes from "./routes/report";
import logOffRoutes from "./routes/LogOff";
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/hello", helloRoutes);
app.use("/auth", authLoginRoute);
app.use('/report', reportRoutes);
app.use("/user", userRoutes);
app.use("/send-email", emailRoute);
app.use("/logOff", logOffRoutes);

const port = Number.parseInt(process.env.PORT || "3000");
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
