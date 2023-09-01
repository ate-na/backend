// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://127.0.0.1/wallet", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected To MongoDB"))
//   .catch((error) => console.log("error", error));
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://root:OkJrlRcStguBzfBBTfVgIANC@aberama.iran.liara.ir:33053/my-app?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected To MongoDB"))
  .catch((error) => console.log("error", error));
