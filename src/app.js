const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const mongodbConnect = require("./config/databaseConfig");
const initResultSocket = require('./socket/resultSocket');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "*" }));

require("./jobs/electionJob");
const port = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initResultSocket(io);


const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const superAdminRoute = require("./routes/ausaDashboard.route");
const voteRoute = require("./routes/vote.route");
const undefinedRoute = require("./middlewares/undefinedRoutes");
const baseUrl = "/api/v1";

app.use(`${baseUrl}/auth`, authRoute);
app.use(`${baseUrl}/user`, userRoute);
app.use(`${baseUrl}/super-admin`, superAdminRoute);
app.use(`${baseUrl}/vote`, voteRoute);

app.use(undefinedRoute);

app.use(errorHandler);

server.listen(port, async () => {
  await mongodbConnect();
  console.log(`server running on ${port}`);
});
