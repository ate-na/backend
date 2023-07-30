const exporess = require("express");

const app = exporess();

const categoryRouter = require("./src/routes/categoryRouter");

require("./config/db");

app.use("/category", categoryRouter);

app.listen(3000, () => console.log("server is Running"));
