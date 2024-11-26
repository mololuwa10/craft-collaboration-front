"use client";

import { useFetchSubcategories, useFetchCategoryById } from "@/lib/dbModels";
import { useSearchParams } from "next/navigation";

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

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useState } from "react";
import { PaginationComponent } from "@/components/ui/PaginationDemo";
import { Input } from "@/components/ui/input";

import { deleteCategory } from "@/lib/auth";
import { LanguageProvider } from "@/app/LanguageContext";

export default function SubCategory() {
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	const searchParams = useSearchParams();
	const categoryId = searchParams.get("categoryId");
	const { subcategories } = useFetchSubcategories(categoryId) as {
		subcategories: Category[];
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingCategoryId, setEditingCategoryId] = useState<
		string | number | null
	>(null);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryDescription, setNewCategoryDescription] = useState("");

	const itemsPerPage = 10;

	const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = subcategories.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(subcategories.length / itemsPerPage);

	const filteredCategories = currentItems.filter((cat) => {
		return cat.label.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<>
			<LanguageProvider>
				<Link
					href={{
						pathname: "/Dashboard/Category/SubCategory/Add",
						query: { categoryId: categoryId },
					}}>
					<Button size={"lg"} className="my-4">
						+ Add Sub Category
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
													// onClick={() => handleSaveEdit(category.value)}
													className="mr-2 mb-2 flex">
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
												className="mr-2 mb-2 flex">
												Edit
											</Button>
										)}
										<Button
											// onClick={() => handleDelete(category.value)}
											className="hover:bg-gray-700">
											Delete
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
