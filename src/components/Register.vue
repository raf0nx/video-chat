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
      <ValidationObserver ref="form" v-slot="{ passes, invalid }">
        <v-form class="pa-8" @submit.prevent="passes(registerUser)">
          <ValidationProvider
            v-slot="{ errors }"
            name="name"
            rules="required|alpha_num_spaces|min:3|max:255"
          >
            <v-text-field
              v-model="registerData.name"
              label="Name"
              outlined
              color="indigo lighten-1"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
          >
            <v-text-field
              v-model="registerData.email"
              label="Email"
              outlined
              color="indigo lighten-1"
              :error-messages="errors"
              type="email"
            ></v-text-field>
          </ValidationProvider>
          <ValidationObserver>
            <ValidationProvider
              v-slot="{ errors }"
              name="password"
              rules="required|min:8|max:255|uppercase|number|special_char"
            >
              <v-text-field
                v-model="registerData.password"
                label="Password"
                outlined
                color="indigo lighten-1"
                :error-messages="errors"
                type="password"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              name="passwordConfirm"
              rules="required|confirmed:password"
            >
              <v-text-field
                v-model="registerData.passwordConfirm"
                label="Confirm password"
                outlined
                color="indigo lighten-1"
                :error-messages="errors"
                type="password"
              ></v-text-field>
            </ValidationProvider>
          </ValidationObserver>
          <v-btn
            type="submit"
            class="font-weight-bold"
            large
            color="indigo lighten-1"
            block
            :disabled="invalid"
          >
            Sing Up
            <v-icon class="align-self-start" right>mdi-account-plus</v-icon>
          </v-btn>
        </v-form>
      </ValidationObserver>
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
  import { ValidationProvider, ValidationObserver } from "vee-validate";

  import { RegisterData } from "@/interfaces/RegisterData";
  import { AuthService } from "@/services/AuthService";
  import { UtilsModule } from "@/store/modules/Utils";
	import { ErrorValidationResponse } from "@/interfaces/ErrorValidationResponse";

  @Component({ components: { ValidationProvider, ValidationObserver } })
  export default class Register extends Vue {
    registerData: RegisterData = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    };

    $refs!: {
      form: InstanceType<typeof ValidationObserver>;
    };

    async registerUser(): Promise<void> {
      UtilsModule.setLoader(true);
      try {
        await AuthService.register(this.registerData);
        this.$router.push({ name: "Home" });
      } catch (err: any) {
        const errors = (err.response as ErrorValidationResponse ).data.errors;
        this.$refs.form.setErrors({
          name: errors.name.msg,
          email: errors.email.msg,
          password: errors.password.msg,
          passwordConfirm: errors.passwordConfirm.msg,
        });
      }
      UtilsModule.setLoader(false);
    }
  }
</script>

<style>
  .register .v-card__title {
    font-family: "Nunito", sans-serif !important;
  }
</style>
