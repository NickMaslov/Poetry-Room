const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const Poem = require('./models/Poem');
const User = require('./models/User');

//Bring in GraphQL-Express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

//Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Connects to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

//Initializes application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };
// app.use(cors(corsOptions));
app.use(cors('*'));

//Setting up JWT authentification middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {
      // console.error(err);
    }
  }
  next();
});

//Create GraphiQL application
// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//Connect schemas with GraphQL
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Poem,
      User,
      currentUser,
    },
  }))
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT; // || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
