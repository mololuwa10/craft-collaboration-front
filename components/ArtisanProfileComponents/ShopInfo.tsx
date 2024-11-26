/* eslint-disable @next/next/no-img-element */
"use client";

import { useFetchUserInfo } from "@/lib/data";
import { MessageSquareMore } from "lucide-react";
import React from "react";

export default function ShopInfo() {
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
			{userDetails && (
				<>
					<div className="flex justify-between items-center p-4 mx-[1.5rem] my-[1.5rem]">
						{/* Shop image and name */}
						<div className="flex items-center space-x-4">
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
								<img
									src={
										userDetails.artisanProfile?.profilePicture
											? `http://localhost:8080${userDetails.artisanProfile?.profilePicture}`
											: "/blacktee.jpg"
									}
									alt={userDetails?.artisanProfile?.storeName}
									className="h-full w-full object-cover object-center lg:h-full lg:w-full"
								/>
							</div>
							<div className="flex flex-col">
								<h2 className="text-2xl font-semibold">
									{userDetails?.artisanProfile?.storeName}
								</h2>
								<button className="text-sm px-4 py-2 mt-2 bg-black text-white rounded-full hover:bg-gray-900">
									Follow shop
								</button>
							</div>
						</div>

						{/* Shop owner and contact */}
						<div className="flex items-center space-x-2">
							<div className="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
								<img
									src={
										userDetails.artisanProfile?.profilePicture
											? `http://localhost:8080${userDetails.artisanProfile?.profilePicture}`
											: "/blacktee.jpg"
									}
									alt={userDetails?.artisanProfile?.storeName}
									className="h-full w-full object-cover object-center lg:h-full lg:w-full"
								/>{" "}
							</div>
							<div className="flex flex-col items-end">
								<p className="text-lg font-semibold">
									{userDetails.user.firstname}
								</p>
								<button className="flex items-center text-blue-600 hover:underline text-sm">
									<MessageSquareMore className="h-4 w-4 mr-1" />
									Contact
								</button>
							</div>
						</div>
					</div>

					<div className="p-4 mx-[1.5rem] ">
						<h2 className="text-xl font-semibold">About the shop</h2>
						<p>{userDetails.artisanProfile?.bio}</p>
					</div>

					<div className="p-4 mx-[1.5rem]">
						<h2 className="text-xl font-semibold">Business Hours</h2>
						<p>{userDetails.artisanProfile?.businessHours}</p>
					</div>
				</>
			)}
		</>
	);
}
