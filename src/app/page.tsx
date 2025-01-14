"use client";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { decrement, increment } from "@/app/store/slices/stockSlice";
import React from "react";

const Home = () => {
	const count = useAppSelector((state) => state.counter.value);
	const dispatch = useAppDispatch();
	return (
		<div>
			<h1>Count: {count}</h1>
			<button type="button" onClick={() => dispatch(increment())}>
				Increment
			</button>
			<button type="button" onClick={() => dispatch(decrement())}>
				Decrement
			</button>
		</div>
	);
};
export default Home;
