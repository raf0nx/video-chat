<template>
	<div class="video">
		<div class="video__partner">
			<Video
				videoId="remoteVideo"
				:displayControls="true"
				:videoStream="remoteStream"
				:pauseVideo="pauseVideo"
				:pauseAudio="pauseAudio"
				:muted="false"
			/>
		</div>
		<video
			id="localVideo"
			class="video__myself"
			autoplay
			muted="muted"
		></video>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Watch } from "vue-property-decorator";
	import { mixins } from "vue-class-component";

	import { VideoAnswer } from "@/interfaces/VideoAnswer";
	import { WebSocketEvents } from "@/enums/WebSocketEvents";
	import { SocketModule } from "@/store/Socket";
	import VideoConfig from "@/mixins/VideoConfig.vue";
	import Video from "@/components/video/Video.vue";

	@Component({
		components: { Video },
	})
	export default class VideoArea extends mixins(VideoConfig) {
		@Prop() privateRoom!: string;
		@Prop() to!: string;
		@Prop() videoAnswer!: VideoAnswer;

		pc!: RTCPeerConnection;
		remoteStream: MediaStream | null = null;
		remoteVideo: HTMLMediaElement = {} as HTMLMediaElement;

		async created(): Promise<void> {
			await this.getUserMedia();
			await this.getAudioVideo();
			// Create peer connection and add local stream
			this.createPeerConnection();
			this.addLocalStream(this.pc);
			// Event listeners
			this.onIceCandidates(this.pc, this.to, this.privateRoom);
			this.onAddStream();
			// Handlers
			/* eslint-disable */
			!this.videoAnswer.video
				? this.createOffer(this.pc, this.to, this.privateRoom)
				: this.handleAnswer(
						this.videoAnswer.remoteDesc as RTCSessionDescriptionInit,
						this.pc,
						this.videoAnswer.from!,
						this.privateRoom
				  );
			/* eslint-disable */
		}

		mounted(): void {
			this.myVideo = document.getElementById(
				"localVideo"
			) as HTMLMediaElement;
			this.remoteVideo = document.getElementById(
				"remoteVideo"
			) as HTMLMediaElement;
		}

		beforeDestroy(): void {
			this.pc.close();
			this.pc = Object.create(null);
			this.$socket.emit(WebSocketEvents.PRIVATE_MESSAGE_PC_SIGNALING, {
				to: this.to,
				from: SocketModule.username,
				room: this.privateRoom,
			});
		}

		@Watch("videoAnswer")
		respond(newValue: VideoAnswer, oldValue: VideoAnswer) {
			const { remoteDesc: description, candidate } = newValue;

			if (!!description && description !== oldValue.remoteDesc) {
				/* eslint-disable */
				this.setRemoteDescription(
					description as RTCSessionDescriptionInit,
					this.pc
				);
				/* eslint-disable */
			}

			if (!!candidate && candidate !== oldValue.candidate) {
				this.addCandidate(this.pc, candidate as RTCIceCandidateInit);
			}
		}

		createPeerConnection(): void {
			this.pc = new RTCPeerConnection(this.configuration);
		}

		onAddStream(): void {
			// TODO: Refactor to the new implementation
			// @ts-ignore
			this.pc.onaddstream = (event) => {
				if (!this.remoteVideo.srcObject && event.stream) {
					this.remoteStream = event.stream;
					this.remoteVideo.srcObject = this.remoteStream;
				}
			};
		}
	}
</script>

<style scoped>
	.video {
		position: relative;
	}
	.video__myself {
		position: absolute;
		width: 130px;
		height: 100px;
		right: 10px;
		bottom: 0;
	}
</style>