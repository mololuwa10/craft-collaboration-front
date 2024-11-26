/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { TopArtisanProfile } from "@/lib/dbModels";
import NewArtisans from "@/app/NewArtisans/page";
import NewArtisansGrid from "../NewArtisanComponents/NewArtisanGrid";
import ArtisanCard from "../NewArtisanComponents/ArtisanCard";
import TopSellerComponents from "./TopSellerComponent";

// Fetching top artisans asynchronously
const fetchTopArtisans = async () => {
	try {
		const response = await fetch(
			"http://localhost:8080/api/sales/top-artisans"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching top artisans:", error);
		throw error;
	}
};

export default function SellerStoreComponent() {
	const [topArtisans, setTopArtisans] = useState<TopArtisanProfile[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		setError(null);
		fetchTopArtisans().then(
			(artisans) => {
				setTopArtisans(artisans);
				setIsLoading(false);
			},
			(error) => {
				setError(error.message);
				setIsLoading(false);
			}
		);
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<div className="mt-[-90px]">
				<div className="mx-auto sm:px-6 sm:py-16 lg:px-8 lg:max-w-[88rem]">
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">
						Best Selling Store
					</h2>

					<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{topArtisans.map((artisan, index) => (
							<TopSellerComponents key={index} artisan={artisan} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}
