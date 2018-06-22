<template>
  <div class="p-3 border-bottom">
    <div class="d-flex mb-2">
      <!-- 썸네일 -->
      <nuxt-link :to="`/member/${reply.replierId}/profile`">
        <img :src="getProfileImage(reply.replierId)" width="50" height="50" alt="thumbnail" class="rounded-circle mr-1">
      </nuxt-link>

      <!-- 작성자 링크 -->
      <div>
        <nuxt-link :to="`/member/${reply.replierId}/profile`" class="c-normal-font mb-0" tag="h4">{{reply.replierName}}</nuxt-link>
        <small class="text-muted c-tiny-font">
          <timeago :since="reply.repliedOn"/>
        </small>
      </div>

      <!-- 버튼 -->
      <div v-if="reply.repliedByMe" class="ml-auto">
        <!--로더-->
        <icon v-if="pendingUpdate||pendingDelete" name="spinner" scale=".7" color="gray" pulse/>

        <!--수정-->
        <a v-if="!editing" @click="onEdit()" :disabled="pendingDelete" class="px-2 py-1 mr-1 c-normal-font">수정</a>

        <!--확인-->
        <a v-else @click="onConfirm()" :disabled="pendingUpdate" class="px-2 py-1 mx-1 c-normal-font">확인</a>

        <!--삭제-->
        <a v-if="!editing" @click="onDelete()" :disabled="pendingDelete"
           class="text-danger px-2 py-1 c-normal-font">삭제</a>

        <!--취소-->
        <a v-else @click="onCancel()" :disabled="pendingUpdate" class="px-2 py-1 c-normal-font">취소</a>
      </div>

      <!-- 관리자 관리용 버튼 -->
      <div v-if="isAdmin" class="ml-1" :class="{'ml-auto':!reply.repliedByMe}">
        <a v-if="!editing" @click="onDeleteForce()" :disabled="pendingDelete" class="px-2 py-1 c-normal-font">강제 삭제</a>
      </div>
    </div>

    <!-- 본문 -->
    <p v-if="!editing" class="c-normal-font text-justify">{{reply.body}}</p>
    <textarea v-model="request.body" v-show="editing" ref="body" id="body" rows="3" class="form-control form-control-sm my-3" required></textarea>

    <div class="d-flex">
      <!-- 코멘트 보기 -->
      <a v-if="reply.commentCount>0" @click="onShowComments()">
        <small class="text-primary">
          코멘트 {{reply.commentCount}}개 보기 <icon :name="showComments?'sort-down':'caret-up'" scale="1.2"/>
        </small>
      </a>
      <!-- 링크 -->
      <a v-else @click="onShowComments()">
        <small class="text-muted">코멘트 작성</small>
      </a>
      <!-- 추천 -->
      <ReplyVote :reply="reply" class="ml-auto"/>
    </div>

    <!-- 코멘트 리스트 -->
    <CommentSection v-if="showComments" :replyId="reply.id" :replierId="reply.replierId"/>
  </div>
</template>

<script>
  import ReplyVote from "./ReplyVote";
  import CommentSection from "@/components/comment/CommentSection";

  export default {
  components: {
    ReplyVote,
    CommentSection
  },
  props: {
    reply: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      request: {
        body: ""
      },
      editing: false,
      pendingUpdate: false,
      pendingDelete: false,
      showComments: false
    };
  },
  methods: {
    onEdit() {
      this.editing = true;
      this.request.body = this.reply.body;
      setTimeout(this.focusBody, 300);
    },
    async onConfirm() {
      try {
        this.pendingUpdate = true;
        await this.$axios.$put(`/replies/${this.reply.id}`, this.request);
        this.reply.body = this.request.body;
        this.$toast.success("답글을 수정하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingUpdate = false;
        this.editing = false;
      }
    },
    async onDelete() {
      try {
        this.pendingDelete = true;
        await this.$axios.$delete(`/replies/${this.reply.id}`);
        this.$emit("replyDeleteCompleted");
        this.$toast.success("답글을 삭제하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingDelete = false;
      }
    },
    async onDeleteForce() {
      try {
        this.pendingDelete = true;
        await this.$axios.$delete(`/replies/${this.reply.id}/force`);
        this.$emit("replyDeleteCompleted");
        this.$toast.success("답글을 강제로 삭제하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingDelete = false;
      }
    },
    async onShowComments() {
      this.showComments = !this.showComments;
    },
    onCancel() {
      this.editing = false;
    },
    focusBody() {
      this.$refs.body.focus();
    }
  }
};
</script>

<style scoped>
.l-small-font {
  font-size: 0.65rem;
  font-weight: lighter;
}
</style>
