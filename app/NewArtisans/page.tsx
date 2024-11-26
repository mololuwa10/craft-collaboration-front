"use client";
import React, { useState, useEffect } from "react";
import { ArtisanProfile, fetchNewArtisans } from "@/lib/dbModels";
import NewArtisansGrid from "@/components/NewArtisanComponents/NewArtisanGrid";
import Header from "@/components/layoutComponents/Header";
import Footer from "@/components/layoutComponents/Footer";
import { LanguageProvider } from "../LanguageContext";

export default function NewArtisans() {
	const [newArtisans, setNewArtisans] = useState<ArtisanProfile[]>([]);

	// Fetch new artisans
	useEffect(() => {
		const loadNewArtisans = async () => {
			try {
				const artisans = await fetchNewArtisans();
				setNewArtisans(artisans);
			} catch (error) {
				console.error("Failed to load new artisans:", error);
				// Handle the error appropriately in your UI
			}
		};

		loadNewArtisans();
	}, []);
	return (
		<>
			<LanguageProvider>
				<Header />
				<NewArtisansGrid artisans={newArtisans} />
				<Footer />
			</LanguageProvider>
		</>
	);
}
