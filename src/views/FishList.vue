<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" tile>
          <code>ET: {{ time }}</code>
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
                      {{ getFishingSpotsName(fish.location) }} @
                      {{ getZoneName(fish.location) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ getWeatherAt(fish.location) }}
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
                        <v-icon v-if="fish.previousWeatherSet.length > 0">
                          mdi-arrow-right
                        </v-icon>
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
import EorzeaTime from "@/utils/Time";
import EorzeaWeather from "@/utils/Weather";

const HOST = "https://cafemaker.wakingsands.com";

export default {
  name: "fish-list",
  data: () => ({
    locale: "ja",
    time: undefined
  }),
  computed: {
    ...mapState({
      fishList: state => Object.values(state.fish), //.filter(it => it._id == 8759),
      items: "items",
      fishingSpots: "fishingSpots",
      weatherTypes: "weatherTypes",
      zones: "zones",
      weatherRates: "weatherRates"
    })
  },
  created() {
    setInterval(() => (this.time = new EorzeaTime()), 1000);
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
  },
  methods: {
    getItemName(id) {
      return this.getName(this.items[id]);
    },
    getFishingSpotsName(id) {
      return this.fishingSpots[id] && this.getName(this.fishingSpots[id]);
    },
    getZoneName(id) {
      const fishingSpot = this.fishingSpots[id];
      if (fishingSpot) {
        return this.getName(
          this.zones[this.weatherRates[fishingSpot.territory_id].zone_id]
        );
      }
    },
    getZoneId(id) {
      const fishingSpot = this.fishingSpots[id];
      if (fishingSpot) {
        return this.weatherRates[fishingSpot.territory_id].zone_id;
      }
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
          name: this.getName(this.weatherTypes[id]),
          icon: this.iconIdToUrl(this.weatherTypes[id].icon)
        };
      });
    },
    getName(multiLanguageItem) {
      return multiLanguageItem["name_" + this.locale];
    },
    getWeatherAt(id) {
      const fishingSpot = this.fishingSpots[id];
      if (fishingSpot) {
        return this.getName(
          this.weatherTypes[
            EorzeaWeather.weatherAt(fishingSpot.territory_id, Date.now())
          ]
        );
      }
    }
  }
};
</script>
