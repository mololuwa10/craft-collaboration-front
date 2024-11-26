/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFetchUsers } from "@/lib/dbModels";
import Link from "next/link";

export default function Users() {
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
		authorities: {
			authority: string;
		}[];
	}

	// Fetch user data
	const { users } = useFetchUsers() as { users: User[] };
	return (
		<>
			<Link href="/Dashboard/Users/Add">
				<Button size={"lg"} className="my-4">
					+ Add User
				</Button>
			</Link>
			<Table>
				<TableCaption>User List</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>User Id</TableHead>
						<TableHead>First Name</TableHead>
						<TableHead>Last Name</TableHead>
						<TableHead>Username</TableHead>
						<TableHead>User Email</TableHead>
						<TableHead>Date Joined</TableHead>
						<TableHead>Contact Telephone</TableHead>
						<TableHead>Contact Address</TableHead>
						<TableHead>User Role</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<>
							<TableRow key={user.userId}>
								<TableCell>{user.userId}</TableCell>
								<TableCell>{user.firstname}</TableCell>
								<TableCell>{user.lastname}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.user_email}</TableCell>
								<TableCell>{user.dateJoined}</TableCell>
								<TableCell>{user.contactTelephone}</TableCell>
								<TableCell>{user.contactAddress}</TableCell>
								<TableCell>{user[0]?.authorities}</TableCell>
								<TableCell>
									<div className="p-2 flex">
										<Link
											href={{
												pathname: "/Dashboard/Users/Edit",
												query: { userId: user.userId },
											}}
										>
											<Button
												size={"lg"}
												// variant={"outline"}
												className="mr-2 mb-2 flex"
											>
												Edit
											</Button>
										</Link>

										<Button
											size={"lg"}
											// variant={"outline"}
											className="mr-2 mb-2 flex"
										>
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						</>
					))}
				</TableBody>
			</Table>
		</>
	);
}
