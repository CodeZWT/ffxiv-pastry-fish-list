<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" tile>
          <v-list-item v-for="fish in fishList" :key="fish.name" three-line>
            <v-list-item-content>
              <v-list-item-title>
                {{ getItemName(fish._id) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ getFishingSpotsName(fish.location) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ fish.startHour }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "fish-list",
  data: () => ({
    locale: "en"
  }),
  computed: {
    ...mapState({
      fishList: "fish",
      items: "items",
      fishingSpots: "fishingSpots"
    })
  },
  mounted() {},
  methods: {
    getItemName(id) {
      return this.items[id]["name_" + this.locale];
    },
    getFishingSpotsName(id) {
      return (
        this.fishingSpots[id] && this.fishingSpots[id]["name_" + this.locale]
      );
    }
  }
};
</script>
