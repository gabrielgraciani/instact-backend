const express = require('express');
const cors = require('cors');
require('dotenv/config');
const { errors } = require('celebrate');
const routes = require('./routes');
const path = require('path');
const http = require('http');

global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(routes);
app.use(errors());


const server = http.createServer(app);
const io = require('socket.io').listen(server);

io.on('connection', socket => {
	console.log('[IO] Connection => Server has a new connection');
	socket.on('chat.message', data => {
		console.log('[SOCKET] Chat.message => ', data);
		io.emit('chat.message', data);
	});
	socket.on('notifications.follow', data => {
		console.log('[SOCKET] Notification.follow => ', data);
		io.emit('notifications.follow', data);
	});
	socket.on('disconnect', () => {
		console.log('[SOCKET] Disconnect => A connection was disconnected');
	});
});

server.listen(process.env.PORT || 3001);