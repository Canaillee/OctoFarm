let majorVersion = null;
try {
  majorVersion = parseInt(process.version?.replace("v", "").split(".")[0]);
} catch (e) {
  // We dont abort on parsing failures
}
if (!!majorVersion && majorVersion < 14) {
  throw "Please make sure Node 14 or higher is installed to run the latest OctoFarm.";
}

const { setupEnvConfig, fetchMongoDBConnectionString, fetchOctoFarmPort } = require("./app-env");
const Logger = require("./server_src/lib/logger.js");
const mongoose = require("mongoose");
const {
  setupExpressServer,
  serveDatabaseIssueFallback,
  serveOctoFarmNormally,
  ensureSystemSettingsInitiated
} = require("./app-core");

function bootAutoDiscovery() {
  require("./server_src/runners/autoDiscovery.js");
}

const logger = new Logger("OctoFarm-Server");

setupEnvConfig();
const octoFarmServer = setupExpressServer();

mongoose
  .connect(fetchMongoDBConnectionString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 2500
  })
  .then(() => ensureSystemSettingsInitiated())
  .then(() => serveOctoFarmNormally(octoFarmServer, fetchOctoFarmPort()))
  .catch(async (err) => {
    logger.error(err);
    serveDatabaseIssueFallback(octoFarmServer, fetchOctoFarmPort());
  });

bootAutoDiscovery();
