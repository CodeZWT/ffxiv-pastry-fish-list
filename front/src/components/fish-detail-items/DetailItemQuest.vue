<template>
  <div>
    <v-subheader>任务及其他信息</v-subheader>
    <v-alert
      v-for="task in fish.tasks"
      :key="task.id"
      border="top"
      colored-border
      type="info"
      elevation="2"
      class="rounded-0"
      :icon="mdiFormatListChecks"
      color="secondary"
    >
      <div class="d-flex align-center my-1">
        <span>任务：{{ task.name }}</span>
        <v-spacer />
        <v-btn text outlined @click="goTo(task)">
          查看任务详细
          <v-icon right>{{ mdiLinkVariant }}</v-icon>
        </v-btn>
      </div>

      <div v-if="task.title" class="my-1">称号：{{ task.title }}</div>
      <div v-if="task.comment" class="my-1">备注： <span v-html="task.comment" /></div>
      <div class="my-1">
        所有需求鱼
        <template v-if="task.requireCollectable">
          (<i title="收藏品" class="xiv collectables" />收藏品)
        </template>
        <span>：</span>
      </div>
      <div class="d-flex align-center my-1 flex-wrap">
        <div v-for="item in task.items" :key="item.id" class="d-flex align-center">
          <item-icon :icon-class="item.icon" :title="item.name" />
          <link-list
            :id="item.id"
            :angler-id="item.anglerFishId"
            :name="item.name"
            :names="item.names"
            mode="fish"
          >
            <v-hover v-slot="{ hover }">
              <div
                :class="
                  `text-subtitle-1 ${hover ? 'info--text text-decoration-underline' : ''}`
                "
              >
                {{ item.name }}
              </div>
            </v-hover>
          </link-list>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script>
import { mdiFormatListChecks, mdiLinkVariant } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'

export default {
  name: 'DetailItemQuest',
  components: { LinkList, ItemIcon },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    // expanded: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data: () => ({
    mdiLinkVariant,
    mdiFormatListChecks,
    // lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
  methods: {
    goTo(task) {
      const link = task.link ?? DataUtil.toHuijiWikiQuestLink({ name: task.name_chs })
      window.open(link)
    },
  },
}
</script>

<style scoped></style>
