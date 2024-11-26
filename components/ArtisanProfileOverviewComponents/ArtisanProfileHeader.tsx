/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";

import { ArtisanProfile, fetchArtisanById } from "@/lib/dbModels";

const ArtisanProfileHeader = ({
	newArtisan,
}: {
	newArtisan: ArtisanProfile | null;
}) => {
	if (!newArtisan) {
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
			<div className="relative">
				{/* Shop Banner Image */}
				{newArtisan ? (
					<img
						src={
							newArtisan.storeBanner
								? `http://localhost:8080${newArtisan.storeBanner}`
								: "/blacktee.jpg"
						}
						alt={newArtisan.storeName || "Artisan Store"}
						className="object-cover object-center lg:h-[24rem] lg:w-full"
					/>
				) : (
					<div className="flex justify-center items-center h-screen">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
					</div>
				)}
			</div>
		</>
	);
};

export default ArtisanProfileHeader;
