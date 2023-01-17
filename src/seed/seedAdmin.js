/* eslint-disable no-console */
require("dotenv").config();
require("../db/db");
const User = require("../user/user.model");
const { role } = require("../utils/constants");

(async function () {
  const admin = {
    username: "admin",
    password: "admin1234",
    role: role.ADMIN,
  };

  const user = await User.findOne({ username: admin.username });

  if (user) {
    console.log("admin already exists");
    process.exit();
  }
  await User.create(admin);

  console.log("admin user created successfully");
  process.exit();
})();
