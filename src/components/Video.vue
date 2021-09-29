<template>
  <v-card>
    <div class="d-flex justify-space-between">
      <video
        ref="webcamVideo"
        width="200px"
        height="400px"
        autoplay
        playsinline
      ></video>
      <video
        ref="remoteVideo"
        width="200px"
        height="400px"
        autoplay
        playsinline
      ></video>
    </div>
    <v-text-field v-model="key" label="Answer key"></v-text-field>
    <v-card-actions class="d-flex justify-space-between">
      <v-btn @click="startWebcam()">Start webcam</v-btn>
      <v-btn @click="createOffer()">Create call</v-btn>
      <v-btn @click="answer()">Answer</v-btn>
      <v-btn>Hangup</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import firebase from "firebase/compat/app";
  import "firebase/compat/firestore";

  import { VideoModule } from "@/store/Video";

  @Component
  export default class Video extends Vue {
    firestore = firebase.firestore();
    key = "";

    async startWebcam(): Promise<void> {
      VideoModule.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      VideoModule.remoteStream = new MediaStream();

      VideoModule.localStream.getTracks().forEach(track => {
        VideoModule.pc.addTrack(track, VideoModule.localStream);
      });

      VideoModule.pc.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          VideoModule.remoteStream.addTrack(track);
        });
      };

      (this.$refs.webcamVideo as HTMLVideoElement).srcObject =
        VideoModule.localStream;
      (this.$refs.remoteVideo as HTMLVideoElement).srcObject =
        VideoModule.remoteStream;
    }

    async createOffer(): Promise<void> {
      const callDoc = this.firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      this.key = callDoc.id;

      VideoModule.pc.onicecandidate = event => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = await VideoModule.pc.createOffer();
      await VideoModule.pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot: any) => {
        const data = snapshot.data;

        if (!VideoModule.pc.currentRemoteDescription && data.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          VideoModule.pc.setRemoteDescription(answerDescription);
        }
      });

      answerCandidates.onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            VideoModule.pc.addIceCandidate(candidate);
          }
        });
      });
    }

    async answer(): Promise<void> {
      const callId = this.key;
      const callDoc = this.firestore.collection("calls").doc(callId);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      VideoModule.pc.onicecandidate = event => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData!.offer;
      await VideoModule.pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await VideoModule.pc.createAnswer();
      await VideoModule.pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === "added") {
            let data = change.doc.data();
            VideoModule.pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }
  }
</script>

<style></style>
