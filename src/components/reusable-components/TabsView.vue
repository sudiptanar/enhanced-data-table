<template>
  <v-tabs centered icons-and-text>
    <v-tabs-slider></v-tabs-slider>
    <v-tab to="/users">
      Users
      <v-icon>mdi-account-multiple</v-icon>
    </v-tab>
    <v-tab to="/roles">
      Roles
      <v-icon>mdi-account-settings</v-icon>
    </v-tab>
  </v-tabs>
</template>
<script>
// Todo make this componenet reuable
export default {
  name: "TabsView",
};
</script>
