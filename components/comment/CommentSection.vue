<template>
  <section>
    <hr>

    <div class="pl-2">
      <!-- 코멘트 추가 -->
      <CommentWrite @newCommentWrote="onNewCommentWrote" :replyId="replyId"/>

      <ListLoader v-if="pendingComments"/>
      <template v-else>
        <!-- 코멘트 목록 -->
        <div v-for="comment in comments" :key="comment.id" class="mb-2">
          <Comment @commentDeleted="onCommentDeleted" :comment="comment" :replierId="replierId"/>
        </div>
        
        <!-- more or less -->
        <span v-if="paging.finalPageNo>1" class="text-center d-block">
          <small v-if="paging.isFinalPage" @click="onLess()" class="text-muted">접기 <icon name="angle-double-up" scale=".7"/></small>
          <template v-else>
            <icon v-if="pendingCommentsMore" name="spinner" class="ml-1 text-muted" scale="1.5" pulse/>
            <small v-else @click="onMore()" class="text-muted">더 보기 <icon name="angle-double-down" scale=".7"/></small>
          </template>
        </span>
      </template>
    </div>    
  </section>
</template>

<script>
import Comment from "./Comment";
import CommentWrite from "./CommentWrite";
import { mapMutations } from "vuex";

export default {
  components: {
    Comment,
    CommentWrite
  },
  props: {
    replyId: {
      type: String,
      required: true
    },
    replierId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      paging: {},
      pageNo: 1,
      pageSize: 5,
      request: {
        body: ""
      },
      pendingComments: false,
      pendingCommentsMore: false
    };
  },
  methods: {
    ...mapMutations({
      decreaseReplyCommentCount: "articleModule/decreaseReplyCommentCount"
    }),
    onCommentDeleted(id) {
      try {
        let idx = _.findIndex(this.comments, { id });
        this.$delete(this.comments, idx);
        this.decreaseReplyCommentCount(this.replyId);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
      }
    },
    async onLoad() {
      try {
        this.pageNo = 1;
        this.pendingComments = true;
        let { content, paging } = await this.$axios.$get(
          `/replies/${this.replyId}/comments?pageNo=${this.pageNo}&pageSize=${this.pageSize}`
        );
        this.comments = content;
        this.paging = paging;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingComments = false;
      }
    },
    async onMore() {
      try {
        this.pendingCommentsMore = true;
        let { content, paging } = await this.$axios.$get(
          `/replies/${this.replyId}/comments?pageNo=${++this.pageNo}&pageSize=${this.pageSize}`
        );
        content.forEach(comment => this.comments.push(comment));
        this.paging = paging;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingCommentsMore = false;
      }
    },
    async onLess() {
      this.comments = this.comments.slice(0, this.pageSize);
      this.paging.isFinalPage = false;
      this.pageNo = 1;
    },
    onNewCommentWrote(newComment) {
      this.comments.unshift(newComment);
    }
  },
  created() {
    this.onLoad();
  }
};
</script>