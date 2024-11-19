const AWS = require("../src/config/awsConfig");

(async () => {
  try {
    const sts = new AWS.STS();
    const identity = await sts.getCallerIdentity().promise();
    console.log("AWS SDK is configured correctly. Identity:", identity);
  } catch (error) {
    console.error("AWS SDK configuration error:", error);
  }
})();
