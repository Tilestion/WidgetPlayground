import WidgetSettings from "./WidgetSettings";

type WidgetProps<T extends WidgetSettings> = {
    settings: T;
    setSettings: (transform: (settings: T) => T) => void;
}

export default WidgetProps;
