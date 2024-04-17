require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const cors = require("cors")
const cookieParser =require("cookie-parser")
const corsOptions =require("./config/corsOptions")
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())

app.use("/" ,require("./routes/root"))
app.use("/auth" , require("./routes/authRoutes"))

mongoose.connection.once("open", () => {
    console.log("db connected");
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    })
})
mongoose.connection.on("error", (err) => {
    console.log(err);
})


