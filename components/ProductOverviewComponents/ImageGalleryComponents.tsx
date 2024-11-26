/* eslint-disable @next/next/no-img-element */
"use client";

import { fetchProductById } from "@/lib/dbModels";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
	productId: number;
	productName: string;
	productDescription: string;
	productPrice: number;
	productStockQuantity: number;
	imageUrls: string[];
	productDiscount: number;
	category: {
		categoryId: number;
		categoryName: string;
	};
	artisanProfile: {
		artisanId: number;
		artisan: {
			userId: number;
			firstname: string;
			lastname: string;
		};
		bio: string;
		profilePicture: string;
		location: string;
		storeName: string;
	};
	dateTimeUpdated: string;
}

export default function ImageGalleryComponents() {
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId");
	const [product, setProduct] = useState<Product | null>(null);
	const [error, setError] = useState("");
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	useEffect(() => {
		if (productId) {
			fetchProductById(Number(productId))
				.then((fetchedProduct) => {
					setProduct(fetchedProduct);
				})
				.catch((err: Error) => {
					console.error(err);
					setError("Failed to fetch product details");
				});
		}
	}, [productId]);

	// Render a message if there is an error
	if (error) {
		return <p>{error}</p>;
	}

	// Render loading state if product is null
	if (!product) {
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
			<div className="w-full p-4">
				{/* Main Image Display */}
				<div className="mb-4">
					<img
						src={`http://localhost:8080${product.imageUrls[selectedImageIndex]}`}
						alt={`Product Image ${selectedImageIndex + 1}`}
						className="w-full h-auto object-center object-cover"
					/>
				</div>
				{/* Thumbnail Selector */}
				<div className="flex space-x-1 overflow-x-auto">
					{product.imageUrls.map((imageUrl, index) => (
						<button
							key={index}
							className={`focus:outline-none ${
								index === selectedImageIndex
									? "ring-2 ring-offset-2 ring-blue-500"
									: ""
							}`}
							onClick={() => setSelectedImageIndex(index)}>
							<img
								src={`http://localhost:8080${imageUrl}`}
								alt={`Product Image ${index + 1}`}
								className="w-24 h-24 object-center object-cover"
							/>
						</button>
					))}
				</div>
			</div>
		</>
	);
}
