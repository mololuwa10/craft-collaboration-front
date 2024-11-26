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
import { useFetchCategories } from "@/lib/dbModels";
import Link from "next/link";
import { useState } from "react";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { Input } from "@/components/ui/input";

import { deleteCategory } from "@/lib/auth";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Category() {
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	// Fetch category data
	const { categories } = useFetchCategories() as { categories: Category[] };
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingCategoryId, setEditingCategoryId] = useState<
		string | number | null
	>(null);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryDescription, setNewCategoryDescription] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);

	const handleSaveEdit = async (categoryId: any) => {
		// Prepare form data
		const formData = new FormData();
		formData.append(
			"category",
			JSON.stringify({
				categoryName: newCategoryName,
				categoryDescription: newCategoryDescription,
			})
		);
		if (selectedImage) {
			formData.append("image", selectedImage);
		}

		try {
			const response = await fetch(
				`https://dissertation-project-backend-b9bee012d5f1.herokuapp.com/api/categories/${categoryId}`,
				{
					method: "PUT",
					body: formData,
				}
			);

			if (response.ok) {
				alert("Category Updated Successfully");
				window.location.reload();
				setEditingCategoryId(null);
			} else {
				// Handle error response
				console.error("Failed to update category");
			}
		} catch (error) {
			console.error("Error updating category:", error);
		}
	};

	const itemsPerPage = 10;

	const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(categories.length / itemsPerPage);

	// Filter category handler
	const filteredCategories = currentItems.filter((cat) => {
		return cat.label.toLowerCase().includes(searchTerm.toLowerCase());
	});

	// Handling delete Category
	const handleDelete = async (categoryId: any) => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this category?"
		);
		if (!confirmation) {
			return;
		}

		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				throw new Error("Authentication token not found.");
			}

			await deleteCategory(categoryId, jwt);
			alert("Category deleted successfully");
			window.location.reload();
		} catch (error) {
			console.error("Error deleting category:", error);
			alert("Failed to delete category");
		}
	};

	return (
		<>
			<LanguageProvider>
				<Link href="/Dashboard/Category/Add">
					<Button size={"lg"} className="my-4">
						+ Add Category
					</Button>
				</Link>

				<Input
					className="mb-5 w-64 rounded border border-black text-black"
					placeholder="Filter by category details..."
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Table>
					<TableCaption>Category List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Category Id</TableHead>
							<TableHead>Category Name</TableHead>
							<TableHead>Category Description</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredCategories.map((category) => (
							<TableRow key={category.value}>
								<TableCell>{category.value}</TableCell>
								<TableCell>
									{editingCategoryId === category.value ? (
										<Input
											value={newCategoryName}
											onChange={(e) => setNewCategoryName(e.target.value)}
											className="text-black"
										/>
									) : (
										category.label
									)}
								</TableCell>
								<TableCell>
									{editingCategoryId === category.value ? (
										<Input
											value={newCategoryDescription}
											onChange={(e) =>
												setNewCategoryDescription(e.target.value)
											}
											className="text-black"
										/>
									) : (
										category.description
									)}
								</TableCell>
								<TableCell>
									<div className="p-2 flex">
										{editingCategoryId === category.value ? (
											<>
												<Button
													onClick={() => handleSaveEdit(category.value)}
													className="mr-2 mb-2 flex"
												>
													Save
												</Button>
												<Button onClick={() => setEditingCategoryId(null)}>
													Cancel
												</Button>
											</>
										) : (
											<Button
												onClick={() => {
													setEditingCategoryId(category.value);
													setNewCategoryName(category.label);
													setNewCategoryDescription(category.description);
												}}
												className="mr-2 mb-2 flex"
											>
												Edit
											</Button>
										)}
										<Button
											onClick={() => handleDelete(category.value)}
											className="hover:bg-gray-700"
										>
											Delete
										</Button>

										<Button className="hover:bg-gray-700 ml-2">
											<Link
												href={{
													pathname: "/Dashboard/Category/SubCategory",
													query: { categoryId: category.value },
												}}
											>
												View Sub Category
											</Link>
										</Button>
									</div>
								</TableCell>
							</TableRow>
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
