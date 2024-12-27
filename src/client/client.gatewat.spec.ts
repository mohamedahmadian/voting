import { Test, TestingModule } from '@nestjs/testing';
import { ClientGateway } from './client.gateway';
import { ClientService } from './client.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

describe('ClientGateway', () => {
  let gateway: ClientGateway;
  let clientService: ClientService;
  let server: Server;
  let socket: Socket;

  beforeEach(async () => {
    // Mocking dependencies
    const clientServiceMock = {
      addClient: jest.fn(),
      removeClient: jest.fn(),
    };

    const serverMock = {
      emit: jest.fn(),
    };

    const socketMock = {
      id: 'client-id',
    } as unknown as Socket;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientGateway,
        { provide: ClientService, useValue: clientServiceMock },
        { provide: Server, useValue: serverMock },
        { provide: Socket, useValue: socketMock },
        Logger,
      ],
    }).compile();

    gateway = module.get<ClientGateway>(ClientGateway);
    clientService = module.get<ClientService>(ClientService);
    server = module.get<Server>(Server);
    socket = module.get<Socket>(Socket);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should call addClient on handleConnection', () => {
    const addClientSpy = jest.spyOn(clientService, 'addClient');
    gateway.handleConnection(socket);
    expect(addClientSpy).toHaveBeenCalledWith(socket.id, socket);
  });

  it('should call removeClient on handleDisconnect', () => {
    const removeClientSpy = jest.spyOn(clientService, 'removeClient');
    gateway.handleDisconnect(socket);
    expect(removeClientSpy).toHaveBeenCalledWith(socket.id);
  });

  it('should log client connection and disconnection', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');
    gateway.handleConnection(socket);
    expect(loggerSpy).toHaveBeenCalledWith('Client connected: client-id');

    gateway.handleDisconnect(socket);
    expect(loggerSpy).toHaveBeenCalledWith('Client disconnected: client-id');
  });

  it('should handle message event', () => {
    const message = 'test message';
    const response = gateway.handleMessage(socket, message);
    expect(response).toBe('Message received!');
  });

  it('should handle broadcastMessage event and emit broadcast', () => {
    const message = 'Test broadcast message';

    // Ensure afterInit is called before testing handleBroadcastMessage
    gateway.afterInit(server);

    gateway.handleBroadcastMessage(message);

    expect(server.emit).toHaveBeenCalledWith('broadcast', {
      from: 'boradcasting system',
      message: message,
    });
  });

  it('should call afterInit and log gateway initialization', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');
    gateway.afterInit(server);
    expect(loggerSpy).toHaveBeenCalledWith('Client Gateway Initialized');
  });
});
