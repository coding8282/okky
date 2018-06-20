<template>
  <div>
    <ListLoader v-if="pending"/>
    <div v-else>
      <template v-if="notifications.length">
        <!-- 상단 탭 -->
        <div class="text-right mb-1">
          <a @click="onMarkReadAll()" class="text-secondary">
            <small><icon name="bullseye" scale=".7" class="text-primary"/> 모두 읽은 상태로 표시</small>
          </a>
        </div>

        <template>
          <div v-for="notification in notifications" :key="notification.id">
            <NotificationItem @readRemoved="onReadRemoved" :notification="notification"/>
          </div>          
        </template>
      </template>
      <ArticleEmpty v-else/>
    </div>
  </div>
</template>

<script>
import NotificationItem from "@/components/notification/NotificationItem";

export default {
  components: {
    NotificationItem
  },
  data() {
    return {
      notifications: [],
      paging: {},
      pageNo: 1,
      pageSize: 15,
      pending: false
    };
  },
  methods: {
    onSubmit() {
      this.$router.push({
        path: "/notifications",
        query: {
          search: this.keyword
        }
      });
    },
    onFetch(pageNo) {
      this.pageNo = pageNo;
      this.load();
      this.focus();
    },
    onReadRemoved(id) {
      let idx = _.findIndex(this.notifications, { id });
      this.$delete(this.notifications, idx);
    },
    async onMarkReadAll() {
      try {
        await this.$axios.$put(`/members/me/notifications/reply-wrote/read-all`);
        _.forEach(this.notifications, notification => (notification.read = true));
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    async onLoad() {
      try {
        this.pending = true;
        let { content, paging } = await this.$axios.$get(`/members/me/notifications/reply-wrote`);
        this.notifications = content;
        this.paging = paging;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    }
  },
  mounted() {
    this.onLoad();
  }
};
</script>