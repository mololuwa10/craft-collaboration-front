"use client";

import React from "react";
import { ArtisanProfile } from "@/lib/dbModels";

const Announcement = ({ artisan }: { artisan: ArtisanProfile }) => {
	if (!artisan) {
		return (
			<>
				<div className="flex justify-center items-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			</>
		);
	}

	return (
		<>
			{artisan ? (
				<div className="flex justify-content space-x-20 items-center p-4 mx-8">
					<div>
						<h2 className="text-lg font-semibold">Announcement</h2>
						<p className="text-sm text-gray-500">
							Last updated on 26 Mar, 2024
						</p>
					</div>
					<p className="text-sm">{artisan.announcements}</p>
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			)}
		</>
	);
};

export default Announcement;
