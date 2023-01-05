const { ApolloServer } = require("@apollo/server");
require("dotenv").config();
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const fileUpload = require("express-fileupload")
const http = require("http");
const cors = require("cors");
const {typeDefs, resolvers} = require("./src/graphql");




const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
(async function () {
  await server.start();

  app.use(
      "/graphql",
      cors(),
      express.json(),
      express.static("uploads"),
      fileUpload({
        createParentPath: true
      }),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
      })
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
})();
