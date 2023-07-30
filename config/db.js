const mongoose = require("mongoose");

mongoose
  .connect("", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected To MongoDB"))
  .catch((error) => console.log(error));
