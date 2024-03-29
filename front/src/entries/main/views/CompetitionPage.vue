<template>
  <v-container
    fluid
    :class="
      `pa-0 detail-wrapper ${
        isElectron ? 'detail-wrapper--electron-original' : 'detail-wrapper--web'
      }`
    "
  >
    <v-row no-gutters>
      <v-col>
        <v-tabs v-model="tab">
          <v-tab v-for="(competition, i) in competitions" :key="i">
            {{ competition.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(competition, i) in competitions" :key="i">
            <v-card>
              <v-card-text>
                <v-row style="width: 100%" no-gutters>
                  <v-col :cols="isMobile ? 12 : 7" class="py-0 d-flex justify-center">
                    <img-viewer
                      v-if="competition.posters.length === 1"
                      :lazy-src="competition.posters[0].md"
                      :src="competition.posters[0].lg"
                      contain
                      :height="IMG_HEIGHT"
                    />
                    <v-carousel
                      v-else
                      hide-delimiter-background
                      show-arrows-on-hover
                      :height="IMG_HEIGHT"
                    >
                      <v-carousel-item
                        v-for="(poster, i) in competition.posters"
                        :key="i"
                      >
                        <img-viewer
                          :lazy-src="poster.md"
                          :src="poster.lg"
                          contain
                          :height="IMG_HEIGHT"
                        />
                      </v-carousel-item>
                    </v-carousel>
                  </v-col>
                  <v-col :cols="isMobile ? 12 : 5" :class="isMobile ? '' : 'pa-0'">
                    <div class="flex-column fill-height">
                      <div class="d-flex flex-column align-center">
                        <v-subheader>最终排名</v-subheader>
                        <div
                          class="d-flex align-center ma-4"
                          v-for="rank in competition.ranks"
                          :key="rank.name"
                        >
                          <v-icon :color="rank.color" x-large>{{ mdiMedal }}</v-icon>
                          <div class="ml-2" style="font-size: x-large">
                            {{ rank.name }}
                          </div>
                        </div>
                      </div>
                      <div class="d-flex flex-column align-center">
                        <v-subheader>工作人员</v-subheader>
                        <div>
                          <v-simple-table>
                            <tbody>
                              <tr
                                v-for="typeStaff in competition.staffs"
                                :key="typeStaff.type"
                              >
                                <td style="min-width: 96px">{{ typeStaff.type }}</td>
                                <td>{{ typeStaff.names }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { competitions } from 'Data/competition'
import { mdiMedal } from '@mdi/js'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import ImgViewer from '@/components/basic/ImgViewer'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'

export default {
  name: 'CompetitionPage',
  components: { ImgViewer },
  mixins: [PageMixin],
  props: ['original'],
  data() {
    return {
      mdiMedal,
      tab: null,
      competitionImageCrrIdx: competitions.map(() => 0),
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {
    IMG_HEIGHT() {
      return this.isMobile ? 400 : 800
    },
    competitions() {
      return competitions.map(competition => {
        return {
          ...competition,
          ranks: this.transferRank(competition.ranks),
        }
      })
    },
  },
  methods: {
    transferRank(names) {
      return names.map((name, i) => {
        return {
          name: name,
          color: ['#FCC201', '#D7D7D7', '#AD8A56'][i],
        }
      })
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"
.detail-wrapper
  width: 100%
  overflow-scrolling: auto
  overflow-x: hidden

  &--web
    height: 100%
    max-height: calc(100vh - #{ $wrapper-web })
    overflow-y: scroll
  &--electron-original
    max-height: calc(100vh - #{ $wrapper-desktop })
</style>
