import Vue from "vue";
import Vuex from "vuex";
import { SocketState } from "./modules/Socket";
import { VideoState } from "./modules/Video";
import { UtilsState } from "./modules/Utils";

Vue.use(Vuex);

export interface RootState {
  socket: SocketState;
  video: VideoState;
  utils: UtilsState;
}

export default new Vuex.Store<RootState>({});
