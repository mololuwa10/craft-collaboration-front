/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { checkout, removeCartItem, updateCartItemQuantity } from "@/lib/auth";
import { fetchShoppingCart } from "@/lib/dbModels";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchUserInfo } from "@/lib/data";
import { LanguageProvider } from "../LanguageContext";

type Product = {
	productId: number;
	productName: string;
	productDescription: string;
	productPrice: number;
	productStockQuantity: number;
	productDiscount: number;
	imageUrls: string[];
};

type Item = {
	cartItemId: number;
	product: Product;
	quantity: number;
	totalProductPrice: number;
};

const CartItem = ({
	item,
	onItemChange,
}: {
	item: Item;
	onItemChange: () => void;
}) => {
	const { userDetails } = useFetchUserInfo();

	// Determine the maximum number of selectable items
	const maxQuantity = Math.min(item.product.productStockQuantity, 20);

	// Generating an array of numbers from 1 to maxQuantity
	const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

	const jwt = localStorage.getItem("jwt");

	const handleQuantityChange = async (event: any) => {
		const newQuantity = parseInt(event.target.value, 10);
		if (!jwt) {
			console.error("JWT not found");
			return;
		}

		try {
			await updateCartItemQuantity(item.cartItemId, newQuantity, jwt);
			toast.success("Quantity updated");
			onItemChange();
		} catch (error) {
			console.error("Failed to update quantity", error);
			toast.error("Failed to update quantity. Please try again.");
		}
	};

	const handleRemoveClick = async () => {
		if (!jwt) {
			console.error("JWT not found");
			return;
		}

		try {
			await removeCartItem(item.cartItemId, jwt);
			toast.success("Item removed");
			onItemChange();
		} catch (error) {
			console.error("Failed to remove item", error);
			toast.error("Failed to remove item. Please try again.");
		}
	};

	const displayedPrice =
		typeof item.product.productDiscount === "number" &&
		item.product.productDiscount >= 0
			? item.product.productDiscount
			: item.product.productPrice;

	return (
		<div className="flex justify-between items-center p-4 bg-white rounded-md shadow mb-3">
			{/* Image */}
			<div className="flex-shrink-0">
				<img
					src={`http://localhost:8080${item.product.imageUrls[0]}`}
					alt={item.product.productName}
					className="w-20 h-20 object-cover rounded"
				/>
			</div>
			{/* Description and Price */}
			<div className="flex-grow px-3">
				<div className="text-lg font-semibold">{item.product.productName}</div>

				<div className="text-lg font-semibold text-red-600">
					{typeof item.product.productDiscount === "number" &&
						item.product.productDiscount > 0 && (
							<span className="line-through text-gray-500">
								{`£${item.product.productPrice.toFixed(2)}`}
							</span>
						)}
					£{displayedPrice.toFixed(2)}
				</div>
				<div className="text-sm text-green-600">
					{item.product.productStockQuantity > 0 ? "In stock" : "Out of stock"}
				</div>
			</div>
			{/* Quantity Selector */}
			<div>
				<select
					className="border-gray-300 rounded"
					value={item.quantity}
					onChange={handleQuantityChange}>
					{quantityOptions.map((quantity) => (
						<option key={quantity} value={quantity}>
							{quantity}
						</option>
					))}
				</select>
			</div>
			{/* Remove Button */}
			<div>
				<button
					onClick={handleRemoveClick}
					className="text-gray-500 hover:text-gray-700">
					<X />
				</button>
			</div>
		</div>
	);
};

const OrderSummary = ({ cartItems }: { cartItems: Item[] }) => {
	// Calculate subtotal by summing the totalProductPrice of each item
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.totalProductPrice,
		0
	);

	// Defining a fixed tax rate and shipping fee for demonstration
	const taxRate = 0.07;
	const shippingFee = subtotal > 50 ? 0 : 5.0;

	// Calculating tax and total
	// const tax = subtotal * taxRate;
	const total = subtotal + shippingFee;

	const handelCheckoutClick = async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			console.error("JWT not found");
			toast.error("You must be logged in to checkout");
			return;
		}

		try {
			const checkoutData = {
				items: cartItems.map((item) => ({
					productId: item.product.productId,
					quantity: item.quantity,
				})),
				customerEmail: "test@email.com",
				quantity: total,
				amount: total,
				currency: "gbp",
				successUrl: "http://localhost:3000/ShoppingCart/Success",
				cancelUrl: "http://example.com/cancel",
			};

			const checkoutResponse = await checkout(checkoutData, jwt);
			// Verify checkoutResponse contains a URL before redirecting
			if (checkoutResponse && checkoutResponse.url) {
				toast.success("Redirecting to payment...");
				setTimeout(() => {
					window.location.href = checkoutResponse.url;
				}, 1500);
			} else {
				toast.error(
					"Your account is not verified. Please verify your account to checkout"
				);
				console.error("Unexpected response structure:", checkoutResponse);
			}
		} catch (error: any) {
			console.error("Checkout error:", error);
			let errorMessage = "Checkout failed. Please try again.";

			// Assuming error is thrown with message when fetch is not ok
			if (error.message.includes("User is not verified")) {
				errorMessage =
					"Your account is not verified. Please verify your account to checkout.";
			}

			toast.error(errorMessage);
		}
	};

	return (
		<div className="p-4 bg-white rounded-md shadow">
			<h2 className="text-lg font-semibold mb-3">Order summary</h2>
			<div className="flex justify-between mb-1">
				<span>Subtotal</span>
				<span>{`£${subtotal.toFixed(2)}`}</span>
			</div>

			<div className="flex justify-between mb-1">
				<span>Shipping</span>
				<span>{`£${shippingFee.toFixed(2)}`}</span>
			</div>
			<div className="flex justify-between mb-1 font-semibold">
				<span>Total</span>
				<span>{`£${total.toFixed(2)}`}</span>
			</div>
			<button
				className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 mt-3"
				onClick={handelCheckoutClick}>
				Checkout
			</button>
		</div>
	);
};

const ShoppingCart = () => {
	const [cartData, setCartData] = useState(null);
	const [error, setError] = useState("");

	// Define fetchCartData function
	const fetchCartData = async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			setError("You must be logged in to view your cart");
			return;
		}

		try {
			const data = await fetchShoppingCart(jwt);
			setCartData(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error fetching shopping cart:", error.message);
				toast.error("Failed to load shopping cart. Please try again.");
			}
		}
	};

	useEffect(() => {
		fetchCartData();
	}, []);

	if (error) {
		return <div>{error}</div>;
	}

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
				<div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
					<h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
					<div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
						<div className="lg:col-span-2">
							{cartData && cartData.cartItems.length > 0 ? (
								<div className="lg:col-span-2">
									{cartData.cartItems.map((item: any) => (
										<CartItem
											key={item.cartItemId}
											item={item}
											onItemChange={fetchCartData}
										/>
									))}
								</div>
							) : (
								<p>Your cart is empty</p>
							)}
						</div>
						<div className="lg:col-span-1">
							<OrderSummary cartItems={cartData?.cartItems ?? []} />
						</div>
					</div>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
};

export default ShoppingCart;
