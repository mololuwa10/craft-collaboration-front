/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { useFetchSubcategories, useFetchCategoryById } from "@/lib/dbModels";
import { useSearchParams } from "next/navigation";
import { LanguageProvider } from "../LanguageContext";

export default function Categories() {
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	interface FetchedCategory {
		categoryId: number;
		categoryName: string;
		categoryDescription: string;
		categoryImageUrl: string;
	}

	const searchParams = useSearchParams();
	const categoryId = searchParams.get("categoryId");

	// Fetch category data
	const { subcategories } = useFetchSubcategories(categoryId) as {
		subcategories: Category[];
	};

	// Fetch category data
	const { category } = useFetchCategoryById(categoryId) as {
		category: FetchedCategory | null;
	};

	if (category) {
		return (
			<>
				<LanguageProvider>
					<Header />
					<section key={category.categoryId} className="py-12">
						<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
							<header className="text-center">
								<h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
									{category.categoryName}
								</h2>

								<p className="mx-auto mt-4 max-w-md text-gray-500">
									{category.categoryDescription}
								</p>
							</header>

							<ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{subcategories.map((subCategoryItem) => (
									<li key={subCategoryItem.value}>
										<a href="#" className="group block overflow-hidden">
											<img
												src={
													subCategoryItem.image
														? `http://localhost:8080${subCategoryItem.image}`
														: "/blacktee.jpg"
												}
												alt=""
												className="w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
											/>

											<div className="relative bg-white pt-3">
												<h3 className="text-lg text-gray-700 group-hover:underline group-hover:underline-offset-4">
													{subCategoryItem.label}
												</h3>
											</div>
										</a>
									</li>
								))}
							</ul>
						</div>
					</section>

					<hr className=" mx-20 border-t-2 border-gray-600" />

					<Footer />
				</LanguageProvider>
			</>
		);
	} else {
		// Handle the case when category is null or not found
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}
}
