import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";
import { ICEServers } from "@/utils/ICEServers";

export interface VideoState {
  pc: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream: MediaStream;
}

@Module({ dynamic: true, store, name: "video" })
class Video extends VuexModule implements VideoState {
  pc = new RTCPeerConnection(ICEServers);
  localStream!: MediaStream;
  remoteStream!: MediaStream;
}

export const VideoModule = getModule(Video);
