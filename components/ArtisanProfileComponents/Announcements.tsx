"use client";

import React from "react";
import { useFetchUserInfo } from "@/lib/data";

const Announcement = () => {
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
				<div className="flex justify-content space-x-20 items-center p-4 mx-8">
					<div>
						<h2 className="text-lg font-semibold">Announcement</h2>
						<p className="text-sm text-gray-500">
							Last updated on 26 Mar, 2024
						</p>
					</div>
					<p className="text-sm">
						{userDetails?.artisanProfile?.announcements}
					</p>
				</div>
			)}
		</>
	);
};

export default Announcement;
