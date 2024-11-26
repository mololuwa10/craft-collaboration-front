"use client";

import Card from "@/components/dashboardComponents/card/card";
// import { cards } from "@/lib/data";
import styles from "@/components/dashboardComponents/dashboard.module.css";
import Chart from "@/components/dashboardComponents/chart/chart";
import Orders from "@/components/dashboardComponents/orders/orders";
import { useState, useEffect } from "react";
import { fetchAllOrders, useFetchUsers } from "@/lib/dbModels";
import { useFetchProducts } from "@/lib/dbModels";
import { LanguageProvider } from "../LanguageContext";
import { useFetchUserInfo } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Inventory from "@/components/dashboardComponents/inventory/inventory";
import HighestSellingProducts from "@/components/dashboardComponents/highestSellingProducts/highestSellingProducts";

const Dashboard = () => {
	const [usersData, setUsersData] = useState({
		currentWeek: 0,
		previousWeek: 0,
		change: 0,
	});

	const [productsData, setProductsData] = useState({
		currentWeek: 0,
		previousWeek: 0,
		productChange: 0,
	});

	const [revenueData, setRevenueData] = useState({
		totalSales: 0,
		percentageChange: 0,
	});

	interface User {
		userId: number;
		username: string;
		user_email: string;
		userPassword: string;
		firstname: string;
		lastname: string;
		dateJoined: string;
		contactTelephone: string;
		contactAddress: string;
		authorities: {
			authority: string;
		}[];
	}

	// Fetch user data
	const { users } = useFetchUsers() as { users: User[] };

	interface Product {
		value: number;
		label: string;
		description: string;
		price: number;
		quantity: number;
		image: string;
		discount: number;
		dateTimeListed: string;
		dateTimeUpdated: string;
		category: any;
		artisan: any;
	}

	// Fetch product data
	const { products } = useFetchProducts() as { products: Product[] };

	useEffect(() => {
		const now = new Date();
		const startOfCurrentWeek = new Date(
			now.setDate(now.getDate() - now.getDay())
		);
		const startOfLastWeek = new Date(
			new Date(startOfCurrentWeek).setDate(startOfCurrentWeek.getDate() - 7)
		);

		// Calculating for users
		const currentWeekUsers = users.filter((user) => {
			const userJoinDate = new Date(user.dateJoined);
			return userJoinDate >= startOfCurrentWeek;
		}).length;

		const previousWeekUsers = users.filter((user) => {
			const userJoinDate = new Date(user.dateJoined);
			return (
				userJoinDate < startOfCurrentWeek && userJoinDate >= startOfLastWeek
			);
		}).length;

		const change =
			previousWeekUsers === 0
				? 100
				: parseFloat(
						(
							((currentWeekUsers - previousWeekUsers) / previousWeekUsers) *
							100
						).toFixed(2)
				  );

		setUsersData({
			currentWeek: currentWeekUsers,
			previousWeek: previousWeekUsers,
			change,
		});

		const currentWeekProducts = products.filter((product) => {
			const productDateListed = new Date(product.dateTimeListed);
			return productDateListed >= startOfCurrentWeek;
		}).length;

		const previousWeekProducts = products.filter((product) => {
			const productDateListed = new Date(product.dateTimeListed);
			return (
				productDateListed < startOfCurrentWeek &&
				productDateListed >= startOfLastWeek
			);
		}).length;

		const productChange =
			previousWeekProducts === 0
				? 100
				: parseFloat(
						(
							((currentWeekProducts - previousWeekProducts) /
								previousWeekProducts) *
							100
						).toFixed(2)
				  );

		setProductsData({
			currentWeek: currentWeekProducts,
			previousWeek: previousWeekProducts,
			productChange,
		});
	}, [users, products]);

	useEffect(() => {
		async function calculateRevenueMetrics() {
			try {
				const allOrders = await fetchAllOrders();
				// Calculate the total sales amount
				const totalSales = allOrders.reduce(
					(acc: any, order: any) => acc + order.totalPrice,
					0
				);
				const formattedTotalSales = totalSales.toFixed(2);

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
						? 100
						: ((totalCurrentWeekSales - totalPreviousWeekSales) /
								totalPreviousWeekSales) *
						  100;

				setRevenueData({
					totalSales: formattedTotalSales,
					percentageChange: parseFloat(percentageChange.toFixed(2)),
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
			title: "Total Users",
			number: users.length,
			change: usersData.change,
		},
		{
			id: 2,
			title: "Total Products",
			number: products.length,
			change: productsData.productChange,
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
				<Orders />
				<Chart />
				<HighestSellingProducts />
				<Inventory />
			</div>
		</div>
	);
};

export default Dashboard;
