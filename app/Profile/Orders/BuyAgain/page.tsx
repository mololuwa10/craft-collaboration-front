/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { fetchCurrentUserOrders } from "@/lib/dbModels";
import Header from "@/components/layoutComponents/Header";
import Footer from "@/components/layoutComponents/Footer";
import { FaSearch } from "react-icons/fa";
import HeaderTabs from "@/components/ProfilePageComponents/OrderPageComponents/HeaderTabs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProductToCart } from "@/lib/auth";
import { LanguageProvider } from "@/app/LanguageContext";

interface Order {
	id: string;
	totalPrice: number;
	status: string;
	orderDateTime: string;
	quantity: string;
	user: {
		firstname: string;
		lastname: string;
		user_email: string;
		phone: string;
		contactAddress: string;
		contactTelephone: string;
	};

	items: Array<{
		id: string | number;
		productDTO: {
			productId: string | number;
			productName: string;
			productDescription: string;
			productStockQuantity: string | number;
			productPrice: string | number;
			productDiscount: string | number;
			imageUrls: string[];
		};
		quantity: number;
		priceAtOrder: number;
	}>;
}

const ProductCard = ({ product }: { product: any }) => {
	const formatPrice = (price: any) => {
		return typeof price === "number" ? price.toFixed(2) : "0.00";
	};

	const handleAddToCart = async () => {
		const jwtToken = localStorage.getItem("jwt");
		if (!jwtToken) {
			toast.error("You must be logged in to add products to the cart.");
			return;
		}

		if (!product.productId) {
			toast.error("Product ID is not available.");
			return;
		}

		try {
			await addProductToCart(product.productId, 1, [], jwtToken);
			toast.success("Product added to cart successfully!");
		} catch (error) {
			console.error("Error adding product to cart:", error);
			toast.error("Failed to add product to cart. Please try again.");
		}
	};

	return (
		<>
			<div className="flex flex-col items-center bg-white p-4 shadow rounded-lg">
				<img
					src={`${product.imageUrls[0]}`}
					alt={product.productName}
					className="w-32 h-32 object-cover mb-3"
				/>
				<h5 className="text-md font-bold mb-2">{product.productName}</h5>
				<p className="text-sm text-gray-500 mb-1">
					{product.productDescription.slice(0, 60)}...
				</p>
				<div className="text-lg font-bold text-gray-800 mb-3">
					{product.productDiscount ? (
						<>
							<span className="text-red-500">
								£{formatPrice(product.productDiscount)}
							</span>
							<span className="line-through text-gray-500 ml-2">
								£{formatPrice(product.productPrice)}
							</span>
						</>
					) : (
						<span>£{formatPrice(product.productPrice)}</span>
					)}
				</div>
				<button
					className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors"
					onClick={handleAddToCart}
				>
					Add to Basket
				</button>
			</div>
		</>
	);
};
const BuyAgain = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchCurrentUserOrders()
			.then((data) => {
				const products = data
					.map((order: Order) =>
						order.items.map((item) => ({
							...item.productDTO,
							productId: item.productDTO.productId,
							productPrice: item.productDTO.productPrice,
							productDiscount: item.productDTO.productDiscount,
							imageUrls: item.productDTO.imageUrls.map(
								(url) =>
									`https://dissertation-project-backend-b9bee012d5f1.herokuapp.com${url}`
							),
						}))
					)
					.flat();

				setAllOrders(products);
				setFilteredOrders(products);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, []);

	// Function to filter orders based on the search query
	const filterOrders = useCallback(
		(query: string) => {
			if (!query) {
				// If the search query is empty, show all orders
				setFilteredOrders(allOrders);
			} else {
				// Filter orders that match the search query
				const lowercasedQuery = query.toLowerCase();
				const filtered = allOrders.filter((order) => {
					return order.items.some((item) =>
						item.productDTO.productName.toLowerCase().includes(lowercasedQuery)
					);
				});
				setFilteredOrders(filtered);
			}
		},
		[allOrders]
	);

	// Update the filtered orders whenever the search query changes
	useEffect(() => {
		filterOrders(searchQuery);
	}, [searchQuery, allOrders, filterOrders]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	// Function to handle search input changes
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<>
			<LanguageProvider>
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
				<Header />

				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center my-3">
						<h1 className="text-2xl font-bold leading-tight text-gray-900">
							Your Orders
						</h1>
						<div className="relative">
							<input
								type="text"
								className="h-10 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none border-2"
								placeholder="Search orders..."
								value={searchQuery}
								onChange={handleSearchChange}
							/>
							<div className="absolute top-2 left-3">
								<i className="fa fa-search hover:text-gray-500">
									<FaSearch />
								</i>
							</div>
							<div className="absolute top-2 right-2">
								<button
									className="h-6 w-20 text-white rounded-lg bg-gray-800 hover:bg-gray-900"
									onClick={() => {
										/* Add search functionality here */
									}}
								>
									Search
								</button>
							</div>
						</div>
					</div>
					<HeaderTabs />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
					{filteredOrders.map((product, index) => (
						<ProductCard key={index} product={product} />
					))}
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
};

export default BuyAgain;
