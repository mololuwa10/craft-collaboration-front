import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import {
	connect,
	sendMessage,
	disconnect,
	isConnected,
} from "@/lib/WebSocketService";

const ChatInterface = ({
	artisanId,
	currentUserId,
	productId,
}: {
	artisanId: any;
	currentUserId: any;
	productId: any;
}) => {
	const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
		[]
	);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const fetchMessageHistory = async () => {
			try {
				let url = `http://localhost:8080/api/messages/history/${currentUserId}?otherUserId=${artisanId}`;
				if (productId) {
					url += `&productId=${productId}`;
				}
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const messageHistory = await response.json();
				setMessages(
					messageHistory.map((msg: any) => ({
						text: msg.content,
						isUser: msg.type === "SENT",
					}))
				);
			} catch (error) {
				console.error(
					"There has been a problem with your fetch operation:",
					error
				);
			}
		};
		if (!currentUserId) {
			return;
		}
		fetchMessageHistory();

		const jwt = localStorage.getItem("jwt") ?? "";

		const onMessageReceived = (msg: any) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: msg.content,
					isUser: msg.type === "SENT",
				},
			]);
		};

		if (isConnected()) {
			console.log("The WebSocket is connected.");
		} else {
			console.log("The WebSocket is not connected, attempting to connect....");
			connect(artisanId, onMessageReceived, jwt);
		}

		return () => {
			// Disconnect or clean up WebSocket connection when component unmounts
			disconnect();
		};
	}, [artisanId, currentUserId, productId]);

	const handleSendMessage = (e: any) => {
		e.preventDefault();
		if (inputValue.trim()) {
			const messageContent = {
				sender: currentUserId,
				content: inputValue,
				recipientId: artisanId,
				productId: productId,
			};
			sendMessage(messageContent);
			// setMessages((prevMessages) => [
			// 	...prevMessages,
			// 	{ text: messageContent.content, isUser: false },
			// ]);
			setInputValue("");
		}
	};
	return (
		<div className="flex flex-col h-full">
			<div className="flex-grow overflow-auto p-4 flex flex-col space-y-4">
				{messages.map((msg, index) => (
					<ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
				))}
			</div>
			<form
				onSubmit={handleSendMessage}
				className="flex-shrink-0 border-t-2 p-4">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type your message here..."
					className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</form>
		</div>
	);
};

export default ChatInterface;
