/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { ArtisanProfile } from "@/lib/dbModels";

const ArtisanCard = ({ artisan }: { artisan: ArtisanProfile }) => {
	return (
		<div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
			<img
				className="rounded-t-lg object-fit w-full h-48"
				src={
					`http://localhost:8080${artisan.profilePicture}` ||
					"/default-profile.jpg"
				}
				alt={artisan.storeName || undefined}
			/>
			<div className="p-5">
				<h5 className="text-gray-900 text-2xl font-semibold mb-2">
					{artisan.storeName}
				</h5>
				<p className="text-gray-700 text-base mb-4">{artisan.bio}</p>
				{/* Additional Artisan info */}
				<button className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
					View Full Profile
				</button>
			</div>
		</div>
	);
};

export default ArtisanCard;
