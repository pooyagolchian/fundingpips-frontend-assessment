import {
	addStock,
	removeStock,
	toggleFavorite,
} from "@/app/store/slices/stockSlice";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import StockTable from "../app/component/StockTable";
import stockReducer from "../app/store/slices/stockSlice";

const mockFetchStockData = jest.fn();

jest.mock("../app/services/mockService", () => ({
	fetchMockStockData: (symbol: string) => mockFetchStockData(symbol),
}));
describe("StockTable Component", () => {
	let store: ReturnType<typeof configureStore>;

	beforeEach(() => {
		store = configureStore({
			reducer: {
				stock: stockReducer,
			},
		});

		jest.spyOn(store, "dispatch");
	});

	test("renders StockTable component", () => {
		render(
			<Provider store={store}>
				<StockTable />
			</Provider>,
		);

		expect(screen.getByText("Stock Table")).toBeInTheDocument();
	});

	test("adds a stock to the table", async () => {
		mockFetchStockData.mockResolvedValueOnce({
			symbol: "AAPL",
			price: "150",
			change: "+2",
			percentageChange: "+1.3%",
			favorite: false,
		});

		render(
			<Provider store={store}>
				<StockTable />
			</Provider>,
		);

		const input = screen.getByPlaceholderText("Search stock symbols");
		fireEvent.change(input, { target: { value: "AAPL" } });

		const addButton = screen.getByText("Add");
		fireEvent.click(addButton);

		await waitFor(() =>
			expect(store.dispatch).toHaveBeenCalledWith(
				addStock({
					symbol: "AAPL",
					price: "150",
					change: "+2",
					percentageChange: "+1.3%",
					favorite: false,
				}),
			),
		);

		expect(screen.getByText("AAPL added to the table")).toBeInTheDocument();
	});

	test("removes a stock from the table", () => {
		store.dispatch(
			addStock({
				symbol: "AAPL",
				price: "150",
				change: "+2",
				percentageChange: "+1.3%",
				favorite: false,
			}),
		);

		render(
			<Provider store={store}>
				<StockTable />
			</Provider>,
		);

		const removeButton = screen.getByTestId("remove-stock-icon");
		fireEvent.click(removeButton);

		expect(store.dispatch).toHaveBeenCalledWith(removeStock("AAPL"));
	});

	test("toggles favorite status of a stock", () => {
		store.dispatch(
			addStock({
				symbol: "AAPL",
				price: "150",
				change: "+2",
				percentageChange: "+1.3%",
				favorite: false,
			}),
		);

		render(
			<Provider store={store}>
				<StockTable />
			</Provider>,
		);

		const favoriteButton = screen.getByTestId("favorite-stock-icon");
		fireEvent.click(favoriteButton);

		expect(store.dispatch).toHaveBeenCalledWith(toggleFavorite("AAPL"));
	});

	test("displays toast messages", async () => {
		mockFetchStockData.mockResolvedValueOnce({
			symbol: "AAPL",
			price: "150",
			change: "+2",
			percentageChange: "+1.3%",
			favorite: false,
		});

		render(
			<Provider store={store}>
				<StockTable />
			</Provider>,
		);

		const input = screen.getByPlaceholderText("Search stock symbols");
		fireEvent.change(input, { target: { value: "AAPL" } });

		const addButton = screen.getByText("Add");
		fireEvent.click(addButton);

		await waitFor(() =>
			expect(screen.getByText("AAPL added to the table")).toBeInTheDocument(),
		);
	});
});
