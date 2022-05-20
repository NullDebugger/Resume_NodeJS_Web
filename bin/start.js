const http = require('http');
// Add Mongoose
const mongoose = require('mongoose');

// Add Redis
const Redis = require('ioredis');

const config = require('../config');
const App = require('../app');

/* Function used to Connect to Mongoose Database */
async function connectToMongoose() {
  // get the url from config
  return mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

/* Function used to connect to Redis Database */
function connectToRedis() {
  const redis = new Redis(config.redis.port);
  // Add Event hanlder, listening to is connect
  redis.on('connect', () => {
    console.info('Successfully connected to Redis');
  });
  // Add Error handler
  redis.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });
  return redis;
}

/* Function used to connect to Mysql Database */

// Connect to Redis
const redis = connectToRedis();
config.redis.client = redis;

/* Logic to start the application */
const app = App(config);
const port = 3000;
app.set('port', port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port  ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const server = http.createServer(app);
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

  console.info(`${config.applicationName} listening on ${bind}`);
}
server.on('error', onError);
server.on('listening', onListening);

// Call the function connect to mongoose
connectToMongoose()
  .then(() => {
    console.info('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error(error);
  });

server.listen(port);
