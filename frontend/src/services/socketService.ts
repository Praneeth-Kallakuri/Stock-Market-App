// import { io, Socket } from 'socket.io-client';

// import { io, Socket } from 'socket.io-client';

// const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// class SocketService {
//   private static instance: SocketService;
//   private socket: Socket | null = null;

//   public static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }
  
//   public connect(): Socket {
//     if (!this.socket) {
//       this.socket = io(SOCKET_SERVER_URL);
//       console.log('WebSocket connection established');
      
//       this.socket.on('connect', () => {
//         console.log('Connected to WebSocket server');
//       });
      
//       this.socket.on('disconnect', () => {
//         console.log('Disconnected from WebSocket server');
//       });
      
//       this.socket.on('connect_error', (error) => {
//         console.error('Connection error:', error);
//       });
//     }
    
//     return this.socket;
//   }
  
//   public disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       console.log('WebSocket connection closed');
//     }
//   }
  
//   public getSocket(): Socket | null {
//     return this.socket;
//   }
  
//   public joinStockRoom(symbol: string): void {
//     if (this.socket) {
//       this.socket.emit('join-stock', symbol);
//     }
//   }
  
//   public leaveStockRoom(symbol: string): void {
//     if (this.socket) {
//       this.socket.emit('leave-stock', symbol);
//     }
//   }
  
//   public emitPriceUpdate(symbol: string, price: number, priceChange: number): void {
//     if (this.socket) {
//       this.socket.emit('price-update', { symbol, price, priceChange });
//     }
//   }
  
//   public emitNewTransaction(symbol: string, transaction: any): void {
//     if (this.socket) {
//       this.socket.emit('new-transaction', { symbol, transaction });
//     }
//   }
  
//   public emitNewNotification(symbol: string, notification: any): void {
//     if (this.socket) {
//       this.socket.emit('new-notification', { symbol, notification });
//     }
//   }
// }

// export default SocketService;