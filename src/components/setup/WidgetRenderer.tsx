import React from "react";
import Widget from "../widgets/Widget";
import WidgetSettings from "../widgets/WidgetSettings";

interface WidgetRendererProps<T extends WidgetSettings> {
    widget: Widget<T>;
    showSettings: boolean;
}

export function WidgetRenderer<T extends WidgetSettings>({widget, showSettings}: WidgetRendererProps<T>) {
    const [settings, setSettings] = React.useState(widget.defaultSettingsGenerator());

    if (showSettings) {
        return <widget.RenderConfig settings={settings} setSettings={setSettings}/>;
    }

    return <widget.RenderWidget settings={settings} setSettings={setSettings}/>;
}
