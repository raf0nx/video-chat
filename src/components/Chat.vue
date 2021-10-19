<template>
  <v-container class="chat pa-0" fluid>
    <PrivateChat
      v-if="privateChat.openChat"
      :privateChat="privateChat"
      @closeChat="closePrivateChat()"
    />
    <v-card height="100vh">
      <v-app-bar fixed>
        <v-row>
          <v-col cols="2" class="py-0 pl-0">
            <div class="d-flex justify-space-between">
              <v-card-text class="subtitle-1 font-weight-bold"
                >Active users</v-card-text
              >
              <v-icon
                @click="changeStatus()"
                :color="getMyStatusColor()"
                x-large
                class="chat__my-status"
                >mdi-circle-small</v-icon
              >
            </div>
          </v-col>
          <v-divider class="ml-n3" vertical></v-divider>
          <v-col cols="10" class="py-0 pr-0">
            <div
              class="
								chat__toolbar--right
								pl-4
								pr-1
								d-flex
								justify-space-between
								align-center
							"
            >
              <v-select
                v-model="room"
                @change="changeRoomHandler($event)"
                :items="rooms"
                item-text="name"
                item-value="name"
                color="indigo lighten-1"
                item-color="indigo lighten-1"
                class="flex-grow-0 font-weight-bold"
                hide-details
              ></v-select>
              <v-icon @click="logout()">mdi-power</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-app-bar>
      <v-row class="chat__row pt-16 my-0">
        <v-col cols="2" class="pa-0">
          <UsersList
            :users="users"
            :isInPrivateChat="privateChat.openChat"
            @openChat="openChat($event)"
          />
        </v-col>
        <v-col cols="10" class="pa-0 d-flex flex-column justify-space-between">
          <ChatArea :messages="messages" :maxMessageLength="120" />
          <MessageArea @sendMessage="sendMessage($event)" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { SocketModule } from "@/store/modules/Socket";
  import { WebSocketEvents } from "@/enums/WebSocketEvents";
  import UsersList from "@/components/UsersList.vue";
  import ChatArea from "@/components/ChatArea.vue";
  import MessageArea from "@/components/MessageArea.vue";
  import PrivateChat from "@/components/PrivateChat.vue";
  import { Status } from "@/enums/Status";
  import { Message } from "@/interfaces/Message";
  import { PrivateChat as PrivateChatModel } from "@/interfaces/PrivateChat";
  import { User } from "@/interfaces/User";
  import { Room } from "@/interfaces/Room";
  import { UserModule } from "@/store/modules/User";
  import { AuthService } from "@/services/AuthService";
  import { StatusColors } from "@/enums/StatusColors";

  @Component({
    components: { UsersList, ChatArea, MessageArea, PrivateChat },
    sockets: {
      newUser({ users, username }: { users: User[]; username: string }): void {
        const me = UserModule.username === username;

        if (users.length > (this as Chat).users.length) {
          (this as Chat).messages.push({
            join: true,
            message: `${me ? "You" : username} joined the room!`,
          });
        } else if (users.length < (this as Chat).users.length) {
          (this as Chat).messages.push({
            join: true,
            message: `${username} left the room!`,
          });
        }

        (this as Chat).users = [...users];
      },
      newMessage({
        message,
        username,
      }: {
        message: string;
        username: string;
      }): void {
        const me = UserModule.username === username;
        const msg = me
          ? { join: false, message }
          : { join: false, message, username };
        (this as Chat).messages.push({ ...msg, me });
      },
      leaveChat({ users, message }: { users: User[]; message: string }): void {
        (this as Chat).messages.push({ join: true, message });
        (this as Chat).users = [...users];
      },
      privateChat({ to, from }: { to: string; from: string }): void {
        if (UserModule.username !== to || (this as Chat).privateChat.openChat) {
          return;
        }

        (this as Chat).privateChat = {
          ...(this as Chat).privateChat,
          openChat: true,
          user: from,
          room: to,
          messages: [
            {
              message: `Write something to ${from}!`,
              join: true,
            },
          ],
        };
      },
      leavePrivateRoom({ privateMessage }: { privateMessage: string }): void {
        if ((this as Chat).privateChat.closed) {
          return;
        }

        (this as Chat).privateChat.messages.push({
          message: privateMessage,
          join: true,
        });
        (this as Chat).privateChat = {
          ...(this as Chat).privateChat,
          closed: true,
        };
      },
      privateMessage({
        privateMessage,
        to,
      }: {
        privateMessage: string;
        to: string;
      }): void {
        (this as Chat).privateChat.messages.push({
          message: privateMessage,
          join: false,
          me: UserModule.username !== to,
        });
      },
    },
  })
  export default class Chat extends Vue {
    messages: Message[] = [];
    room = SocketModule.room;
    username = UserModule.username;
    users: User[] = [];
    privateChat: PrivateChatModel = {
      openChat: false,
      user: "",
      messages: [],
      room: "",
      closed: false,
    };

    get rooms(): Room[] {
      return SocketModule.rooms;
    }

    async beforeCreate(): Promise<void> {
      this.$socket.emit(WebSocketEvents.JOIN_ROOM, this.$store.state);
    }

    async logout(): Promise<void> {
      try {
        await AuthService.logout();
        this.$socket.emit(WebSocketEvents.LEAVE_CHAT, {
          room: this.room,
          username: this.username,
        });
        await SocketModule.joinRoom("");
        UserModule.setAuthUser(null);

        this.$router.push({ name: "Home" });
      } catch (err) {
        console.error(err);
      }
    }

    getMyStatusColor(): string {
      switch (UserModule.status) {
        case Status.AVAILABLE:
          return StatusColors.GREEN;
        case Status.AWAY:
          return StatusColors.ORANGE;
        case Status.UNAVAILABLE:
          return StatusColors.RED;
        default:
          return StatusColors.WHITE;
      }
    }

    changeRoomHandler(selectedRoom: string): void {
      this.$socket.emit(WebSocketEvents.LEAVE_ROOM, this.$store.state);
      SocketModule.joinRoom(selectedRoom);
      this.messages.length = 0;
      this.$socket.emit(WebSocketEvents.JOIN_ROOM, this.$store.state);
    }

    openChat(username: string): void {
      this.privateChat = {
        ...this.privateChat,
        openChat: true,
        room: username,
        user: username,
        messages: [
          {
            join: true,
            message: `Write something to ${username}!`,
          },
        ],
      };
    }

    changeStatus(): void {
      UserModule.changeStatus();
      this.$socket.emit(WebSocketEvents.CHANGE_STATUS, this.$store.state);
    }

    sendMessage(message: string): void {
      this.$socket.emit(WebSocketEvents.PUBLIC_MESSAGE, {
        ...this.$store.state,
        message,
      });
    }

    closePrivateChat(): void {
      Object.assign(this.privateChat, {
        openChat: false,
        closed: false,
        user: "",
        messages: [],
        room: "",
      });
    }
  }
</script>

<style>
  .chat {
    height: 100vh;
  }
  .chat .chat__row {
    height: 100%;
  }
  .chat .chat__my-status::after {
    width: 0;
    height: 0;
  }
  .chat .v-card__text {
    font-family: "Nunito", sans-serif !important;
  }
  .chat__toolbar--right {
    height: 100%;
  }
  .chat .v-select__slot {
    max-width: 200px;
  }
</style>
