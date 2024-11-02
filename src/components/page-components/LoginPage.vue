<template>
  <v-container class="login-form">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-5" color="blue lighten-5">
          <v-card-title class="headline blue--text"> Login </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible>
              {{ errorMessage }}
            </v-alert>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                color="blue"
                prepend-icon="mdi-email"></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                outlined
                color="blue"
                prepend-icon="mdi-lock"></v-text-field>
              <v-text-field
                v-model="serverUrl"
                label="Server URL"
                outlined
                color="blue"
                prepend-icon="mdi-server"></v-text-field>
              <v-btn
                color="blue darken-2"
                class="white--text mt-4"
                @click="login">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { globalMethods } from "../../utility.js";

export default {
  name: "UserLogin",
  mixins: [globalMethods],
  data() {
    return {
      email: "test@example.com",
      password: "",
      serverUrl: "https://www.exampleurl.com/",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        const data = {
          UserName: this.email,
          Password: this.password,
        };
        const url = `${this.serverUrl}api/security/api-token-v3`;
        const urlEncodedData = new URLSearchParams(data);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData,
        });
        if (!response.ok) {
          const error = await response.text();
          if (error) {
            const errorJSON = JSON.parse(error);

            this.errorMessage = errorJSON?.errorDescription
              ? errorJSON.errorDescription
              : errorJSON.userMessage
              ? errorJSON.userMessage
              : "Oops! Something went wrong";
          }
          throw new Error(`HTTP error! status: ${error}`);
        }
        const responseData = await response.json();
        this.setTokenAndUrlInLocalStorage(responseData);
        this.$router.push("/users");
      } catch (error) {
        console.error("Login error:", error);
        if (!this.errorMessage) {
          this.errorMessage = "Oops! Something went wrong";
        }
      }
    },
  },
};
</script>
<style scoped>
.login-form {
  margin-top: 100px;
}
</style>
