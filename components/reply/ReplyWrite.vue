<template>
  <div class="p-3">
    <!-- 프로필 -->
    <div class="d-flex mb-2">
      <img v-if="isAuthenticated" :src="getProfileImage()" width="40" height="40" alt="thumbnail" class="rounded-circle mr-1">
      <div>
        <nuxt-link :to="`/member/${authenticatedId}/profile`" class="c-normal-font">{{authenticatedNickName}}</nuxt-link><br/>
      </div>
    </div>

    <!-- 작성부 -->
    <form @submit.prevent="onSubmit()" class="input-group">
      <textarea v-model="request.body" :disabled="disableWriteButton" rows="3" class="form-control form-control-sm" :placeholder="placeholder()" required></textarea>
      <div class="input-group-append">
        <button :disabled="disableWriteButton" class="btn btn-outline-success btn-sm">
          <icon v-if="pending" name="spinner" scale=".75" color="gray" pulse class="mr-1 text-success"/>
          <span>등록</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        replierName: "",
        body: ""
      },
      pending: false
    };
  },
  computed: {
    article() {
      return this.$store.getters["articleModule/article"];
    },
    disableWriteButton() {
      return this.pending || this.article.blocked || this.article.deletedForce || !this.isAuthenticated;
    }
  },
  methods: {
    placeholder() {
      if (this.article.blocked || this.article.deletedForce) return "게시글에 답변할 수 없습니다.";
      if (!this.isAuthenticated) return "먼저 로그인해주세요.";
      if (!this.article.hasReplies()) return `${this.authenticatedNickName}님이 최초로 답글을 달아주세요 ^^`;
      return `${this.authenticatedNickName}님! 정성스러운 답글 부탁드립니다!`;
    },
    async onSubmit() {
      try {
        this.pending = true;
        this.request.replierName = this.authenticatedNickName;
        await this.$axios.$post(`/articles/${this.article.id}/replies`, this.request);
        this.clearRequest();
        this.$emit("replyWroteCompleted");
        this.$toast.success("답글을 작성하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    clearRequest() {
      this.request = {};
    }
  }
};
</script>
