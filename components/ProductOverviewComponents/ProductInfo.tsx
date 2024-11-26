import { fetchProductById, fetchReviewsByProductId } from "@/lib/dbModels";
import { addProductToCart } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatBox } from "./ChatBox";
import Link from "next/link";

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
	attributes: {};
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

export default function ProductInfo() {
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId");
	const [product, setProduct] = useState<Product | null>(null);
	const [error, setError] = useState("");
	const [reviews, setReviews] = useState<Review[]>([]);
	const [selectedQuantity, setSelectedQuantity] = useState(1);
	const [selectedAttributes, setSelectedAttributes] = useState({});

	const handleAttributeChange = (attributeKey: any, attributeId: any) => {
		setSelectedAttributes((prevAttributes) => ({
			...prevAttributes,
			[attributeKey]: parseInt(attributeId, 10),
		}));
	};

	// Determining the maximum selectable quantity
	const maxSelectableQuantity = Math.min(
		product?.productStockQuantity || 0,
		10
	);

	// Generating an array for the selectable quantities
	const quantityOptions = Array.from(
		{ length: maxSelectableQuantity },
		(_, index) => index + 1
	);

	const groupAttributes = (attributes: any) => {
		return attributes.reduce((acc: any, attr: any) => {
			acc[attr.key] = acc[attr.key]
				? [...acc[attr.key], attr.value]
				: [attr.value];
			return acc;
		}, {});
	};

	useEffect(() => {
		fetchReviewsByProductId(productId as string)
			.then((reviews) => {
				setReviews(reviews);
			})
			.catch((error) => {
				console.error(error);
				setError("Failed to load reviews");
			});
	}, [productId]);

	const displayedPrice =
		typeof product?.productDiscount === "number" && product.productDiscount >= 0
			? product.productDiscount
			: product?.productPrice;

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

	useEffect(() => {
		if (productId) {
			fetchProductById(Number(productId))
				.then((fetchedProduct) => {
					const groupedAttributes = groupAttributes(fetchedProduct.attributes);
					// Set product with grouped attributes
					setProduct({ ...fetchedProduct, attributes: groupedAttributes });
				})
				.catch((err: Error) => {
					console.error(err);
					setError("Failed to fetch product details");
				});
		}
	}, [productId]);

	const handleAddToCart = async () => {
		const jwtToken = localStorage.getItem("jwt");
		if (!jwtToken) {
			toast.error("You must be logged in to add products to the cart.");
			return;
		}

		if (!productId) {
			toast.error("Product ID is not available.");
			return;
		}

		// Check if the selected quantity exceeds available stock
		if (selectedQuantity > (product?.productStockQuantity || 0)) {
			toast.error("Selected quantity exceeds available stock.");
			return;
		}

		// // Converting selectedAttributes into an array of selected attribute IDs
		// const attributeIds = Object.values(selectedAttributes);

		// Log the selected attributes to confirm their values before sending
		console.log("Selected Attributes:", selectedAttributes);

		// ConvertING selectedAttributes into an array of selected attribute IDs
		const attributeIds = Object.values(selectedAttributes).filter(
			(id) => id !== null
		);

		try {
			await addProductToCart(
				productId,
				selectedQuantity,
				attributeIds,
				jwtToken
			);
			toast.success("Product added to cart successfully!");
			window.location.reload();
		} catch (error) {
			console.error("Error adding product to cart:", error);
			toast.error("Failed to add product to cart. Please try again.");
		}
	};

	const handleQuantityChange = (event: any) => {
		setSelectedQuantity(Number(event.target.value));
	};

	// Check if the product is out of stock
	const isOutOfStock = product?.productStockQuantity === 0;

	const [isChatOpen, setChatOpen] = useState(false);

	const toggleChat = () => {
		setChatOpen(!isChatOpen);
	};

	return (
		<>
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
			<div className="w-full md:w-1/2 p-4">
				<h1 className="text-2xl font-bold">{product?.productName}</h1>
				<div className="text-xl font-semibold text-red-600">
					{typeof product?.productDiscount === "number" &&
						product.productDiscount > 0 && (
							<span className="line-through text-gray-500">
								£{product?.productPrice.toFixed(2)}
							</span>
						)}
					£{displayedPrice}
				</div>
				{/* Reviews */}
				<div className="mt-6">
					<h3 className="sr-only">Reviews</h3>
					<div className="flex items-center">
						<div className="flex items-center">
							{renderStars(parseFloat(averageRating.toFixed(1)))}
						</div>
						<a
							href={"#"}
							className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
							{`${reviews.length || 0} Reviews`}
						</a>
					</div>
				</div>
				<div className="mt-4 text-xl font-medium">
					{product?.productDescription}
				</div>

				{/* Quantity Selector */}
				{/* Check and display if the product is out of stock */}
				{isOutOfStock ? (
					<div className="mt-6 text-red-500 text-xl">
						Out of stock, check back later 🙂
					</div>
				) : (
					// If the product is in stock, display the quantity selector and add-to-cart button
					<>
						{/* Quantity Selector */}
						<Label htmlFor="quantity" className="font-normal text-xl my-6">
							Quantity
						</Label>
						<select
							className="border-gray-900 border-2 p-4 rounded-2xl w-full my-3"
							value={selectedQuantity}
							onChange={handleQuantityChange}>
							{quantityOptions.map((quantity) => (
								<option key={quantity} value={quantity}>
									{quantity}
								</option>
							))}
						</select>

						{/* Attribute Selectors */}
						{product &&
							Object.entries(product.attributes).map(
								([productAttributeId, attributes]) =>
									Array.isArray(attributes) && attributes.length > 1 ? (
										<div key={productAttributeId} className="my-6">
											<Label
												htmlFor={productAttributeId}
												className="font-normal text-xl">
												{productAttributeId}
											</Label>
											<select
												id={productAttributeId}
												name={productAttributeId}
												className="border-gray-900 border-2 p-4 rounded-2xl w-full my-3"
												onChange={(e) =>
													handleAttributeChange(
														productAttributeId,
														e.target.value
													)
												}>
												{attributes.map((attribute) => (
													<option
														key={attribute.productAttributeId}
														value={attribute.productAttributeId}>
														{attribute}
													</option>
												))}
											</select>
										</div>
									) : null
							)}
						<Button
							size="lg"
							className="w-full bg-gray-800 text-white py-3 rounded-3xl hover:bg-gray-900 mt-4"
							onClick={handleAddToCart}>
							Add to cart
						</Button>

						{/* <Button
							size="lg"
							className="w-full text-white py-3 rounded-3xl hover:bg-blue-600 mt-4">
							Buy Now
						</Button>
						<Button
							size="lg"
							className="w-full text-white py-3 rounded-3xl hover:bg-blue-600 mt-4">
							Add to Collection
						</Button> */}
					</>
				)}

				{/* Other product details and policies */}
				<div className="mt-6 space-y-6">
					<div className="text-lg font-medium text-gray-900">Item details</div>
					<ul className="space-y-4 text-sm text-gray-600">
						<li>Handmade</li>
						{product &&
							Object.entries(product.attributes).map(([key, values]) => (
								<li key={key}>
									{key}: {(values as string[])[0]}
								</li>
							))}
					</ul>
					<div className="text-lg font-medium text-gray-900">
						Delivery and return policies
					</div>
					<ul className="space-y-4 text-sm text-gray-600">
						<li>Order today to get by 19-24 Feb</li>
						<li>Returns & exchanges accepted within 7 days</li>
						<li>Free delivery</li>
					</ul>
					<div className="text-lg font-medium text-gray-900">
						Meet your sellers
					</div>
					<div className="text-sm text-gray-600">
						{product?.artisanProfile.firstname}
					</div>
					<div className="text-sm text-gray-600">
						Owner of{" "}
						<Link
							href={{
								pathname: "/ArtisanProfileOverview",
								query: { artisanId: product?.artisanProfile.artisanId },
							}}
							className="underline font-medium text-gray-600 hover:text-gray-700">
							{product?.artisanProfile.storeName}
						</Link>
					</div>
					<Button
						size="lg"
						className="w-full bg-gray-800 text-white py-2 rounded-3xl mt-4"
						onClick={toggleChat}>
						Message {product?.artisanProfile.firstname}
					</Button>
				</div>
				<ChatBox
					isOpen={isChatOpen}
					onClose={toggleChat}
					artisanName={product?.artisanProfile.firstname!}
					artisanStore={product?.artisanProfile.storeName!}
					artisanId={product?.artisanProfile.artisanId!}
					productId={product?.productId!}
				/>
			</div>
		</>
	);
}
