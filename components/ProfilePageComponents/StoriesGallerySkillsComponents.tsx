/* eslint-disable @next/next/no-img-element */
import { Button } from "../ui/button";
import { useFetchUserInfo } from "@/lib/data";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StoriesGallerySkillsComponents() {
	const { isLoggedIn, userRole, userDetails } = useFetchUserInfo();

	interface UserDetails {
		user: {
			userId: number;
			firstname: string;
			lastname: string;
			user_email: string;
			username: string;
			password: string | null;
			bankAccountNo: string | null;
			bankSortCode: string | null;
			contactTelephone: string;
			contactAddress: string;
			authorities: { roleId: number; authority: string }[];
			dateJoined: Date | string;
		};
		artisanProfile: {
			artisanId: number;
			bio: string | null;
			profilePicture: string | null;
			location: string | null;
			storeName: string | null;
			gallery: [string];
		};
	}

	if (!isLoggedIn || (userRole !== "ADMIN" && userRole !== "ARTISAN")) {
		return null;
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-2xl text-gray-800 font-semibold mb-4">Gallery</h2>
					{/* Gallery images */}
					<div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-6">
						{userDetails?.artisanProfile?.gallery?.map(
							(image: any, index: any) => (
								<div key={index} className="relative">
									<img
										src={`http://localhost:8080${image}`}
										alt={`Gallery Image ${index}`}
										className="w-full h-[30rem] object-cover rounded-lg"
									/>
									{/* <button className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 text-white px-2 py-1 rounded-md text-sm"> */}
									<Trash2 className="absolute top-2 right-2 text-black hover:text-white hover:border-2 hover:bg-black hover:rounded-md cursor-pointer px-2 py-1 rounded-md h-10 w-10" />
									{/* Delete */}
									{/* </button> */}
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</>
	);
}
