<template>
  <form @submit.prevent="onWrite()" class="input-group mb-3">
    <!-- 바디 쓰는 부분 -->
    <textarea v-model="body" :disabled="!isAuthenticated" rows="2" ref="body" class="form-control form-control-sm" required minlength="2" maxlength="150" :placeholder="placeholder"></textarea>
    
    <!-- 쓰기 버튼 -->
    <div class="input-group-append">
      <button :disabled="!isAuthenticated||pending" class="btn btn-outline-primary btn-sm border-0">
        <icon v-if="pending" name="spinner" pulse class="mr-1"/>
        <icon v-else name="pencil-alt"/>
      </button>
    </div>
  </form>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    replyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      body: "",
      pending: false
    };
  },
  computed: {
    placeholder() {
      return this.isAuthenticated ? `${this.authenticatedNickName}님! 정성스러운 코멘트 부탁해요~!` : "먼저 로그인해주세요.";
    }
  },
  methods: {
    ...mapMutations({
      increaseReplyCommentCount: "articleModule/increaseReplyCommentCount"
    }),
    async onWrite() {
      try {
        this.pending = true;
        let newComment = await this.$axios.$post(`/replies/${this.replyId}/comments`, {
          replyId: this.replyId,
          commenterName: this.authenticatedNickName,
          body: this.body
        });
        this.$emit("newCommentWrote", newComment);
        this.increaseReplyCommentCount(this.replyId);
        this.body = "";
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    focusBody() {
      this.$refs.body.focus();
    }
  }
};
</script>

<style scoped>
textarea {
  border: none;
  border-bottom: 1px solid #ddd;
}
</style>