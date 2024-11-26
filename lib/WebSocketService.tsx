import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const isConnected = () => {
	return stompClient !== null && stompClient.connected;
};

export const disconnect = () => {
	if (isConnected()) {
		stompClient?.deactivate();
	}
};

const connect = (
	artisanId: string,
	onMessageReceived: (msg: any) => void,
	jwt: string
) => {
	// Included the jwt in the connect headers
	const headers = {
		Authorization: `Bearer ${jwt}`,
	};

	stompClient = new Client({
		webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
		connectHeaders: headers,
		onConnect: () => {
			if (stompClient) {
				stompClient.subscribe(`/topic/public`, (message) => {
					if (onMessageReceived) {
						onMessageReceived(JSON.parse(message.body));
					}
				});
			}
		},
		onStompError: (error) => {
			console.error("STOMP Error:", error);
		},
	});

	stompClient.activate();
};

const sendMessage = (msg: any) => {
	if (stompClient && stompClient.connected) {
		stompClient.publish({
			destination: "/app/chat.sendMessage",
			body: JSON.stringify(msg),
		});
	} else {
		console.error("stompClient is not connected.");
	}
};

export { connect, sendMessage };
