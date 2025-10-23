import * as React from "react";
import WidgetSettings from "./WidgetSettings";
import WidgetProps from "./WidgetProps";

type Widget<T extends WidgetSettings> = {
    RenderWidget: React.FunctionComponent<WidgetProps<T>>;
    RenderConfig: React.FunctionComponent<WidgetProps<T>>;
    defaultSettingsGenerator: () => T;
}

export default Widget;
