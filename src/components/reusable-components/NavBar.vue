<template>
  <div>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title class="ml-4">Web App</v-toolbar-title>
    <v-spacer></v-spacer>
    <div>
      <UserLogout />
    </div>
  </v-app-bar>
</div>
</template>
<script>
import UserLogout from "./LogoutButton.vue";
export default {
  name: "NavBar",
  components: {
    UserLogout,
  }
};
</script>
<style scoped></style>
