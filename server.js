const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("./jwt");

const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");

require('dotenv').config();
require("./db");

const app = express();
const port = process.env.PORT || 5000;

// var allowedOrigins = ['http://localhost:3001',
//                       'https://myonline-stores.herokuapp.com/'];
// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin)return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return res.json({status:'error', msg});
//     }
//     return callback(null, true);
//   }
// }));
app.use(cors())

app.use(express.json());

const User = require("./models/userSchema");

app.put("/api/profile", async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let doc = await User.findOneAndUpdate({ _id: fields.id }, fields);
      await uploadImage(files, fields);
    res.json({ result: "success", message: "Update Successfully" });
    });
  } catch (err) {
    res.json({ result: "error", message: err.errmsg });
  }
});

const uploadImage = async (files, doc) => {
  if (files.avatars != null) {
    var fileExtention = files.avatars.name.split(".").pop();
    doc.avatars = `${Date.now()}+${doc.username}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + "/uploaded/images/") + "/" + doc.avatars;

    if (fs.exists(newpath)) {
      await fs.remove(newpath);
    }
    await fs.move(files.avatars.path, newpath);

    await User.findOneAndUpdate({ _id: doc.id }, doc);
  }
};
app.use(express.static(__dirname + "/uploaded"));

app.get("/api/profile/id/:id", async (req, res) => { 
  let doc = await User.findOne({ _id: req.params.id });
  res.json(doc);
});

app.post("/api/login", async (req, res) => {
  const doc = await User.findOne({ email: req.body.email });
  if (doc) {
    if (bcrypt.compareSync(req.body.password, doc.password)) {
      // if (doc.status != "not_activated") {
      const payload = {
        id: doc._id,
        level: doc.level,
        email: doc.email
      };

      const token = jwt.sign(payload);
      console.log(token);
      res.json({ result: "success", token, message: "Login successful"});
    // } else {
    //   return res.json({
    //     result: "error",
    //     message: "You need to activate your account first"
    //   });
    // }
  } else {
      // invalid password
      res.json({ result: "error", message: "Invalid password"});
    }
  } else {
    // invalid email
    res.json({ result: "error", message: "Invalid email" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    await User.create(req.body);
    res.json({ result: "success", message: "Register successfully" });
  } catch (err) {
    res.json({ result: "error", message: err.errmsg });
  }
});

// app.get('/', function (req, res) {
//   res.render('index', {});
// });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});