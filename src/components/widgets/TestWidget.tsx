import {useTelemetryLatest} from "../setup/TelemetryProvider";
import Widget from "./Widget";
import WidgetProps from "./WidgetProps";
import React from "react";
import AccelGauge from "../charts/AccelGauge";

type TestWidgetSettings = {
    telemetryId: string;
}

export const TestWidget: Widget<TestWidgetSettings> = {
    RenderWidget: ({settings}: WidgetProps<TestWidgetSettings>) => {
        const value = useTelemetryLatest<number>(settings.telemetryId);

        if (!value) return <div style={{
            margin: "auto",
            fontSize: 60,
            color: "white",
        }}>No data!</div>;

        return <AccelGauge value={value} min={0} max={3}/>;
    },
    RenderConfig: ({settings, setSettings}: WidgetProps<TestWidgetSettings>) => {
        const [telemetryId, setTelemetryId] = React.useState<string>(settings.telemetryId);

        return <div style={{
            display: "flex",
            margin: "auto",
        }}>
            <form style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 12,
            }} onSubmit={(e) => {
                e.preventDefault();
                setSettings((old) => ({
                    ...old,
                    telemetryId: telemetryId,
                }));
            }}>
                <input value={telemetryId} onChange={(e) => setTelemetryId(e.target.value)} />
                <button type="submit">save</button>
            </form>
        </div>
    },
    defaultSettingsGenerator(): TestWidgetSettings {
        return {
            telemetryId: "value",
        };
    },
}
