<template>
  <v-container class="home">
    <v-card elevation="4" max-width="50%" class="mx-auto rounded-xl">
      <v-card-title class="display-1 font-weight-bold justify-center py-6"
        >Welcome back!</v-card-title
      >
      <v-divider />
      <v-card-subtitle class="pt-8 text-center"
        >Join right now to students community from whole over the
        world!</v-card-subtitle
      >
      <v-form @submit.prevent="loginUser()" class="pa-8">
        <v-text-field
          v-model="loginData.email"
          label="Email"
          outlined
          color="indigo lighten-1"
          type="email"
        ></v-text-field>
        <v-text-field
          v-model="loginData.password"
          label="Password"
          outlined
          color="indigo lighten-1"
          type="password"
        ></v-text-field>
        <v-btn
          type="submit"
          class="font-weight-bold"
          large
          color="indigo lighten-1"
          block
        >
          Continue
          <v-icon right>mdi-chevron-right</v-icon>
          <v-icon class="ml-n2" right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-form>
      <div class="d-flex align-center px-8 py-4">
        <v-divider></v-divider>
        <span class="px-4">OR</span>
        <v-divider></v-divider>
      </div>
      <div class="px-8 py-4">
        <v-btn
          @click="loginToGoogle()"
          class="px-8 font-weight-bold"
          light
          large
          block
        >
          <v-icon class="mr-4" left>mdi-google</v-icon>
          Continue with google
        </v-btn>
      </div>
      <v-card-text class="d-flex justify-center align-center"
        >Don't have an account?<v-btn
          :to="{ name: 'Register' }"
          class="px-2 font-weight-bold"
          color="indigo lighten-1"
          plain
          text
          small
          >Create!</v-btn
        ></v-card-text
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { URL } from "@/utils/utils";
  import { SocketModule } from "@/store/Socket";
  import { UserModule } from "@/store/User";
  import { AuthService } from "@/services/AuthService";

  @Component
  export default class Home extends Vue {
    loginData = {
      email: "",
      password: "",
    };

    async loginUser(): Promise<void> {
      try {
        const response = await AuthService.login(
          this.loginData.email,
          this.loginData.password
        );
        UserModule.setAuthUser(response.data);
        SocketModule.joinRoom(SocketModule.room);
        this.$router.push({ name: "Chat" });
      } catch (error) {
        console.error(error);
      }
    }

    async fetchUser(): Promise<void> {
      try {
        const response = await AuthService.getAuthUser();
        UserModule.setAuthUser(response.data);
        SocketModule.joinRoom(SocketModule.room);
        this.$router.push({ name: "Chat" });
      } catch (err) {
        console.error(err);
      }
    }

    loginToGoogle(): void {
      let timer: any = null;
      const newWindow = window.open(
        `${URL}/auth/google/login`,
        "_blank",
        "width=500,height=600"
      );

      if (newWindow) {
        timer = setInterval(() => {
          if (newWindow.closed) {
            this.fetchUser();
            if (timer) {
              clearInterval(timer);
            }
          }
        }, 500);
      }
    }
  }
</script>

<style>
  .home .v-card__title {
    font-family: "Nunito", sans-serif !important;
  }
</style>
