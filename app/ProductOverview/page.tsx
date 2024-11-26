"use client";

import ImageGalleryComponents from "@/components/ProductOverviewComponents/ImageGalleryComponents";
import ProductInfo from "@/components/ProductOverviewComponents/ProductInfo";
import ProductReviews from "@/components/ProductOverviewComponents/ProductReviews";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LanguageProvider } from "../LanguageContext";

export default function ProductOverview() {
	return (
		<>
			<LanguageProvider>
				<Header />
				<div className="container mx-auto mt-10">
					<div className="flex flex-wrap md:flex-nowrap">
						<div className="w-full md:w-1/2 p-4">
							<ImageGalleryComponents />
						</div>
						<ProductInfo />
					</div>

					<div className="mt-10">
						{/* Product Reviews Component */}
						<ProductReviews />
					</div>
				</div>

				<hr className=" mx-20 border-t-2 border-gray-600" />

				<Footer />
			</LanguageProvider>
		</>
	);
}
