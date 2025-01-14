import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface StockData {
	symbol: string;
	price: string;
	change: string;
	percentageChange: string;
	favorite?: boolean;
}

interface StockState {
	stockData: StockData[];
}

const initialState: StockState = {
	stockData: [],
};

const stockSlice = createSlice({
	name: "stock",
	initialState,
	reducers: {
		addStock: (state, action: PayloadAction<StockData>) => {
			const exists = state.stockData.some(
				(stock) => stock.symbol === action.payload.symbol,
			);
			if (!exists) {
				state.stockData.push(action.payload);
			}
		},
		removeStock: (state, action: PayloadAction<string>) => {
			state.stockData = state.stockData.filter(
				(stock) => stock.symbol !== action.payload,
			);
		},
		toggleFavorite: (state, action: PayloadAction<string>) => {
			state.stockData = state.stockData.map((stock) =>
				stock.symbol === action.payload
					? { ...stock, favorite: !stock.favorite }
					: stock,
			);
		},
	},
});

export const { addStock, removeStock, toggleFavorite } = stockSlice.actions;
export default stockSlice.reducer;
