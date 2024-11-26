"use client";
import Card from "@/components/dashboardComponents/card/card";
// import { cards } from "@/lib/data";
import styles from "@/components/dashboardComponents/dashboard.module.css";
import Chart from "@/components/dashboardComponents/chart/chart";
import ArtisanOrders from "@/components/dashboardComponents/artisanOrder/orders";
import { fetchOrdersByArtisan } from "@/lib/dbModels";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
	const [ordersData, setOrdersData] = useState<{
		currentWeek: number;
		previousWeek: number;
		change: number | string;
	}>({
		currentWeek: 0,
		previousWeek: 0,
		change: 0,
	});

	const [revenueData, setRevenueData] = useState<{
		totalSales: number;
		percentageChange: number | string;
	}>({
		totalSales: 0,
		percentageChange: 0,
	});

	useEffect(() => {
		const fetchOrdersAndCalculate = async () => {
			const orders = await fetchOrdersByArtisan();
			const now = new Date();
			const startOfCurrentWeek = new Date(
				now.setDate(now.getDate() - now.getDay())
			);
			const startOfLastWeek = new Date(
				new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() - 7)
			);

			const currentWeekOrders = orders.filter((order: any) => {
				const orderDate = new Date(order.order.orderDateTime);
				return orderDate >= startOfCurrentWeek;
			}).length;
			const previousWeekOrders = orders.filter((order: any) => {
				const orderDate = new Date(order.order.orderDateTime);
				return orderDate < startOfCurrentWeek && orderDate >= startOfLastWeek;
			}).length;

			const change =
				previousWeekOrders === 0
					? currentWeekOrders > 0
						? "New Orders - No previous data"
						: 0
					: parseFloat(
							(
								((currentWeekOrders - previousWeekOrders) /
									previousWeekOrders) *
								100
							).toFixed(2)
					  );

			setOrdersData({
				currentWeek: currentWeekOrders,
				previousWeek: previousWeekOrders,
				change,
			});
		};

		fetchOrdersAndCalculate();
	}, []);

	useEffect(() => {
		async function calculateRevenueMetrics() {
			try {
				const allOrders = await fetchOrdersByArtisan();
				// Calculate the total sales amount
				const totalSales = allOrders.reduce((acc: any, orderWrapper: any) => {
					return acc + orderWrapper.order.totalPrice;
				}, 0);
				const formattedTotalSales = parseFloat(totalSales.toFixed(2));

				// Calculate the current date and the start dates of the current and previous weeks
				const now = new Date();
				const startOfCurrentWeek = new Date(
					now.setDate(now.getDate() - now.getDay())
				);
				const startOfLastWeek = new Date(
					new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() - 7)
				);

				// Calculate the total sales for the current and previous weeks
				const totalCurrentWeekSales = allOrders
					.filter((order: any) => {
						const orderDate = new Date(order.orderDateTime);
						return orderDate >= startOfCurrentWeek;
					})
					.reduce((acc: any, order: any) => acc + order.totalPrice, 0);

				const totalPreviousWeekSales = allOrders
					.filter((order: any) => {
						const orderDate = new Date(order.orderDateTime);
						return (
							orderDate < startOfCurrentWeek && orderDate >= startOfLastWeek
						);
					})
					.reduce((acc: any, order: any) => acc + order.totalPrice, 0);

				// Calculate the percentage change between the two weeks
				const percentageChange =
					totalPreviousWeekSales === 0
						? totalCurrentWeekSales > 0
							? "New Sales - No previous data"
							: 0
						: ((totalCurrentWeekSales - totalPreviousWeekSales) /
								totalPreviousWeekSales) *
						  100;

				const formattedPercentageChange =
					typeof percentageChange === "number"
						? parseFloat(percentageChange.toFixed(2))
						: percentageChange;

				setRevenueData({
					totalSales: formattedTotalSales,
					percentageChange: formattedPercentageChange,
				});
			} catch (error) {
				console.error("Error calculating revenue metrics:", error);
			}
		}

		calculateRevenueMetrics();
	}, []);

	const cards = [
		{
			id: 1,
			title: "New Orders",
			number: ordersData.currentWeek,
			change: ordersData.change,
		},
		{
			id: 2,
			title: "Messages",
			number: 8,
			change: 2,
		},
		{
			id: 3,
			title: "Revenue",
			number: revenueData.totalSales,
			change: revenueData.percentageChange,
		},
	];

	return (
		<div className={styles.wrapper}>
			<div className={styles.main}>
				<div className={styles.cards}>
					{cards.map((item) => (
						<Card item={item} key={item.id} />
					))}
				</div>
				<ArtisanOrders />
				<Chart />
			</div>
		</div>
	);
};

export default Dashboard;
