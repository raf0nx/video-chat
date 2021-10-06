<template>
  <div
    class="error-page d-flex font-weight-bold align-center justify-center flex-column red--text"
  >
    <span class="error-page__code">404</span>
    Oops! Requested resource is not available.
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component
  export default class Error extends Vue {}
</script>

<style scoped>
  .error-page {
    font-size: 3rem;
  }
  .error-page__code {
    font-size: 6rem;
  }
</style>
