<template>
  <v-dialog
    v-model="privateChat.openChat"
    max-width="350px"
    scrollable
    hide-overlay
    persistent
    no-click-animation
  >
    <v-dialog
      v-model="videoCall"
      max-width="500px"
      hide-overlay
      persistent
      no-click-animation
    >
      <Video />
    </v-dialog>
    <v-card>
      <v-card-actions class="justify-space-between py-4">
        <span class="font-weight-bold">{{ privateChat.user }}</span>
        <div>
          <v-icon
            :disabled="!privateChat.messages.length"
            class="mr-2"
            @click="videoCall = !videoCall"
            >{{ videoCall ? "mdi-video-off" : "mdi-video" }}</v-icon
          >
          <v-icon @click="closeChat()">mdi-close</v-icon>
        </div>
      </v-card-actions>
      <v-card-text
        class="pa-0 d-flex flex-column justify-space-between"
        style="height: 400px"
      >
        <ChatArea
          :messages="privateChat.messages"
          :maxMessageLength="30"
          :isPrivate="true"
        />
        <v-textarea
          v-model="privateMessage"
          no-resize
          hide-details
          placeholder="Aa"
          class="pa-4 flex-shrink-1 flex-grow-0"
          rows="1"
          color="indigo lighten-1"
          append-icon="mdi-send"
          filled
          rounded
          dense
          :disabled="privateChat.closed"
          @click:append="sendPrivateMessage(privateMessage)"
          @keyup.enter="sendPrivateMessage(privateMessage)"
        ></v-textarea>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from "vue-property-decorator";

  import { WebSocketEvents } from "@/enums/WebSocketEvents";
  import { SocketModule } from "@/store/modules/Socket";
  import ChatArea from "@/components/ChatArea.vue";
  import Video from "@/components/Video.vue";
  import { PrivateChat as PrivateChatModel } from "@/interfaces/PrivateChat";
  import { sortNamesAlphabetically } from "@/utils/utils";
	import { UserModule } from "@/store/modules/User";

  @Component({
    components: { ChatArea, Video },
  })
  export default class PrivateChat extends Vue {
    @Prop() privateChat!: PrivateChatModel;

    privateMessage = "";
    videoCall = false;

    get privateRoom(): string {
      return sortNamesAlphabetically(
        UserModule.username!,
        this.privateChat.user
      );
    }

    created() {
      this.joinChatRoom(this.privateChat, {
        openChat: false,
        user: "",
        messages: [],
        room: "",
        closed: false,
      });
    }

    @Watch("privateChat")
    joinChatRoom(
      { openChat }: PrivateChatModel,
      oldVal: PrivateChatModel
    ): void {
      if (openChat && openChat !== oldVal.openChat) {
        if (this.privateChat.room !== UserModule.username) {
          this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
            ...this.$store.state,
            to: this.privateChat.user,
            from: UserModule.username,
            privateRoom: sortNamesAlphabetically(
              this.privateChat.user,
              UserModule.username!
            ),
          });
        }

        if (this.privateChat.room === UserModule.username) {
          this.$socket.emit(WebSocketEvents.JOIN_PRIVATE_ROOM, {
            ...this.$store.state,
            to: UserModule.username,
            from: UserModule.username,
            privateRoom: sortNamesAlphabetically(
              this.privateChat.user,
              UserModule.username
            ),
            joinConfirm: true,
          });
        }
      }
    }

    closeChat(): void {
      this.$socket.emit(WebSocketEvents.LEAVE_PRIVATE_ROOM, {
        room: SocketModule.room,
        to: this.privateChat.room,
        from: UserModule.username,
        privateRoom: this.privateRoom,
      });

      this.$emit("closeChat");
    }

    sendPrivateMessage(message: string): void {
      if (!this.privateMessage.trim().length) {
        return;
      }

      this.$socket.emit(WebSocketEvents.PRIVATE_MESSAGE, {
        privateMessage: message,
        to: this.privateChat.user,
        from: UserModule.username,
        privateRoom: this.privateRoom,
      });

      this.privateMessage = "";
    }
  }
</script>

<style>
  .v-dialog__content:nth-child(2) {
    justify-content: flex-end !important;
    align-items: flex-end !important;
  }
  .v-card__actions {
    background-color: #000000;
  }
</style>
