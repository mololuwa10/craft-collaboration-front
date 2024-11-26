"use client";

import {
	fetchAllArtisans,
	useFetchAllCategories,
	useFetchProducts,
} from "@/lib/dbModels";
import { useEffect, useState } from "react";

const FilterSidebar = ({
	products,
	filters,
	updateFilters,
}: {
	products: any;
	filters: any;
	updateFilters: any;
}) => {
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	interface ArtisanProfile {
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
	}

	const [filterInStock, setFilterInStock] = useState(false);
	const [filterOutOfStock, setFilterOutOfStock] = useState(false);
	// Calculate product availability
	const inStockCount = products.filter(
		(product: any) => product.productStockQuantity > 0
	).length;
	const outOfStockCount = products.length - inStockCount;

	// Filter products based on selection
	const filteredProducts = products.filter((product: any) => {
		if (filterInStock && !filterOutOfStock) {
			return product.productStockQuantity > 0;
		} else if (!filterInStock && filterOutOfStock) {
			return product.productStockQuantity <= 0;
		}
		return true; // If no filter is selected, show all products.
	});

	const handleInStockChange = () => {
		setFilterInStock(!filterInStock);
	};

	const handleOutOfStockChange = () => {
		setFilterOutOfStock(!filterOutOfStock);
	};

	// Fetch category data
	const { categories } = useFetchAllCategories() as unknown as {
		categories: Category[];
	};

	// fetch all artisan store name
	const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>([]);
	const [selectedArtisans, setSelectedArtisans] = useState(new Set());

	useEffect(() => {
		fetchAllArtisans()
			.then((fetchedArtisans) => {
				setAllArtisans(fetchedArtisans);
			})
			.catch((error) => {
				console.error("Error fetching artisans:", error);
			});
	}, []);

	const handleArtisanChangeDuplicate = (artisanId: any) => {
		const newArtisanIds = new Set(filters.artisanIds);
		if (newArtisanIds.has(artisanId)) {
			newArtisanIds.delete(artisanId);
		} else {
			newArtisanIds.add(artisanId);
		}
		console.log(
			`Toggling artisan ID: ${artisanId}, Current selection:`,
			Array.from(newArtisanIds)
		);
		updateFilters({ artisanIds: newArtisanIds });
	};

	const resetArtisanSelection = () => {
		updateFilters({ artisanIds: new Set() });
	};

	const handleCategoryChange = (categoryId: any) => {
		const newCategoryIds = new Set(filters.categoryIds);
		if (newCategoryIds.has(categoryId)) {
			newCategoryIds.delete(categoryId);
		} else {
			newCategoryIds.add(categoryId);
		}
		console.log(
			`Toggling category ID: ${categoryId}, Current selection:`,
			Array.from(filters.categoryIds)
		);
		updateFilters({ ...filters, categoryIds: newCategoryIds });
	};

	const handleResetCategories = () => {
		const newFilters = { ...filters, categoryIds: new Set() };
		updateFilters(newFilters);
	};

	return (
		<aside className="w-1/4 p-5 bg-white rounded shadow">
			<div className="hidden space-y-4 lg:block">
				<div>
					<div className="flex justify-between">
						<p className="block text-lg font-medium text-gray-700 mb-6">
							Filters
						</p>

						{/* clear all button */}
						<button
							type="button"
							className="text-md mb-6 text-gray-900 underline underline-offset-4">
							Clear All
						</button>
					</div>

					<div className="mt-1 space-y-2">
						{/* Category */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> Categories </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700">
										{" "}
										{filters.categoryIds.size} Selected{" "}
									</span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4"
										onClick={handleResetCategories}>
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									{categories.map((category) => (
										<li key={category.value}>
											<label
												htmlFor={`Filter${category.label}`}
												className="inline-flex items-center gap-2">
												<input
													type="checkbox"
													id={`Filter${category.label}`}
													checked={filters.categoryIds.has(category.value)}
													onChange={() => handleCategoryChange(category.value)}
													className="size-5 rounded border-gray-300"
												/>

												<span className="text-sm font-medium text-gray-700">
													{category.label}
												</span>
											</label>
										</li>
									))}
								</ul>
							</div>
						</details>

						{/* Store name */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> Store name </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700">
										{" "}
										{filters.artisanIds.size} Selected{" "}
									</span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4"
										onClick={resetArtisanSelection}>
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									{allArtisans.map((artisan) => (
										<li key={artisan.artisanId}>
											<label
												htmlFor={`artisan-${artisan.artisanId}`}
												className="inline-flex items-center gap-2">
												<input
													type="checkbox"
													id={`artisan-${artisan.artisanId}`}
													checked={filters.artisanIds.has(artisan.artisanId)}
													onChange={() =>
														handleArtisanChangeDuplicate(artisan.artisanId)
													}
													className="size-5 rounded border-gray-300"
												/>
												<span className="text-sm font-medium text-gray-700">
													{artisan.storeName}
												</span>
											</label>
										</li>
									))}
								</ul>
							</div>
						</details>

						{/* Availability */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> Availability </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700"> 0 Selected </span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4">
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									<li>
										<label
											htmlFor="FilterInStock"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterInStock"
												checked={filterInStock}
												onChange={handleInStockChange}
												className="size-5 rounded border-gray-300"
											/>
											<span className="text-sm font-medium text-gray-700">
												In Stock ({inStockCount})
											</span>
										</label>
									</li>
									<li>
										<label
											htmlFor="FilterOutOfStock"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterOutOfStock"
												checked={filterOutOfStock}
												onChange={handleOutOfStockChange}
												className="size-5 rounded border-gray-300"
											/>
											<span className="text-sm font-medium text-gray-700">
												Out of Stock ({outOfStockCount})
											</span>
										</label>
									</li>
								</ul>
							</div>
						</details>

						{/* Price */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> Price </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700">
										{" "}
										The highest price is $600{" "}
									</span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4">
										Reset
									</button>
								</header>

								<div className="border-t border-gray-200 p-4">
									<div className="flex justify-between gap-4">
										<label
											htmlFor="FilterPriceFrom"
											className="flex items-center gap-2">
											<span className="text-sm text-gray-600">$</span>

											<input
												type="number"
												id="FilterPriceFrom"
												placeholder="From"
												className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
											/>
										</label>

										<label
											htmlFor="FilterPriceTo"
											className="flex items-center gap-2">
											<span className="text-sm text-gray-600">$</span>

											<input
												type="number"
												id="FilterPriceTo"
												placeholder="To"
												className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
											/>
										</label>
									</div>
								</div>
							</div>
						</details>

						{/* Deals and discount */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium">
									{" "}
									Deals and Discounts{" "}
								</span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700"> 0 Selected </span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4">
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									<li>
										<label
											htmlFor="FilterRed"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterRed"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Red{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterBlue"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterBlue"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Blue{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterGreen"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterGreen"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Green{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterOrange"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterOrange"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Orange{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterPurple"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterPurple"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Purple{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterTeal"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterTeal"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Teal{" "}
											</span>
										</label>
									</li>
								</ul>
							</div>
						</details>

						{/* Rating */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> Rating </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700"> 0 Selected </span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4">
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									<li>
										<label
											htmlFor="FilterRed"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterRed"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Red{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterBlue"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterBlue"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Blue{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterGreen"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterGreen"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Green{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterOrange"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterOrange"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Orange{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterPurple"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterPurple"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Purple{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterTeal"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterTeal"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Teal{" "}
											</span>
										</label>
									</li>
								</ul>
							</div>
						</details>

						{/* New Arrivals */}
						<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
								<span className="text-sm font-medium"> New Arrivals </span>

								<span className="transition group-open:-rotate-180">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="h-4 w-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</span>
							</summary>

							<div className="border-t border-gray-200 bg-white">
								<header className="flex items-center justify-between p-4">
									<span className="text-sm text-gray-700"> 0 Selected </span>

									<button
										type="button"
										className="text-sm text-gray-900 underline underline-offset-4">
										Reset
									</button>
								</header>

								<ul className="space-y-1 border-t border-gray-200 p-4">
									<li>
										<label
											htmlFor="FilterRed"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterRed"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Red{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterBlue"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterBlue"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Blue{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterGreen"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterGreen"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Green{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterOrange"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterOrange"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Orange{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterPurple"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterPurple"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Purple{" "}
											</span>
										</label>
									</li>

									<li>
										<label
											htmlFor="FilterTeal"
											className="inline-flex items-center gap-2">
											<input
												type="checkbox"
												id="FilterTeal"
												className="size-5 rounded border-gray-300"
											/>

											<span className="text-sm font-medium text-gray-700">
												{" "}
												Teal{" "}
											</span>
										</label>
									</li>
								</ul>
							</div>
						</details>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default FilterSidebar;
