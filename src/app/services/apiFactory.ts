import axios from "axios";

const BASE_URL = "https://www.alphavantage.co/query";

const apiFactory = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const fetchStockData = async (symbol: string, apiKey: string) => {
	try {
		const response = await apiFactory.get("", {
			params: {
				function: "TIME_SERIES_INTRADAY",
				symbol,
				interval: "1min",
				apikey: apiKey,
			},
		});

		if (!response || !response.data) {
			throw new Error(`Invalid API response for symbol: ${symbol}`);
		}

		const timeSeries = response.data["Time Series (1min)"];
		if (!timeSeries || Object.keys(timeSeries).length === 0) {
			throw new Error(`No time series data available for symbol: ${symbol}`);
		}

		const latestTime = Object.keys(timeSeries)[0];
		const previousTime = Object.keys(timeSeries)[1];

		const latestData = timeSeries[latestTime];
		const previousData = timeSeries[previousTime];

		if (!latestData || !previousData) {
			throw new Error(`Incomplete time series data for symbol: ${symbol}`);
		}

		const price = Number.parseFloat(latestData["4. close"]);
		const previousClose = Number.parseFloat(previousData["4. close"]);

		if (Number.isNaN(price) || Number.isNaN(previousClose)) {
			throw new Error(`Invalid price data for symbol: ${symbol}`);
		}

		const change = (price - previousClose).toFixed(2);
		const percentageChange = ((Number(change) / previousClose) * 100).toFixed(
			2,
		);

		return {
			symbol,
			price: `$${price.toFixed(2)}`,
			change: Number(change) >= 0 ? `+${change}` : change,
			percentageChange:
				Number(change) >= 0 ? `+${percentageChange}%` : `${percentageChange}%`,
		};
	} catch (error) {
		console.error(`Error fetching stock data for symbol: ${symbol}`, error);
		throw new Error(
			error instanceof Error
				? error.message
				: `An unexpected error occurred while fetching data for symbol: ${symbol}`,
		);
	}
};
