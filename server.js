const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to instact." });
});

require("./app/routes/usersRouter.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
