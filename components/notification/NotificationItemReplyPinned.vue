<template>
  <div v-if="notification.event==='ReplyPinnedNoti'">
    <!--쁘사-->
    <img :src="getProfileImage(notification.articleWriterId)" width="40" height="40" :alt="notification.writerName" class="rounded-circle">

    <!--알림-->
    <nuxt-link v-if="notification.event==='ReplyPinnedNoti'" @click.native="onGoArticle()" :to="`/articles/${notification.articleId}`" class="ml-1 c-normal-font">
      <span class="ml-1">
        <b>{{notification.articleWriterName}}</b>님이 당신의 답글을 고정하였습니다.
      </span>
      <span>
        <!-- 메모 -->
        <small class="text-muted text-justify ml-5 d-block">{{notification.pinMemo}}</small>
      </span>
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    methods: {
      onGoArticle() {
        if (!this.notification.read) {
          try {
            this.$axios.$put(`/notifications/${this.notification.id}/read`);
            this.notification.read = true;
          } catch (e) {
            this.$toast.error(e.response ? e.response.data.message : e);
          }
        }
      },
    }
  };
</script>
