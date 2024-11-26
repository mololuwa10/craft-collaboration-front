import { useFetchUserInfo } from "@/lib/data";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export default function PersonalInformationComponents() {
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
		};
	}

	const [formDetails, setFormDetails] = useState<UserDetails>({
		user: {
			userId: 0,
			firstname: "",
			lastname: "",
			user_email: "",
			contactTelephone: "",
			contactAddress: "",
			username: "",
			password: null,
			bankAccountNo: null,
			bankSortCode: null,
			authorities: [],
			dateJoined: "",
		},
		artisanProfile: {
			artisanId: 0,
			bio: null,
			profilePicture: null,
			location: null,
			storeName: null,
		},
	});

	useEffect(() => {
		if (userDetails) {
			setFormDetails(userDetails as UserDetails);
		}
	}, [userDetails]);

	const handleInputChange = (event: any) => {
		const { id, value } = event.target;
		setFormDetails((prevDetails) => ({
			...prevDetails,
			[id]: value,
		}));
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log(formDetails);
		// Implement update logic here
	};

	return (
		<>
			<div className="bg-white shadow rounded-lg p-6 mb-6">
				<h2 className="text-2xl text-gray-800 font-semibold mb-4">
					Personal Information
				</h2>
				<form>
					{userDetails && (
						<>
							<div className="mb-4">
								<label
									htmlFor="firstname"
									className="block text-gray-700 text-sm font-bold mb-2">
									First Name
								</label>
								<input
									type="text"
									id="firstname"
									value={formDetails.user.firstname}
									onChange={handleInputChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="lastname"
									className="block text-gray-700 text-sm font-bold mb-2">
									Last Name
								</label>
								<input
									type="text"
									id="lastname"
									value={formDetails.user.lastname}
									onChange={handleInputChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="email"
									className="block text-gray-700 text-sm font-bold mb-2">
									Email Address
								</label>
								<input
									type="email"
									id="email"
									value={formDetails.user.user_email}
									onChange={handleInputChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="phone"
									className="block text-gray-700 text-sm font-bold mb-2">
									Phone Number
								</label>
								<input
									type="tel"
									id="phone"
									value={formDetails.user.contactTelephone}
									onChange={handleInputChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="address"
									className="block text-gray-700 text-sm font-bold mb-2">
									Address
								</label>
								<textarea
									id="address"
									value={formDetails.user.contactAddress}
									onChange={handleInputChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<Button className="mt-4 text-white px-6 py-2 rounded hover:bg-blue-600">
								Save
							</Button>
						</>
					)}
				</form>
			</div>
		</>
	);
}
