"use client";

import { LanguageProvider } from "@/app/LanguageContext";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import React, { useState, useEffect } from "react";
import { useFetchUserInfo } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateArtisanProfile } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditArtisanPage() {
	const { userDetails } = useFetchUserInfo();

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
			storeBanner: string;
			announcements: string;
			businessHours: string;
			gallery: [];
			stories: string | number | null;
			specializations: string | number | null;
			materialsUsed: string | number | null;
			servicesOffered: string | number | null;
			experienceYears: string | number | null;
			shippingPolicies: string | number | null;
			returnPolicy: string | number | null;
			paymentOptions: string | number | null;
			termsConditions: string | number | null;
			privacyPolicy: string | number | null;
			communicationPreferences: string | number | null;
			preferredLanguage: string | number | null;
		};
	}

	const [artisanProfile, setArtisanProfile] = useState<UserDetails>({
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
			bio: "",
			profilePicture: null,
			location: "",
			storeName: "",
			storeBanner: "",
			announcements: "",
			businessHours: "",
			gallery: [],
			stories: "",
			specializations: "",
			materialsUsed: "",
			servicesOffered: "",
			experienceYears: "",
			shippingPolicies: "",
			returnPolicy: "",
			paymentOptions: "",
			termsConditions: "",
			privacyPolicy: "",
			communicationPreferences: "",
			preferredLanguage: "",
		},
	});

	const [selectedProfilePicture, setSelectedProfilePicture] =
		useState<File | null>(null);
	const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(
		null
	);
	const [selectedGalleryImages, setSelectedGalleryImages] = useState<File[]>(
		[]
	);

	useEffect(() => {
		if (userDetails) {
			setArtisanProfile(userDetails as UserDetails);
		}
	}, [userDetails]);

	const handleInputChange = (event: any) => {
		const { name, value } = event.target;
		setArtisanProfile((prevState) => ({
			...prevState,
			artisanProfile: {
				...prevState.artisanProfile,
				[name]: value,
			},
		}));
	};

	const handleProfilePictureChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedProfilePicture(event.target.files[0]);
		}
	};

	const handleBannerImageChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedBannerImage(event.target.files[0]);
		}
	};

	const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedGalleryImages(Array.from(event.target.files));
		}
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const jwt = localStorage.getItem("jwt");

			const updatedData = {
				bio: artisanProfile.artisanProfile.bio,
				// profilePicture: artisanProfile.artisanProfile.profilePicture,
				location: artisanProfile.artisanProfile.location,
				storeName: artisanProfile.artisanProfile.storeName,
				// storeBanner: artisanProfile.artisanProfile.storeBanner,
				announcements: artisanProfile.artisanProfile.announcements,
				businessHours: artisanProfile.artisanProfile.businessHours,
				// gallery: artisanProfile.artisanProfile.gallery,
				stories: artisanProfile.artisanProfile.stories,
				specializations: artisanProfile.artisanProfile.specializations,
				materialsUsed: artisanProfile.artisanProfile.materialsUsed,
				servicesOffered: artisanProfile.artisanProfile.servicesOffered,
				experienceYears: Number(artisanProfile.artisanProfile.experienceYears),
				shippingPolicies: artisanProfile.artisanProfile.shippingPolicies,
				returnPolicy: artisanProfile.artisanProfile.returnPolicy,
				paymentOptions: artisanProfile.artisanProfile.paymentOptions,
				termsConditions: artisanProfile.artisanProfile.termsConditions,
				privacyPolicy: artisanProfile.artisanProfile.privacyPolicy,
				communicationPreferences:
					artisanProfile.artisanProfile.communicationPreferences,
				preferredLanguage: artisanProfile.artisanProfile.preferredLanguage,
			};

			const result = await updateArtisanProfile(
				updatedData,
				selectedBannerImage,
				selectedProfilePicture,
				selectedGalleryImages,
				jwt
			);
			toast.success("Artisan Profile Updated Successfully!!");
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	};

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
					<div className="bg-white shadow sm:rounded-lg">
						<div className="px-4 py-5 sm:px-6">
							<h3 className="text-lg font-medium leading-6 text-gray-900">
								Edit Artisan Profile
							</h3>
							<p className="mt-1 max-w-2xl text-sm text-gray-500">
								Edit your artisan profile details
							</p>
						</div>

						<form className="border-t border-gray-200" onSubmit={handleSubmit}>
							{userDetails && (
								<>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Store name
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											type="text"
											name="storeName"
											value={artisanProfile.artisanProfile.storeName ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Bio
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="bio"
											value={artisanProfile.artisanProfile.bio ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Specializations
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											type="text"
											name="specializations"
											value={
												artisanProfile.artisanProfile.specializations ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Location
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											type="text"
											name="location"
											value={artisanProfile.artisanProfile.location ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Announcements
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="announcements"
											value={artisanProfile.artisanProfile.announcements ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Business Hours
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											type="text"
											name="businessHours"
											value={artisanProfile.artisanProfile.businessHours ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Stories
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="stories"
											value={artisanProfile.artisanProfile.stories ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Years of Experience
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											type="number"
											name="experienceYears"
											value={
												artisanProfile.artisanProfile.experienceYears ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Terms and Conditions
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="termsConditions"
											value={
												artisanProfile.artisanProfile.termsConditions ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Privacy Policy
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="privacyPolicy"
											value={artisanProfile.artisanProfile.privacyPolicy ?? ""}
											onChange={handleInputChange}
										/>
									</div>{" "}
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Return Policy
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="returnPolicy"
											value={artisanProfile.artisanProfile.returnPolicy ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Shipping Policy
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="shippingPolicies"
											value={
												artisanProfile.artisanProfile.shippingPolicies ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>{" "}
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Services Offered
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="servicesOffered"
											value={
												artisanProfile.artisanProfile.servicesOffered ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Materials Used
										</Label>
										<Textarea
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="materialsUsed"
											value={artisanProfile.artisanProfile.materialsUsed ?? ""}
											onChange={handleInputChange}
										/>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<Label className="text-sm font-medium text-gray-500 mt-[0.5rem]">
											Communication Preferences
										</Label>
										<Input
											className="mt-1 text-sm text-gray-900 sm:col-span-2"
											name="communicationPreferences"
											type="text"
											value={
												artisanProfile.artisanProfile
													.communicationPreferences ?? ""
											}
											onChange={handleInputChange}
										/>
									</div>
									{/* Example File Input */}
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<label>
											Profile Picture:
											<input
												type="file"
												name="profilePicture"
												onChange={handleProfilePictureChange}
											/>
										</label>
									</div>
									{/* Example for List of Strings (Gallery) */}
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<label>
											Gallery Images:
											<input
												type="file"
												multiple
												name="galleryImages"
												onChange={handleGalleryChange}
											/>
										</label>
									</div>
									<div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<label>
											Store Banner:
											<input
												type="file"
												name="storeBanner"
												onChange={handleBannerImageChange}
											/>
										</label>
									</div>
									<button
										className="mb-5 ml-3 mt-4 mx-auto text-sm px-10 py-3 bg-black rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-white"
										type="submit">
										Save
									</button>
								</>
							)}
						</form>
					</div>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
}
