<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { ICEServers } from "@/utils/ICEServers";
  import { DescriptionType } from "@/enums/DescriptionType";
  import { WebSocketEvents } from "@/enums/WebSocketEvents";
	import { UserModule } from "@/store/User";

  @Component
  export default class VideoConfig extends Vue {
    constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
      video: {
        width: 400,
        height: 250,
      },
    };

    // ICE servers
    configuration = ICEServers;

    // Offer config
    offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };

    // Local video
    myVideo!: HTMLMediaElement;
    localStream: MediaStream | null = null;
    username = "";

    created(): void {
      this.username = UserModule.username!;
    }

    beforeDestroy(): void {
      this.localStream?.getTracks().forEach((track: any) => track.stop());
    }

    async getUserMedia(): Promise<void> {
      if ("mediaDevices" in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(
            this.constraints
          );
          this.myVideo!.srcObject = stream;
          this.myVideo!.volume = 0;
          this.localStream = stream;
        } catch (error) {
          console.error(error);
        }
      }
    }

    getAudioVideo(): void {
      const video = this.localStream?.getVideoTracks();
      const audio = this.localStream?.getAudioTracks();

      if (video!.length > 0)
        console.log(`Using video device: ${video![0].label}`);
      if (audio!.length > 0)
        console.log(`Using audio device: ${audio![0].label}`);
    }

    /* eslint-disable */
    async setRemoteDescription(
      remoteDescription: RTCSessionDescriptionInit,
      pc: RTCPeerConnection
    ): Promise<void> {
      try {
        await pc.setRemoteDescription(remoteDescription);
      } catch (error) {
        console.error(
          `Error in setting the remote description for ${UserModule.username}. Error: ${error}`
        );
      }
    }
    /* eslint-disable */
    async createOffer(
      pc: RTCPeerConnection,
      to: string,
      privateRoom: string,
      conference = false
    ): Promise<void> {
      try {
        const offer = await pc.createOffer(this.offerOptions);
        await pc.setLocalDescription(offer);
        this.sendSignalingMessage(
          pc.localDescription!,
          true,
          to,
          privateRoom,
          conference
        );
      } catch (error) {
        console.error(error);
      }
    }

    async createAnswer(
      pc: RTCPeerConnection,
      to: string,
      privateRoom: string,
      conference = false
    ): Promise<void> {
      try {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.sendSignalingMessage(
          pc.localDescription!,
          false,
          to,
          privateRoom,
          conference
        );
      } catch (error) {
        console.error(error);
      }
    }

    async handleAnswer(
      desc: RTCSessionDescriptionInit,
      pc: RTCPeerConnection,
      from: string,
      privateRoom: string,
      conference = false
    ): Promise<void> {
      await this.setRemoteDescription(desc, pc);
      this.createAnswer(pc, from, privateRoom, conference);
    }

    sendSignalingMessage(
      desc: RTCSessionDescriptionInit,
      offer: boolean,
      to: string,
      privateRoom: string,
      conference: boolean
    ): void {
      const isOffer = offer ? DescriptionType.OFFER : DescriptionType.ANSWER;
      console.log(
        `${this.username} sends the ${isOffer} through the signal channel to ${to} in room ${privateRoom}`
      );

      this.$socket.emit(
        conference
          ? WebSocketEvents.PC_SIGNALING_CONFERENCE
          : WebSocketEvents.PRIVATE_MESSAGE_PC_SIGNALING,
        {
          desc,
          to,
          from: this.username,
          privateRoom,
        }
      );
    }

    addLocalStream(pc: RTCPeerConnection): void {
      // TODO: Refactor to the new method
      // pc.addTrack(this.localStream as unknown as MediaStreamTrack);
      // @ts-ignore
      pc.addStream((this.localStream as unknown) as MediaStreamTrack);
    }

    addCandidate(pc: RTCPeerConnection, candidate: RTCIceCandidateInit): void {
      try {
        pc.addIceCandidate(candidate);
      } catch (error) {
        console.error(error);
      }
    }

    onIceCandidates(
      pc: RTCPeerConnection,
      to: string,
      privateRoom: string,
      conference = false
    ): void {
      pc.onicecandidate = ({ candidate }) => {
        if (!candidate) return;

        setTimeout(() => {
          this.$socket.emit(
            conference
              ? WebSocketEvents.PC_SIGNALING_CONFERENCE
              : WebSocketEvents.PRIVATE_MESSAGE_PC_SIGNALING,
            {
              candidate,
              to,
              from: this.username,
              privateRoom,
            }
          );
        }, 500);
      };
    }

    pauseVideo(): void {
      this.localStream
        ?.getVideoTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }

    pauseAudio(): void {
      this.localStream
        ?.getAudioTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }

    // WIP...
  }
</script>
