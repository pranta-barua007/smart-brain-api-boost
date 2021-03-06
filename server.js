const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const logout = require("./controllers/logout");
const auth = require("./middlewares/authorization");

// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL || process.env.POSTGRES_URI,
// });

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URI,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();

const whitelist = [
  "http://localhost:3000",
  "https://face-detect-smart-brain.netlify.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(morgan("combined"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("its working");
});

app.post("/signin", signin.signinAuthentication(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});
app.get("/logout", (req, res) => {
  logout.handleLogout(req, res);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
