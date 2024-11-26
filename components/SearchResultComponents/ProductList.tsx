/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const fetchReviewsByProduct = async (productId: any) => {
	if (productId !== undefined) {
		try {
			const response = await fetch(
				`http://localhost:8080/api/reviews/product/${productId}`
			);
			const data = await response.json();
			return data; // Returns the array of reviews
		} catch (error) {
			console.error("Error fetching reviews:", error);
			return []; // Return empty array in case of error
		}
	} else {
		return [];
	}
};

const ProductList = ({ products }: { products: any }) => {
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
				// Assume fetchReviewsByProduct correctly fetches reviews for a given product ID
				const reviews = await fetchReviewsByProduct(product.productId);
				// Store the number of reviews instead of calculating an average
				counts[product.productId] = reviews.length;
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
				const reviews = await fetchReviewsByProduct(product.productId);
				const averageRating =
					reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) /
					reviews.length;
				ratings[product.productId] = isNaN(averageRating)
					? 0
					: Number(averageRating.toFixed(1));
			}
			setAverageRatings(ratings);
		};

		if (products.length > 0) {
			calculateAndSetRatings();
		}
	}, [products]);

	return (
		<div className="w-3/4 p-5">
			<div className="grid grid-cols-3 gap-4">
				{/* Map through products and display them */}
				{products.length > 0 ? (
					products.map((product: any) => (
						<div key={product.productId} className="group relative">
							<div className="w-full h-80 overflow-hidden rounded-md bg-gray-200">
								<img
									src={
										product.imageUrls.length
											? `http://localhost:8080${product.imageUrls[0]}`
											: "/blacktee.jpg"
									}
									alt={product.productName}
									className="w-full h-full object-cover object-center"
								/>
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
								<p className="text-sm font-medium text-gray-900">
									£{product.productPrice}
								</p>
							</div>
							<p className="mt-1 text-gray-500 text-sm">
								{product.productDescription?.split(" ").slice(0, 10).join(" ") +
									"..."}
							</p>
							{/* Rating component */}
							<div className="mt-1 flex items-center">
								{[...Array(5)].map((_, index) => (
									<svg
										key={index}
										className={`h-5 w-5 ${
											index < averageRatings[product.productId]
												? "fill-current text-gray-900 flex-shrink-0"
												: "fill-current text-gray-400"
										}`}
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
								<span className="ml-2">
									{reviewCounts[product.productId] > 0
										? `(${reviewCounts[product.productId]})`
										: "No Reviews"}
								</span>
							</div>
						</div>
					))
				) : (
					<div className="col-span-3 text-center">
						<p className="text-xl text-gray-600">No products found.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductList;
