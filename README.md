<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Amazing Voting System</p>

## Description

Implemented in nestjs supporting both rest and websoket as communication protocol and used swagger for api documentation and also retool as administration dashboard

Deployed on Render.com free hosting
Address:[Voting service](https://voting-6hp9.onrender.com)
Retool Address: [Retool](https://zsco.retool.com/apps/voting)
Swagger Address: [Swagger](https://voting-6hp9.onrender.com/swagger)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

```

## Run tests

```bash
# unit tests
$ npm run test

```

## Database

we used postgres as our database and Typeorm as our ORM and have following entities

- user
- poll
- option
- vote

## Retool

We used this platform for creating a simple dashboard for our backend service consist of voting logic and websocket managements.

For each endpoint in bakend service, we have implemented forms and visual functionalities which user can touch and test them directly without needing calling them via swagger or other rest client programs

Retool Address: [https://zsco.retool.com/apps/voting](https://zsco.retool.com/apps/voting)

## Deployment

The test project has been deployed on Render.com website which consist of following:

- postgres database
  -- storing information about following entities
  --- user
  --- poll
  --- options
  --- voting
- voting backend service
  -- This service has logic for voting system, websocket managements
- socket client test service
  -- This service is used to act as client ( websocket ) for out websocket server that is launched on the same port of backend service ( )

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Mohamed Ahmadain](mohamed.ahmadian@gmail.com)
- github - [Voting source](https://github.com/mohamedahmadian/voting/tree/main)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
