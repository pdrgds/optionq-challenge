# Twitter-like API

You're supposed to set the following environment vars before proceeding:

> TWITTER_DB_NAME;
> TWITTER_DB_USER;
> TWITTER_DB_PASSWORD;
> TWITTER_DB_HOST;

To run tests:
```
npm test
```

To start the server:
```
npm start
```

After starting the server, you can read the automatically-generated documentation by Swagger at:
```
localhost:3000/docs
```

The "try it out" thing is not working because OpenAPI 2.0, which is the version supported by fastify-swagger, doesn't support cookies authentication.
