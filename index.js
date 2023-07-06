const express = require("express");
const con = require("./views/connection");
const app = express();
const path = require("path");
const session = require("express-session");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cab_management",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
const port = 3000;

const routes = require("./auth");
app.use("/",routes);

const admin = require("./admin");
app.use("/",admin)

const driver = require("./driver");
app.use("/",driver);

const car = require("./car");
app.use("/",car);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
