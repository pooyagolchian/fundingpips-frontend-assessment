import { fetchMockStockData } from "@/app/services/mockService";
import type { AppDispatch, RootState } from "@/app/store";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addStock,
	removeStock,
	toggleFavorite,
} from "../../store/slices/stockSlice";

interface StockData {
	symbol: string;
	price: string;
	change: string;
	percentageChange: string;
	favorite: boolean;
}

const StockTable = () => {
	const dispatch = useDispatch<AppDispatch>();
	const stockData = useSelector(
		(state: RootState) => state.stock.stockData,
	) as StockData[];
	const [searchInput, setSearchInput] = useState<string>("");
	const [filterInput, setFilterInput] = useState<string>("");
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof StockData;
		direction: string;
	} | null>(null);

	const popularSymbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"];

	const handleAddStock = async (symbol: string) => {
		const existingStock = stockData.find((stock) => stock.symbol === symbol);
		if (existingStock) {
			setToastMessage(`${symbol} is already in the table`);
			return;
		}
		const data = await fetchMockStockData(symbol);
		if (data.price !== "N/A") {
			dispatch(addStock(data));
			setToastMessage(`${symbol} added to the table`);
		} else {
			setToastMessage(`Failed to fetch data for ${symbol}`);
		}
	};

	const handleRemoveStock = (symbol: string) => {
		dispatch(removeStock(symbol));
		setToastMessage(`${symbol} removed from the table`);
	};

	const handleToggleFavorite = (symbol: string) => {
		dispatch(toggleFavorite(symbol));
		const isFavorite = stockData.find(
			(stock) => stock.symbol === symbol,
		)?.favorite;
		setToastMessage(
			`${symbol} ${isFavorite ? "removed from favorites" : "added to favorites"}`,
		);
	};

	const handleSort = (key: keyof StockData) => {
		let direction = "ascending";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const renderSortIcon = (key: keyof StockData) => {
		if (!sortConfig || sortConfig.key !== key) return null;
		return sortConfig.direction === "ascending" ? (
			<ArrowUpIcon className="w-4 h-4 inline-block ml-2 text-gray-500" />
		) : (
			<ArrowDownIcon className="w-4 h-4 inline-block ml-2 text-gray-500" />
		);
	};

	const sortedStockData = useMemo(() => {
		if (!sortConfig) return stockData;

		return [...stockData].sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key]) {
				return sortConfig.direction === "ascending" ? -1 : 1;
			}
			if (a[sortConfig.key] > b[sortConfig.key]) {
				return sortConfig.direction === "ascending" ? 1 : -1;
			}
			return 0;
		});
	}, [stockData, sortConfig]);

	const filteredStockData = sortedStockData.filter(
		(stock) =>
			stock.symbol.toLowerCase().includes(filterInput.toLowerCase()) ||
			stock.price.includes(filterInput) ||
			stock.change.includes(filterInput) ||
			stock.percentageChange.includes(filterInput),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeout = setTimeout(() => setToastMessage(null), 3000);
		return () => clearTimeout(timeout);
	}, [toastMessage]);

	return (
		<div className="container mx-auto mt-10 px-4">
			<h1 className="text-2xl font-bold mb-5 text-center text-gray-800">
				Stock Table
			</h1>

			{toastMessage && (
				<div className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-md">
					{toastMessage}
				</div>
			)}

			<div className="mb-5 flex items-center space-x-4">
				<input
					type="text"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					placeholder="Search stock symbols"
					className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="button"
					onClick={() => {
						if (searchInput.trim())
							handleAddStock(searchInput.trim().toUpperCase()).then((r) => r);
						setSearchInput("");
					}}
					className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
				>
					Add
				</button>
				<input
					type="text"
					value={filterInput}
					onChange={(e) => setFilterInput(e.target.value)}
					placeholder="Filter table"
					className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="mb-5">
				<p className="text-gray-700 mb-2">Popular Symbols:</p>
				<div className="flex space-x-2">
					{popularSymbols.map((symbol) => (
						<button
							type="button"
							key={symbol}
							onClick={() => handleAddStock(symbol)}
							className="bg-gray-100 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{symbol}
						</button>
					))}
				</div>
			</div>

			<div className="overflow-x-auto">
				<Suspense
					fallback={
						<div className="text-center text-gray-500 py-5">Loading...</div>
					}
				>
					{filteredStockData.length > 0 ? (
						<table className="min-w-full border border-gray-200 shadow-md rounded-lg">
							<thead className="bg-gray-100">
								<tr>
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
									<th
										className="px-4 py-2 text-left font-semibold cursor-pointer"
										onClick={() => handleSort("symbol")}
									>
										Symbol {renderSortIcon("symbol")}
									</th>
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
									<th
										className="px-4 py-2 text-left font-semibold cursor-pointer"
										onClick={() => handleSort("price")}
									>
										Price {renderSortIcon("price")}
									</th>
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
									<th
										className="px-4 py-2 text-left font-semibold cursor-pointer"
										onClick={() => handleSort("change")}
									>
										Change {renderSortIcon("change")}
									</th>
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
									<th
										className="px-4 py-2 text-left font-semibold cursor-pointer"
										onClick={() => handleSort("percentageChange")}
									>
										Percentage Change {renderSortIcon("percentageChange")}
									</th>
									<th className="px-4 py-2 text-left font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredStockData.map((stock) => (
									<tr key={stock.symbol} className="hover:bg-gray-50">
										<td className="px-4 py-2 border">{stock.symbol}</td>
										<td className="px-4 py-2 border">{stock.price}</td>
										<td className="px-4 py-2 border">{stock.change}</td>
										<td className="px-4 py-2 border">
											{stock.percentageChange}
										</td>
										<td className="px-4 py-3 border flex justify-center items-center space-x-2">
											<StarIcon
												data-testid="favorite-stock-icon"
												tabIndex={0}
												onClick={() => handleToggleFavorite(stock.symbol)}
												onKeyDown={(e) =>
													e.key === "Enter" &&
													handleToggleFavorite(stock.symbol)
												}
												className={`w-5 h-5 ${
													stock.favorite ? "text-yellow-500" : "text-gray-300"
												} cursor-pointer`}
											/>
											<XMarkIcon
												data-testid="remove-stock-icon"
												tabIndex={0}
												onClick={() => handleRemoveStock(stock.symbol)}
												onKeyDown={(e) =>
													e.key === "Enter" && handleRemoveStock(stock.symbol)
												}
												className="w-5 h-5 text-red-500 cursor-pointer"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="text-center text-gray-500 py-5">
							Enter stock symbols like AAPL, TSLA, etc.
						</div>
					)}
				</Suspense>
			</div>
		</div>
	);
};

export default StockTable;
