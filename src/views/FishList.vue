<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" tile>
          <v-list three-line>
            <v-virtual-scroll
              :items="fishList"
              :item-height="100"
              height="1000"
            >
              <template v-slot="{ item: fish }">
                <v-list-item :key="fish.name" three-line>
                  <v-list-item-avatar tile>
                    <v-img :src="getItemIconUrl(fish._id)"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ getItemName(fish._id) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ getFishingSpotsName(fish.location) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <div style="display: flex">
                        <div
                          :key="weather.name"
                          v-for="weather in getWeather(fish.previousWeatherSet)"
                          :title="weather.name"
                        >
                          <v-img
                            :src="weather.icon"
                            :key="weather.name"
                            :alt="weather.name"
                            width="24"
                            height="24"
                          ></v-img>
                        </div>
                        <v-icon>mdi-arrow-right</v-icon>
                        <div
                          :key="weather.name"
                          v-for="weather in getWeather(fish.weatherSet)"
                          :title="weather.name"
                        >
                          <v-img
                            :src="weather.icon"
                            :key="weather.name"
                            :alt="weather.name"
                            width="24"
                            height="24"
                          ></v-img>
                        </div>
                      </div>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ fish.startHour }} - {{ fish.endHour }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

const HOST = "https://cafemaker.wakingsands.com";

export default {
  name: "fish-list",
  data: () => ({
    locale: "en"
  }),
  computed: {
    ...mapState({
      fishList: state => Object.values(state.fish).filter(it => it._id == 8759),
      items: "items",
      fishingSpots: "fishingSpots",
      weatherTypes: "weatherTypes"
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
    },
    getItemIconUrl(id) {
      const iconId = this.items[id].icon;
      return this.iconIdToUrl(iconId);
    },
    iconIdToUrl(iconId) {
      return `${HOST}/i/${iconId.substring(0, 3)}000/${iconId}.png`;
    },
    getWeather(weatherSet) {
      return weatherSet.map(id => {
        return {
          name: this.weatherTypes[id]["name_" + this.locale],
          icon: this.iconIdToUrl(this.weatherTypes[id].icon)
        };
      });
    }
  }
};
</script>
