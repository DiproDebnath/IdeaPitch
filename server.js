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
const { validateToken } = require("./src/utils/jwt");
const { thumbnailUpload } = require("./src/idea/idea.controller");

const corsConfig = {
  origin: ["http://localhost:4000", "https://studio.apollographql.com"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors(corsConfig));
app.use(cookieParser());
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

    express.json(),
    express.static("uploads"),

    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let currentUser = null;
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = await validateToken(token);

          if (decoded) {
            currentUser = decoded;
          }
        }
        return {
          res,
          req,
          currentUser,
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
              sameSite: "None",
            });
          },
        };
      },
    })
  );

  app.post("/upload", thumbnailUpload);

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
})();
