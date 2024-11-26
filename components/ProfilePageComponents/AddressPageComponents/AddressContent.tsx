"use client";

import { deleteAddress, setDefaultAddress } from "@/lib/auth";
import { useFetchUserInfo } from "@/lib/data";
import { Addresses } from "@/lib/dbModels";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddressContent = ({
	address,
	isDefault,
}: {
	address: Addresses;
	isDefault: boolean;
}) => {
	const { userDetails } = useFetchUserInfo();
	const [isSettingDefault, setIsSettingDefault] = useState(false);
	const router = useRouter();

	// Handler functions for edit, remove, and set as default
	const handleSetDefault = async () => {
		setIsSettingDefault(true);
		try {
			await setDefaultAddress(Number(address.addressId));
			window.location.reload();
		} catch (err) {
			console.error(err);
		} finally {
			setIsSettingDefault(false);
			window.location.reload();
		}
	};

	const handleRemove = () => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this address?"
		);
		if (isConfirmed) {
			// Call deleteAddress function if the user confirms
			deleteAddress(Number(address.addressId))
				.then(() => {
					toast.success("Address removed successfully!");
					window.location.reload();
				})
				.catch((error) => {
					toast.error("Error deleting address.");
					console.error("Error deleting address:", error);
				});
		}
	};

	return (
		<>
			<div className="p-6 shadow rounded bg-white border-2 border-gray-300 relative">
				{isDefault && (
					<span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
						Default
					</span>
				)}
				<div className="mb-2">
					{userDetails && (
						<p className="font-semibold text-xl mb-2">
							{userDetails?.user.firstname} {userDetails?.user.lastname}
						</p>
					)}
					<p>{address.addressLine1}</p>
					<p>{address.addressLine2}</p>
					<p>
						{address.city}, {address.postcode}
					</p>
					<p>{address.country}</p>
				</div>
				<div className="text-right">
					<Link
						href={{
							pathname: "/Profile/Addresses/Edit",
							query: { addressId: address.addressId },
						}}>
						<button className="text-blue-500 hover:text-blue-700 text-sm">
							Edit
						</button>
					</Link>
					<span className="text-gray-300 mx-1">|</span>
					<button
						className="text-red-500 hover:text-red-700 text-sm"
						onClick={handleRemove}>
						Remove
					</button>
					{!isDefault && (
						<>
							<span className="text-gray-300 mx-1">|</span>
							<button
								className="text-green-500 hover:text-green-700 text-sm"
								onClick={handleSetDefault}
								disabled={isSettingDefault}>
								Set as Default
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default AddressContent;
