<template>
  <div>
    <v-subheader>{{ $t('task.detail.title') }}</v-subheader>
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
        <span>{{ $t('task.detail.taskTitle', [task.name]) }}</span>
        <v-spacer />
        <v-btn text outlined @click="goTo(task)">
          {{ $t('task.detail.checkTaskDetail') }}
          <v-icon right>{{ mdiLinkVariant }}</v-icon>
        </v-btn>
      </div>

      <div v-if="task.title" class="my-1">
        {{ $t('task.detail.rewardTitle', [task.title]) }}
      </div>
      <div v-if="task.comment" class="my-1">
        {{ $t('task.detail.comment') }} <span v-html="task.comment" />
      </div>
      <div class="my-1">
        <i18n path="task.detail.requirement">
          <template v-if="task.requireCollectable">
            <i18n place="collectable" path="common.ui.brackets">
              <span>
                <i :title="$t('common.game.collectable')" class="xiv collectables" />
                {{ $t('common.game.collectable') }}
              </span>
            </i18n>
          </template>
          <template v-else>
            <span place="collectable"></span>
          </template>
        </i18n>
      </div>
      <div class="d-flex align-center my-1 flex-wrap">
        <div v-for="item in task.items" :key="item.id" class="d-flex align-center">
          <item-icon :icon-class="item.icon" :title="item.name" />
          <div v-if="!item.isInLog" class="text-subtitle-1">
            {{ item.name }}
          </div>
          <link-list
            v-else
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
                :title="item.collectable ? $t('common.game.collectable') : ''"
              >
                {{ item.name }}
                <i v-if="item.collectable" class="xiv collectables"></i>
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
