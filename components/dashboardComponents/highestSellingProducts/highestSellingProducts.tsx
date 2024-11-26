/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-undef */
"use client";

import { highestSellingProducts } from "@/lib/dbModels";
import styles from "./highestSelling.module.css";
import React, { useEffect, useState } from "react";
export default function HighestSellingProducts() {
	interface Products {
		product: {
			productId: any;
			productName: string;
			imageUrls: string[];
		};
		imageUrl: string;
		totalOrders: number;
		totalQuantitySold: number;
	}

	const [productSales, setProductSales] = useState<Products[]>([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/orders/product-sales")
			.then((response) => response.json())
			.then((data) => {
				const enrichedData = data.map((sale: any) => {
					return {
						...sale,
						imageUrl: sale.product.images?.[0]?.imageUrl
							? `http://localhost:8080${sale.product.images[0].imageUrl}`
							: "/astronaut.png",
					};
				});
				setProductSales(enrichedData);
				console.log(data);
			})
			.catch((error) => {
				console.error("Failed to fetch product sales:", error);
			});
	}, []);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Highest Selling Products</h2>
			<div className={styles.productList}>
				{productSales.slice(0, 3).map((sale) => {
					return (
						<div key={sale.product.productId} className={styles.product}>
							<img
								src={sale.imageUrl}
								alt={sale.product.productName}
								className={styles.productImage}
							/>
							<div className={styles.productDetails}>
								<span className={styles.productName}>
									{sale.product.productName}
								</span>
								<span className={styles.sales}>{sale.totalQuantitySold}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
