<template>
	<v-container class="chat pa-0" fluid>
		<v-card>
			<v-toolbar>
				<v-row>
					<v-col cols="2" class="py-0 pl-0">
						<div class="d-flex justify-space-between">
							<v-card-text class="subtitle-1 font-weight-bold"
								>Active users</v-card-text
							>
							<v-icon
								@click="changeStatus()"
								:color="getMyStatusColor()"
								x-large
                                class="chat__my-status"
								>mdi-circle-small</v-icon
							>
						</div>
					</v-col>
					<v-divider class="ml-n3" vertical></v-divider>
					<v-col cols="10" class="py-0 pr-0">
						<div
							class="
								chat__toolbar--right
								pl-4
								pr-1
								d-flex
								justify-space-between
								align-center
							"
						>
							<v-select
								v-model="room"
								@change="changeRoomHandler($event)"
								:items="rooms"
								item-text="name"
								item-value="name"
								color="indigo lighten-1"
								item-color="indigo lighten-1"
								class="flex-grow-0 font-weight-bold"
								hide-details
							></v-select>
							<v-icon @click="logout()">mdi-power</v-icon>
						</div>
					</v-col>
				</v-row>
			</v-toolbar>
			<v-row>
				<v-col cols="2" class="pr-0 pb-0">
					<UsersList
						:users="users"
						:openPrivateChat="openPrivateChat.chat"
						@openChat="openChat($event)"
					/>
				</v-col>
				<v-col cols="10" class="pl-0"></v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";

	import { SocketModule } from "@/store/Socket";
	import { WebSocketEvents } from "@/enums/WebSocketEvents";
	import UsersList from "@/components/UsersList.vue";
	import { Status } from "@/enums/Status";

	@Component({
		components: { UsersList },
	})
	export default class Chat extends Vue {
		messages = [];
		room = SocketModule.room;
		username = SocketModule.username;
		users = [
			{
				username: "Alex",
				status: Status.AVAILABLE,
			},
			{
				username: "Michael",
				status: Status.AWAY,
			},
			{
				username: "Trevor",
				status: Status.UNAVAILABLE,
			},
		];
		openPrivateChat = {
			chat: false,
			user: "",
			msg: [],
			room: "",
			closed: false,
		};

		get rooms(): [] {
			return SocketModule.rooms as [];
		}

		beforeCreate(): void {
			this.$socket.emit(WebSocketEvents.JOIN_ROOM, this.$store.state);
		}

		async logout(): Promise<void> {
			try {
				this.$socket.emit(WebSocketEvents.LEAVE_CHAT, {
					room: this.room,
					username: this.username,
				});
				await SocketModule.leaveChat(this.username);
				this.$socket.close();
				this.$router.push({ name: "Home" });
			} catch (error) {
				console.error(error);
			}
		}

		getMyStatusColor(): string {
			switch (SocketModule.status) {
				case Status.AVAILABLE:
					return "green";
				case Status.AWAY:
					return "orange";
				case Status.UNAVAILABLE:
					return "red";
				default:
					return "white";
			}
		}

		changeRoomHandler(roomSelected: string): void {
			this.$socket.emit(WebSocketEvents.LEAVE_ROOM, this.$store.state);
			SocketModule.changeRoom(roomSelected);
			this.messages.length = 0;
			this.$socket.emit(WebSocketEvents.JOIN_ROOM, this.$store.state);
		}

		openChat(user: string) {
			this.openPrivateChat = {
				...this.openPrivateChat,
				chat: true,
				room: user,
				user,
			};
		}

		changeStatus(): void {
			SocketModule.changeStatus();
			this.$socket.emit(WebSocketEvents.CHANGE_STATUS, this.$store.state);
		}
	}
</script>

<style>
	.chat {
		height: 100vh;
	}
    .chat .chat__my-status::after {
        width: 0;
        height: 0;
    }
	.chat .v-card__text {
		font-family: "Nunito", sans-serif !important;
	}
	.chat__toolbar--right {
		height: 100%;
	}
	.chat .v-select__slot {
		max-width: 200px;
	}
</style>