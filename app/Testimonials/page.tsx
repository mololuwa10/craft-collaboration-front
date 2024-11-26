"use client";

import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { addTestimonial } from "@/lib/auth";
import { useGetMoreTestimonials } from "@/lib/dbModels";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "../LanguageContext";

type StarRatingProps = {
	onRating: (rating: number) => void;
};

const StarRating = ({ onRating }: StarRatingProps) => {
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);

	return (
		<>
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
							onMouseLeave={() => setHover(rating)}
						>
							<span className="text-2xl">&#9733;</span>
						</button>
					);
				})}
			</div>
		</>
	);
};

export default function Testimonials() {
	interface Testimonials {
		testimonialId: number;
		testimonialTitle: string;
		rating: number;
		comment: string;
		reviewDate: string;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
	}

	const pageSize = 3;
	const [page, setPage] = useState(1);

	const { testimonials } = useGetMoreTestimonials(page, pageSize) as {
		testimonials: Testimonials[];
	};

	const handleViewMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const renderStars = (rating: number) => {
		return (
			<div className="flex gap-0.5 text-green-500">
				{[...Array(5)].map((_, index) => (
					<svg
						key={index}
						className={`h-5 w-5 ${
							index < rating
								? "fill-current text-gray-900"
								: "fill-current text-gray-400"
						}`}
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				))}
			</div>
		);
	};

	const [testimonialRating, setTestimonialRating] = useState(0);
	const [testimonialTitle, setTestimonialTitle] = useState("");
	const [testimonialComment, setTestimonialComment] = useState("");
	const jwt = localStorage.getItem("jwt");

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (jwt === null) {
			alert("You must be logged in to submit a testimonial");
			return;
		}
		try {
			await addTestimonial(
				{
					testimonialTitle: testimonialTitle,
					rating: testimonialRating,
					comment: testimonialComment,
				},
				jwt
			);
			toast.success("Thank you for your submission!");
			setTestimonialTitle("");
			setTestimonialComment("");
			setTestimonialRating(0);
		} catch (error) {
			console.error(error);
			toast.error(
				"An error occurred while submitting your testimonial!! Check if you are signed in"
			);
		}
	};
	return (
		<>
			<LanguageProvider>
				<Header />

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

				<div className="container mx-auto p-8">
					<header className="text-center mb-10">
						<h1 className="text-4xl font-bold mb-3">Testimonials</h1>
						<p className="text-medium mb-4">
							Discover inspiring stories from our community
						</p>
					</header>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-6 text-center">
							What Our Users Say
						</h2>
						<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
							{testimonials.slice(0, 3).map((testimonial) => (
								<blockquote
									key={testimonial.testimonialId}
									className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 border-2 rounded-lg"
								>
									<div>
										{renderStars(testimonial.rating)}

										<div className="mt-4">
											<p className="text-2xl font-bold text-rose-600 sm:text-3xl">
												{testimonial.testimonialTitle}
											</p>

											<p className="mt-4 leading-relaxed text-gray-700">
												{testimonial.comment}
											</p>
										</div>
									</div>

									<footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
										&mdash; {testimonial.applicationUser.firstname}{" "}
										{testimonial.applicationUser.lastname}
									</footer>
								</blockquote>
							))}
						</div>
						<div className="text-center mt-4">
							<Button
								size={"lg"}
								className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
								onClick={handleViewMore}
							>
								View More Testimonials
							</Button>
						</div>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-6 text-center">
							Submit Your Testimonial
						</h2>
						<form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
							<label htmlFor="testimonialTitle">Testimonial Title</label>
							<input
								id="testimonialTitle"
								type="text"
								value={testimonialTitle}
								onChange={(e) => setTestimonialTitle(e.target.value)}
								placeholder="Enter your testimonial title"
								className="border border-gray-300 p-2 w-full rounded h-10 mb-4"
							/>
							<div className="mb-6">
								<label
									htmlFor="rating"
									className="block mb-2 text-sm font-medium"
								>
									Rating
								</label>
								<StarRating
									onRating={(rating) => setTestimonialRating(rating)}
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="testimonial"
									className="block mb-2 text-sm font-medium"
								>
									Testimonial
								</label>
								<textarea
									id="testimonial"
									value={testimonialComment}
									onChange={(e) => setTestimonialComment(e.target.value)}
									placeholder="Enter your testimonial"
									className="border border-gray-300 p-2 w-full rounded h-24"
								></textarea>
							</div>
							<div className="text-center">
								<button
									type="submit"
									className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-300"
								>
									Submit Testimonial
								</button>
							</div>
						</form>
					</section>
				</div>

				<Footer />
			</LanguageProvider>
		</>
	);
}
