<template>
    <v-row justify="space-around">
      <v-btn color="error" @click="logout"> Logout </v-btn></v-row
    >
  </template>
  
  <script>
  import { globalMethods } from "../../utility.js";
  export default {
    name: "UserLogout",
    mixins: [globalMethods],
  
    methods: {
      async logout() {
        try {
          let endPoint = `${this.getServerUrlFromLocalStorage()}/v2.1/logout`;
          await fetch(endPoint, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + this.getTokenFromLocalStorage(),
              "Content-Type": "application/json",
            },
          });
        } finally {
          this.removeTokenAndUrlFromLocalStorage();
          this.$router.push("/");
        }
      },
    },
  };
  </script>
  