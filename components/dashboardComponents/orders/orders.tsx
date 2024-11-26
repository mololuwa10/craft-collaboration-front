"use client";

import Image from "next/image";
import styles from "./transactions.module.css";
import { Button } from "@/components/ui/button";
import { fetchAllOrders } from "@/lib/dbModels";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";

const Orders = () => {
	interface Order {
		[x: string]: any;
		id: string;
		totalPrice: number;
		status: string;
		orderDateTime: string;
		quantity: string;
		user: {
			firstname: string;
			lastname: string;
			user_email: string;
			phone: string;
			contactAddress: string;
			contactTelephone: string;
		};

		items: Array<{
			productDTO: {
				productId: string | number;
				productName: string;
				imageUrls: string[];
			};
			quantity: number;
			priceAtOrder: number;
		}>;
	}

	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchAllOrders()
			.then((data) => {
				// Flatten the items arrays from all orders into a single array
				const allItems = data.reduce((acc: any, order: any) => {
					const itemsWithOrderInfo = order.items.map((item: any) => ({
						...item,
						orderInfo: {
							id: order.id,
							totalPrice: order.totalPrice,
							status: order.status,
							orderDateTime: order.orderDateTime,
							user: order.user,
						},
					}));
					return [...acc, ...itemsWithOrderInfo];
				}, []);

				// Sort the orders based on the orderDateTime in descending order
				const sortedOrders = allItems.sort(
					(a: any, b: any) =>
						new Date(b.orderInfo.orderDateTime).getTime() -
						new Date(a.orderInfo.orderDateTime).getTime()
				);

				setAllOrders(sortedOrders);
				// setFilteredOrders(sortedOrders);
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
					{allOrders.slice(0, 4).map((item) => (
						<tr key={item.productDTO.productId + item.orderInfo.id}>
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
							<td>{item.productDTO.productName}</td>
							<td>
								<span className={`${styles.status} ${styles.pending}`}>
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
			<Link href={"/Dashboard/Orders"}>
				<Button size={"lg"} className="my-4 bg-gray-700 hover:bg-gray-800">
					View More Orders
				</Button>
			</Link>
		</div>
	);
};

export default Orders;
