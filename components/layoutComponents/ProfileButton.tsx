"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createArtisanProfile } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useFetchUserInfo, useLogout } from "@/lib/data";
import { Button } from "../ui/button";
import { FormattedMessage } from "react-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ProfileButton = () => {
	const { isLoggedIn, userRole, userDetails } = useFetchUserInfo();
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const logout = useLogout();

	const handleCreateArtisanProfile = async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				throw new Error("JWT not found");
			}

			const profileData = await createArtisanProfile(userDetails.user.userId, jwt);
			if (profileData.status === 403) {
				toast.error(
					"Your account is not verified. Please verify your account to create an artisan profile."
				);
			} else {
				toast.success("Artisan profile created successfully");
				console.log("Artisan profile created:", profileData.data);
			}
		} catch (error) {
			console.error("Error creating artisan profile:", error.message);
			toast.error(
				error.profileData?.data ||
					"Your account is not verified. Please verify your account to create an artisan profile."
			);
		}
	};

	if (!isLoggedIn) {
		return (
			<Link href="/SignIn">
				<Button size={"lg"}>
					<FormattedMessage id="navSignIn" defaultMessage="	Sign In" />
				</Button>
			</Link>
		);
	}

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className="hover:rounded-lg hover:bg-gray-100 hover:p-2 hover:shadow-lg hover:border hover:border-gray-300">
				<DropdownMenu>
					<DropdownMenuTrigger onClick={toggleDropdown}>
						<div className="flex items-center">
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									alt={`hello`}
								/>
								<AvatarFallback>Loading</AvatarFallback>
							</Avatar>
							{isOpen ? (
								<ChevronUp className="hover" />
							) : (
								<ChevronDown className="hover" />
							)}
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>
							{/* <FormattedMessage id="myAccount" defaultMessage="My Account" />s */}
							<div className="flex items-center">
								<Avatar>
									<AvatarImage
										src="https://github.com/shadcn.png"
										alt={`hello`}
									/>
									<AvatarFallback>Loading</AvatarFallback>
								</Avatar>
								{userDetails && (
									<>
										<span className="flex flex-col space-x-2"></span>
										<span className="text-md mt-2 ml-[1rem]">
											{userDetails.user.firstname} {userDetails.user.lastname}
										</span>
									</>
								)}
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="cursor-pointer">
							<Link href={"/Profile"}>
								<FormattedMessage id="profile" defaultMessage="Profile" />
							</Link>
						</DropdownMenuItem>
						{isLoggedIn && userRole === "ADMIN" && (
							<DropdownMenuItem className="cursor-pointer">
								<Link href="/Dashboard">
									<FormattedMessage id="dashboard" defaultMessage="Dashboard" />
								</Link>
							</DropdownMenuItem>
						)}
						{isLoggedIn && userRole === "USER" && (
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={handleCreateArtisanProfile}
							>
								<FormattedMessage
									id="sellOnCraftCollaborations"
									defaultMessage="Sell on Craft Collaborations"
								/>
							</DropdownMenuItem>
						)}
						<DropdownMenuItem className="cursor-pointer">
							<FormattedMessage id="settings" defaultMessage="Settings" />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="cursor-pointer" onClick={logout}>
							<FormattedMessage id="logOut" defaultMessage="Log Out" />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};

export default ProfileButton;
