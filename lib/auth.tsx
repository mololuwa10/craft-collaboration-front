/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Addresses } from "./dbModels";

export const useLogin = () => {
	const router = useRouter();
	const [error, setError] = useState("");

	const login = useCallback(
		async (username: string, password: string) => {
			try {
				const response = await fetch(
					"https://dissertation-project-backend-b9bee012d5f1.herokuapp.com/api/auth/login",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ username, password }),
					}
				);

				if (response.status === 200) {
					const data = await response.json();
					localStorage.setItem("jwt", data.jwt);
					console.log(data);
					router.push("/");
				} else if (response.status === 401) {
					// Handle invalid credentials
					setError("Invalid username or password.");
				} else {
					// Handle other non-200 responses
					setError("An error occurred during login.");
					console.error("Login failed: ", response.statusText);
				}
			} catch (error) {
				console.error("Login error: ", error);
				setError("An error occurred during login.");
			}
		},
		[router]
	);

	return { login, error };
};

// Category Function------------------------------------
export const createCategoryOrSubcategory = async (
	formData: FormData,
	jwt: string,
	parentId?: number | string
) => {
	try {
		let url = "http://localhost:8080/api/categories";
		if (parentId !== undefined) {
			url += `/${parentId}/subcategories`;
		}

		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();
			alert(
				parentId
					? "Subcategory Added Successfully"
					: "Category Added Successfully"
			);
			window.location.reload();
			return data;
		} else {
			const errorText = await response.text();
			throw new Error(
				`Failed to add ${parentId ? "subcategory" : "category"}: ${errorText}`
			);
		}
	} catch (error) {
		console.error(
			`Error adding ${parentId ? "subcategory" : "category"}: `,
			error
		);
		throw error;
	}
};

export const deleteCategory = async (categoryId: number, jwt: string) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/categories/${categoryId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Could not delete category");
		}
	} catch (err) {
		console.error("Error deleting category: ", err);
		throw err;
	}
};
// -------------------------------------

// Users Function
export const registerUser = async (userData: any) => {
	try {
		const response = await fetch("http://localhost:8080/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (response.ok) {
			const data = await response.json();
			localStorage.setItem("jwt", data.jwt);
			return data;
		} else {
			// Handle non-OK responses
			let errorMessage = `Error during registration: ${response.status}`;
			if (response.headers.get("Content-Type")?.includes("application/json")) {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			}
			throw new Error(errorMessage);
		}
	} catch (error) {
		console.error("There was an error registering the user:", error);
		throw error;
	}
};

// Update User
export const updateUser = async (
	userId: number,
	userData: any,
	jwt: string
) => {
	try {
		const url = `http://localhost:8080/api/admin/updateUser/${userId}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (response.ok) {
			const data = await response.json();
			alert("User Updated Successfully");
			return data;
		} else {
			const errorText = await response.text();
			throw new Error(`Failed to update user: ${errorText}`);
		}
	} catch (error) {
		console.error("Error updating user: ", error);
		throw error;
	}
};

// Create Artisan Profile
export const createArtisanProfile = async (userId: number, jwt: string) => {
	if (!jwt) {
		throw new Error("No JWT provided");
	}
	try {
		const response = await fetch(
			`http://localhost:8080/api/user/createArtisanProfile`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (response.ok) {
			// const data = await response.json();
			return await response.json();
		} else {
			const errorText = await response.text();
			throw new Error(`Failed to create artisan profile: ${errorText}`);
		}
	} catch (error) {
		console.error("Error creating artisan profile:", error);
		throw error;
	}
};

// update Artisan Profile
export const updateArtisanProfile = async (
	artisanData: any,
	selectedStoreBanner: any,
	selectedProfilePicture: any,
	selectedGalleryImages: any,
	jwt: any
) => {
	const formData = new FormData();
	formData.append("artisanProfile", JSON.stringify(artisanData));

	if (selectedProfilePicture) {
		formData.append("profilePicture", selectedProfilePicture);
	}

	if (selectedStoreBanner) {
		formData.append("storeBanner", selectedStoreBanner);
	}

	if (selectedGalleryImages) {
		for (let i = 0; i < selectedGalleryImages.length; i++) {
			formData.append("galleryImages", selectedGalleryImages[i]);
		}
	}

	try {
		const url = `http://localhost:8080/api/artisan`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		});

		if (response.ok) {
			// const data = await response.json();
			return await response.json();
		} else {
			const errorText = await response.text();
			throw new Error(`Failed to update artisan profile: ${errorText}`);
		}
	} catch (error) {
		console.error("Error updating artisan profile: ", error);
		throw error;
	}
};

// Product Function----------------------------------------------------------------------------------------
// Add Product
export const addProduct = async (
	productData: any,
	attributes: any,
	images: File[],
	jwt: string
) => {
	try {
		const url = "http://localhost:8080/api/products";
		const formData = new FormData();
		formData.append("product", JSON.stringify(productData));
		formData.append("attributes", JSON.stringify(attributes));

		images.forEach((image) => {
			formData.append("images", image);
		});

		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + jwt,
			},
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();
			window.location.reload();
			return data;
		} else {
			const errorText = await response.text();
			throw new Error(`Failed to add product: ${errorText}`);
		}
	} catch (error) {
		console.error("Error adding product: ", error);
		throw error;
	}
};

// Adding Product images
export const uploadProductImages = async (
	productId: any,
	images: any,
	jwt: any
) => {
	const formData = new FormData();
	for (const image of images) {
		formData.append("images", image);
	}

	const response = await fetch(
		`http://localhost:8080/api/products/${productId}/images`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
};

// Delete Product
export const deleteProduct = async (productId: number, jwt: string) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/products/${productId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Could not delete product");
		}
	} catch (err) {
		console.error("Error deleting product: ", err);
		throw err;
	}
};

export const translateTextWithApertium = async (
	text: any,
	sourceLang: any,
	targetLang: any
) => {
	const response = await fetch(
		`https://www.apertium.org/apy/translate?langpair=${sourceLang}|${targetLang}&q=${encodeURIComponent(
			text
		)}`,
		{
			method: "GET",
		}
	);

	const data = await response.json();
	if (data.responseStatus === 200 && data.responseData) {
		console.log(data.responseData.translatedText);
		return data.responseData.translatedText;
	} else {
		console.error("Error translating text:", data);
		return "Translation error";
	}
};

export const translateText = async (text: any) => {
	const res = await fetch("https://libretranslate.com/translate", {
		method: "POST",
		body: JSON.stringify({
			q: text,
			source: "auto",
			target: "fr",
			format: "text",
			api_key: "",
		}),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();
	console.log(data);
	return data.translatedText;
};

// Update Product
export const updateProduct = async (
	productId: number,
	attributes: any,
	productData: any,
	jwt: string
) => {
	try {
		const url = `http://localhost:8080/api/products/${productId}`;
		const formData = new FormData();
		formData.append("product", JSON.stringify(productData));
		formData.append("attributes", JSON.stringify(attributes));

		const response = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		});

		if (response.ok) {
			// const data = await response.json();
			return await response.json();
		} else {
			const errorText = await response.text();
			throw new Error(`Failed to update product: ${errorText}`);
		}
	} catch (error) {
		console.error("Error updating product: ", error);
		throw error;
	}
};
// -------------------------------------------------------------------------------------------------------

// Testimonial --------------------------------------------------------------
export const addTestimonial = async (testimonialData: any, jwt: string) => {
	try {
		const response = await fetch("http://localhost:8080/api/testimonials", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(testimonialData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Could not add testimonial");
		}

		// const data = await response.json();
		return await response.json();
	} catch (error) {
		console.error("Error adding testimonial: ", error);
		throw error;
	}
};
// -------------------------------------------------------------------------

//Review Section ------------------------------------------------------------
export const addReview = async (
	reviewData: any,
	jwt: string,
	id: number,
	type: "product" | "artisan"
) => {
	const endpoint = type === "product" ? `product/${id}` : `artisan/${id}`;
	try {
		const response = await fetch(
			`http://localhost:8080/api/reviews/${endpoint}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reviewData),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Could not add testimonial");
		}

		// const data = await response.json();
		return await response.json();
	} catch (error) {
		console.error("Error adding testimonial: ", error);
		throw error;
	}
};
//---------------------------------------------------------------------------

// Cart Function -------------------------------------------------------------
// Updating the quantity of a product in the cart
export const updateCartItemQuantity = async (
	cartItemId: any,
	quantity: any,
	jwt: any
) => {
	const response = await fetch(
		`http://localhost:8080/api/shoppingCart/cartItem/${cartItemId}`,
		{
			method: "PUT",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ quantity }),
		}
	);

	if (!response.ok) {
		throw new Error("Failed to update cart item quantity");
	}
	return response.json();
};

// Remove a product from the cart
export const removeCartItem = async (cartItemId: any, jwt: any) => {
	const response = await fetch(
		`http://localhost:8080/api/shoppingCart/cartItem/${cartItemId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to remove cart item");
	}

	return true;
};

// Adding Product to cart ---------------------------------------
export const addProductToCart = async (
	productId: any,
	quantity: any,
	selectedAttributes: any,
	jwt: any
) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/shoppingCart/addToCart/${productId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify({ quantity, attributeIds: selectedAttributes }),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to add product to cart");
		}

		const data = await response.json();
		console.log("Product added to cart:", data);
		return data;
	} catch (error) {
		console.error("Error adding product to cart:", error);
		throw error;
	}
};

// --------------------------------------------------------------

// Checkout Function
export const checkout = async (checkoutData: any, jwt: any) => {
	const response = await fetch(
		"http://localhost:8080/api/stripe/create-checkout-session",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(checkoutData),
		}
	);

	if (!response.ok) {
		const errorText = await response.text();
		console.error("Checkout session creation failed:", errorText);
		throw new Error(`Failed to create checkout session: ${errorText}`);
	}

	// const data = await response.json();
	return await response.json();
};

// Order function
export const handleCancelOrder = async (orderId: any) => {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			`http://localhost:8080/api/orders/${orderId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		// If the response is successful, resolve the promise
		return Promise.resolve("Order cancelled successfully");
	} catch (error) {
		// Handle any errors here
		console.error("Failed to cancel the order:", error);
	}
};

// Address ----------------------
// Add Address ------------------------------
export const createAddresses = async (address: Addresses) => {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch("http://localhost:8080/api/addresses", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(address),
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		// const data = await response.json();
		return await response.json();
	} catch (error) {
		console.error("Error creating address:", error);
		throw error;
	}
};

// update address
export const updateAddress = async (addressId: number, address: Addresses) => {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			`http://localhost:8080/api/addresses/${addressId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify(address),
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error("Error updating address:", err);
		throw err;
	}
};

// Delete Address
export const deleteAddress = async (addressId: number) => {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			`http://localhost:8080/api/addresses/${addressId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		return true;
	} catch (err) {
		console.error("Error deleting address:", err);
		throw err;
	}
};

// Set Address as default
export const setDefaultAddress = async (addressId: number) => {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			`http://localhost:8080/api/addresses/set-default/${addressId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error("Error setting default address:", err);
		throw err;
	}
};
