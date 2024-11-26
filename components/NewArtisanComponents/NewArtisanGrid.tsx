"use client";

import { ArtisanProfile } from "@/lib/dbModels";
import ArtisanCard from "./ArtisanCard";
import React from "react";
import NewArtisansHeader from "./NewArtisanHeader";

const NewArtisansGrid = ({ artisans }: { artisans: ArtisanProfile[] }) => {
	return (
		<div className="container mx-auto mb-7 px-4 sm:px-6 lg:px-8 mt-8">
			<NewArtisansHeader />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{artisans.map((artisan, index) => (
					<ArtisanCard key={index} artisan={artisan} />
				))}
			</div>
		</div>
	);
};

export default NewArtisansGrid;
