"use client";

import { useFetchProducts } from "@/lib/dbModels";
import styles from "./inventory.module.css";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Inventory() {
	interface Product {
		status: any;
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
	const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

	useEffect(() => {
		// Sort by dateTimeListed and take the latest 5 products
		const sortedProducts = [...products]
			.sort(
				(a, b) =>
					new Date(b.dateTimeListed).getTime() -
					new Date(a.dateTimeListed).getTime()
			)
			.slice(0, 5);

		// Add status based on the stock quantity
		const productsWithStatus = sortedProducts.map((product) => ({
			...product,
			status: getStatus(product.quantity),
		}));

		setDisplayProducts(productsWithStatus);
	}, [products]);

	// Function to determine the status based on the quantity
	const getStatus = (quantity: any) => {
		if (quantity === 0) {
			return { label: "Out of Stock", className: styles.outOfStock };
		} else if (quantity < 20) {
			return { label: "Low Stock", className: styles.lowStock };
		} else {
			return { label: "In Stock", className: styles.inStock };
		}
	};
	return (
		<>
			<div className={styles.container}>
				<h2 className={styles.title}>Inventory</h2>
				<h3 className="font-normal text-textSoft mb-[20px]">
					You can view and manage products, track sales, set up low stock alerts
					and generate reports on inventory levels
				</h3>
				<table className={styles.table}>
					<thead>
						<tr>
							<td className="font-bold">PRODUCT NAME</td>
							<td className="font-bold">PRODUCT ID</td>
							<td className="font-bold">CATEGORY</td>
							<td className="font-bold">PRICE</td>
							<td className="font-bold">STATUS</td>
							<td className="font-bold">QTY</td>
						</tr>
					</thead>
					<tbody>
						{displayProducts.map((product) => (
							<tr key={product.value}>
								<td>{product.label}</td>
								<td>{product.value}</td>
								<td>{product.category.categoryName}</td>{" "}
								<td>£{product.price.toFixed(2)}</td>
								<td>
									<span className={product.status.className}>
										{product.status.label}
									</span>
								</td>
								<td>{product.quantity}</td>
							</tr>
						))}
					</tbody>
				</table>
				<Link href={"/Dashboard/Products"}>
					<Button size={"lg"} className="my-4 bg-gray-700 hover:bg-gray-800">
						View More Products
					</Button>
				</Link>
			</div>
		</>
	);
}
