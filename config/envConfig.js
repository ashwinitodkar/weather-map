const os = require("os");

module.exports = {
  environmentName: process.env.NODE_ENV,
  appPort: process.env.APP_PORT,
  protocol: "http://",
  subDomain: "",
  domain: "localhost",
  logs: {
    logFolder: `./logs/${os.hostname()}`
  },
  Promise: require("bluebird"),
  swaggerDefinition: {
    info: {
      title: "Weather map",
      version: "1.0.0",
      description: "Weather map"
    },
    host: process.env.SWAGGER_HOST, //BKUPP9167Q,CAN - 17344QZA38, folio no - 91041446144
    basePath: "/",
    schemes: ["http", "https"]
  }
};

