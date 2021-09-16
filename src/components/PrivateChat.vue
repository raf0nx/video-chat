<template>
	<v-dialog
		v-model="privateChat.openChat"
		max-width="350px"
		scrollable
		hide-overlay
		persistent
		no-click-animation
	>
		<v-dialog
			v-model="videoCall"
			max-width="500px"
			hide-overlay
			persistent
			no-click-animation
		>
			<VideoArea
				:privateRoom="privateRoom"
				:to="privateChat.user"
				:videoAnswer="videoAnswer"
				@closeVideo="video(false)"
			/>
		</v-dialog>
		<v-card>
			<v-card-actions class="justify-space-between py-4">
				<span class="font-weight-bold">{{ privateChat.user }}</span>
				<div>
					<v-icon
						:disabled="!privateChat.messages.length"
						class="mr-2"
						@click="video(!videoCall)"
						>{{ videoCall ? "mdi-video-off" : "mdi-video" }}</v-icon
					>
					<v-icon @click="closeChat()">mdi-close</v-icon>
				</div>
			</v-card-actions>
			<v-card-text
				class="pa-0 d-flex flex-column justify-space-between"
				style="height: 400px"
			>
				<ChatArea
					:messages="privateChat.messages"
					:maxMessageLength="30"
					:isPrivate="true"
				/>
				<v-textarea
					v-model="privateMessage"
					no-resize
					hide-details
					placeholder="Aa"
					class="pa-4 flex-shrink-1 flex-grow-0"
					rows="1"
					color="indigo lighten-1"
					append-icon="mdi-send"
					filled
					rounded
					dense
					:disabled="privateChat.closed"
					@click:append="sendPrivateMessage(privateMessage)"
					@keyup.enter="sendPrivateMessage(privateMessage)"
				></v-textarea>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";

	import { WebSocketEvents } from "@/enums/WebSocketEvents";
	import { SocketModule } from "@/store/Socket";
	import ChatArea from "@/components/ChatArea.vue";
	import VideoArea from "@/components/VideoArea.vue";
	import { PrivateChat as PrivateChatModel } from "@/interfaces/PrivateChat";
	import { VideoAnswer } from "@/interfaces/VideoAnswer";
	import { sortNamesAlphabetically } from "@/utils/utils";
	import { DescriptionType } from "@/enums/DescriptionType";

	@Component({
		components: { ChatArea, VideoArea },
		sockets: {
			/* eslint-disable */
			privateMessagePCSignaling({
				desc,
				from,
				candidate,
			}: {
				desc: RTCSessionDescriptionInit;
				from: string;
				candidate: RTCIceCandidateInit;
			}) {
				if (SocketModule.username === from) return;

				if (desc) {
					if (desc.type === DescriptionType.OFFER) {
						(this as PrivateChat).openChat(desc, from);
					} else if (desc.type === DescriptionType.ANSWER) {
						(this as PrivateChat).videoAnswer = {
							...(this as PrivateChat).videoAnswer,
							remoteDesc: desc,
						};
					} else {
						console.error("Unsupported SDP type");
					}
				} else if (candidate) {
					(this as PrivateChat).videoAnswer = {
						...(this as PrivateChat).videoAnswer,
						candidate,
					};
				} else {
					(this as PrivateChat).videoCall = false;
				}
			},
			/* eslint-disable */
		},
	})
	export default class PrivateChat extends Vue {
		@Prop() privateChat!: PrivateChatModel;

		privateMessage = "";
		videoCall = false;
		videoAnswer: VideoAnswer = {
			video: false,
			remoteDesc: "",
			candidate: "",
			close: false,
		};

		get privateRoom(): string {
			return sortNamesAlphabetically(
				SocketModule.username,
				this.privateChat.user
			);
		}

		created() {
			this.joinChatRoom(this.privateChat, {
				openChat: false,
				user: "",
				messages: [],
				room: "",
				closed: false,
			});
		}

		@Watch("privateChat")
		joinChatRoom(
			{ openChat }: PrivateChatModel,
			oldVal: PrivateChatModel
		): void {
			if (openChat && openChat !== oldVal.openChat) {
				if (this.privateChat.room !== SocketModule.username) {
					this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
						...this.$store.state,
						to: this.privateChat.user,
						from: SocketModule.username,
						privateRoom: sortNamesAlphabetically(
							this.privateChat.user,
							SocketModule.username
						),
					});
				}

				if (this.privateChat.room === SocketModule.username) {
					this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
						...this.$store.state,
						to: SocketModule.username,
						from: SocketModule.username,
						privateRoom: sortNamesAlphabetically(
							this.privateChat.user,
							SocketModule.username
						),
						joinConfirm: true,
					});
				}
			}
		}

		openChat(desc: RTCSessionDescriptionInit, from: string): void {
			this.videoAnswer = {
				...this.videoAnswer,
				video: true,
				remoteDesc: desc,
				from,
			};
			this.videoCall = true;
		}

		closeChat(): void {
			this.$socket.emit(WebSocketEvents.LEAVE_PRIVATE_ROOM, {
				room: SocketModule.room,
				to: this.privateChat.room,
				from: SocketModule.username,
				privateRoom: this.privateRoom,
			});

			this.$emit("closeChat");
		}

		sendPrivateMessage(message: string): void {
			if (!this.privateMessage.trim().length) {
				return;
			}

			this.$socket.emit(WebSocketEvents.PRIVATE_MESSAGE, {
				privateMessage: message,
				to: this.privateChat.user,
				from: SocketModule.username,
				privateRoom: this.privateRoom,
			});

			this.privateMessage = "";
		}

		video(isVideoCall: boolean): void {
			this.videoCall = isVideoCall;

			isVideoCall
				? Object.assign(this.videoAnswer, { video: !isVideoCall })
				: this.sendPrivateMessage(
						`${SocketModule.username} has closed the video`
				  );
		}
	}
</script>

<style>
	.v-dialog__content:nth-child(2) {
		justify-content: flex-end !important;
		align-items: flex-end !important;
	}
	.v-card__actions {
		background-color: #000000;
	}
</style>