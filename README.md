# Getting Started with Widget Playground

## Installation

1. Make sure you have `Node.js` installed on your system.
2. Clone the repository
3. Run `npm install` in your project directory
4. Enter your nats configuration into [config.ts](/src/config.ts)

## Usage

In the project directory, run: `npm start`

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Test your widget

You can either write your own code inside the [TestWidget.tsx](/src/components/widgets/TestWidget.tsx),
or create a new widget.

When creating a new widget you need to replace the widget inside the WidgetRenderer inside [App.tsx](/src/App.tsx) with your own.
