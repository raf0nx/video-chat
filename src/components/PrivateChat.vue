<template>
	<v-dialog
		v-model="showDialog.chat"
		max-width="350px"
		scrollable
		hide-overlay
	>
		<v-card>
			<v-card-actions class="justify-space-between py-4">
				<v-icon
					@click="video(!videoCall)"
					:disabled="!showDialog.msg.length"
					>{{ videoCall ? "mdi-video-off" : "mdi-video" }}</v-icon
				>
				<v-icon @click="closeChat()">mdi-close</v-icon>
			</v-card-actions>
			<v-card-text
				class="pa-0 d-flex flex-column justify-space-between"
				style="height: 400px"
			>
				<ChatArea
					:messages="showDialog.msg"
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
					:disabled="showDialog.closed"
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

	@Component({ components: { ChatArea } })
	export default class PrivateChat extends Vue {
		@Prop() showDialog!: {
			chat: boolean;
			user: string;
			msg: [];
			room: string;
			closed: boolean;
		};

		videoCall = false;
		videoAnswer = {
			video: false,
			remoteDesc: undefined,
			candidate: undefined,
			close: false,
		};
		privateMessage = "";

		@Watch("showDialog", { deep: true })
		// @ts-ignore
		joinChatRoom({ chat }, oldVal): void {
			if (chat && chat !== oldVal.chat) {
				if (this.showDialog.room !== SocketModule.username) {
					this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
						...this.$store.state,
						to: this.showDialog.user,
						from: SocketModule.username,
					});
				}

				if (this.showDialog.room === SocketModule.username) {
					this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
						...this.$store.state,
						to: SocketModule.username,
						from: SocketModule.username,
						joinConfirm: true,
					});
				}
			}
		}

		closeChat(): void {
			this.videoCall = false;
			this.$socket.emit(WebSocketEvents.LEAVE_PRIVATE_ROOM, {
				room: SocketModule.room,
				to: this.showDialog.room,
				from: SocketModule.username,
			});

			this.$emit("closeChat");
		}

		sendPrivateMessage(message: { msg: string }): void {
			if (typeof message !== "object" && !this.privateMessage.trim().length) {
				return;
			}

			this.$socket.emit(WebSocketEvents.PRIVATE_MESSAGE, {
				privateMessage: message,
				to: this.showDialog.user,
				from: SocketModule.username,
				room: this.showDialog.room,
			});

			this.privateMessage = "";
		}

		video(value: boolean): void {
			this.videoCall = value;

			if (value) {
				this.videoAnswer = { ...this.videoAnswer, video: !value };
			} else {
				this.sendPrivateMessage({
					msg: `${SocketModule.username} has closed the video`,
				});
			}
		}
	}
</script>

<style>
	.v-dialog__content {
		justify-content: flex-end !important;
		align-items: flex-end !important;
	}
	.v-card__actions {
		background-color: #000000;
	}
</style>