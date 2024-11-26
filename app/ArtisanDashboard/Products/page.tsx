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
import { fetchProductsByArtisanId } from "@/lib/dbModels";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { deleteProduct } from "@/lib/auth";
import { useFetchUserInfo } from "@/lib/data";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Products() {
	interface Product {
		productId: number;
		productName: string;
		productDescription: string;
		productPrice: number;
		productStockQuantity: number;
		imageUrls: string;
		productDiscount: number;
		dateTimeUpdated: string;
		category: any;
		artisanProfile: any;
	}

	const { userDetails } = useFetchUserInfo();
	const [artisanProducts, setArtisanProducts] = useState([]);
	const artisanId = userDetails?.artisanProfile?.artisanId ?? "";

	useEffect(() => {
		const fetchAndSetProducts = async () => {
			try {
				const products = await fetchProductsByArtisanId(artisanId);
				setArtisanProducts(products);
			} catch (error) {
				console.error("Failed to fetch products:", error);
			}
		};

		fetchAndSetProducts();
	}, [artisanId]);

	// Fetch product data
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const itemsPerPage = 10;

	const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems: Product[] = artisanProducts.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	const totalPages = Math.ceil(artisanProducts.length / itemsPerPage);

	// Filter products handler
	const filteredProducts = currentItems.filter((product) => {
		return (
			product.productName &&
			product.productName.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	// Handling delete Product
	const handleDelete = async (productId: any) => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this product?"
		);
		if (!confirmation) {
			return;
		}

		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				throw new Error("Authentication token not found.");
			}

			await deleteProduct(productId, jwt);
			alert("Product deleted successfully");
			window.location.reload();
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete product");
		}
	};

	// Handling Edit Product

	return (
		<>
			<LanguageProvider>
				<Link href="/ArtisanDashboard/Products/Add">
					<Button size={"lg"} className="my-4">
						+ Add Product
					</Button>
				</Link>

				<Input
					className="mb-5 w-64 rounded border border-black text-black"
					placeholder="Filter by product details..."
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<Table>
					<TableCaption>Product List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Product Id</TableHead>
							<TableHead>Product Name</TableHead>
							<TableHead>Product Description</TableHead>
							<TableHead>Product Price</TableHead>
							<TableHead>Product Quantity</TableHead>
							<TableHead>Product Discount</TableHead>
							<TableHead>Product Date Updated</TableHead>
							<TableHead>Category Id</TableHead>
							<TableHead>Artisan</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProducts.map((product) => (
							<>
								<TableRow key={product.productId}>
									<TableCell>{product.productId}</TableCell>
									<TableCell>{product.productName}</TableCell>
									<TableCell>
										{product.productDescription
											.split(" ")
											.slice(0, 10)
											.join(" ")}
									</TableCell>
									<TableCell>{product.productPrice.toFixed(2)}</TableCell>
									<TableCell>{product.productStockQuantity}</TableCell>
									<TableCell>{product.productDiscount}</TableCell>
									<TableCell>
										{new Date(product.dateTimeUpdated).toLocaleDateString()}
									</TableCell>
									<TableCell>{product.category.categoryName}</TableCell>
									<TableCell>{product.artisanProfile.firstname}</TableCell>

									<TableCell>
										<div className="p-2 flex">
											<Link
												href={{
													pathname: "/ArtisanDashboard/Products/Edit",
													query: { productId: product.productId },
												}}
											>
												<Button size={"lg"} className="mr-2 mb-2 flex">
													Edit
												</Button>
											</Link>
											<Button
												size={"lg"}
												onClick={() => handleDelete(product.productId)}
												className="mr-2 mb-2 flex"
											>
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
					paginate={paginate}
					currentPage={currentPage}
				/>
			</LanguageProvider>
		</>
	);
}
