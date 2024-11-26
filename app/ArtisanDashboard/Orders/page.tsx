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
import Link from "next/link";
import { fetchOrdersByArtisan } from "@/lib/dbModels";
import { useEffect, useState } from "react";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Orders() {
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
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage, setOrdersPerPage] = useState(10);

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

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const totalPages = Math.ceil(allOrders.length / ordersPerPage);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<LanguageProvider>
				<Table className="my-6">
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
						{currentOrders.map((allOrders, index) => (
							<>
								<TableRow key={index}>
									<TableCell>
										{" "}
										{/*{allOrders.orderInfo.id}  */} {index + 1}
									</TableCell>
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
										{allOrders.productName} ({allOrders.quantity})
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
