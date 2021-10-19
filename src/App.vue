<template>
  <v-app id="app">
    <v-main class="d-flex align-center">
      <transition name="zoom" mode="out-in" appear>
        <router-view />
      </transition>
      <v-overlay :value="showLoader">
        <v-progress-circular indeterminate size="64" width="8"></v-progress-circular>
      </v-overlay>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { UtilsModule } from "./store/modules/Utils";

  @Component
  export default class App extends Vue {
    get showLoader(): boolean {
      return UtilsModule.showLoader;
    }
  }
</script>

<style>
  #app {
    font-family: "Nunito", sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .zoom-enter-active,
  .zoom-leave-active {
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-name: zoom;
  }
  .zoom-leave-active {
    animation-direction: reverse;
  }
  @keyframes zoom {
    from {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }

    100% {
      opacity: 1;
    }
  }
</style>
