require("dotenv").config();
require("./src/db/db");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const fileUpload = require("express-fileupload");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { typeDefs, resolvers } = require("./src/graphql");
const { validateAccessToken } = require("./src/utils/jwt");

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  // includeStacktraceInErrorResponses: false
});

(async function () {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    cookieParser(),
    express.json(),
    express.static("uploads"),
    fileUpload({
      createParentPath: true,
    }),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let authData = null;
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = validateAccessToken(token);

          if (decoded) {
            authData = decoded;
          }
        }
        return {
          res,
          req,
          authData,
          clearCookie(name) {
            res.clearCookie(name);
          },
          getCookie(name) {
            return req.cookies[name];
          },
          setCookie(name, value) {
            res.cookie(name, value, {
              secure: true,
              httpOnly: true,
              maxAge: 2592000000,
            });
          },
        };
      },
    })
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
})();
