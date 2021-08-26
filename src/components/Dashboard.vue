<template>
	<div class="dashboard">
		<h1>Dashboard</h1>
		<button @click="sendGetRequest()">Click me!</button>
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		methods: {
			async sendGetRequest() {
				const message = await axios.get("http://localhost:3000/api");
				console.log(message.data.message);
			},
		},
	};
</script>

<style scoped>
</style>
