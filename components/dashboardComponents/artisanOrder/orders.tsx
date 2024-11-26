"use client";

import Image from "next/image";
import styles from "./transactions.module.css";
import { Button } from "@/components/ui/button";
import { fetchOrdersByArtisan } from "@/lib/dbModels";
import { useEffect, useState } from "react";
import Link from "next/link";

const ArtisanOrders = () => {
	interface Order {
		[x: string]: any;
		id: number;
		totalPrice: number;
		status: string;
		orderDateTime: string;
		quantity: number;
		user: {
			userId: number;
			firstname: string;
			lastname: string;
			user_email: string;
			contactTelephone: string;
			contactAddress: string;
		};
		items: Array<{
			id: number;
			productName: string;
			quantity: number;
			priceAtOrder: number;
			productDTO: {
				productId: number;
				productDescription: string;
				productPrice: number;
				productStockQuantity: number;
				imageUrls: string[];
				dateTimeListed: string | null;
				dateTimeUpdated: string;
				productDiscount: number;
				category: any;
				artisanProfile: any;
			};
		}>;
	}

	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchOrdersByArtisan()
			.then((data) => {
				if (!Array.isArray(data)) {
					throw new Error("Data is not an array");
				}
				// Process each order and its items
				const processedOrders = data
					.map(({ order, orderDetails }) => {
						return orderDetails.map((item: any) => ({
							...item.productDTO,
							quantity: item.quantity,
							priceAtOrder: item.priceAtOrder,
							orderInfo: {
								id: order.id,
								totalPrice: order.totalPrice,
								status: order.status,
								orderDateTime: order.orderDateTime,
								user: order.user,
							},
						}));
					})
					.flat()
					.sort(
						(a, b) =>
							new Date(b.orderInfo.orderDateTime).getTime() -
							new Date(a.orderInfo.orderDateTime).getTime()
					);

				setAllOrders(processedOrders);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Latest Orders</h2>
			<table className={styles.table}>
				<thead>
					<tr>
						<td>Customer Name</td>
						<td>Product Name</td>
						<td>Status</td>
						<td>Date</td>
						<td>Amount</td>
					</tr>
				</thead>
				<tbody>
					{allOrders.slice(0, 4).map((item, index) => (
						<tr key={index}>
							<td>
								<div className={styles.user}>
									<Image
										src="/noavatar.png"
										alt=""
										width={40}
										height={40}
										className={styles.userImage}
									/>
									{item.orderInfo.user?.firstname || "Unknown"}{" "}
									{item.orderInfo.user?.lastname}
								</div>
							</td>
							<td>{item.productName}</td>
							<td>
								<span
									className={`${styles.status} ${
										styles[item.orderInfo.status.toLowerCase()]
									}`}>
									{item.orderInfo.status}
								</span>
							</td>
							<td>
								{new Date(item.orderInfo.orderDateTime).toLocaleDateString()}
							</td>
							<td>£{item.orderInfo.totalPrice.toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>
			<Link href={"/ArtisanDashboard/Orders"}>
				<Button size={"lg"} className="my-4 bg-gray-700 hover:bg-gray-800">
					View More Orders
				</Button>
			</Link>
		</div>
	);
};

export default ArtisanOrders;
