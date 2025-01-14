import type { TimeSeries } from "@/app/services/types";
import mockAlphaVantageData from "./mockData";

export const fetchMockStockData = async (symbol: string) => {
	const mockStock = mockAlphaVantageData.find(
		(stock) => stock.symbol === symbol,
	);

	if (!mockStock) {
		return {
			symbol,
			price: "N/A",
			change: "N/A",
			percentageChange: "N/A",
			error: "Mock data not available for this symbol",
		};
	}

	const timeSeries: TimeSeries = mockStock["Time Series (1min)"];
	const latestTime = Object.keys(timeSeries)[0];
	const previousTime = Object.keys(timeSeries)[1];

	const latestData = timeSeries[latestTime];
	const previousData = timeSeries[previousTime];

	const price = Number.parseFloat(latestData["4. close"]);
	const previousClose = Number.parseFloat(previousData["4. close"]);
	const change = (price - previousClose).toFixed(2);
	const percentageChange = ((Number(change) / previousClose) * 100).toFixed(2);

	return {
		symbol,
		price: `$${price.toFixed(2)}`,
		change: Number(change) >= 0 ? `+${change}` : change,
		percentageChange:
			Number(change) >= 0 ? `+${percentageChange}%` : `${percentageChange}%`,
	};
};
