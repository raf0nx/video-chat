import {
  Module,
  VuexModule,
  getModule,
  Action,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store/store";

export interface UtilsState {
  showLoader: boolean;
}

@Module({ dynamic: true, store, name: "utils" })
class Utils extends VuexModule implements UtilsState {
  showLoader = false;

  @Mutation
  private SET_LOADER(showLoader: boolean) {
    this.showLoader = showLoader;
  }

  @Action
  setLoader(showLoader: boolean) {
    this.SET_LOADER(showLoader);
  }
}

export const UtilsModule = getModule(Utils);
