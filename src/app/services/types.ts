export interface TimeSeries {
	[timestamp: string]: {
		"4. close": string;
	};
}

export interface MockStock {
	symbol: string;
	"Time Series (1min)": TimeSeries;
}
