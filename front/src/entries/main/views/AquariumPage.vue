<template>
  <page-template>
    <v-row>
      <v-card style="width: 100%" class="mx-2">
        <v-expansion-panels hover flat>
          <v-expansion-panel class="system">
            <v-expansion-panel-header class="system">
              <div style="display: flex; justify-content: center">
                <div>
                  <v-icon>{{ mdiInformation }}</v-icon>
                  {{ $t('aquariumPage.note.title') }}
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col :cols="isMobile ? 12 : 10">
                  <i18n
                    path="aquariumPage.note.source"
                    tag="div"
                    style="text-align: center"
                    class="text-subtitle-1"
                  >
                    <span place="author" class="font-weight-bold">{{
                      $t('aquariumPage.note.author')
                    }}</span>
                  </i18n>
                  <div>
                    <div>{{ $t('aquariumPage.note.explanation.line1') }}</div>
                    <div>{{ $t('aquariumPage.note.explanation.line2') }}</div>
                    <div>
                      {{ $t('aquariumPage.note.explanation.line3') }}
                    </div>
                    <v-simple-table>
                      <colgroup>
                        <col span="1" style="width: 12%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th></th>
                          <th>{{ $t('aquariumPage.note.box1') }}</th>
                          <th>{{ $t('aquariumPage.note.explanation.box2') }}</th>
                          <th>{{ $t('aquariumPage.note.explanation.box3') }}</th>
                          <th>{{ $t('aquariumPage.note.explanation.box4') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {{ $t('aquariumPage.note.explanation.boxFishQuantity') }}
                          </td>
                          <td>1</td>
                          <td>2</td>
                          <td>3</td>
                          <td>4</td>
                        </tr>
                        <tr>
                          <th>{{ $t('aquariumPage.note.explanation.boxCapacity') }}</th>
                          <td>1</td>
                          <td>2</td>
                          <td>4</td>
                          <td>7</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <div>
                      {{ $t('aquariumPage.note.explanation.line4') }}
                    </div>

                    <v-simple-table>
                      <colgroup>
                        <col span="1" style="width: 12%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                        <col span="1" style="width: 22%" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th></th>
                          <th>S</th>
                          <th>M</th>
                          <th>L</th>
                          <th>XL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>
                            {{ $t('aquariumPage.note.explanation.fishSizeNumber') }}
                          </th>
                          <td>1</td>
                          <td>2</td>
                          <td>4</td>
                          <td>7</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-col>
                <v-col :cols="isMobile ? 12 : 2">
                  <v-img :src="aquariumSettingImg" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-text>
          <v-row>
            <v-col>
              <v-subheader>{{
                $t('aquariumPage.note.explanation.fishSize')
              }}</v-subheader>
              <v-btn-toggle
                v-model="sizeIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="size in allSizes" :key="size.id">
                  {{ size.size }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>{{
                $t('aquariumPage.note.explanation.waterType')
              }}</v-subheader>
              <v-btn-toggle
                v-model="waterIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="water in allWater" :key="water.id">
                  {{ water.name_chs }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>{{
                $t('aquariumPage.note.explanation.fishPatch')
              }}</v-subheader>
              <v-btn-toggle
                v-model="fishPatchIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="patch in PATCH_TEXT" :key="patch">
                  {{ patch }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>{{
                $t('aquariumPage.note.explanation.updateStatus')
              }}</v-subheader>
              <v-btn-toggle
                v-model="availableIndicesFilter"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="available in AVAILABLE_TYPES" :key="available">
                  {{ available }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <rc-autocomplete
                ref="search"
                v-model="fishId"
                :items="filteredList"
                item-value="id"
                item-text="name"
                :label="$t('aquariumPage.search.placeholder')"
                clearable
                solo
                :filter="filterOptions"
              >
                <template v-slot:item="data">
                  <div class="d-flex">
                    <v-list-item-avatar>
                      <raw-item-icon :icon-class="data.item.icon" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        <div>
                          {{ data.item.name }}
                        </div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </div>
                </template>
              </rc-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row>
      <v-col :cols="cols" v-for="fish in searchFilteredList" :key="fish.id">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="240"
          transition="fade-transition"
        >
          <fish-aquarium :fish="fish" :is-mobile="isMobile" />
        </v-lazy>
      </v-col>
    </v-row>
  </page-template>
</template>

<script>
import { AQUARIUMS, AQUARIUM_FISH_SIZE, AQUARIUM_WATER } from 'Data/fix'
import { OCEAN_FISHING_FISH } from 'Data/oceanFishing'
import { mdiInformation } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishAquarium from '@/components/FishAquarium'
import ImgUtil from '@/utils/ImgUtil'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import PageTemplate from '@/entries/main/views/PageTemplate'
import PinyinMatch from 'pinyin-match'
import RawItemIcon from '@/components/basic/RawItemIcon'
import RcAutocomplete from '@/components/basic/RcAutocomplete'

const PATCHES_MIN = [2, 3, 4, 5, 6]
export default {
  name: 'AquariumPage',
  mixins: [PageMixin],
  components: { PageTemplate, RcAutocomplete, RawItemIcon, FishAquarium },
  props: ['original'],
  data() {
    return {
      mdiInformation,
      aquariumSettingImg: ImgUtil.getImgUrl('aquarium-setting.webp'),
      isElectron: DevelopmentModeUtil.isElectron(),
      sizeIndicesToShow: Object.keys(AQUARIUM_FISH_SIZE).map(it => it - 1),
      waterIndicesToShow: Object.keys(AQUARIUM_WATER).map(it => it - 1),
      PATCH_TEXT: PATCHES_MIN.map(it => it + '.X'),
      fishPatchIndicesToShow: PATCHES_MIN.map((_, index) => index),
      allSizes: AQUARIUM_FISH_SIZE,
      allWater: AQUARIUM_WATER,
      AVAILABLE_TYPES: [
        this.$t('aquariumPage.filter.normal'),
        this.$t('aquariumPage.filter.new'),
        this.$t('aquariumPage.filter.future'),
      ],
      availableIndicesFilter: [0, 1, 2],
      fishId: undefined,
    }
  },
  computed: {
    cols() {
      return this.isMobile ? 12 : 4
    },
    aquariumFishList() {
      return Object.values(AQUARIUMS).map(aquarium => {
        const spotFishId =
          DataUtil.FISH_ID_TO_WIKI_IDS[aquarium.id]?.[0]?.split('-')?.[3] ?? aquarium.id
        const fishData = DataUtil.FISH_DATA[spotFishId] ?? OCEAN_FISHING_FISH[aquarium.id]
        return DataUtil.assembleAquarium(aquarium, fishData)
      })
    },
    filteredList() {
      return this.aquariumFishList
        .filter(fish => {
          return this.sizeIndicesToShow.map(it => it + 1).includes(fish.sizeId)
        })
        .filter(fish => {
          return this.waterIndicesToShow.map(it => it + 1).includes(fish.waterId)
        })
        .filter(fish => {
          return this.fishPatchIndicesToShow
            .map(i => PATCHES_MIN[i])
            .includes(Math.floor(fish.patch))
        })
        .filter(fish => {
          return this.availableIndicesFilter.includes(fish.available)
        })
    },
    searchFilteredList() {
      return this.filteredList.filter(fish => {
        return this.fishId == null || fish.id === this.fishId
      })
    },
  },
  methods: {
    filterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
  },
}
</script>
