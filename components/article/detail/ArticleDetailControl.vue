<template>
  <div class="mt-5">
    <ArticleDetailControlEmotion/>

    <section class="mt-2 d-flex">
      <!-- 목록 -->
      <nuxt-link :to="`/boards/${article.boardId}/articles`" tag="button" class="btn btn-outline-secondary btn-sm px-1 py-0 border-0">
        <icon name="bars" scale=".8"/> 목록
      </nuxt-link>

      <!-- 수정 -->
      <nuxt-link v-if="showUpdateButton" to="update" append tag="button" :disabled="article.blocked" class="btn btn-outline-secondary btn-sm px-1 py-0 border-0">
        <icon name="pencil-alt" scale=".7" /> 수정
      </nuxt-link>

      <!-- 삭제 -->
      <button v-if="showDeleteButton" @click="onDelete()" :disabled="article.replyCount>0" class="btn btn-outline-danger btn-sm px-1 py-0 border-0 ml-auto">
        <icon name="trash-alt" scale=".8"/>
        <span> 삭제</span>
      </button>
    </section>

    <section v-if="isAdmin" class="d-flex justify-content-end mt-2">
      <!-- Choice -->
      <button @click="onToggleChoice()" class="btn btn-outline-success btn-sm px-1 py-0 border-0">
        <icon name="check" scale=".9"/>
        <span v-if="article.choosed"> UNCHOICE</span>
        <span v-else> CHOICE</span>
      </button>

      <!-- 블락 -->
      <button @click="onToggleBlock()" class="btn btn-outline-warning btn-sm px-1 py-0 border-0" >
        <icon name="ban" scale=".8"/>
        <span v-if="article.blocked"> 해제</span>
        <span v-else> 블락</span>
      </button>

      <!-- 강제 삭제 -->
      <button @click="onDeleteForce()" class="btn btn-outline-danger btn-sm px-1 py-0 border-0">
        <icon name="trash-alt" scale=".8"/>
        <span> 강제 삭제</span>
      </button>
    </section>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import ArticleDetailControlEmotion from "./ArticleDetailControlEmotion";

  export default {
  components: {
    ArticleDetailControlEmotion
  },
  computed: {
    ...mapGetters({
      article: "articleModule/article"
    }),
    showUpdateButton() {
      return this.article.wroteByMe && !this.article.blocked && !this.article.deletedForce;
    },
    showDeleteButton() {
      return this.article.wroteByMe && !this.article.blocked && !this.article.deletedForce;
    }
  },
  methods: {
    ...mapMutations({
      toggleBlock: "articleModule/toggleBlock",
      toggleChoice: "articleModule/toggleChoice"
    }),
    async onToggleChoice() {
      try {
        await this.$axios.$put(`/articles/${this.article.id}/choices/toggle`);
        this.toggleChoice();
        this.$toast.success(this.article.choosed ? "게시글을 선택했습니다." : "게시글 선택을 취소했습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    async onToggleBlock() {
      try {
        await this.$axios.$put(`/articles/${this.article.id}/blocks/toggle`);
        this.toggleBlock();
        this.$toast.success(this.article.blocked ? "게시글을 블락했습니다." : "게시글 블락을 해제했습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    async onDelete() {
      try {
        await this.$axios.$delete(`/articles/${this.article.id}`);
        this.goArticleList(this.article.boardId);
        this.$toast.success("게시글 삭제를 완료하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    async onDeleteForce() {
      try {
        await this.$axios.$delete(`/articles/${this.article.id}/force`);
        this.goArticleListForce(this.article.boardId);
        this.$toast.success("게시글 삭제를 완료하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    }
  }
};
</script>
