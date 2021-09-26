<template>
  <v-app>
    <v-app-bar app> </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App.vue',
}
</script>

<style scoped></style>
