<template>
  <div>
    <rc-tooltip v-if="!isMobile" :message="$t('setting.announcement')" bottom>
      <v-btn icon text @click="forceShow = true">
        <v-icon>{{ bellIcon }}</v-icon>
      </v-btn>
    </rc-tooltip>

    <rc-dialog
      v-if="currAnnouncement"
      :value="show"
      @input="$emit('input', $event)"
      max-width="600"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title>{{ currAnnouncement.title }}</v-card-title>
        <v-card-subtitle>
          {{ new Date(currAnnouncement.updatedAt).toLocaleString() }}
        </v-card-subtitle>
        <v-subheader v-if="currAnnouncement.description">
          {{ currAnnouncement.description }}
        </v-subheader>
        <v-card-text>
          <div class="markdown-body" v-html="currAnnouncementContent"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="onConfirmRead">
            {{ $t('common.ui.dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import * as MarkdownIt from 'markdown-it'
import { mapMutations, mapState } from 'vuex'
import { mdiBellBadge, mdiBellOutline } from '@mdi/js'
import EnvMixin from '@/components/basic/EnvMixin'
import RcDialog from '@/components/basic/RcDialog'
import RcTooltip from '@/components/basic/RcTooltip'
import rcapiService from '@/service/rcapiService'

export default {
  name: 'MainAnnouncement',
  components: { RcTooltip, RcDialog },
  mixins: [EnvMixin],
  props: {
    announcement: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      mdiBellOutline,
      mdiBellBadge,
      forceShow: false,
      md: new MarkdownIt(),
      currAnnouncementIndex: -1,
    }
  },
  computed: {
    ...mapState('announcement', ['announcements']),
    bellIcon() {
      return this.hasUnreadAnnouncement ? mdiBellBadge : mdiBellOutline
    },
    hasUnreadAnnouncement() {
      return this.announcements[this.currAnnouncementIndex]?.unread
      // return this.announcements.some(it => it.unread)
    },
    show() {
      return this.hasUnreadAnnouncement || this.forceShow
    },
    currAnnouncementId() {
      return this.announcements[this.currAnnouncementIndex]?.id
    },
    currAnnouncement() {
      return this.announcements[this.currAnnouncementIndex]
    },
    currAnnouncementContent() {
      return (
        this.currAnnouncement?.content && this.md.render(this.currAnnouncement?.content)
      )
    },
  },
  async created() {
    const annoInfoList = await rcapiService.getAnnouncementList()
    if (annoInfoList.length > 0) {
      const annoList = []
      for await (const annoInfo of annoInfoList) {
        const anno = await rcapiService.getAnnouncement(annoInfo.id)
        annoList.push(anno)
      }
      this.updateAnnouncements(annoList)
      // TODO implement announcement list panel
      if (annoList.length > 0) {
        this.currAnnouncementIndex = 0
      }
    }
  },
  methods: {
    ...mapMutations('announcement', ['updateAnnouncements', 'confirmRead']),
    onConfirmRead() {
      this.forceShow = false
      if (this.currAnnouncementId) {
        this.confirmRead(this.currAnnouncementId)
      }
    },
  },
}
</script>

<style scoped></style>
