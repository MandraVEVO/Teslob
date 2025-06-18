import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({cors: true})
export class MessageWsGateway  implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly messageWsService: MessageWsService) {}

    handleConnection(client: Socket ) {
    // You can store connected clients or log the connection
    console.log(`Client connected`, client.id);
    
  }

  handleDisconnect(client: Socket) {
    // Handle client disconnection logic
    console.log(`Client disconnected:`,client.id);
    
  }

}
