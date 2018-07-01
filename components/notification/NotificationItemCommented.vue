<template>
  <div v-if="notification.event==='ReplyCommentedNoti'">
    <!--쁘사-->
    <img :src="getProfileImage(notification.commenterId)" width="40" height="40" :alt="notification.commenterId" class="rounded-circle">

    <!--알림-->
    <nuxt-link @click.native="onGoArticle()" :to="`/articles/${notification.articleId}`" class="ml-1 c-normal-font">
      <span class="ml-1">
        <icon name='comment-alt' color="purple" scale=".85" class="mr-1"/>
        <b>{{notification.commenterName}}</b>님이 당신의 답글에 코멘트를 남겼습니다.
      </span>
      <span>
        <!-- 메모 -->
        <small class="text-muted text-justify ml-5 d-block">{{notification.commentBody}}</small>
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
