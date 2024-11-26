"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Fetch user info thats logged in

export const useFetchUserInfo = () => {
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const jwt = localStorage.getItem("jwt");
				if (!jwt) {
					setIsLoggedIn(false);
					setError("JWT not found");
					return;
				}

				const response = await fetch("http://localhost:8080/api/user/info", {
					headers: { Authorization: "Bearer " + jwt },
				});

				if (!response.ok) {
					setIsLoggedIn(false);
					setError("Failed to fetch user details");
					throw new Error("Failed to fetch user details");
				}

				const data = await response.json();
				setUserDetails(data);
				// Setting the user role based on authorities
				const isAdmin = data.user.authorities.some(
					(authority: { roleId: number; authority: string }) =>
						authority.authority === "ADMIN"
				);

				const isArtisan = data.user.authorities.some(
					(authority: { roleId: number; authority: string }) =>
						authority.authority === "ARTISAN"
				);

				setUserRole(isAdmin ? "ADMIN" : isArtisan ? "ARTISAN" : "USER");
				setIsLoggedIn(true);
			} catch (error) {
				console.error("Error fetching user info:", error);
				// setError(error.message);
			}
		};

		fetchUserInfo();
	}, []);

	return { userDetails, userRole, isLoggedIn, error };
};

export const words = [
	"a",
	"about",
	"all",
	"also",
	"and",
	"as",
	"at",
	"be",
	"because",
	"but",
	"by",
	"can",
	"come",
	"could",
	"will",
	"with",
	"would",
	"year",
	"you",
	"your",
];

export const useLogout = () => {
	const router = useRouter();
	const [userDetails, setUserDetails] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem("jwt");
		setIsLoggedIn(false);
		setUserDetails(null);
		router.push("/SignIn");
	};

	return handleLogout;
};

// Check verification
export const checkVerificationStatus = async () => {
	try {
		const token = localStorage.getItem("jwt");

		const response = await fetch(
			`http://localhost:8080/api/email/check-verification`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const isVerified = await response.json();
		return isVerified;
	} catch (error) {
		console.error("Error checking verification status:", error);
		throw error;
	}
};
