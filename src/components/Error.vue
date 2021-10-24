<template>
  <div
    class="error-page d-flex font-weight-bold align-center justify-center flex-column red--text text-center"
  >
    <span class="error-page__code">{{ errorCode }}</span>
    {{ errorMessage }}
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component
  export default class Error extends Vue {
		@Prop({ default: 404 }) errorCode!: number;
		@Prop({ default: "Oops! Requested resource is not available." }) errorMessage!: string;
	}
</script>

<style scoped>
  .error-page {
    font-size: 2rem;
		padding: 0 10%;
  }
  .error-page__code {
    font-size: 6rem;
  }
</style>
