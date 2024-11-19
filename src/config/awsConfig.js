require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION || "eu-central-1",
});

module.exports = AWS;
