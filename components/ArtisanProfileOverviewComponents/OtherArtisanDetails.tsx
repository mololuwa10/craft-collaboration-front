"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApplePay, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { ArtisanProfile } from "@/lib/dbModels";

const OtherArtisanDetails = ({
	newArtisan,
}: {
	newArtisan: ArtisanProfile | null;
}) => {
	const currentDate = new Date();
	const lastUpdatedDate = currentDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// const { userDetails } = useFetchUserInfo();

	if (!newArtisan) {
		return (
			<>
				<div className="flex justify-center items-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="container mx-auto px-4 py-2">
				<div className="border-b-2 py-4">
					{newArtisan ? (
						<div className="flex lg:flex-row justify-evenly items-start space-x-20">
							<div className="mb-4 lg:mb-0">
								<h1 className="text-2xl font-bold">Shop policies</h1>
								<p className="text-sm text-gray-600 mt-4">
									Last updated on {lastUpdatedDate}
								</p>
							</div>

							<div className="block items-start lg:items-center lg:justify-around">
								<div className="mb-4 lg:mb-0 lg:border-l-2 lg:pl-10">
									<h2 className="text-xl font-semibold">
										Accepted payment methods
									</h2>
									<div className="flex items-center mt-2">
										<FontAwesomeIcon
											icon={faPaypal}
											className="h-8 w-8 text-blue-600 mx-2"
										/>

										<FontAwesomeIcon
											icon={faApplePay}
											className="h-8 w-8 text-blue-600 mx-2"
										/>
									</div>
									<p className="text-sm text-gray-600">
										Accepts Crafts Collaborations Gift Cards and Crafts
										Collaborations Credits
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Stories</h2>
									<p className="text-sm text-gray-600">{newArtisan.stories}</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">
										Returns & exchanges Policy
									</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.returnPolicy}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Specializations</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.specializations}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Services Offered</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.servicesOffered}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Materials Used</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.materialsUsed}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Shipping Policy</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.shippingPolicies}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Privacy Policy</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.privacyPolicy}
									</p>
								</div>

								<div className="lg:pl-10 mt-6 lg:mb-0 lg:border-l-2">
									<h2 className="text-xl font-semibold">Terms & Conditions</h2>
									<p className="text-sm text-gray-600">
										{newArtisan.termsConditions}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="flex justify-center items-center h-screen">
							<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default OtherArtisanDetails;
