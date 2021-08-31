<template>
	<v-container class="chat pa-0" fluid>
		<v-card>
			<v-toolbar>
				<v-row>
					<v-col cols="2" class="pa-0">
						<div class="d-flex justify-space-between">
							<v-card-text class="subtitle-1 font-weight-bold"
								>Active users</v-card-text
							>
							<v-badge
								color="green"
								dot
								offset-x="35"
								offset-y="35"
							></v-badge>
						</div>
					</v-col>
					<v-divider vertical></v-divider>
					<v-col cols="10" class="pa-0">
						<div
							class="
								chat__toolbar--right
								px-4
								d-flex
								justify-space-between
								align-center
							"
						>
							<v-select
								v-model="roomName"
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
		</v-card>
	</v-container>
</template>

<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";

	import { SocketModule } from "@/store/Socket";

	@Component
	export default class Chat extends Vue {
		get roomName(): string {
			return SocketModule.room;
		}

		get rooms(): [] {
			return SocketModule.rooms as [];
		}

		logout(): void {
			this.$router.push({ name: "Home" });
			console.log("Logged out!");
		}
	}
</script>

<style>
	.chat {
		height: 100vh;
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