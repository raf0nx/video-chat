<template>
	<v-app id="app">
		<v-main class="d-flex align-center">
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";

	@Component
	export default class App extends Vue {}
</script>

<style>
	#app {
		font-family: "Nunito", sans-serif !important;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>
