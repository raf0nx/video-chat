<template>
	<v-card class="users-list" elevation="4" height="100%">
		<v-list flat class="py-0">
			<v-list-item-group>
				<v-list-item
					v-for="(user, id) in users"
					@click="openChat(user.username)"
					:key="id"
				>
					<v-list-item-content>
						<v-list-item-icon class="my-0 mr-2"
							><v-icon :color="getStatusColor(user)" x-large
								>mdi-circle-small</v-icon
							></v-list-item-icon
						>
						<v-list-item-title class="my-0">{{
							user.username
						}}</v-list-item-title>
						<v-list-item-icon
							v-if="currentUsername !== user.username"
							class="my-0 align-self-center"
						>
							<v-icon :disabled="isInPrivateChat"
								>mdi-chat</v-icon
							>
						</v-list-item-icon>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-card>
</template>

<script lang="ts">
	import { Status } from "@/enums/Status";
	import { User } from "@/interfaces/User";
	import { SocketModule } from "@/store/Socket";
	import { Vue, Component, Prop } from "vue-property-decorator";

	@Component
	export default class UsersList extends Vue {
		@Prop() users!: User[];
		@Prop() isInPrivateChat!: boolean;

		get currentUsername(): string {
			return SocketModule.username;
		}

		getStatusColor(user: User): string {
			switch (user.status) {
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

		openChat(username: string): void {
			if (this.isInPrivateChat) {
				return;
			}
            
			this.$emit("openChat", username);
		}
	}
</script>

<style>
	.users-list .v-list-item {
		transition: background-color 0.3s ease-in-out;
	}
	.users-list .v-list-item:hover {
		background-color: #333333;
	}
	.users-list .v-list-item__title,
	.users-list .v-list-item__content > * {
		flex: 1 1 auto;
	}
	.users-list .v-list-item__icon {
		flex: 0 1 auto;
	}
</style>