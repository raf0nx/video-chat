<template>
	<v-container class="home">
		<v-card elevation="4" max-width="50%" class="mx-auto rounded-xl">
			<v-card-title class="display-1 font-weight-bold justify-center py-6"
				>Welcome back!</v-card-title
			>
			<v-divider />
			<v-card-subtitle class="pt-8"
				>Choose your username and the conference room</v-card-subtitle
			>
			<v-form @submit.prevent="loginUser()" class="pa-8">
				<v-text-field
					v-model="username"
					label="Username"
					outlined
					color="indigo lighten-1"
				></v-text-field>
				<v-select
					v-model="room"
					label="Room"
					item-text="name"
					item-value="name"
					item-color="indigo lighten-1"
					:items="rooms"
					color="indigo lighten-1"
					outlined
				></v-select>
				<v-btn
					type="submit"
					class="font-weight-bold"
					large
					color="indigo lighten-1"
					block
				>
					Continue
					<v-icon right>mdi-chevron-right</v-icon>
					<v-icon class="ml-n2" right>mdi-chevron-right</v-icon>
				</v-btn>
			</v-form>
		</v-card>
	</v-container>
</template>

<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";
	import axios from "axios";

	import { URL } from "@/utils/URL";
	import { SocketModule } from "@/store/Socket";

	@Component
	export default class Home extends Vue {
		username = "";
		room = "";
		rooms = [];

		async created(): Promise<void> {
			try {
				const rooms = await axios.get(`${URL}/rooms`);
				this.rooms = rooms.data;
				SocketModule.setRooms(this.rooms as []);
			} catch (error) {
				console.error(error);
			}
		}

		async loginUser(): Promise<void> {
			try {
				const response = await axios.post(`${URL}/auth/login`, {
					username: this.username,
					room: this.room,
				});
				SocketModule.joinRoom(response.data);
				this.$router.push("/chat");
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<style>
	.home .v-card__title {
		font-family: "Nunito", sans-serif !important;
	}
</style>
