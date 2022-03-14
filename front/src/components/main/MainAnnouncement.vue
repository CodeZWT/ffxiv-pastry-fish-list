<template>
  <div>
    <rc-tooltip v-if="!isMobile" :message="$t('setting.announcement')" bottom>
      <v-btn icon text @click="forceShow = true">
        <v-icon>{{ messageIcon }}</v-icon>
      </v-btn>
    </rc-tooltip>

    <rc-dialog
      v-if="currAnnouncement"
      :value="show"
      @input="handleClose"
      max-width="600"
      scrollable
      :persistent="hasUnreadAnnouncement"
    >
      <v-card>
        <v-card-title>{{ currAnnouncement.title }}</v-card-title>
        <v-card-subtitle>
          {{ new Date(currAnnouncement.updatedAt).toLocaleString() }}
        </v-card-subtitle>
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
import { mdiMessageBadge, mdiMessageOutline } from '@mdi/js'
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
      mdiMessageBadge,
      mdiMessageOutline,
      forceShow: false,
      md: new MarkdownIt(),
      currAnnouncementIndex: -1,
    }
  },
  computed: {
    ...mapState('announcement', ['announcements']),
    messageIcon() {
      return this.hasUnreadAnnouncement ? mdiMessageBadge : mdiMessageOutline
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
    this.fetchAnnouncement()
    setInterval(() => this.fetchAnnouncement(), 10 * 60 * 1000)
  },
  methods: {
    ...mapMutations('announcement', ['updateAnnouncements', 'confirmRead']),
    onConfirmRead() {
      this.handleClose()
      if (this.currAnnouncementId) {
        this.confirmRead(this.currAnnouncementId)
      }
    },
    handleClose() {
      this.forceShow = false
    },
    async fetchAnnouncement() {
      console.debug('[Announcement] Checking Announcement')
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
  },
}
</script>

<style scoped>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
