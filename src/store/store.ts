import Vue from "vue";
import Vuex from "vuex";
import { SocketState } from "./modules/Socket";
import { VideoState } from "./modules/Video";

Vue.use(Vuex);

export interface RootState {
  socket: SocketState;
  video: VideoState;
}

export default new Vuex.Store<RootState>({});
