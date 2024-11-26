import { useFetchUserInfo } from "@/lib/data";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

export default function AccountSettingsComponents() {
	const { isLoggedIn, userRole, userDetails } = useFetchUserInfo();

	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

	const [newPasswordShown, setNewPasswordShown] = useState(false);

	const toggleNewPasswordVisibility = () => {
		setNewPasswordShown(!newPasswordShown);
	};

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
					Account Settings
				</h2>
				<form>
					<div className="mb-4">
						<label
							htmlFor="username"
							className="block text-gray-700 text-sm font-bold mb-2">
							Username
						</label>
						<input
							type="text"
							id="username"
							value={formDetails.user.username}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-4 relative">
						<label
							htmlFor="currentPassword"
							className="block text-gray-700 text-sm font-bold mb-2">
							Current Password
						</label>
						<input
							type={passwordShown ? "text" : "password"}
							id="currentPassword"
							placeholder="Enter your current password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							style={{ top: "26px", bottom: "0px", right: "0px" }}
							className="absolute pr-3 flex items-center text-sm leading-5">
							{passwordShown ? (
								<EyeOffIcon className="h-5 w-5 text-gray-700" />
							) : (
								<EyeIcon className="h-5 w-5 text-gray-700" />
							)}
						</button>
					</div>

					<div className="mb-4 relative">
						<label
							htmlFor="newPassword"
							className="block text-gray-700 text-sm font-bold mb-2">
							New Password
						</label>
						<div className="flex items-center border rounded shadow appearance-none w-full">
							<input
								type={newPasswordShown ? "text" : "password"}
								id="newPassword"
								name="newPassword"
								placeholder="Enter New Password"
								className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-l"
								// Removed the rounded and border classes from here and applied them to the parent div to encompass the button
							/>
							<button
								type="button"
								onClick={toggleNewPasswordVisibility}
								className="pr-3 flex items-center text-sm leading-5">
								{newPasswordShown ? (
									<EyeOffIcon className="h-5 w-5 text-gray-700" />
								) : (
									<EyeIcon className="h-5 w-5 text-gray-700" />
								)}
							</button>
						</div>
					</div>

					<Button className="mt-4 text-white px-6 py-2 rounded hover:bg-blue-600">
						Save
					</Button>
				</form>
			</div>
		</>
	);
}
