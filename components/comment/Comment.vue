<template>
  <div>
    <!-- 코멘트 -->
    <section class="px-2 py-1 rounded" :class="{'l-bg-replier':commenterIsReplier}">
      <!-- 내용물 -->
      <div class="d-flex mb-0">
        <nuxt-link :to="`/member/${comment.commenterId}/profile`">
          <img :src="getProfileImage(comment.commenterId)" width="35" height="35" alt="thumbnail" class="rounded-circle">
        </nuxt-link>
        <span class="l-comment-font text-justify pl-3 pr-2">{{comment.body}}</span>
      </div>

      <!-- 작성자 링크 -->
      <div class="d-flex">
        <nuxt-link :to="`/member/${comment.commenterId}/profile`" class="c-small-font text-secondary mb-0 mr-2 pt-1">
          <b v-if="commenterIsReplier">
            <icon name="lightbulb" scale=".75"/> {{comment.commenterName}}
          </b>
          <span v-else>{{comment.commenterName}}</span>
        </nuxt-link> 
        <small class="c-small-font text-muted pt-1"><timeago :since="comment.commentedOn"/></small>
        
        <!-- 툴바 -->
        <div v-if="comment.commenterId===authenticatedId" class="dropdown ml-auto">
          <icon v-if="pendingDelete||pendingUpdate" name="spinner" class="text-muted" scale=".8" pulse/>
          <a v-else @click="onToggleControl()">
            <icon :name="showControl?'ellipsis-h':'ellipsis-v'" class="text-muted" scale="1"/>
          </a>
        </div>
      </div>
    </section>    

    <!-- 컨트롤 바 -->
    <section v-if="showControl" class="c-small-font text-secondary d-flex justify-content-between mt-0">
      <div></div>
      <div>
        <a @click="onDelete()" class="btn btn-sm py-1 text-danger" :class="{'disabled':pendingDelete||pendingUpdate}">삭제</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true
    },
    replierId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editing: false,
      pendingUpdate: false,
      pendingDelete: false,
      showComments: false,
      showControl: false
    };
  },
  computed: {
    commenterIsReplier() {
      return this.replierId === this.comment.commenterId;
    }
  },
  methods: {
    onEdit() {
      this.editing = true;
      this.request.body = this.comment.body;
      setTimeout(this.focusBody, 300);
    },
    onCancel() {
      this.editing = false;
    },
    onToggleControl() {
      this.showControl = !this.showControl;
    },
    async onConfirm() {
      try {
        this.pendingUpdate = true;
        await this.$axios.$put(`/comments/${this.comment.id}`, this.request);
        this.comment.body = this.request.body;
        this.$toast.success("코멘트를 수정하였습니다.");
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
        await this.$axios.$delete(`/comments/${this.comment.id}`);
        this.$emit("commentDeleted", this.comment.id);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingDelete = false;
      }
    },
    focusBody() {
      this.$refs.body.focus();
    }
  }
};
</script>

<style scoped>
.l-comment-font {
  font-size: 0.8rem;
  color: #777;
}
.l-bg-replier {
  background-color: rgba(240, 244, 255, 0.473);
}
</style>