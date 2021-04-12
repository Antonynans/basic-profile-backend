const mongoose = require("mongoose");

const schema = mongoose.Schema({
  avatars: String,
  username: String,
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: String,
  phoneNumber: { type: String, default: "" },
  address:{ type: String, default: "" },
  password: String,
  status: { type: String, default: "not_activated" },
  activated_token: { type: String, default: "" },
  level: {type: String, default: "normal"},
  created: {type: Date, default: Date.now}
});
schema.index({email: 1}, {unique: true});

const User = mongoose.model("users", schema);
module.exports = User;