"use client";

import { useGetAllTestimonials } from "@/lib/dbModels";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LanguageProvider } from "@/app/LanguageContext";

export default function Testimonials() {
	interface Testimonials {
		testimonialId: number;
		testimonialTitle: string;
		rating: number;
		comment: string;
		testimonialDate: string;
		isApproved: boolean;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
	}
	const { testimonials } = useGetAllTestimonials() as {
		testimonials: Testimonials[];
	};

	return (
		<>
			<LanguageProvider>
				<Table className="my-6">
					<TableCaption>Testimonial List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Testimonial Id</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Testimonial Date and Time</TableHead>
							<TableHead>Testimonial Title</TableHead>
							<TableHead>Testimonial Rating</TableHead>
							<TableHead>Testimonial Content</TableHead>
							<TableHead>is Approved</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{(testimonials || []).map((testimonial) => (
							<>
								<TableRow key={testimonial.testimonialId}>
									<TableCell>{testimonial.testimonialId}</TableCell>
									<TableCell>
										{testimonial.applicationUser.firstname}
										{testimonial.applicationUser.lastname}
									</TableCell>
									<TableCell>
										{new Date(testimonial.testimonialDate).toLocaleDateString()}
									</TableCell>
									<TableCell>{testimonial.testimonialTitle}</TableCell>
									<TableCell>{testimonial.rating}</TableCell>
									<TableCell>{testimonial.comment}</TableCell>
									<TableCell>{testimonial.isApproved ? "Yes" : "No"}</TableCell>
									<TableCell>
										<div className="p-2 flex">
											<Link
												href={{
													pathname: "/Dashboard/Testimonials/Edit",
													query: { testimonialId: testimonial.testimonialId },
												}}>
												<Button size={"lg"} className="mr-2 mb-2 flex">
													Edit
												</Button>
											</Link>
											<Button
												size={"lg"}
												// onClick={() => handleDelete(product.value)}
												className="mr-2 mb-2 flex">
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							</>
						))}
					</TableBody>
				</Table>
			</LanguageProvider>
		</>
	);
}
