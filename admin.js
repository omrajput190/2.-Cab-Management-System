// const express = require("express");
// const con = require("./views/connection");
// const app = express();
// const path = require("path");
// const session = require("express-session");
// const { route } = require("./auth");
// const router = express.Router();

// router.post("/adminlogin", (req, res) => {
//     var name = req.body.username;
//     var password = req.body.password;
  
//     console.log(req.body);
  
//     con.connect((err) => {
//       if (err) {
//         throw err;
//       }
  
//       var sql = "SELECT * FROM adminlogin WHERE username = ? AND Passkey = ?";
//       con.query(sql, [name, password], (err, result) => {
//         if (err) {
//           throw err;
//         }
  
//         if (result.length > 0) {
//           req.session.user = {
//             name: result[0].name,
//           };
//           // res.send("admin login successfull !!!!");
//           res.sendFile(path.join(__dirname, "views/adminDashboard.html"));
//         } else {
//           res.send("Invalid email or password");
//         }
//       });
//     });
//   });

// module.exports = router;
const express = require("express");
const con = require("./views/connection");
const app = express();
const path = require("path");
const session = require("express-session");
const { route } = require("./auth");
const router = express.Router();

router.post("/adminlogin", (req, res) => {
  var name = req.body.username;
  var password = req.body.password;

  console.log(req.body);

  con.connect((err) => {
    if (err) {
      throw err;
    }

    var sql = "SELECT * FROM adminlogin WHERE username = ? AND Passkey = ?";
    con.query(sql, [name, password], (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        req.session.user = {
          name: result[0].name,
        };

        // Set authentication flag in session
        req.session.isAuthenticated = true;

        // Send the client a script to manipulate the browser's history
        res.send(`
          <script>
            history.pushState(null, null, '/adminDashboard.html');
            window.location.href = '/adminDashboard.html';
          </script>
        `);
      } else {
        res.send("Invalid email or password");
      }
    });
  });
});

// Middleware to protect subsequent routes
router.use((req, res, next) => {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
    // User is authenticated, proceed to the requested route
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/login");
  }
});

// Add other routes for the admin dashboard and subsequent pages
router.get("/dashboard", (req, res) => {
  // Serve the admin dashboard page
  res.sendFile(path.join(__dirname, "views/adminDashboard.html"));
});

module.exports = router;
