"use client";

import React, { useState, useEffect, useCallback, SetStateAction } from "react";

export interface ArtisanProfile {
	artisanId: number;
	artisan: {
		firstname: string;
		lastname: string;
	};
	bio: string;
	profilePicture: string | null;
	location: string | null;
	storeName: string | null;
	storeBanner: string | null;
	announcements: string | null;
	businessHours: string | null;
	gallery: string[];
	stories: string | null;
	specializations: string | null;
	materialsUsed: string | null;
	servicesOffered: string | null;
	experienceYears: number | null;
	shippingPolicies: string | null;
	returnPolicy: string | null;
	paymentOptions: string | null;
	termsConditions: string | null;
	privacyPolicy: string | null;
	communicationPreferences: string | null;
	preferredLanguage: string | null;
	creationDate: string;
}

export interface TopArtisanProfile {
	artisan: {
		artisanId: number;
		artisan: {
			firstname: string;
			lastname: string;
		};
		bio: string;
		profilePicture: string | null;
		location: string | null;
		storeName: string | null;
		storeBanner: string | null;
		announcements: string | null;
		businessHours: string | null;
		gallery: string[];
		stories: string | null;
		specializations: string | null;
		materialsUsed: string | null;
		servicesOffered: string | null;
		experienceYears: number | null;
		shippingPolicies: string | null;
		returnPolicy: string | null;
		paymentOptions: string | null;
		termsConditions: string | null;
		privacyPolicy: string | null;
		communicationPreferences: string | null;
		preferredLanguage: string | null;
		creationDate: string;
	};
}
export interface Addresses {
	addressId: number | null;
	country: string | null;
	postcode: string | null;
	addressLine1: string | null;
	addressLine2?: string | null;
	city: string | null;
	county?: string | null;
	default: boolean | null;
}

export const useFetchCategoryById = (categoryId: any) => {
	interface Category {
		categoryId: number;
		categoryName: string;
		categoryDescription: string;
		categoryImageUrl: string;
	}

	const [category, setCategory] = useState<Category | null>(null);

	useEffect(() => {
		if (!categoryId) return;

		fetch(`http://localhost:8080/api/categories/${categoryId}`)
			.then((response) => response.json())
			.then((data) => {
				const formattedData: Category = {
					categoryId: data.categoryId,
					categoryName: data.categoryName,
					categoryDescription: data.categoryDescription,
					categoryImageUrl: data.categoryImageUrl,
				};
				setCategory(formattedData);
				console.log(formattedData);
			})
			.catch((error) => {
				console.error("Error fetching category:", error);
			});
	}, [categoryId]);

	return { category };
};

// User Function
export const useFetchUsers = () => {
	// Define User interface
	interface User {
		userId: number;
		username: string;
		user_email: string;
		firstname: string;
		lastname: string;
		dateJoined: string | null;
		contactTelephone: string;
		contactAddress: string;
		authorities: {
			authority: string;
		}[];
	}

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const jwt = localStorage.getItem("jwt");

		if (jwt) {
			fetch("http://localhost:8080/api/admin/allUsers", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
			})
				.then((response) => {
					// Check for unauthorized response
					if (response.status === 401) {
						throw new Error("Unauthorized access. Please login.");
					}
					return response.json();
				})
				.then((data) => {
					const formattedData = data.map((user: User) => ({
						userId: user.userId,
						username: user.username,
						user_email: user.user_email,
						firstname: user.firstname,
						lastname: user.lastname,
						dateJoined: user.dateJoined,
						contactTelephone: user.contactTelephone,
						contactAddress: user.contactAddress,
						authorities: user.authorities
							.map((auth) => auth.authority)
							.join(", "),
						checked: false,
					}));
					setUsers(formattedData);
					console.log(formattedData);
				})
				.catch((error) => {
					console.error("Error fetching users:", error);
				});
		} else {
			console.log(
				"JWT token not found. User must be logged in to access this data."
			);
		}
	}, []);

	return { users };
};

// get user by id
export async function fetchUserById(userId: any, jwt: string) {
	try {
		const response = await fetch(
			`http://localhost:8080/api/admin/user/${userId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			// Handle HTTP errors
			throw new Error(`Error fetching user: ${response.status}`);
		}

		const user = await response.json();
		return user;
	} catch (error) {
		console.error("Fetching user failed:", error);
		throw error;
	}
}

export async function fetchAllRoles(jwt: string) {
	try {
		const response = await fetch("http://localhost:8080/api/admin/allRoles", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch roles");
		}

		const roles = await response.json();
		return roles;
	} catch (error) {
		console.error("Error fetching roles:", error);
		throw error;
	}
}

// Artisan functions
// Get all artisans
export async function fetchAllArtisans() {
	const response = await fetch("http://localhost:8080/api/user/allArtisans", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch artisans");
	}

	return response.json();
}

// Getting all new artisans within the span of 2 weeks
export const fetchNewArtisans = async (): Promise<ArtisanProfile[]> => {
	try {
		const response = await fetch("http://localhost:8080/api/user/newArtisans");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const artisans: ArtisanProfile[] = await response.json();
		return artisans;
	} catch (error) {
		console.error("Error fetching new artisans:", error);
		throw error; // Re-throw to let calling code handle it
	}
};

export const fetchArtisanById = async (
	artisanId: any
): Promise<ArtisanProfile> => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/artisan/${artisanId}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const artisans: ArtisanProfile = await response.json();
		return artisans;
	} catch (error) {
		console.error("Error fetching new artisans:", error);
		throw error;
	}
};
// Get all searched products
export const useFetchSearchedProducts = (
	searchTerm: string,
	filters: Record<string, any>
) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.append("searchTerm", searchTerm);

		Object.keys(filters).forEach((key) => {
			const value = filters[key];
			if (value) {
				if (value instanceof Set || Array.isArray(value)) {
					// For Sets or Arrays, append each value separately
					value.forEach((item: any) => params.append(key, item.toString()));
				} else {
					// For other types, just append directly
					params.append(key, value.toString());
				}
			}
		});

		const fetchProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:8080/api/products/search?${params}`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setProducts(data.content);
				console.log("Filtered products: ", data.content);
			} catch (error) {
				console.error("Error fetching products:", error);
				setError(error as SetStateAction<null>);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();

		console.log(`Fetching products with params: ${params.toString()}`);
		// Use a cleanup function to avoid setting state on unmounted component
		return () => {
			setLoading(false);
			setError(null);
		};
	}, [filters, searchTerm]);

	return { products, loading, error };
};

// Product function
export const useFetchProducts = () => {
	// Product function
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
		};
		artisanProfile: {
			artisanId: number;
		};
		dateTimeListed: string;
		dateTimeUpdated: string;
	}
	const [products, setProducts] = useState([]);
	// Fetch products with selected category filter
	useEffect(() => {
		fetch("http://localhost:8080/api/products")
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((product: Product) => ({
					value: product.productId,
					label: product.productName,
					description: product.productDescription,
					price: product.productPrice,
					quantity: product.productStockQuantity,
					image: product.imageUrls[0],
					dateTimeListed: product.dateTimeListed,
					dateTimeUpdated: product.dateTimeUpdated,
					discount: product.productDiscount,
					category: product.category,
					artisan: product.artisanProfile,
					checked: false,
				}));
				console.log(formattedData);
				setProducts(formattedData);
			});
	}, []);

	return { products };
};

// Getting Products with the highest sales
export async function highestSellingProducts() {
	try {
		const response = await fetch(
			"http://localhost:8080/api/orders/product-sales",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch highest selling products");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching highest selling products:", error);
		throw error;
	}
}

// get product by id
export async function fetchProductById(productId: any) {
	try {
		const response = await fetch(
			`http://localhost:8080/api/products/${productId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error fetching product: ${response.status}`);
		}

		const product = await response.json();
		return product;
	} catch (error) {
		console.error("Fetching product failed:", error);
		throw error;
	}
}

// get product by artisan id
export async function fetchProductsByArtisanId(artisanId: any) {
	try {
		const response = await fetch(
			`http://localhost:8080/api/products/artisan/${artisanId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error fetching product By Artisan: ${response.status}`);
		}

		const products = await response.json();
		console.log(products);
		return products;
	} catch (err) {
		console.error("Fetching products failed:", err);
		throw err;
	}
}

// Get All categories
export const useFetchAllCategories = () => {
	interface Category {
		categoryId: number;
		categoryName: string;
		categoryDescription: string;
		categoryImageUrl: string;
	}
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/categories/allCategories")
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((category: Category) => ({
					value: category.categoryId,
					label: category.categoryName,
					description: category.categoryDescription,
					image: category.categoryImageUrl,
					checked: false,
				}));
				setCategories(formattedData);
			});
	}, []);

	return { categories };
};

// Get Parent Categories
export const useFetchCategories = () => {
	interface Category {
		categoryId: number;
		categoryName: string;
		categoryDescription: string;
		categoryImageUrl: string;
	}
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/categories")
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((category: Category) => ({
					value: category.categoryId,
					label: category.categoryName,
					description: category.categoryDescription,
					image: category.categoryImageUrl,
					checked: false,
				}));
				setCategories(formattedData);
			});
	}, []);

	return { categories };
};

export const useFetchSubcategories = (categoryId: any) => {
	interface Category {
		categoryId: number;
		categoryName: string;
		categoryDescription: string;
		categoryImageUrl: string;
	}
	const [subcategories, setSubcategories] = useState([]);
	// const { updateFilters, filters } = useFilterContext();

	useEffect(() => {
		fetch(`http://localhost:8080/api/categories/${categoryId}/subcategories`)
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((category: Category) => ({
					value: category.categoryId,
					label: category.categoryName,
					description: category.categoryDescription,
					image: category.categoryImageUrl,
					checked: false,
				}));
				setSubcategories(formattedData);
				console.log(formattedData);
			})
			.catch((error) => {
				console.error("Error fetching subcategories:", error);
			});
	}, [categoryId]);
	return { subcategories };
};

// get all testimonials
export const useGetAllTestimonials = () => {
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
	const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const response = await fetch("http://localhost:8080/api/testimonials", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch testimonials");
				}

				const data = await response.json();
				setTestimonials(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching testimonials: ", error);
			}
		};

		fetchTestimonials();
	}, []);

	return { testimonials };
};
// Get all approved testimonials
export const useGetTestimonials = () => {
	interface Testimonials {
		testimonialId: number;
		testimonialTitle: string;
		rating: number;
		comment: string;
		reviewDate: string;
		testimonialDate: string;
		isApproved: boolean;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
	}
	const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/api/testimonials/approvedTestimonials",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch testimonials");
				}

				const data = await response.json();
				setTestimonials(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching testimonials: ", error);
			}
		};

		fetchTestimonials();
	}, []);

	return { testimonials };
};

export const useGetMoreTestimonials = (page: any, pageSize: any) => {
	interface Testimonials {
		testimonialId: number;
		testimonialTitle: string;
		rating: number;
		comment: string;
		reviewDate: string;
		testimonialDate: string;
		isApproved: boolean;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
	}
	const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/testimonials/approvedTestimonials?page=${page}&pageSize=${pageSize}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch testimonials");
				}

				const data = await response.json();
				setTestimonials(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching testimonials: ", error);
			}
		};

		fetchTestimonials();
	}, [page, pageSize]);

	return { testimonials };
};

// Get all testimonials by Id
export const useGetTestimonialsById = (testimonialId: any) => {
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
	const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/testimonials/${testimonialId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				} else {
					const data = await response.json();
					setTestimonials(data);
					console.log(data);
				}
			} catch (error) {
				console.error("Error fetching testimonials: ", error);
			}
		};
		fetchTestimonials();
	}, [testimonialId]);

	return { testimonials };
};

// Get all Reviews by product
export async function fetchReviewsByProductId(productId: number | string) {
	try {
		const response = await fetch(
			`http://localhost:8080/api/reviews/product/${productId}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const reviews = await response.json();
		console.log(reviews);
		return reviews;
	} catch (error) {
		console.error("Failed to fetch reviews:", error);
		throw error;
	}
}

// Get all review by users
export async function fetchReviewsByUserId(userId: number | string) {
	try {
		const response = await fetch(
			`http://localhost:8080/api/reviews/user/${userId}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const userReviewData = await response.json();
		console.log(userReviewData);
		return userReviewData;
	} catch (error) {
		console.error("Failed to fetch reviews:", error);
		throw error;
	}
}

// Get Shopping Cart
export async function fetchShoppingCart(jwt: any) {
	const response = await fetch(
		"http://localhost:8080/api/shoppingCart/getCart",
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch shopping cart");
	}

	return response.json();
}

// Orders -------------------------------------------------------
// Get Orders
export async function fetchCurrentUserOrders() {
	const jwt = localStorage.getItem("jwt");
	const response = await fetch(
		"http://localhost:8080/api/orders/users/my-orders",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		}
	);

	if (!response.ok) {
		// Handle the error case
		const message = await response.text();
		throw new Error(
			`HTTP error! status: ${response.status}, message: ${message}`
		);
	}

	return response.json();
}

// Get all orders
export async function fetchAllOrders() {
	const jwt = localStorage.getItem("jwt");
	const response = await fetch("http://localhost:8080/api/orders/all-orders", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});
	if (!response.ok) {
		// Handle the error case
		const message = await response.text();
		throw new Error(
			`HTTP error! status: ${response.status}, message: ${message}`
		);
	}

	return response.json();
}

// Get all orders by artisan
export async function fetchOrdersByArtisan() {
	const jwt = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			`http://localhost:8080/api/orders/artisan/orders`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
			}
		);

		if (!response.ok) {
			const message = await response.text();
			throw new Error(`Error: ${response.status}, Message: ${message}`);
		}

		const orders = await response.json();
		return orders;
	} catch (error) {
		console.error("Failed to fetch orders:", error);
		throw error;
	}
}

// Messages
export const getAllConversations = async () => {
	const jwtToken = localStorage.getItem("jwt");

	try {
		const response = await fetch(
			"http://localhost:8080/api/messages/conversations",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const conversations = await response.json();
		return conversations;
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw error;
	}
};

// Address -----------------------------------------------------
export const GetUserAddresses = () => {
	const jwt = localStorage.getItem("jwt");
	const [addresses, setAddresses] = React.useState<Addresses[]>([]);
	useEffect(() => {
		const fetchUserAddresses = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/api/addresses/my-addresses",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${jwt}`,
						},
					}
				);

				setAddresses(await response.json());
			} catch (err) {
				console.error("Error fetching user addresses:", err);
			}
		};
		fetchUserAddresses();
	}, [jwt]);
	return addresses;
};

// Get top artisans
export const GetTopArtisans = async () => {
	const [topArtisans, setTopArtisans] = React.useState<ArtisanProfile[]>([]);
	useEffect(() => {
		const fetchTopArtisans = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/api/sales/top-artisans"
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				setTopArtisans(await response.json());
			} catch (error) {
				console.error("Error fetching top artisans:", error);
			}
		};
		fetchTopArtisans().catch((error) => {
			console.error("Error fetching top artisans:", error);
		});
	}, []);

	return topArtisans;
};
