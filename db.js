const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://toanoi763:lhVOa78WlfAxIj8M@cluster0.cxppvzj.mongodb.net/crud?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
