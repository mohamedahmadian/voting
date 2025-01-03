<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://electionbuddy.com/wp-content/uploads/2022/01/Voting-image-6-scaled.jpg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://electionbuddy.com/wp-content/uploads/2022/01/Voting-image-6-scaled.jpg

  <p align="center">Voting System</p>

## Description

This project is built with NestJS handling logic for voting system with minimal features that could be implemented in less than a week. It uses Swagger for API documentation and Retool as an administration dashboard. The service is deployed on Render.com, a free hosting platform.

- Voting service: [Voting service](https://voting-6hp9.onrender.com)
- Retool Address: [Retool](https://zsco.retool.com/apps/voting)
- Swagger Address: [Swagger](https://voting-6hp9.onrender.com/swagger)
- Client websocket test Address: [Client websocket](https://test-socket-vmdb.onrender.com/clientTest.html)

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

Test include testing process for following entities in the system. we also have test for sockets communications and check if everything is working correctly.

- user
- poll
- option
- vote
- webSocket

```bash
# unit tests
$ npm run test

```

## Database

- Database system : Postgres

- ORM: TypeOrm

- Database creation/modification: using typeorm migration mechanism

- Entities: ( User - Poll - Option - Vote )

<img src="https://i.ibb.co/kKJJxPn/db-Diagram.png" width="400px" alt="Nest Logo" />

#### user

- All information related to the user like name, username, password, etc
- each user can partipicate only one time in each poll

#### poll

- All information about poll like title, decription, creation date and etc
- each poll can have unlimited numbers of options

#### option

-- All information about options like title, description and creaction date and etc

- each option is related to one poll

#### vote

- All information about vote like vote date, user, selected poll, selected option and etc
- each user can have one vote on each poll by selecting one option
- user can not change his vote due to system policy

## Retool

Retool is used to create an easy-to-use admin interface for managing the voting system and WebSocket logic. Each endpoint of the backend service is represented with forms and interactive tools, allowing users to test the service without needing to use Swagger or other REST client tools.

Retool Address: [https://zsco.retool.com/apps/voting](https://zsco.retool.com/apps/voting)

<img src="https://i.ibb.co/269bbWK/retool.png" width="400px" alt="Nest Logo" />

## Deployment

The test project has been deployed on Render.com website which consist of following:

#### postgres database

storing data about voting system.

#### voting backend service

Contains the voting system logic and WebSocket management.

- Voting service: [Voting service](https://voting-6hp9.onrender.com)

#### socket client test service

Simulates a WebSocket client that connects to the WebSocket server running on the same port as the backend service.

- Client websocket test Address: [Client websocket](https://test-socket-vmdb.onrender.com/clientTest.html)

## Stay in touch

- Author - [Mohamed Ahmadian](mohamed.ahmadian@gmail.com)

- Phone - +989159103070

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
