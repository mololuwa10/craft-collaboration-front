/* eslint-disable @next/next/no-img-element */
import { fetchReviewsByProductId } from "@/lib/dbModels";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addReview } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
	productId: number;
	productName: string;
	productDescription: string;
	productPrice: number;
	productStockQuantity: number;
	imageUrls: string[];
	productDiscount: number;
	category: {
		categoryId: number;
		categoryName: string;
	};
	artisanProfile: {
		artisanId: number;
		firstname: string;
		lastname: string;
		bio: string;
		profilePicture: string;
		location: string;
		storeName: string;
	};
	dateTimeUpdated: string;
}

interface Review {
	reviewId: number;
	reviewTitle: string;
	rating: number;
	comment: string;
	applicationUser: {
		firstname: string;
		lastname: string;
	};
}

type StarRatingProps = {
	onRating: (rating: number) => void;
};

export default function ProductReviews() {
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId");
	const [product, setProduct] = useState<Product | null>(null);
	const [error, setError] = useState("");
	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewTitle, setReviewTitle] = useState("");
	const [reviewComment, setReviewComment] = useState("");

	// Convert productId from string to number
	const numericProductId = Number(productId);

	useEffect(() => {
		fetchReviewsByProductId(numericProductId)
			.then((reviews) => {
				setReviews(reviews);
			})
			.catch((error) => {
				console.error(error);
				setError("Failed to load reviews");
			});
	}, [numericProductId]);

	const averageRating =
		reviews.length > 0
			? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
			: 0;

	// Function to render stars based on rating
	const renderStars = (rating: number | string) => {
		return (
			<div className="flex gap-0.5 text-green-500">
				{[...Array(5)].map((_, index) => (
					<svg
						key={index}
						className={`h-5 w-5 ${
							index < Number(rating)
								? "fill-current text-gray-900 flex-shrink-0"
								: "fill-current text-gray-400"
						}`}
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				))}
			</div>
		);
	};

	const StarRating = ({ onRating }: StarRatingProps) => {
		const [rating, setRating] = useState(0);
		const [hover, setHover] = useState(0);

		return (
			<div className="flex">
				{[...Array(5)].map((star, index) => {
					index += 1;
					return (
						<button
							type="button"
							key={index}
							className={
								index <= (hover || rating) ? "text-gray-900" : "text-gray-400"
							}
							onClick={() => {
								setRating(index);
								onRating(index);
							}}
							onMouseEnter={() => setHover(index)}
							onMouseLeave={() => setHover(rating)}>
							<span className="text-2xl">&#9733;</span>
						</button>
					);
				})}
			</div>
		);
	};

	const jwt = localStorage.getItem("jwt") ?? "";
	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		if (jwt === null) {
			toast.error("You must be logged in to submit a review");
			return;
		}
		// Convert productId from string to number
		const numericProductId = Number(productId);

		// Checking if productId conversion is successful and is a valid number
		if (isNaN(numericProductId)) {
			toast.error("Invalid product ID");
			return;
		}
		try {
			await addReview(
				{
					reviewTitle: reviewTitle,
					rating: reviewRating,
					comment: reviewComment,
				},
				jwt,
				numericProductId,
				"product"
			);
			if (!reviewTitle || !reviewComment || reviewRating <= 0) {
				toast.error(
					"Please fill in all fields and make sure the rating is above 0."
				);
				return;
			}
			toast.success("Review submitted successfully!");
			// Reset form fields
			setReviewTitle("");
			setReviewComment("");
			setReviewRating(0);
		} catch (error) {
			toast.error(
				"An error occurred while submitting your review! Its either you have not signed in or you are not able to add a review because you have not ordered or recived the product if ordered"
			);
		}
	};

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
			<div className=" lg:border-gray-200 mx-auto my-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
				{/* No of reviews */}
				<div className="mb-6 flex items-center gap-2">
					<p className="text-3xl font-medium text-gray-900">
						{`${reviews.length || 0} Reviews`}
					</p>
					<div className="flex items-center">
						{renderStars(parseFloat(averageRating.toFixed(1)))}
					</div>
				</div>

				<Dialog>
					<DialogTrigger asChild>
						<Button
							size={"lg"}
							variant={"outline"}
							className="border-2 rounded-3xl mb-6">
							Add a review
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Add Review</DialogTitle>
							<DialogDescription>Share your experience!!</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<form onSubmit={handleSubmit}>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="reviewTitle" className="text-right">
										Review Title
									</Label>
									<Input
										id="name"
										value={reviewTitle}
										onChange={(event) => setReviewTitle(event.target.value)}
										placeholder="Enter title here..."
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4 mt-3">
									<Label htmlFor="reviewComment" className="text-right">
										Comment
									</Label>
									<Textarea
										id="comment"
										value={reviewComment}
										onChange={(event) => setReviewComment(event.target.value)}
										placeholder="Write your review here.."
										className="col-span-3"
									/>
								</div>
								<div className="mb-6">
									<Label
										htmlFor="rating"
										className="block mb-2 text-sm font-medium">
										Rating
									</Label>
									<StarRating
										onRating={(rating: any) => setReviewRating(rating)}
									/>
								</div>
								<DialogFooter className="mt-4">
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</form>
						</div>
					</DialogContent>
				</Dialog>
				<section
					aria-labelledby="reviews-heading"
					className="border-t border-gray-200 pt-10 lg:pt-16">
					<h2 id="reviews-heading" className="sr-only">
						Reviews
					</h2>

					<div className="space-y-10">
						{error && <p>{error}</p>}
						{reviews.map((review) => (
							<div className="flex flex-col sm:flex-row" key={review.reviewId}>
								<div className="order-2 mt-6 sm:ml-16 sm:mt-0">
									<h3 className="text-sm font-medium text-gray-900">
										{review.reviewTitle}
									</h3>
									<p className="sr-only">5 out of 5 stars</p>

									<div className="mt-3 space-y-6 text-sm text-gray-600">
										<p>{review.comment}</p>
									</div>
								</div>

								<div className="order-1 flex items-center sm:flex-col sm:items-start">
									<img
										src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixqx=oilqXxSqey&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt="Mark Edwards."
										className="h-12 w-12 rounded-full"
									/>

									<div className="ml-4 sm:ml-0 sm:mt-4">
										<p className="text-sm font-medium text-gray-900">
											{review.applicationUser.firstname}{" "}
											{review.applicationUser.lastname}
										</p>
										<div className="mt-2 flex items-center">
											{renderStars(review.rating)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</>
	);
}
