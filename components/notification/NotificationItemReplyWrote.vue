<template>
  <div v-if="notification.event==='ReplyWroteNoti'">
    <!--쁘사-->
    <img :src="getProfileImage(notification.writerId)" width="40" height="40" :alt="notification.writerName" class="rounded-circle">

    <!-- 알림 종류 -->
    <nuxt-link @click.native="onGoArticle()" :to="`/articles/${notification.articleId}`" class="ml-1 c-normal-font">
      <span v-if="notification.context==='YOURS'" class="ml-1">
        <icon name='comment-dots' color="#777" scale=".85" class="mr-1"/>
        <b>{{notification.replierName}}</b>님이 당신의 게시글에 답글을 남겼습니다
      </span>
      <span v-else-if="notification.context==='ADVISORY'" class="ml-1">
        <icon name='comment' color="#777" scale=".85" class="mr-1"/>
        <b>{{notification.articleWriterName}}</b>님이 본인 게시글에 답글을 남겼습니다
      </span>
      <span v-else-if="notification.context==='EACH_OTHER'" class="ml-1">
        <icon name='comments' color="#777" scale=".85" class="mr-1"/>
        <b>{{notification.articleWriterName}}</b>님의 게시글에 {{notification.replierName}}님이 답글을 남겼습니다
      </span>

      <!-- 내용 -->
      <small class="text-muted text-justify ml-5 d-block">{{notification.replyBody}}</small>
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
