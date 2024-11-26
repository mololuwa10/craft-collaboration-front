/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { PencilIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useFetchUserInfo } from "@/lib/data";

const ArtisanProfileHeader = () => {
	const { isLoggedIn, userDetails, userRole } = useFetchUserInfo();

	if (!userDetails) {
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
				{userDetails && (
					<img
						src={
							userDetails.artisanProfile?.storeBanner
								? `http://localhost:8080${userDetails.artisanProfile?.storeBanner}`
								: "/blacktee.jpg"
						}
						alt={userDetails?.artisanProfile?.storeName}
						className="object-cover object-center lg:h-[24rem] lg:w-full "
					/>
				)}
				<div className="flex justify-between items-center px-4 py-2 bg-[#FDF0E8] border-b border-[#DEDEDE] absolute bottom-0 w-full">
					<Link
						href="/Profile/ArtisanProfile/Edit"
						className="flex items-center text-sm px-6 py-3 bg-black rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
						<PencilIcon className="h-4 w-4 text-white mr-2" />
						<span className="text-white">Edit shop</span>
					</Link>
					<div className="hidden sm:block"></div>

					<Link href={"/ArtisanDashboard"}>
						<Button
							size={"lg"}
							className="bg-gray-800 hover:bg-gray-900 rounded-full">
							Go To Seller Dashboard
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default ArtisanProfileHeader;
