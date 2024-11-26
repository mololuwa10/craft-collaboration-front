"use client";

import { LanguageProvider } from "@/app/LanguageContext";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAddresses } from "@/lib/auth";
import { Addresses, GetUserAddresses } from "@/lib/dbModels";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddAddress() {
	const addresses = GetUserAddresses();
	const [isLoading, setIsLoading] = useState(true);
	const [countries, setCountries] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState("");
	const [address, setAddress] = useState({
		addressId: 0,
		country: "",
		postcode: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		county: "",
		default: false,
	});

	useEffect(() => {
		if (addresses !== undefined) {
			setIsLoading(false);
		}
	}, [addresses]);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await fetch("https://restcountries.com/v3.1/all");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				const countriesData = data.map((country: any) => ({
					name: country.name.common,
					isoCode: country.cca2,
				}));

				// Sort countries by name in ascending order
				countriesData.sort((a: any, b: any) => a.name.localeCompare(b.name));

				// Update state with the fetched countries
				setCountries(countriesData);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		// Call the function
		fetchCountries();
	}, []);

	const handleCountryChange = (e: any) => {
		const selectedCountryName = e.target.value;
		setSelectedCountry(selectedCountryName);
		setAddress((prev) => ({
			...prev,
			country: selectedCountryName,
		}));
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const newAddress = await createAddresses(address);
			toast.success("Address added successfully!");
			setAddress({
				addressId: 0,
				country: "",
				postcode: "",
				addressLine1: "",
				addressLine2: "",
				city: "",
				county: "",
				default: false,
			});
		} catch (error) {
			toast.error("Failed to create the address.");
			console.error(error);
		}
	};

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
				<div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="px-4 py-5 sm:px-6 mb-4">
						<h3 className="text-2xl font-semibold leading-6 text-gray-900">
							Add a new address
						</h3>
					</div>
					<div className="bg-white shadow sm:rounded-lg">
						<form className="border-t border-gray-200" onSubmit={handleSubmit}>
							<>
								<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										Country
									</Label>
									<Select
										className="mt-1 text-sm text-gray-900 sm:col-span-2 border-2 border-gray-400 rounded-lg"
										name="country"
										value={selectedCountry}
										onChange={handleCountryChange}
										options={countries}
									/>
								</div>

								<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										Postcode
									</Label>
									<Input
										className="mt-1 text-sm text-gray-900 sm:col-span-2"
										type="text"
										name="postcode"
										value={address.postcode}
										onChange={(e) =>
											setAddress({ ...address, postcode: e.target.value })
										}
									/>
								</div>
								<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										Address Line 1
									</Label>
									<Input
										className="mt-1 text-sm text-gray-900 sm:col-span-2"
										name="addressLine1"
										type="text"
										value={address.addressLine1}
										onChange={(e) =>
											setAddress({ ...address, addressLine1: e.target.value })
										}
									/>
								</div>
								<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										Address Line 2 (Optional)
									</Label>
									<Input
										className="mt-1 text-sm text-gray-900 sm:col-span-2"
										type="text"
										name="addressLine2"
										value={address.addressLine2}
										onChange={(e) =>
											setAddress({ ...address, addressLine2: e.target.value })
										}
									/>
								</div>
								<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										Town/City
									</Label>
									<Input
										className="mt-1 text-sm text-gray-900 sm:col-span-2"
										type="text"
										name="city"
										value={address.city}
										onChange={(e) =>
											setAddress({ ...address, city: e.target.value })
										}
									/>
								</div>
								<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<Label className="text-md font-semibold text-gray-800 mt-[0.5rem]">
										County
									</Label>
									<Input
										className="mt-1 text-sm text-gray-900 sm:col-span-2"
										name="county"
										type="text"
										value={address.county}
										onChange={(e) =>
											setAddress({ ...address, county: e.target.value })
										}
									/>
								</div>

								<button
									className="mb-5 ml-3 mt-4 mx-auto text-sm px-10 py-3 bg-black rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-white"
									type="submit">
									Save
								</button>
							</>
						</form>
					</div>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
}

const Select = ({
	className,
	name,
	value,
	onChange,
	options,
}: {
	className: string;
	name: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { isoCode: string; name: string }[];
}) => {
	return (
		<select
			name={name}
			value={value}
			onChange={onChange}
			className={`${className} block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md`}>
			<option value="">Select a country</option>
			{options.map((option) => (
				<option key={option.isoCode} value={option.name}>
					{option.name}
				</option>
			))}
		</select>
	);
};
