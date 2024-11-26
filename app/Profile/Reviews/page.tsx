"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { fetchReviewsByUserId } from "@/lib/dbModels";
import { useFetchUserInfo } from "@/lib/data";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { LanguageProvider } from "@/app/LanguageContext";

interface Review {
	reviewId: number;
	reviewTitle: string;
	rating: number;
	comment: string;
	reviewDate: string;
	applicationUser: {
		userId: number;
		firstname: string;
		lastname: string;
	};
}

function formatDate(dateString: any) {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const date = new Date(dateString);
	let formattedDate = date.toLocaleDateString("en-GB", options);

	const day = date.getDate();
	const suffix = ["th", "st", "nd", "rd"][
		day % 10 > 3 ? 0 : (day % 100) - (day % 10) != 10 ? day % 10 : 0
	];

	formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

	return formattedDate;
}

const ReviewCard = ({ review }: { review: Review }) => {
	// Generating the stars for the review
	const stars = Array.from({ length: 5 }, (_, index) =>
		index < review.rating ? "★" : "☆"
	).join("");

	const formattedDate = formatDate(review.reviewDate);

	return (
		<div className="bg-gray-800 text-white p-4 rounded-lg space-y-2 my-4 relative">
			<div className="flex items-center space-x-2">
				<div className="font-bold text-lg">
					{review.applicationUser.firstname[0]}
				</div>
				<div className="flex-grow font-semibold">
					{review.applicationUser.firstname} {review.applicationUser.lastname}
				</div>
				<button
					// onClick={() => onEdit(review.reviewId)}
					className="p-1 rounded-full bg-gray-700 hover:bg-gray-600">
					<FaPencilAlt className="h-5 w-5 text-white" />
				</button>
				<button
					// onClick={() => onDelete(review.reviewId)}
					className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 ml-2">
					<FaTrash className="h-5 w-5 text-white" />
				</button>
			</div>
			<div className="text-lg font-medium">{review.reviewTitle}</div>
			<div className="text-sm">{review.comment}</div>
			<div className="text-xs">{formattedDate}</div>
			<div className="text-yellow-400">{stars}</div>
		</div>
	);
};

const Reviews = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const { userDetails } = useFetchUserInfo();

	useEffect(() => {
		if (userDetails && userDetails.user) {
			const userId = userDetails.user.userId;
			fetchReviewsByUserId(userId)
				.then((data) => {
					setReviews(data);
				})
				.catch((error) => {
					console.error("Error fetching reviews:", error);
				});
		}
	}, [userDetails]);

	return (
		<>
			<LanguageProvider>
				<Header />
				<h1 className="text-3xl font-semibold text-center my-4">
					Your Reviews
				</h1>
				<div className="my-4 max-w-2xl mx-auto">
					<input
						type="text"
						placeholder="Search Review"
						className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-gray-400 border-2"
					/>
				</div>
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{reviews.map((review) => (
							<ReviewCard key={review.reviewId} review={review} />
						))}
					</div>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
};

export default Reviews;
