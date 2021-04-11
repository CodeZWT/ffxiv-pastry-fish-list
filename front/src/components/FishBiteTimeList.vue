<template>
  <v-menu right offset-x open-on-hover open-delay="300" close-delay="300">
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex align-center justify-center" v-bind="attrs" v-on="on">
        <span>{{ item.biteTimeMin }}</span>
        <span v-if="item.biteTimeMax && item.biteTimeMax !== item.biteTimeMin">
          <span class="mx-1">-</span>{{ item.biteTimeMax }}
        </span>
      </div>
    </template>

    <v-sheet max-width="300px">
      <v-list v-if="item">
        <v-list-item v-for="(item, index) in item.biteTimeOfBaits" :key="index">
          <v-list-item-avatar>
            <div :class="item.icon" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ item.baitName }}（{{ item.count }}条记录）</v-list-item-title
            >
            <v-list-item-subtitle>
              {{ item.biteTimeMin }}s<span class="mx-1">-</span>{{ item.biteTimeMax }}s
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn color="primary" block @click="openUploadPage" class="rounded-t-0">
        上传数据
      </v-btn>
    </v-sheet>
  </v-menu>
</template>

<script>
export default {
  name: 'FishBiteTimeList',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    openUploadPage() {
      window.open(
        'https://workspace.jianguoyun.com/inbox/collect/3ddb8c50e5ac4c43afc36f41eae33879/submit',
        '_blank'
      )
    },
  },
}
</script>

<style scoped></style>
