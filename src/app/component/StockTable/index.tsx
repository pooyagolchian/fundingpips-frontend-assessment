import { fetchMockStockData } from "@/app/services/mockService";
import type { AppDispatch, RootState } from "@/app/store";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addStock,
	removeStock,
	toggleFavorite,
} from "../../store/slices/stockSlice";

const StockTable = () => {
	const dispatch = useDispatch<AppDispatch>();
	const stockData = useSelector((state: RootState) => state.stock.stockData);
	const [searchInput, setSearchInput] = useState<string>("");
	const [filterInput, setFilterInput] = useState<string>("");
	const [toastMessage, setToastMessage] = useState<string | null>(null);

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
		setToastMessage(
			`${symbol} ${
				stockData.find((stock) => stock.symbol === symbol)?.favorite
					? "removed from favorites"
					: "added to favorites"
			}`,
		);
	};

	const filteredStockData = stockData.filter(
		(stock) =>
			stock?.symbol.toLowerCase().includes(filterInput.toLowerCase()) ||
			stock?.price.includes(filterInput) ||
			stock?.change.includes(filterInput) ||
			stock?.percentageChange.includes(filterInput),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeout = setTimeout(() => setToastMessage(null), 3000);
		return () => clearTimeout(timeout);
	}, [toastMessage]);

	return (
		<div className="container mx-auto mt-10">
			<h1 className="text-2xl font-bold mb-5 text-center">Stock Table</h1>

			{toastMessage && (
				<div className="fixed top-5 right-24 transform bg-blue-500 text-white px-4 py-2 rounded shadow">
					{toastMessage}
				</div>
			)}

			<div className="mb-5 flex items-center space-x-4">
				<input
					type="text"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					placeholder="Search stock symbols"
					className="border px-3 py-2 rounded w-full"
				/>
				<button
					type="button"
					onClick={() => {
						if (searchInput.trim())
							handleAddStock(searchInput.trim().toUpperCase()).then((r) => r);
						setSearchInput("");
					}}
					className="bg-blue-500 text-white px-4 py-2 rounded shadow"
				>
					Add
				</button>
				<input
					type="text"
					value={filterInput}
					onChange={(e) => setFilterInput(e.target.value)}
					placeholder="Filter table"
					className="border px-3 py-2 rounded w-full"
				/>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200 shadow-md rounded-lg">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left font-semibold">Symbol</th>
							<th className="px-4 py-2 text-left font-semibold">Price</th>
							<th className="px-4 py-2 text-left font-semibold">Change</th>
							<th className="px-4 py-2 text-left font-semibold">
								Percentage Change
							</th>
							<th className="px-4 py-2 text-left font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredStockData.map((stock) => (
							<tr key={stock.symbol}>
								<td className="px-4 py-2 border">{stock?.symbol}</td>
								<td className="px-4 py-2 border">{stock?.price}</td>
								<td className="px-4 py-2 border">{stock?.change}</td>
								<td className="px-4 py-2 border">{stock?.percentageChange}</td>
								<td className="px-4 py-2 border flex justify-center items-center">
									<StarIcon
										onClick={() => handleToggleFavorite(stock?.symbol)}
										className={`w-5 h-5 ${
											stock.favorite ? "text-yellow-500" : "text-gray-300"
										} cursor-pointer`}
									/>
									<XMarkIcon
										onClick={() => handleRemoveStock(stock.symbol)}
										className="w-5 h-5 text-red-500 cursor-pointer"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StockTable;
