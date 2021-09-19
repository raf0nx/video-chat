<template>
	<div class="audio-video-controls">
		<v-icon @click="swapVideo()">
			{{ videoOn ? "mdi-video-off" : "mdi-video" }}
		</v-icon>
		<v-icon @click="swapAudio()">
			{{ audioOn ? "mdi-microphone-off" : "mdi-microphone" }}
		</v-icon>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";

	@Component
	export default class AudioVideoControls extends Vue {
		@Prop() pauseVideo!: () => void;
		@Prop() pauseAudio!: () => void;

		videoOn = true;
		audioOn = true;

		swapVideo(): void {
			this.videoOn = !this.videoOn;
			this.pauseVideo();
		}

		swapAudio(): void {
			this.audioOn = !this.audioOn;
			this.pauseAudio();
		}
	}
</script>

<style scoped>
	.audio-video-controls {
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>