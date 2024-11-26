"use client";

import Breadcrumb from "@/components/SearchResultComponents/Breadcrumb";
import FilterSidebar from "@/components/SearchResultComponents/FilterSidebar";
import ProductList from "@/components/SearchResultComponents/ProductList";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { useFetchSearchedProducts } from "@/lib/dbModels";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageProvider } from "../LanguageContext";

const SearchResults = () => {
	const searchParams = useSearchParams();
	const searchTerm = searchParams.get("query") ?? "";
	const [filters, setFilters] = useState({
		minPrice: "",
		maxPrice: "",
		minRating: "",
		categoryIds: new Set(),
		artisanIds: new Set(),
	});

	const updateFilters = (newFilters: any) => {
		console.log("Updating filters with: ", newFilters);
		setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
	};

	const { products } = useFetchSearchedProducts(searchTerm, filters);

	return (
		<>
			<LanguageProvider>
				<div className="container mx-auto">
					<Header />
					<Breadcrumb title={`Result for "${searchTerm}"`} />
					<div className="flex my-6">
						<FilterSidebar
							products={products}
							filters={filters}
							updateFilters={updateFilters}
						/>
						<ProductList products={products} />
					</div>
					<Footer />
				</div>
			</LanguageProvider>
		</>
	);
};

export default SearchResults;
