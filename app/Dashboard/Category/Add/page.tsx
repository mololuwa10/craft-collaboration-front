"use client";

import styles from "@/components/dashboardComponents/users/addUser/addUser.module.css";
import { useRef, useState } from "react";
import { createCategoryOrSubcategory } from "@/lib/auth";
import { LanguageProvider } from "@/app/LanguageContext";

const AddCategoryPage = () => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [categoryName, setCategoryName] = useState("");
	const [categoryDescription, setCategoryDescription] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!categoryName || !categoryDescription || !selectedImage) {
			setError("Please fill all fields and select an image.");
			return;
		}

		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				throw new Error("Authentication token not found.");
			}

			const formData = new FormData();
			formData.append(
				"category",
				JSON.stringify({ categoryName, categoryDescription })
			);
			formData.append("image", selectedImage);

			setLoading(true);
			const response = await createCategoryOrSubcategory(formData, jwt);
			console.log(response);
			// Handle the success scenario, like redirecting or clearing the form
			setCategoryName("");
			setCategoryDescription("");
			setSelectedImage(null);
		} catch (error) {
			setError(error instanceof Error ? error.message : String(error));
		} finally {
			setLoading(false);
		}
	};

	// Function to handle file selection
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedImage(event.target.files[0]);
		}
	};

	// Function to open file dialog
	const handleSelectImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<>
			<LanguageProvider>
				<div className={styles.container}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Category Name"
							name="categoryName"
							value={categoryName}
							onChange={(event) => setCategoryName(event.target.value)}
							required
						/>
						<textarea
							name="description"
							id="description"
							value={categoryDescription}
							onChange={(event) => setCategoryDescription(event.target.value)}
							placeholder="Category Description"></textarea>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
						<button
							className="my-8"
							type="button"
							onClick={() => fileInputRef.current?.click()}>
							Select Image
						</button>

						<button type="submit" disabled={loading}>
							{loading ? "Submitting..." : "Submit"}
						</button>
					</form>
					{error && <p className="error">{error}</p>}
				</div>
			</LanguageProvider>
		</>
	);
};

export default AddCategoryPage;
