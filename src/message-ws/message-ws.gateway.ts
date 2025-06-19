import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from 'src/common/dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interfaces';

@WebSocketGateway({cors: true})
export class MessageWsGateway  implements OnGatewayConnection, OnGatewayDisconnect{


  @WebSocketServer() wss: Server
  constructor(private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

   async handleConnection(client: Socket ) {
      const token = client.handshake.headers.authentication as string;
      let payload:JwtPayload;
      try{
        payload = this.jwtService.verify(token)
        await this.messageWsService.registerClient(client,payload.id);

      }
      catch(error){
        client.disconnect();
        return;
      }

      // console.log({payload});
    // You can store connected clients or log the connection
    // console.log(`Client connected`, client.id);
    

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
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'No message provided',
    });

    };

}
