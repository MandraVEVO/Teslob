import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from 'src/common/dto/new-message.dto';

@WebSocketGateway({cors: true})
export class MessageWsGateway  implements OnGatewayConnection, OnGatewayDisconnect{


  @WebSocketServer() wss: Server
  constructor(private readonly messageWsService: MessageWsService) {}

    handleConnection(client: Socket ) {
    // You can store connected clients or log the connection
    // console.log(`Client connected`, client.id);
    this.messageWsService.registerClient(client);

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());

  }

  handleDisconnect(client: Socket) {
    // Handle client disconnection logic
    // console.log(`Client disconnected:`,client.id);
    this.messageWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    
    //!emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message:payload.message || 'No message provided',
    // })

    //!emite a todos los clientes conectados menos al que emitio
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message:payload.message || 'No message provided',
    // })

    //emite a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'No message provided',
    });

    };

}
