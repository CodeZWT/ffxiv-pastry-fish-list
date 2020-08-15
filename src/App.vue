<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div>Fish List</div>
    </v-app-bar>

    <v-main>
      <fish-list />
    </v-main>
  </v-app>
</template>

<script>
import FishList from "./components/FishList";

export default {
  name: "App",

  components: {
    FishList
  },

  data: () => ({
    //
  })
};
</script>
