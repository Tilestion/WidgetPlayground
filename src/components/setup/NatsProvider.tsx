import React from "react";
import {connect, type NatsConnection, NatsError} from "nats.ws";
export interface NatsProviderProps {
    children: React.ReactNode;
    clientName: string;
}

export type User = { natsUrl: string; username: string };

export type NatsStatus = "idle" | "connecting" | "connected" | "error";

export type LoginFunction = (natsUrl: string, username: string, password: string) => Promise<void>;

export type LogoutFunction = () => Promise<void>;

export type NatsContextType = {
    connection: NatsConnection | null;
    user: User | null;
    status: NatsStatus;
    error?: string;
    login: LoginFunction;
    logout: LogoutFunction;
}

const NatsContext = React.createContext<NatsContextType | null>(null);

export function useNatsConnection() {
    const ctx = React.useContext(NatsContext);
    if (!ctx) throw new Error("useNatsConnection must be used within NatsProvider");
    return ctx.connection;
}
export function useNatsUser() {
    const ctx = React.useContext(NatsContext);
    if (!ctx) throw new Error("useNatsUser must be used within NatsProvider");
    return ctx.user;
}
export function useNatsAuth() {
    const ctx = React.useContext(NatsContext);
    if (!ctx) throw new Error("useNatsAuth must be used within NatsProvider");
    const { login, logout, status, error } = ctx;
    return { login, logout, status, error };
}

const NatsProvider = ({children, clientName}: NatsProviderProps) => {
    const [connection, setConnection] = React.useState<NatsConnection | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [status, setStatus] = React.useState<NatsStatus>("idle");
    const [error, setError] = React.useState<string | undefined>();

    const login: LoginFunction = React.useCallback<LoginFunction>(async (natsUrl, username, password) => {
        if (connection) return; // already connected
        setStatus("connecting");
        setError(undefined);
        try {
            const conn = await connect({
                servers: natsUrl,
                name: `${clientName}-${username}`,
                user: username,
                pass: password,
            });
            setConnection(conn);
            setUser({natsUrl, username});
            setStatus("connected");
        } catch (e) {
            const msg = e instanceof NatsError
                ? `Login failed. Check connection and credentials.`
                : (e as Error).message;
            setStatus("error");
            setError(msg);
            throw new Error(msg);
        }
    }, [connection, setStatus, setError, clientName, setConnection, setUser]);

    const logout: LogoutFunction = React.useCallback<LogoutFunction>(async () => {
        if (connection) {
            try {
                await connection.drain();
                await connection.close();
            } finally {
                setConnection(null);
            }
        }
        setUser(null);
        setStatus("idle");
        setError(undefined);
    }, [connection, setConnection, setUser, setStatus, setError]);

    const value = React.useMemo<NatsContextType>(() => ({
        connection: connection,
        status: status,
        user: user,
        error: error as string,
        login: login,
        logout: logout,
    }), [connection, status, user, login, logout, error]);

    return <NatsContext.Provider value={value}>{children}</NatsContext.Provider>;
};

export default NatsProvider;
