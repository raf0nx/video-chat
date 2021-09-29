import Vue from "vue";
import Vuex from "vuex";
import { SocketState } from "./Socket";
import { VideoState } from "./Video";

Vue.use(Vuex);

export interface RootState {
  socket: SocketState;
  video: VideoState;
}

export default new Vuex.Store<RootState>({});
