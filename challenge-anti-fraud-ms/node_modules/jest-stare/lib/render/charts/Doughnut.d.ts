/// <reference types="jquery" />
/// <reference types="jquery" />
import { ChartConfiguration } from "chart.js";
import { IChartData } from "../doc/IChartData";
export declare class Doughnut {
    static createChart(canvas: JQuery<HTMLCanvasElement>, chartData: IChartData): void;
    static buildCanvas(canvas: HTMLCanvasElement, config: ChartConfiguration): void;
}
