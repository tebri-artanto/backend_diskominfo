const mongoose = require("mongoose");

const connectDb = async () => {
  const connectionString = "mongodb+srv://username:A5VCGzOi3gTcEy6R@cluster0.uqotgpm.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster"

  await mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // To suppress another deprecation warning
    })
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("Database Connection Error:", error.message));
};

connectDb();
