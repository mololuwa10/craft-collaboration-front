"use client";

import React, { useState, useEffect } from "react";
import { GetUserAddresses } from "@/lib/dbModels";
import AddressContent from "@/components/ProfilePageComponents/AddressPageComponents/AddressContent";
import Header from "@/components/layoutComponents/Header";
import Footer from "@/components/layoutComponents/Footer";
import { LanguageProvider } from "@/app/LanguageContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Addresses() {
	interface Addresses {
		addressId: number | null;
		country: string | null;
		postcode: string | null;
		addressLine1: string | null;
		addressLine2?: string | null;
		city: string | null;
		county?: string | null;
		default: boolean | null;
	}
	const userAddresses = GetUserAddresses();
	const [isLoading, setIsLoading] = useState(true);
	const [sortedAddresses, setSortedAddresses] = useState<Addresses[]>([]);

	useEffect(() => {
		if (userAddresses !== undefined) {
			// Sort the userAddresses based on the `isDefault` property
			const sorted = [...userAddresses].sort(
				(a, b) => Number(b.default) - Number(a.default)
			);
			setSortedAddresses(sorted);
			setIsLoading(false);
		}
	}, [userAddresses]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<>
			<LanguageProvider>
				<ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<Header />
				<div className="container mx-auto p-4 my-4">
					<h1 className="text-2xl font-semibold mb-6">Your Addresses</h1>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Add Address card */}
						<Link
							href={"/Profile/Addresses/Add"}
							className="border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center">
							<div>
								<button className="p-2 text-gray-700 hover:text-gray-900 flex">
									<Plus />
									Add Address
								</button>
							</div>
						</Link>
						{sortedAddresses.map((address: any) => (
							<AddressContent
								key={address.addressId}
								address={address}
								isDefault={address.default}
							/>
						))}
					</div>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
}
