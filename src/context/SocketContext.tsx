"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    joinPartida: (partidaId: string, userName: string) => void;
    leavePartida: (partidaId: string, userName: string) => void;
    updatePartida: (partidaId: string, data: any, userName: string) => void;
    onPartidaUpdate: (callback: (update: PartidaUpdate) => void) => void;
    onUserJoined: (callback: (user: UserInfo) => void) => void;
    onUserLeft: (callback: (user: UserInfo) => void) => void;
}

interface PartidaUpdate {
    data: any;
    updatedBy: string;
    timestamp: number;
}

interface UserInfo {
    userName: string;
    socketId: string;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
        const socketInstance = io(socketUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        socketInstance.on('connect', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinPartida = (partidaId: string, userName: string) => {
        socket?.emit('join-partida', { partidaId, userName });
    };

    const leavePartida = (partidaId: string, userName: string) => {
        socket?.emit('leave-partida', { partidaId, userName });
    };

    const updatePartida = (partidaId: string, data: any, userName: string) => {
        socket?.emit('update-partida', { partidaId, data, userName });
    };

    const onPartidaUpdate = (callback: (update: PartidaUpdate) => void) => {
        socket?.on('partida-updated', callback);
    };

    const onUserJoined = (callback: (user: UserInfo) => void) => {
        socket?.on('user-joined', callback);
    };

    const onUserLeft = (callback: (user: UserInfo) => void) => {
        socket?.on('user-left', callback);
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                joinPartida,
                leavePartida,
                updatePartida,
                onPartidaUpdate,
                onUserJoined,
                onUserLeft
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
