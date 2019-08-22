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
                console.log(`Online`, this.users);
            });    

            client.on('chat-message', (data) => {
                //console.log(data);
                //console.log(`Message To ${data.user_emitter.username} (${this.users[data.user_emitter.username]}) :: ${data.text}`);
                this.io.to(this.users[data.user_receiver]).emit('chat-message', data)
                this.io.to(this.users[data.user_receiver]).emit('new-message', data.user_emitter.username)
            });

            client.on('writing', (data) => { 
                this.io.to(this.users[data.user_receiver]).emit('writing', data)
            })
            
            client.on('disconnect', () => {
                const u = this.deleteByValue(client.id); 
                this.io.emit('offline', {username: u});               
                console.log(`User ${u} disconnected with id ${client.id}`);
                console.log(`Online`, this.users);
            })           

            client.on('logout', (data) => {
                console.log(`${data.username} is logget`);
                delete this.users[data.username];      
                this.io.emit('offline', {username: data.username});          
            })
        });
    }    

    socketConfig(){
        this.socketEvents();
    }

    sendNotify(username, message, url) {
        console.log(`Notify`, {username, message, url});
        this.io.to(this.users[username]).emit('notify', {username, message, url});
    }

    deleteByValue(val) {
        for(const u in this.users) {
            if(this.users[u] == val) {
                delete this.users[u];
                return u;
            }
        }
        return null;
    }
}



module.exports = SocketServer;