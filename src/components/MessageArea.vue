<template>
  <v-textarea
    v-model="message"
    no-resize
    placeholder="Aa"
    class="px-8 pt-4 flex-shrink-1 flex-grow-0"
    rows="1"
    color="indigo lighten-1"
    append-icon="mdi-send"
    filled
    rounded
    dense
    @click:append="sendMessage()"
    @keyup.enter="sendMessage()"
  ></v-textarea>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component
  export default class MessageArea extends Vue {
    message = "";

    sendMessage(): void {
      const trimmedMsg = this.message.trim();

      if (!trimmedMsg) {
        return;
      }

      this.$emit("sendMessage", trimmedMsg);
      this.message = "";
    }
  }
</script>

<style></style>
