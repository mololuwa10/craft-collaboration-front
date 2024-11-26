/* eslint-disable @next/next/no-img-element */
"use client";

import { ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { LanguageComboBox } from "./LanguageComboBox";
import { LocationComboBox } from "./LocationComboBox";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import ProfileButton from "./ProfileButton";
import Container from "../ui/container";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { fetchShoppingCart } from "@/lib/dbModels";
import SearchBar from "./SearchBar";
import { FormattedMessage } from "react-intl";
import { checkVerificationStatus, useFetchUserInfo } from "@/lib/data";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [cartItemCount, setCartItemCount] = useState(0);
	const router = useRouter();
	const [isVerified, setIsVerified] = useState(false);

	const { isLoggedIn, userDetails, userRole } = useFetchUserInfo();

	const handleShoppingCartClick = () => {
		router.push("/ShoppingCart");
	};

	useEffect(() => {
		const jwt = localStorage.getItem("jwt");
		if (jwt) {
			fetchShoppingCart(jwt)
				.then((cart) => {
					const itemCount = cart.cartItems.reduce(
						(total: any, item: any) => total + item.quantity,
						0
					);
					setCartItemCount(itemCount);
				})
				.catch((error) => {
					console.error("Error fetching shopping cart:", error);
				});
		}
	}, []);

	const handleSearch = (query: any) => {
		console.log("Searching for:", query);
		// Perform the search action, such as querying an API
	};

	useEffect(() => {
		const verifyUser = async () => {
			try {
				const verified = await checkVerificationStatus();
				setIsVerified(verified);
			} catch (error) {
				// Handle errors, for example by setting an error state
				console.error("Error during verification check", error);
			}
		};

		verifyUser();
	}, []);

	return (
		<>
			<div className="sticky top-0 z-10 bg-white shadow">
				{!isVerified && isLoggedIn && (
					<div className="text-center py-2 bg-yellow-200 text-yellow-800">
						Your account is not verified. Please check your email for the
						verification link.
					</div>
				)}
				<header className="sm:flex sm:justify-end py-3 px-4 border-b">
					<div
						className="relative px-4 sm:px-6 lg:px-8 flex items-center
				justify-end w-full">
						<SearchBar placeholder="Search..." />
						<LanguageComboBox />
						<LocationComboBox />
					</div>
				</header>
				<header className="sm:flex sm:justify-between py-3 px-4 border-b">
					<Container>
						<div
							className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center
				justify-between w-full">
							<div className="flex items-center ml-4">
								<a
									href="/"
									className="ml-1 lg:ml-0 text-lg font-bold text-emerald-900">
									<FormattedMessage
										id="companyName"
										defaultMessage="Craft Collaborations"
									/>
								</a>
							</div>
							<nav className="mx-6 flex items-center space-x-4 lg:space-x-6 md:block white-text">
								<NavigationMenuDemo />
							</nav>
							<div className="flex items-center">
								<div className="relative mr-6">
									<Button
										variant="ghost"
										size="icon"
										aria-label="Shopping Cart"
										onClick={handleShoppingCartClick}
										className="relative">
										<ShoppingCart className="h-6 w-6" />
										{cartItemCount > 0 && (
											<span className="absolute -top-[0.6rem] -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs">
												{cartItemCount}
											</span>
										)}
									</Button>
								</div>

								<ProfileButton />
							</div>
						</div>
					</Container>
				</header>
			</div>
		</>
	);
}
