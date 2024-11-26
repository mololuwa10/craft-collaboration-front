/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { ArtisanProfile, TopArtisanProfile } from "@/lib/dbModels";
import Link from "next/link";

const TopSellerComponents = ({ artisan }: { artisan: TopArtisanProfile }) => {
	return (
		<div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
			<img
				className="rounded-t-lg object-cover w-full h-48"
				src={
					`http://localhost:8080${artisan.artisan.profilePicture}` ||
					"/default-profile.jpg"
				}
				alt={artisan.artisan.storeName || undefined}
			/>
			<div className="p-5">
				<h5 className="text-gray-900 text-2xl font-semibold mb-2">
					{artisan.artisan.storeName}
				</h5>
				<p className="text-gray-700 text-base mb-4">{artisan.artisan.bio}</p>
				{/* Additional Artisan info */}
				<Link
					href={{
						pathname: "/ArtisanProfileOverview",
						query: { artisanId: artisan.artisan.artisanId },
					}}>
					<button className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
						View Full Profile
					</button>
				</Link>
			</div>
		</div>
	);
};

export default TopSellerComponents;
