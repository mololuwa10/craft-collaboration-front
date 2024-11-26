/* eslint-disable @next/next/no-img-element */
"use client";

import { useFetchProducts } from "@/lib/dbModels";
import { Button } from "../ui/button";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

// Convert fetching logic into a standalone async function
const fetchReviewsByProduct = async (productId: any) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/reviews/product/${productId}`
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return [];
	}
};

export default function TrendingSections() {
	// Product function to fetch data from the database
	interface Product {
		value: number;
		label: string;
		description: string;
		price: number;
		discount: number;
		quantity: number;
		image: string;
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

	const { products, isLoading: productsLoading } =
		useFetchProducts() as unknown as {
			products: Product[];
			isLoading: boolean;
		};
	const [reviewsLoading, setReviewsLoading] = useState(false);
	const [reviewCounts, setReviewCounts] = useState<{ [key: number]: number }>(
		{}
	);

	const [averageRatings, setAverageRatings] = useState<{
		[key: number]: number;
	}>({});

	useEffect(() => {
		const fetchAndCountReviews = async () => {
			const counts: { [key: number]: number } = {};
			for (const product of products) {
				const reviews = await fetchReviewsByProduct(product.value);

				counts[product.value] = reviews.length;
			}
			setReviewCounts(counts);
		};

		if (products.length > 0) {
			fetchAndCountReviews();
		}
	}, [products]);

	useEffect(() => {
		const calculateAndSetRatings = async () => {
			// Define the type of the ratings object
			const ratings: { [key: number]: number } = {};
			for (const product of products) {
				const reviews = await fetchReviewsByProduct(product.value);
				const averageRating =
					reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) /
					reviews.length;
				ratings[product.value] = isNaN(averageRating)
					? 0
					: Number(averageRating.toFixed(1));
			}
			setAverageRatings(ratings);
		};

		if (products.length > 0) {
			calculateAndSetRatings();
		}
	}, [products]);

	if (productsLoading || reviewsLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<>
			<div className="mt-[-90px]">
				<div className="mx-auto sm:px-6 sm:py-16 lg:px-8 lg:max-w-[88rem]">
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">
						Customers also purchased
					</h2>

					<div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
						{products.slice(0, 20).map((product) => (
							<div key={product.value} className="group relative">
								<div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
									{product.price && product.price > product.discount && (
										<div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold py-1 px-2">
											{(
												((product.price - product.discount) / product.price) *
												100
											).toFixed(0)}
											% Off
										</div>
									)}
									<img
										src={
											product.image
												? `http://localhost:8080${product.image}`
												: "/blacktee.jpg"
										}
										alt={product.label}
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
													query: { productId: product.value },
												}}>
												<span aria-hidden="true" className="absolute inset-0" />
												{product.label}
											</Link>
										</h3>
									</div>
									<div>
										{/* Check if product has original price and if it's greater than the current price */}
										{product.price && product.price > product.discount && (
											<div className="flex flex-col items-end">
												<span className="text-sm font-medium text-gray-900 line-through">
													£{product.price.toFixed(2)}
												</span>
												<span className="text-sm font-medium text-gray-900">
													£
													{product.discount !== null
														? product.discount.toFixed(2)
														: product.price.toFixed(2)}
												</span>
											</div>
										)}
										{/* If no original price or if it's not greater than current price, just show current price */}
										{!product.price ||
											product.price <= product.discount ||
											(product.discount === 0 && (
												<span className="text-sm font-medium text-gray-900">
													£{product.discount.toFixed(2)}
												</span>
											))}
									</div>
								</div>
								<p className="text-gray-500 text-sm mt-2">
									{product.description.split(" ").slice(0, 10).join(" ")}
								</p>
								<div className="mt-1 flex items-center">
									{[...Array(5)].map((_, index) => (
										<svg
											key={index}
											className={`h-5 w-5 ${
												index < averageRatings[product.value]
													? "fill-current text-gray-900 flex-shrink-0"
													: "fill-current text-gray-400"
											}`}
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
									<span className="ml-2">
										{reviewCounts[product.value] > 0
											? `(${reviewCounts[product.value]})`
											: "No Reviews"}
									</span>
								</div>
							</div>
						))}
					</div>
					<div>
						<Button
							size={"lg"}
							variant={"outline"}
							className="rounded-lg flex justify-center mt-4">
							View more
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
