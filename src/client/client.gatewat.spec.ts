import { Test, TestingModule } from '@nestjs/testing';
import { ClientGateway } from './client.gateway';
import { ClientService } from './client.service';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import * as io from 'socket.io-client';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('ClientGateway (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let clientSocket: io.Socket;
  let clientService: ClientService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        ClientGateway,
        {
          provide: ClientService,
          useValue: {
            addClient: jest.fn(),
            removeClient: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the WebSocket server instance
    const gateway = app.get<ClientGateway>(ClientGateway);
    server = gateway['server'];
  });

  beforeEach(() => {
    // Connect client to the WebSocket server
    clientSocket = io.io(`http://localhost:3000`, {
      transports: ['websocket'],
    });
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should connect and disconnect client', (done) => {
    const spyAddClient = jest.spyOn(clientService, 'addClient');
    const spyRemoveClient = jest.spyOn(clientService, 'removeClient');

    clientSocket.on('connect', () => {
      expect(spyAddClient).toHaveBeenCalled();
      clientSocket.disconnect();
    });

    clientSocket.on('disconnect', () => {
      expect(spyRemoveClient).toHaveBeenCalled();
      done();
    });
  });

  it('should handle message event', (done) => {
    clientSocket.emit('message', 'Hello Server!');

    clientSocket.on('message', (response) => {
      expect(response).toBe('Message received!');
      done();
    });
  });

  it('should handle broadcast message', (done) => {
    server.emit('broadcast', { from: 'System', message: 'Broadcast test' });

    clientSocket.on('broadcast', (data) => {
      expect(data).toEqual({
        from: 'System',
        message: 'Broadcast test',
      });
      done();
    });
  });
});
