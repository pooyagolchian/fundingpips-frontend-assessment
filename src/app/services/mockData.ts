import type { MockStock } from "@/app/services/types";

const mockAlphaVantageData: MockStock[] = [
	{
		symbol: "AAPL",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "150.50" },
			"2025-01-14 15:59:00": { "4. close": "150.25" },
		},
	},
	{
		symbol: "TSLA",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "750.00" },
			"2025-01-14 15:59:00": { "4. close": "748.50" },
		},
	},
	{
		symbol: "GOOGL",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "2800.00" },
			"2025-01-14 15:59:00": { "4. close": "2795.00" },
		},
	},
	{
		symbol: "MSFT",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "310.00" },
			"2025-01-14 15:59:00": { "4. close": "308.50" },
		},
	},
	{
		symbol: "AMZN",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "3400.00" },
			"2025-01-14 15:59:00": { "4. close": "3398.00" },
		},
	},
	{
		symbol: "NFLX",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "650.00" },
			"2025-01-14 15:59:00": { "4. close": "648.75" },
		},
	},
	{
		symbol: "NVDA",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "220.00" },
			"2025-01-14 15:59:00": { "4. close": "218.50" },
		},
	},
	{
		symbol: "META",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "350.00" },
			"2025-01-14 15:59:00": { "4. close": "348.75" },
		},
	},
	{
		symbol: "BABA",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "150.00" },
			"2025-01-14 15:59:00": { "4. close": "149.50" },
		},
	},
	{
		symbol: "DIS",
		"Time Series (1min)": {
			"2025-01-14 16:00:00": { "4. close": "120.00" },
			"2025-01-14 15:59:00": { "4. close": "119.75" },
		},
	},
];

export default mockAlphaVantageData;
