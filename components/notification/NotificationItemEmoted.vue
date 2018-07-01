<template>
  <div v-if="notification.event==='EmotedNoti'">
    <!--쁘사-->
    <img :src="getProfileImage(notification.emoterId)" width="40" height="40" :alt="notification.writerName" class="rounded-circle">

    <!--알림-->
    <nuxt-link @click.native="onGoArticle()" :to="`/articles/${notification.targetId}`" class="ml-1 c-normal-font">
      <span class="ml-1">
        <icon :name="iconName" scale=".9" :color="iconColor" class="mr-1"/>
        <b>{{notification.emoterName}}</b>님이
        <span v-if="notification.emotionType==='LIKE'">당신의 게시글을 좋아합니다.</span>
        <span v-if="notification.emotionType==='FUN'">당신의 게시글이 재밌답니다.ㅋㅋ</span>
        <span v-if="notification.emotionType==='THANKS'">당신 게시글에 고마워합니다.</span>
        <span v-if="notification.emotionType==='SAD'">당신 게시글 때문에 슬퍼요 ㅜㅜ</span>
        <span v-if="notification.emotionType==='ANGRY'">화가났네요...</span>
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
    computed: {
      iconName() {
        let map = {
          LIKE: 'heart',
          FUN: 'poo',
          THANKS: 'smile',
          SAD: 'meh',
          ANGRY: 'frown',
        };
        return map[this.notification.emotionType];
      },
      iconColor() {
        let map = {
          LIKE: 'red',
          FUN: 'blue',
          THANKS: 'orange',
          SAD: 'orange',
          ANGRY: 'red',
        };
        return map[this.notification.emotionType];
      },
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
