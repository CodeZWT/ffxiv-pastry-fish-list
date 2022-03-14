const AnnouncementModule = {
  namespaced: true,
  state: {
    announcements: [],
  },
  getters: {
    getAnnouncement: state => key => {
      return state.announcements[key]
    },
  },
  mutations: {
    updateAnnouncements(state, announcements) {
      state.announcements = announcements.map(it => {
        const read = state.announcements.some(
          storedAnn =>
            storedAnn.id === it.id &&
            storedAnn.updatedAt >= it.updatedAt &&
            !storedAnn.unread
        )
        return {
          id: it.id,
          unread: !read,
          updatedAt: it.updatedAt,
          title: it.title,
          description: it.description,
          content: it.content,
          contentType: it.contentType,
          render: it.render,
        }
      })
    },
    confirmRead(state, announcementId) {
      if (announcementId) {
        const targetIndex = state.announcements.findIndex(it => it.id === announcementId)
        if (targetIndex >= 0) {
          state.announcements.splice(targetIndex, 1, {
            ...state.announcements[targetIndex],
            unread: false,
          })
        }
      }
    },
  },
}

export { AnnouncementModule }
