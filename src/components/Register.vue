<template>
  <v-container class="register">
    <v-card elevation="4" max-width="50%" class="mx-auto rounded-xl">
      <v-card-title class="display-1 font-weight-bold justify-center py-6"
        >VoChat</v-card-title
      >
      <v-divider />
      <v-card-subtitle class="pt-8 text-center"
        >Create account in VoChat app in order to use it!</v-card-subtitle
      >
      <v-form class="pa-8" @submit.prevent="registerUser()">
        <v-text-field
          v-model="registerData.name"
          label="Name"
          outlined
          color="indigo lighten-1"
        ></v-text-field>
        <v-text-field
          v-model="registerData.email"
          label="Email"
          outlined
          color="indigo lighten-1"
          type="email"
        ></v-text-field>
        <v-text-field
          v-model="registerData.password"
          label="Password"
          outlined
          color="indigo lighten-1"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="registerData.passwordConfirm"
          label="Confirm password"
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
          Sing Up
          <v-icon right>mdi-account-plus</v-icon>
        </v-btn>
      </v-form>
      <v-card-text class="d-flex justify-center align-center"
        >Already have an account?<v-btn
          :to="{ name: 'Home' }"
          class="px-2 font-weight-bold"
          color="indigo lighten-1"
          plain
          text
          small
          >Sign in!</v-btn
        ></v-card-text
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { RegisterData } from "@/interfaces/RegisterData";
  import { AuthService } from "@/services/AuthService";

  @Component
  export default class Register extends Vue {
    registerData: RegisterData = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    };

    async registerUser(): Promise<void> {
      try {
        await AuthService.register(this.registerData);
        this.$router.push({ name: "Home" });
      } catch (err) {
        console.error(err);
      }
    }
  }
</script>

<style>
  .register .v-card__title {
    font-family: "Nunito", sans-serif !important;
  }
</style>
