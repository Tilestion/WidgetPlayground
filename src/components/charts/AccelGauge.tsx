import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

type Props = {
    value: number;        // current acceleration in g
    min?: number;         // default 0
    max?: number;         // default 5
    height?: number | string;  // px or CSS size, default '100%'
};

const AccelGauge: React.FC<Props> = ({ value, min = 0, max = 5, height = "100%" }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<echarts.EChartsType | null>(null);
    const roRef = useRef<ResizeObserver | null>(null);
    const frameRef = useRef<number | null>(null);
    const latestValueRef = useRef<number>(value);
    const prevBoundsRef = useRef<{min: number; max: number}>({ min, max });

    useEffect(() => {
        if (!ref.current) return;

        const chart = echarts.init(ref.current);
        chartRef.current = chart;

        const option: echarts.EChartsOption = {
            series: [
                {
                    type: "gauge",
                    center: ["50%", "70%"],
                    radius: "100%",
                    startAngle: 200,
                    endAngle: -20,
                    animation: true,
                    animationDurationUpdate: 0,
                    min,
                    max,
                    splitNumber: 10,
                    itemStyle: { color: "#FFAB91" },
                    progress: { show: true, width: 30 },
                    pointer: { show: false },
                    axisLine: { lineStyle: { width: 30 } },
                    axisTick: {
                        distance: -45,
                        splitNumber: 5,
                        lineStyle: { width: 2, color: "#999" }
                    },
                    splitLine: {
                        distance: -52,
                        length: 14,
                        lineStyle: { width: 3, color: "#999" }
                    },
                    axisLabel: { distance: -20, color: "#999", fontSize: 14 },
                    anchor: { show: false },
                    title: { show: false },
                    detail: {
                        valueAnimation: true,
                        width: "100%",
                        lineHeight: 36,
                        borderRadius: 8,
                        offsetCenter: [0, "-15%"],
                        fontSize: 38,
                        fontWeight: "bolder",
                        formatter: (val: number) => val.toFixed(3) + " g",
                        color: "inherit"
                    },
                    data: [{ value }]
                },
                {
                    type: "gauge",
                    center: ["50%", "70%"],
                    radius: "100%",
                    startAngle: 200,
                    endAngle: -20,
                    animation: true,
                    animationDurationUpdate: 0,
                    min,
                    max,
                    itemStyle: { color: "#FD7347" },
                    progress: { show: true, width: 8 },
                    pointer: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    detail: { show: false },
                    data: [{ value }]
                }
            ]
        };

        chart.setOption(option);
        // Ensure initial sizing follows the container
        chart.resize();
        requestAnimationFrame(() => chart.resize());

        // Resize handling
        roRef.current = new ResizeObserver(() => chart.resize());
        roRef.current.observe(ref.current);

        return () => {
            roRef.current?.disconnect();
            chart.dispose();
            chartRef.current = null;
        };
    }, []);

    useEffect(() => {
        latestValueRef.current = value;
        if (!chartRef.current) return;
        if (frameRef.current != null) return; // already scheduled
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            const v = latestValueRef.current;
            chartRef.current?.setOption(
                { series: [{ data: [{ value: v }] }, { data: [{ value: v }] }] },
                { lazyUpdate: true }
            );
        });
    }, [value]);

    useEffect(() => {
        if (!chartRef.current) return;
        const prev = prevBoundsRef.current;
        if (prev.min === min && prev.max === max) return;
        prevBoundsRef.current = { min, max };
        chartRef.current.setOption(
            {
                series: [
                    { min, max },
                    { min, max }
                ]
            },
            { lazyUpdate: true }
        );
    }, [min, max]);

    return <div ref={ref} style={{ width: "100%", height }} />;
};

export default AccelGauge;
