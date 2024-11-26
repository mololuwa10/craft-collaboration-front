/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/layoutComponents/Header";
import { LanguageProvider } from "../LanguageContext";
import Footer from "@/components/layoutComponents/Footer";
import { ArtisanProfile, fetchArtisanById } from "@/lib/dbModels";
import { useSearchParams } from "next/navigation";
import ArtisanProfileHeader from "@/components/ArtisanProfileOverviewComponents/ArtisanProfileHeader";
import ShopInfo from "@/components/ArtisanProfileOverviewComponents/ShopInfo";
import Announcement from "@/components/ArtisanProfileOverviewComponents/Announcements";
import ItemList from "@/components/ArtisanProfileOverviewComponents/ItemList";
import OtherArtisanDetails from "@/components/ArtisanProfileOverviewComponents/OtherArtisanDetails";

export default function ArtisanProfileOverview() {
	const [newArtisan, setNewArtisan] = useState<ArtisanProfile | null>(null);
	const [error, setError] = useState<string>("");
	const searchParams = useSearchParams();
	const artisanId = searchParams.get("artisanId");

	useEffect(() => {
		const loadNewArtisan = async (): Promise<void> => {
			try {
				if (artisanId) {
					const artisan = await fetchArtisanById(artisanId);
					setNewArtisan(artisan);
				}
			} catch (error) {
				console.error("Failed to load the artisan:", error);
				setError("Failed to load artisan details");
			}
		};

		loadNewArtisan();
	}, [artisanId]);

	return (
		<>
			<LanguageProvider>
				<Header />
				<ArtisanProfileHeader newArtisan={newArtisan} />
				{newArtisan && <ShopInfo artisan={newArtisan} />}
				{newArtisan && <Announcement artisan={newArtisan} />}
				{newArtisan && <ItemList artisan={newArtisan} />}
				{newArtisan && <OtherArtisanDetails newArtisan={newArtisan} />}
				<Footer />
			</LanguageProvider>
		</>
	);
}
