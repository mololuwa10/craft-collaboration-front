"use client";

import styles from "@/components/dashboardComponents/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { fetchUserById, fetchAllRoles } from "@/lib/dbModels";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createArtisanProfile, updateUser } from "@/lib/auth";

export default function EditUser() {
	interface Authority {
		authority: string;
		roleId: number;
	}

	interface User {
		userId: number;
		username: string;
		user_email: string;
		userPassword: string;
		firstname: string;
		lastname: string;
		dateJoined: string;
		contactTelephone: string;
		contactAddress: string;
		authorities: Authority[];
	}

	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState("");
	const [roles, setRoles] = useState([]);
	const [selectedRoleId, setSelectedRoleId] = useState<string | number>("");
	const [hasArtisanProfile, setHasArtisanProfile] = useState(false);

	const searchParams = useSearchParams();
	const userId = searchParams.get("userId");

	useEffect(() => {
		const jwt = localStorage.getItem("jwt");
		if (jwt) {
			fetchAllRoles(jwt).then(setRoles).catch(console.error);
		}
	}, []);

	useEffect(() => {
		if (user && user.authorities.length > 0) {
			// Assuming a user can have multiple roles but only one is selectable for simplicity
			setSelectedRoleId(user.authorities[0].roleId.toString());
		}
	}, [user]);

	useEffect(() => {
		const jwt = localStorage.getItem("jwt");

		if (userId && jwt) {
			fetchUserById(Number(userId), jwt)
				.then((fetchedUser) => setUser(fetchedUser))
				.catch((err) => {
					console.error(err);
					setError("Failed to fetch user details");
				});
		}
	}, [userId]);

	// Assuming fetchUserById now includes information about the artisan profile
	useEffect(() => {
		const jwt = localStorage.getItem("jwt");
		if (userId && jwt) {
			fetchUserById(Number(userId), jwt)
				.then((fetchedUser) => {
					setUser(fetchedUser);
					setHasArtisanProfile(fetchedUser.hasArtisanProfile);
				})
				.catch((err) => {
					console.error(err);
					setError("Failed to fetch user details");
				});
		}
	}, [userId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!user) {
		return <div>Loading...</div>;
	}

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			alert("Authentication token not found.");
			return;
		}

		const updatedUserData = {
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			user_email: user.user_email,
			contactTelephone: user?.contactTelephone,
			contactAddress: user?.contactAddress,
			authorities: [
				{
					roleId: selectedRoleId,
					authority: roles.find((role) => role.roleId === selectedRoleId)
						?.authority,
				},
			],
		};

		const isArtisanRoleSelected = selectedRoleId === 3;
		if (isArtisanRoleSelected && !hasArtisanProfile) {
			try {
				await createArtisanProfile(user.userId, jwt);
				setHasArtisanProfile(true);
			} catch (error) {
				console.error("Failed to create artisan profile:", error);
				alert("Failed to create artisan profile.");
				return;
			}
		}

		// Call the updateUser function
		try {
			// Check if the "Artisan" role is selected and the user does not already have an artisan profile
			// const isArtisanRoleSelected = roles.some(
			// 	(role) => role.roleId === selectedRoleId && role.authority === "ARTISAN"
			// );

			await updateUser(user.userId, updatedUserData, jwt);
			// if (isArtisanRoleSelected && !hasArtisanProfile) {
			// 	await createArtisanProfile(user.userId, jwt);
			// }
		} catch (error) {
			if (error instanceof Error) {
				console.error("Failed to update the user:", error.message);
			} else {
				console.error("Failed to update the user:", error);
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
	};

	return (
		<div className={styles.container}>
			<div className={styles.infoContainer}>
				<div className={styles.imgContainer}>
					{/* <Image src={user.img || "/noavatar.png"} alt="" fill /> */}
					<Image src={"/noavatar.png"} alt="" fill />
				</div>
				{user.username}
			</div>
			<div className={styles.formContainer}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<input type="hidden" name="id" />
					<label>Firstname</label>
					<input
						type="text"
						name="firstname"
						placeholder={user.firstname}
						value={user.firstname}
						onChange={handleInputChange}
					/>
					<label>Lastname</label>
					<input
						type="text"
						name="lastname"
						placeholder={user.lastname}
						value={user.lastname}
						onChange={handleInputChange}
					/>
					<label>Username</label>
					<input
						type="text"
						name="username"
						placeholder={user.username}
						value={user.username}
						onChange={handleInputChange}
					/>
					<label>Email</label>
					<input
						type="email"
						name="email"
						placeholder={user.user_email}
						value={user.user_email}
						onChange={handleInputChange}
					/>
					<label>Password</label>
					<input
						type="password"
						name="password"
						placeholder={user.userPassword}
						value={user.userPassword}
						onChange={handleInputChange}
					/>
					<label>Phone</label>
					<input
						type="text"
						name="contactTelephone"
						placeholder={user.contactTelephone}
						value={user.contactTelephone}
						onChange={handleInputChange}
					/>
					<label>Address</label>
					<textarea
						// type="text"
						name="contactAddress"
						placeholder={user.contactAddress}
						value={user.contactAddress}
						onChange={handleInputChange as any}
					/>
					<label>Is Admin?</label>
					<select
						name="role"
						id="role"
						value={selectedRoleId}
						onChange={(e) => setSelectedRoleId(e.target.value)}
					>
						{roles.map((role) => (
							<option key={role.roleId} value={role.roleId}>
								{role.authority}
							</option>
						))}
					</select>
					<button>Update</button>
				</form>
			</div>
		</div>
	);
}
