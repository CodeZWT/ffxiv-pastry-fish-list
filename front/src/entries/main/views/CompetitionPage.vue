<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
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
                <v-row style="width: 100%">
                  <v-col :cols="isMobile ? 12 : 7" class="py-0">
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
                    <v-row class="flex-column fill-height">
                      <v-col class="d-flex flex-column align-center">
                        <v-subheader>最终排名</v-subheader>
                        <div class="d-flex align-center ma-4">
                          <v-icon color="#C9B037" x-large>fa fa-medal</v-icon>
                          <div class="ml-2" style="font-size: x-large">
                            {{ competition.ranks[0] }}
                          </div>
                        </div>
                        <div class="d-flex align-center ma-4">
                          <v-icon color="#D7D7D7" x-large>fa fa-medal</v-icon>
                          <div class="ml-2" style="font-size: x-large">
                            {{ competition.ranks[1] }}
                          </div>
                        </div>
                        <div class="d-flex align-center ma-4">
                          <v-icon color="#AD8A56" x-large>fa fa-medal</v-icon>
                          <div class="ml-2" style="font-size: x-large">
                            {{ competition.ranks[2] }}
                          </div>
                        </div>
                      </v-col>
                      <v-col class="d-flex flex-column align-center">
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
                      </v-col>
                    </v-row>
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
import EnvMixin from '@/components/basic/EnvMixin'
import ImgViewer from '@/components/basic/ImgViewer'

export default {
  name: 'CompetitionPage',
  components: { ImgViewer },
  mixins: [EnvMixin],
  data() {
    return {
      competitions: competitions.reverse(),
      tab: null,
      competitionImageCrrIdx: competitions.map(() => 0),
      IMG_HEIGHT: 800,
    }
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"
.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
