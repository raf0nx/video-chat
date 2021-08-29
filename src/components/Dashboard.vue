<template>
	<div class="dashboard">
		<h1>Dashboard</h1>
		<button @click="sendGetRequest()">Click me!</button>
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
