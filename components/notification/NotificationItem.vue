<template>
  <div class="c-article-border px-2 pt-1" :class="{'l-notification-bg':!notification.read}">
    <!-- 알림 -->
    <div class="d-flex">
      <img :src="getProfileImage(notification.writerId)" width="40" height="40" :alt="notification.writerName" class="rounded-circle">

      <!-- 알림 종류 -->
      <nuxt-link @click.native="onGoArticle()" :to="`/articles/${notification.articleId}`" class="ml-1 c-normal-font">
        <span v-if="notification.context==='YOURS'">
          <b>{{notification.replierName}}</b>님이 당신의 게시글에 답글을 남겼습니다
        </span>
        <span v-else-if="notification.context==='ADVISORY'" class="ml-2">
          <b>{{notification.articleWriterName}}</b>님이 본인 게시글에 답글을 남겼습니다
        </span>
        <span v-else-if="notification.context==='EACH_OTHER'" class="ml-2">
          <b>{{notification.articleWriterName}}</b>님의 게시글에 {{notification.replierName}}님이 답글을 남겼습니다
        </span>

        <!-- 내용 -->
        <small class="text-muted text-justify ml-2 d-block">{{notification.replyBody}}</small>
      </nuxt-link>
    </div>

    <!-- 컨트롤 -->
    <div class="d-flex w-100 pt-1 justify-content-between text-muted">
      <small class="ml-1 c-small-font">
        <timeago :since="notification.notifiedOn" :auto-update="60"/>
      </small>
      <div>
        <!--읽음 확인-->
        <a v-if="notification.read" @click="toggleRead()" class="text-secondary mr-3">
          <small>
            <icon name="bullseye" class="text-primary" scale="1.05"/>
          </small>
        </a>
        <a v-else @click="toggleRead()" class="text-secondary mr-3">
          <small>
            <icon name="bullseye" scale="1.05"/>
          </small>
        </a>

        <!--읽음 삭제-->
        <a @click="removeRead()" class="text-danger">
          <small>
            <icon name="trash-alt" scale="1.05"/>
          </small>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showControl: false
    };
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    onGoArticle() {
      if (!this.notification.read) {
        this.toggleRead();
      }
    },
    toggleShowControl() {
      this.showControl = !this.showControl;
    },
    async toggleRead() {
      try {
        this.$axios.$put(`/notifications/${this.notification.id}/read/toggle`);
        this.notification.read = !this.notification.read;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    async removeRead() {
      try {
        this.$axios.$delete(`/notifications/${this.notification.id}`);
        this.$emit("readRemoved", this.notification.id);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    }
  }
};
</script>

<style scoped>
.l-notification-bg {
  background-color: rgb(243, 249, 252);
}
</style>
