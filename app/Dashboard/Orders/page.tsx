"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchAllOrders } from "@/lib/dbModels";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Orders() {
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
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage, setOrdersPerPage] = useState(10);

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

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const totalPages = Math.ceil(allOrders.length / ordersPerPage);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<LanguageProvider>
				<Table>
					<TableCaption>Order List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Order Id</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Order Date and Time</TableHead>
							<TableHead>Order Status</TableHead>
							<TableHead>Total Price</TableHead>
							<TableHead>Item Ordered</TableHead>
							<TableHead>Shipping Address</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentOrders.map((allOrders) => (
							<>
								<TableRow
									key={allOrders.productDTO.productId + allOrders.orderInfo.id}>
									<TableCell>{allOrders.orderInfo.id}</TableCell>
									<TableCell>
										{allOrders.orderInfo.user?.firstname || "Unknown"}{" "}
										{allOrders.orderInfo.user?.lastname}
									</TableCell>
									<TableCell>
										{new Date(
											allOrders.orderInfo.orderDateTime
										).toLocaleDateString()}
									</TableCell>
									<TableCell>{allOrders.orderInfo.status}</TableCell>
									<TableCell>
										£{allOrders.orderInfo.totalPrice.toFixed(2)}
									</TableCell>
									<TableCell>
										{allOrders.productDTO.productName} ({allOrders.quantity})
									</TableCell>
									<TableCell>
										{allOrders.orderInfo.user.contactAddress ||
											"No address provided"}
									</TableCell>
									<TableCell>
										<div className="p-2 flex">
											<Link
												href={{
													pathname: "/Dashboard/Orders/Edit",
													query: { orderId: allOrders.orderInfo.id },
												}}>
												<Button size={"lg"} className="mr-2 mb-2 flex">
													Edit
												</Button>
											</Link>
											<Button
												size={"lg"}
												// onClick={() => handleDelete(product.value)}
												className="mr-2 mb-2 flex">
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							</>
						))}
					</TableBody>
				</Table>

				<PaginationComponent
					totalPages={totalPages}
					currentPage={currentPage}
					paginate={(pageNumber) => setCurrentPage(pageNumber)}
				/>
			</LanguageProvider>
		</>
	);
}
