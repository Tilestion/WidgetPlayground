import React from "react";
import {useNatsAuth, useNatsConnection} from "./NatsProvider";
import {NATS_PASSWORD, NATS_URL, NATS_USER} from "../../config";

export interface TelemetryProviderProps {
    children: React.ReactNode;
}

function useTelemetry() {
    const {login, status} = useNatsAuth();

    React.useEffect(() => {
        switch (status) {
            case "connected":
            case "connecting":
                break;
            default:
                login(NATS_URL, NATS_USER, NATS_PASSWORD).then();
        }
    }, [status, login]);
}

function useTelemetrySubscription<T>(address: string, amount: number, parser: (message: string) => T): {timestamp: Date, value: T}[] {
    if (amount < 1) {
        throw new Error("Cant request less than one telemetry");
    }
    const conn = useNatsConnection();

    const [values, setValues] = React.useState<{timestamp: Date, value: T}[]>([]);

    const parserRef = React.useRef(parser);
    React.useEffect(() => { parserRef.current = parser; }, [parser]);

    const amountRef = React.useRef(amount);
    React.useEffect(() => { amountRef.current = amount; }, [amount]);

    const subRef = React.useRef<{ unsubscribe: () => void } | null>(null);

    React.useEffect(() => {
        if (!conn) {
            // ensure previous sub is torn down if conn vanished
            if (subRef.current) {
                try { subRef.current.unsubscribe(); } catch {}
                subRef.current = null;
            }
            return;
        }

        // Hard dedupe: if a sub already exists, unsubscribe before creating a new one
        if (subRef.current) {
            try { subRef.current.unsubscribe(); } catch {}
            subRef.current = null;
        }

        console.log("subscribing to " + address);

        const sub = conn.subscribe(address, {
            callback: (err, msg) => {
                if (err) return;
                const parsed = parserRef.current(msg.string());
                setValues((current) => {
                    const nextPoint = { timestamp: new Date(), value: parsed };
                    const amt = amountRef.current;
                    if (current.length >= amt) {
                        const start = Math.max(0, current.length - (amt - 1));
                        return [...current.slice(start), nextPoint];
                    }
                    return [...current, nextPoint];
                });
            }
        });
        subRef.current = sub;

        return () => {
            if (subRef.current) {
                try { subRef.current.unsubscribe(); } catch {}
                subRef.current = null;
            }
        };
    }, [address, conn]);

    return values;
}

export function useTelemetryLatest<T>(id: string) {
    const ctx = React.useContext(TelemetryContext);
    return React.useMemo(() => {
        const series = ctx?.[id];
        if (!series || series.length === 0) return null as unknown as T;
        return series[series.length - 1].value as T;
    }, [ctx, id]);
}

export function useTelemetrySeries<T>(id: string): T[] {
    const ctx = React.useContext(TelemetryContext);
    return React.useMemo(() => {
        const series = ctx?.[id];
        if (!series || series.length === 0) return [] as T[];
        return series.map((p) => p.value as T);
    }, [ctx, id]);
}

type TelemetryContextType = Record<string, { timestamp: Date; value: any }[]>;

const TelemetryContext = React.createContext<TelemetryContextType>(null as unknown as TelemetryContextType);

export const TelemetryProvider = ({children}: TelemetryProviderProps) => {
    useTelemetry();

    const vectors = useTelemetrySubscription<{x: number, y: number, z: number}>("telemetry.test.vector", 100, (message) => {
        return JSON.parse(message).value;
    });

    const values = useTelemetrySubscription<number>("telemetry.test.value", 100, (message) => {
        return JSON.parse(message).value;
    });

    return <TelemetryContext.Provider value={{
        vector: vectors,
        value: values,
    }}>
        {children}
    </TelemetryContext.Provider>;
}
