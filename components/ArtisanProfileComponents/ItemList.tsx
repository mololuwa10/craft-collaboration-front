/* eslint-disable @next/next/no-img-element */
"use client";

import { SearchIcon } from "@heroicons/react/outline";
import { MailOpen } from "lucide-react";
import React, { useState, useEffect } from "react";
import { fetchProductsByArtisanId } from "@/lib/dbModels";
import { useFetchUserInfo } from "@/lib/data";
import { Heart, Star } from "lucide-react";
import Link from "next/link";

const ItemList = () => {
	interface Product {
		productId: number;
		productName: string;
		productDescription: string;
		productPrice: number;
		productDiscount: number;
		productStockQuantity: number;
		imageUrls: string[];
		category: {
			categoryId: number;
		};
		artisan: {
			artisanId: number;
		};
		dateTimeUpdated: string;
	}

	interface Review {
		reviewId: number;
		rating: number;
		comment: string;
		reviewDate: string;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
		products: {
			productId: number;
		};
	}

	const [artisanProducts, setArtisanProducts] = useState<Product[]>([]);
	const { userDetails } = useFetchUserInfo();

	const artisanId = userDetails?.artisanProfile?.artisanId ?? "";

	useEffect(() => {
		const fetchAndSetProducts = async () => {
			try {
				const products = await fetchProductsByArtisanId(artisanId);
				setArtisanProducts(products as Product[]);
			} catch (error) {
				console.error("Failed to fetch products:", error);
			}
		};

		if (artisanId) {
			fetchAndSetProducts();
		}
	}, [artisanId]);

	if (!artisanProducts) {
		return (
			<>
				<div className="flex justify-center items-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="text-xl font-bold p-4 mx-8 mt-4">Items</div>
			{/* Search Bar */}
			<div className="flex justify-between items-center p-4 mx-8">
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						className="pl-10 p-2 border border-gray-300 rounded-full"
						placeholder="Search items"
					/>
				</div>
				<div className="self-end">
					<label htmlFor="sort" className="text-sm font-medium mr-2">
						Sort:
					</label>
					<select id="sort" className="border border-gray-300 rounded">
						<option>Most Recent</option>
						{/* Include other sorting options here */}
					</select>
				</div>
			</div>
			<div className="flex justify-between p-4 mx-8 mb-10">
				{/* Left column for search and stats */}
				<div className="flex flex-col w-1/2 space-y-8">
					{/* Item stats */}
					<div className="space-y-8">
						<div className="flex items-center space-x-1">
							<span className="font-medium">All</span>
							<span className="font-bold">0</span>
						</div>
						<button className="flex items-center px-4 py-2 text-sm font-medium border-2 border-gray-700 rounded-full shadow">
							<MailOpen className="mr-2 -ml-1 w-4 h-4" />
							Contact shop owner
						</button>
						<div className="flex items-center space-x-1">
							<span className="font-medium">0 Sales</span>
						</div>
						<div className="flex items-center space-x-1">
							<span className="font-medium">0 Admirers</span>
						</div>
					</div>
				</div>

				{artisanProducts.length > 0 ? (
					<div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
						{artisanProducts.slice(0, 12).map((product) => (
							<div key={product.productId} className="group relative">
								<div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
									{product.productPrice &&
										product.productPrice > product.productDiscount && (
											<div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold py-1 px-2">
												{(
													((product.productPrice - product.productDiscount) /
														product.productPrice) *
													100
												).toFixed(0)}
												% Off
											</div>
										)}
									<img
										src={
											product.imageUrls
												? `http://localhost:8080${product.imageUrls[0]}`
												: "/blacktee.jpg"
										}
										alt={product.productName}
										className="h-full w-full object-cover object-center lg:h-full lg:w-full"
									/>

									<button className="absolute top-0 right-0 p-2">
										<svg
											className="w-6 h-6 text-gray-800"
											fill="none"
											stroke="currentColor">
											<Heart />
										</svg>
									</button>
								</div>
								<div className="mt-4 flex justify-between">
									<div>
										<h3 className="text-sm text-gray-700">
											<Link
												href={{
													pathname: "/ProductOverview",
													query: { productId: product.productId },
												}}>
												<span aria-hidden="true" className="absolute inset-0" />
												{product.productName}
											</Link>
										</h3>
									</div>
									<div>
										{/* Check if product has original price and if it's greater than the current price */}
										{typeof product.productPrice === "number" &&
											product.productPrice > product.productDiscount && (
												<div className="flex flex-col items-end">
													<span className="text-sm font-medium text-gray-900 line-through">
														£{product.productPrice.toFixed(2)}
													</span>
													<span className="text-sm font-medium text-gray-900">
														£{product.productDiscount.toFixed(2)}
													</span>
												</div>
											)}
										{/* If no original price or if it's not greater than current price, just show current price */}
										{(!product.productPrice ||
											product.productPrice <= product.productDiscount) && (
											<span className="text-sm font-medium text-gray-900">
												£{product.productDiscount.toFixed(2)}
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex items-center justify-start w-1/2">
						<div className="text-gray-400 mb-8">
							<svg
								className="w-32 h-32 mx-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-1m0-8h1m-1 1h-1m4 0h.01M12 12h1v1m0 4h-1m1-5h1m-4 0H8m0 0H7m0 0v1m0-1v-1m0 6h1m-1 0H7m0 0v1m0-1v-1"
								/>
							</svg>
							<p className="text-lg">No items listed at this time</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ItemList;
