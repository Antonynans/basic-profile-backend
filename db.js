const mongoose = require("mongoose");

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open");
});

mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});