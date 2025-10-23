import React from "react";
import NatsProvider from "./components/setup/NatsProvider";
import {TelemetryProvider} from "./components/setup/TelemetryProvider";
import {TestWidget} from "./components/widgets/TestWidget";
import {WidgetRenderer} from "./components/setup/WidgetRenderer";

function App() {
    const [showSettings, setShowSettings] = React.useState(false);

    return <NatsProvider clientName={"nats-client"}>
        <TelemetryProvider>
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "black",
            }}>
                <div style={{
                    display: "flex",
                    height: "20vh",
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    font: "monospace",
                    fontFamily: "sans-serif",
                    fontWeight: 800,
                    fontSize: "60px",
                    color: "white",
                }}>
                    Tilestion Widget
                </div>
                <div style={{
                    height: "60vh",
                    width: "60vw",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "flex",
                }}>
                    <div style={{
                        flexGrow: 1,
                        border: "2px solid gray",
                        borderRadius: "48px",
                        padding: "2%",
                        display: "flex",
                        background: "#3f3f3f",
                        boxShadow: "",
                    }}>
                        <WidgetRenderer widget={TestWidget} showSettings={showSettings}/>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    height: "20vh",
                }}>
                    <div style={{
                        display: "flex",
                        margin: "auto",
                        flexDirection: "row",
                        columnGap: 12,
                    }}>
                        <input
                            type={"checkbox"} checked={showSettings}
                            onChange={(ev) => setShowSettings(ev.target.checked)}/>
                        <div style={{
                            color: "white",
                        }}>Toggle settings</div>
                    </div>
                </div>
            </div>
        </TelemetryProvider>
    </NatsProvider>;
}

export default App;
