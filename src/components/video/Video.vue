<template>
	<div class="video">
		<v-progress-circular
			v-if="!videoStream"
			indeterminate
			color="indigo lighten-1"
		></v-progress-circular>

		<video v-if="muted" :id="videoId" autoplay="true" muted="muted"></video>
		<video v-else :id="videoId" autoplay="true"></video>
        
		<AudioVideoControls
			v-if="displayControls"
			:pauseVideo="pauseVideo"
			:pauseAudio="pauseVideo"
		/>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";

	import AudioVideoControls from "./AudioVideoControls.vue";

	@Component({ components: { AudioVideoControls } })
	export default class Video extends Vue {
		@Prop() videoId!: string;
		@Prop() displayControls!: boolean;
		@Prop() videoStream!: MediaStream | null;
		@Prop() pauseVideo!: () => void;
		@Prop() pauseAudio!: () => void;
		@Prop() muted!: boolean;
	}
</script>

<style>
</style>