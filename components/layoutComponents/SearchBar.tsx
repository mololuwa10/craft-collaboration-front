"use client";
// import { Search } from "lucide-react";
import React, { useState } from "react";
// import { words } from "@/lib/data";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleInputChange = (event: any) => {
		setSearchTerm(event.target.value);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSubmit = (event: any) => {
		event.preventDefault();
		router.push(`/SearchResults?query=${encodeURIComponent(searchTerm)}`);
	};

	return (
		<form className="flex items-center justify-center" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center">
				<div className="relative md:w-full max-w-xl shadow-md rounded-lg">
					<input
						type="search"
						className="w-full border border-gray-300 rounded-md py-2 px-4"
						placeholder={placeholder}
						value={searchTerm}
						onChange={handleInputChange}
					/>
					<button
						type="submit"
						className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
					>
						<FaSearch />
					</button>
				</div>
			</div>
		</form>
	);
};

export default SearchBar;
