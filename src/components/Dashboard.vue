<template>
	<div class="dashboard">
		<h1>Dashboard</h1>
		<v-card elevation="4">
			<v-btn @click="sendGetRequest()">Click me!</v-btn>
		</v-card>
	</div>
</template>

<script lang="ts">
	import { Vue, Component } from "vue-property-decorator";
	import axios from "axios";

	@Component
	export default class Dashboard extends Vue {
		async sendGetRequest() {
			const message = await axios.get("http://localhost:3000/api");
			console.log(message.data.message);
		}
	}
</script>

<style scoped>
</style>
