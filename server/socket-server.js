const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store active users per partida
const partidaRooms = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-partida', ({ partidaId, userName }) => {
        socket.join(`partida-${partidaId}`);

        // Track users in this room
        if (!partidaRooms.has(partidaId)) {
            partidaRooms.set(partidaId, new Set());
        }
        partidaRooms.get(partidaId).add({ socketId: socket.id, userName });

        // Notify others in the room
        socket.to(`partida-${partidaId}`).emit('user-joined', {
            userName,
            socketId: socket.id
        });

        // Send current users to the new joiner
        const users = Array.from(partidaRooms.get(partidaId));
        socket.emit('room-users', users);

        console.log(`User ${userName} joined partida ${partidaId}`);
    });

    socket.on('leave-partida', ({ partidaId, userName }) => {
        socket.leave(`partida-${partidaId}`);

        if (partidaRooms.has(partidaId)) {
            partidaRooms.get(partidaId).delete({ socketId: socket.id, userName });
        }

        socket.to(`partida-${partidaId}`).emit('user-left', {
            userName,
            socketId: socket.id
        });

        console.log(`User ${userName} left partida ${partidaId}`);
    });

    socket.on('update-partida', ({ partidaId, data, userName }) => {
        // Broadcast to all other users in the room
        socket.to(`partida-${partidaId}`).emit('partida-updated', {
            data,
            updatedBy: userName,
            timestamp: Date.now()
        });

        console.log(`Partida ${partidaId} updated by ${userName}`);
    });

    socket.on('disconnect', () => {
        // Clean up user from all rooms
        partidaRooms.forEach((users, partidaId) => {
            const userArray = Array.from(users);
            const user = userArray.find(u => u.socketId === socket.id);
            if (user) {
                users.delete(user);
                io.to(`partida-${partidaId}`).emit('user-left', {
                    userName: user.userName,
                    socketId: socket.id
                });
            }
        });

        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket server running on port ${PORT}`);
});
