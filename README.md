<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Voting System</p>

## Description

This project is built with NestJS handling logic for voting system with minimal features that could be implemented in less than a week. It uses Swagger for API documentation and Retool as an administration dashboard. The service is deployed on Render.com, a free hosting platform.

- Voting service: [Voting service](https://voting-6hp9.onrender.com)
- Retool Address: [Retool](https://zsco.retool.com/apps/voting)
- Swagger Address: [Swagger](https://voting-6hp9.onrender.com/swagger)

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

Retool is used to create an easy-to-use admin interface for managing the voting system and WebSocket logic. Each endpoint of the backend service is represented with forms and interactive tools, allowing users to test the service without needing to use Swagger or other REST client tools.

Retool Address: [https://zsco.retool.com/apps/voting](https://zsco.retool.com/apps/voting)

## Deployment

The test project has been deployed on Render.com website which consist of following:

### postgres database

storing data about voting system

### voting backend service

Contains the voting system logic and WebSocket management.

### socket client test service

Simulates a WebSocket client that connects to the WebSocket server running on the same port as the backend service.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Mohamed Ahmadain](mohamed.ahmadian@gmail.com)

- github - [Voting source](https://github.com/mohamedahmadian/voting/tree/main)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
