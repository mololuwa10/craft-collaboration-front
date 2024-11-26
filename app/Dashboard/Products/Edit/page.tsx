"use client";

import styles from "@/components/dashboardComponents/users/singleUser/singleUser.module.css";
import Image from "next/image";
import {
	fetchProductById,
	useFetchAllCategories,
	fetchAllArtisans,
} from "@/lib/dbModels";
import { updateProduct } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LanguageProvider } from "@/app/LanguageContext";

export default function EditProduct() {
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
			artisan: {
				userId: number;
				firstname: string;
				lastname: string;
			};
			bio: string;
			profilePicture: string;
			location: string;
			storeName: string;
		};
		dateTimeUpdated: string;
	}
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	interface ArtisanProfile {
		artisanId: number;
		artisan: {
			userId: number;
			firstname: string;
			lastname: string;
		};
		bio: string;
		profilePicture: string;
		location: string;
		storeName: string;
	}

	// Fetch category data
	const { categories } = useFetchAllCategories() as unknown as {
		categories: Category[];
	};

	const [attributes, setAttributes] = useState([
		{ productAttributesKey: "", productAttributesValue: "" },
	]);

	const [selectedArtisanId, setSelectedArtisanId] = useState<number | string>(
		""
	);
	const [product, setProduct] = useState<Product | null>(null);
	const [error, setError] = useState("");
	const [roles, setRoles] = useState([]);
	const [selectedRoleId, setSelectedRoleId] = useState<string>("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>(
		""
	);
	const [productImages, setProductImages] = useState<File[]>([]);
	const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>([]);
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId");

	useEffect(() => {
		fetchAllArtisans()
			.then((fetchedArtisans) => {
				setAllArtisans(fetchedArtisans);
			})
			.catch((error) => {
				console.error("Error fetching artisans:", error);
			});
	}, []);

	useEffect(() => {
		if (productId) {
			fetchProductById(Number(productId))
				.then((fetchedProduct) => {
					setProduct(fetchedProduct);
					// Update selectedCategoryId based on fetched product's category
					if (fetchedProduct && fetchedProduct.category) {
						setSelectedCategoryId(fetchedProduct.category.categoryId);
					}
					if (fetchedProduct.attributes) {
						setAttributes(fetchedProduct.attributes);
					}
					// Set the artisan that owns the product
					if (fetchedProduct && fetchedProduct.artisanProfile) {
						setSelectedArtisanId(fetchedProduct.artisanProfile.artisanId);
					}
				})
				.catch((err) => {
					console.error(err);
					setError("Failed to fetch product details");
				});
		}
	}, [productId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!product) {
		return <div>Loading...</div>;
	}

	// Function to add a new attribute input field
	const handleAddAttributeField = () => {
		setAttributes([
			...attributes,
			{ productAttributesKey: "", productAttributesValue: "" },
		]);
	};

	const handleAttributeChange = (index: any, key: any, value: any) => {
		const updatedAttributes = attributes.map((attr, i) => {
			if (i === index) {
				return { ...attr, [key]: value };
			}
			return attr;
		});
		setAttributes(updatedAttributes);
	};

	// Function to remove an attribute input field
	const handleRemoveAttributeField = (index: any) => {
		const updatedAttributes = attributes.filter((_, i) => i !== index);
		setAttributes(updatedAttributes);
	};
	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			alert("Authentication token not found.");
			return;
		}

		const productData = {
			productName: product?.productName,
			productDescription: product?.productDescription,
			productPrice: product?.productPrice,
			productStockQuantity: product?.productStockQuantity,
			category: {
				categoryId: selectedCategoryId,
			},
			// artisanProfile: {
			// 	artisanId: selectedArtisanId,
			// },
			productDiscount: product?.productDiscount,
		};

		// Prepare attributes for submission, filtering out any empty keys or values
		const filteredAttributes = attributes.filter(
			(attr) => attr.productAttributesKey && attr.productAttributesValue
		);

		try {
			await updateProduct(
				product?.productId,
				filteredAttributes,
				productData,
				jwt
			);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Failed to update the product:", error.message);
				alert(error.message || "Failed to update the product.");
			} else {
				console.error("Failed to update the product:", error);
				alert("Failed to update the product.");
			}
		}
	};

	const handleFileChange = (event: any) => {
		// Assuming you're handling multiple images
		if (event.target.files) {
			setProductImages([...event.target.files]);
		}
	};

	const handleInputChange = (event: any) => {
		const { name, value } = event.target;
		setProduct((prevProduct) => {
			if (prevProduct) {
				return { ...prevProduct, [name]: value };
			}
			return null;
		});
	};

	return (
		<>
			<LanguageProvider>
				<div className={styles.container}>
					<div className={styles.infoContainer}>
						<div className={styles.imgContainer}>
							{product?.imageUrls.map((imageUrl, index) => (
								<Image
									key={index}
									src={`http://localhost:8080${imageUrl}` || "/noavatar.png"}
									alt={`Product Image ${index + 1}`}
									fill
								/>
							))}
						</div>
						{/* {user.username} */}
					</div>
					<div className={styles.formContainer}>
						<form className={styles.form} onSubmit={handleSubmit}>
							<input type="hidden" name="id" />
							<label>Product Name</label>
							<input
								type="text"
								name="productName"
								placeholder={product.productName}
								value={product.productName}
								onChange={handleInputChange}
							/>
							<label>Product Price</label>
							<input
								type="text"
								name="productPrice"
								placeholder={String(product.productPrice)}
								value={product.productPrice}
								onChange={handleInputChange}
							/>
							<label>Product Stock Quantity</label>
							<input
								type="text"
								name="stockQuanitiy"
								placeholder={String(product.productStockQuantity)}
								value={product.productStockQuantity}
								onChange={handleInputChange}
							/>
							<label>Product Discount</label>
							<input
								type="text"
								name="productDiscount"
								placeholder={String(product.productDiscount)}
								value={product.productDiscount}
								onChange={handleInputChange}
							/>
							<label>Product Description</label>
							<textarea
								name="productDescription"
								placeholder={product.productDescription}
								value={product.productDescription}
								onChange={handleInputChange}
							/>

							{attributes.map((attribute, index) => (
								<div key={index} className="flex items-center mb-4">
									<input
										type="text"
										placeholder="Attribute Key"
										className="input-field"
										value={attribute.productAttributesKey}
										onChange={(e) =>
											handleAttributeChange(
												index,
												"productAttributesKey",
												e.target.value
											)
										}
									/>
									<input
										type="text"
										placeholder="Attribute Value"
										className="input-field"
										value={attribute.productAttributesValue}
										onChange={(e) =>
											handleAttributeChange(
												index,
												"productAttributesValue",
												e.target.value
											)
										}
									/>
									<button
										type="button"
										className="remove-attribute-button"
										onClick={() => handleRemoveAttributeField(index)}>
										Remove
									</button>
								</div>
							))}
							<button
								type="button"
								className="add-attribute-button"
								onClick={handleAddAttributeField}>
								Add Attribute
							</button>

							<label>Category</label>
							<select
								name="category"
								id="category"
								value={selectedCategoryId}
								onChange={(e) => setSelectedCategoryId(e.target.value)}>
								{categories.map((category) => (
									<option key={category.value} value={category.value}>
										{category.label}
									</option>
								))}
							</select>
							<label>Artisan</label>
							<select
								name="artisan"
								id="artisan"
								value={selectedArtisanId}
								onChange={(e) => setSelectedArtisanId(e.target.value)}>
								{allArtisans &&
									allArtisans.map((artisan) => (
										<option
											key={artisan.artisanId}
											value={artisan.artisanId.toString()}>
											{artisan.artisanId} - {artisan.artisan.firstname}{" "}
											{artisan.artisan.lastname}
										</option>
									))}
							</select>

							<input type="file" multiple onChange={handleFileChange} />
							<button>Update</button>
						</form>
					</div>
				</div>
			</LanguageProvider>
		</>
	);
}
