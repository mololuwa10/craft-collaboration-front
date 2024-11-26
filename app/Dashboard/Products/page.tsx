/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { useFetchProducts } from "@/lib/dbModels";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { deleteProduct } from "@/lib/auth";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Products() {
	interface Product {
		value: number;
		label: string;
		description: string;
		price: number;
		quantity: number;
		image: string;
		discount: number;
		dateTimeUpdated: string;
		category: any;
		artisan: any;
	}

	// Fetch product data
	const { products } = useFetchProducts() as { products: Product[] };
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const itemsPerPage = 10;

	const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(products.length / itemsPerPage);

	// Filter products handler
	const filteredProducts = currentItems.filter((product) => {
		return product.label.toLowerCase().includes(searchTerm.toLowerCase());
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

	return (
		<>
			<LanguageProvider>
				<Link href="/Dashboard/Products/Add">
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
							<TableHead>Artisan Profile</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProducts.map((product) => (
							<>
								<TableRow key={product.value}>
									<TableCell>{product.value}</TableCell>
									<TableCell>{product.label}</TableCell>
									<TableCell>{product.description.slice(0, 30)}</TableCell>
									<TableCell>{product.price.toFixed(2)}</TableCell>
									<TableCell>{product.quantity}</TableCell>
									<TableCell>{product.discount}</TableCell>
									<TableCell>{product.dateTimeUpdated}</TableCell>
									<TableCell>{product.category.categoryId}</TableCell>
									<TableCell>{product.artisan.artisanId}</TableCell>

									<TableCell>
										<div className="p-2 flex">
											<Link
												href={{
													pathname: "/Dashboard/Products/Edit",
													query: { productId: product.value },
												}}
											>
												<Button size={"lg"} className="mr-2 mb-2 flex">
													Edit
												</Button>
											</Link>
											<Button
												size={"lg"}
												onClick={() => handleDelete(product.value)}
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
