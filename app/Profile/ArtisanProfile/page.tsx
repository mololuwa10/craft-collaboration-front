import { LanguageProvider } from "@/app/LanguageContext";
import Announcement from "@/components/ArtisanProfileComponents/Announcements";
import ArtisanProfileHeader from "@/components/ArtisanProfileComponents/ArtisanProfileHeader";
import ItemList from "@/components/ArtisanProfileComponents/ItemList";
import OtherArtisanDetails from "@/components/ArtisanProfileComponents/OtherArtisanDetails";
import ShopInfo from "@/components/ArtisanProfileComponents/ShopInfo";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import React from "react";

const ShopContainer = () => {
	return (
		<>
			<LanguageProvider>
				<div>
					<Header />
					<ArtisanProfileHeader />
					<ShopInfo />
					<Announcement />
					<ItemList />

					<OtherArtisanDetails />
					<Footer />
				</div>
			</LanguageProvider>
		</>
	);
};

export default ShopContainer;
