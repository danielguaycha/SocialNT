class SocketServer {
    
    constructor(socket)
    {
        this.users = {};
        this.io = socket;
    }

    socketEvents(){
        this.io.on('connection', (client) => {            
            client.on('new-user', (data) => {                
                console.log(`User ${data.nick} joined with id ${client.id}`);
                this.users[data.nick] = client.id;                
                this.io.emit('online', this.users);
            });    

            client.on('chat-message', (data) => {
                //console.log(data);
                //console.log(`Message To ${data.user_emitter.username} (${this.users[data.user_emitter.username]}) :: ${data.text}`);
                this.io.to(this.users[data.user_receiver]).emit('chat-message', data)
            })      
        });
    }

    socketConfig(){
        this.socketEvents();
    }
}

module.exports = SocketServer;