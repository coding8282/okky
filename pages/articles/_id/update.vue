<template>
  <div>
    <!-- 캡션 -->
    <h3 class="mb-0">
      <icon :name="boardId|toBoardIcon" scale="1.5"/>
      {{boardId|toBoardName}}
    </h3>

    <form @submit.prevent="onSubmit" class="border p-3 mt-3">
      <!-- 썸네일 -->
      <div class="d-flex mb-4 pb-2">
        <img :src="getProfileImage()" width="80" height="80" alt="thumbnail" class="rounded-circle c-img-shadow mr-1">
        <nuxt-link :to="`/member/${authenticatedId}/profile`" class="c-cute-font c-text-shadow" tag="h2">
          {{authenticatedNickName}}
        </nuxt-link>
      </div>

      <!-- 제목 -->
      <div class="form-group mb-2">
        <input v-model="request.title"
               :disabled="pendingUpdate"
               class="form-control form-control-sm" id="title" ref="title"
               placeholder="제목"
               minlength="1" maxlength="150"
               required>
      </div>

      <!-- 바디 -->
      <div class="form-group mb-2">
        <textarea v-model="request.body" :disabled="pendingUpdate"
                  class="form-control form-control-sm" id="content" ref="content" rows="13"
                  placeholder="5~3000자"
                  minlength="5" maxlength="3000"
                  required>
        </textarea>
      </div>

      <!-- 태그 -->
      <div class="form-group form-row mb-2">
        <label for="tag" class="col-sm-1 d-none d-sm-inline col-form-label col-form-label-sm">태그: </label>
        <div class="col-12 col-sm-11">
          <input v-model="tagString"
                 :disabled="pendingUpdate"
                 class="form-control form-control-sm"
                 placeholder="ex) Spring,일상,잡담"
                 required>
          <p class="form-text text-muted c-small-font">태그는 ,로 구분해주세요(1~7개)</p>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="form-group">
        <button :disabled="pendingUpdate" type="button" tag="button" class="btn btn-outline-secondary btn-sm mr-1"
                data-toggle="modal" data-target="#cancelModal">
          <icon name="undo" scale=".8"/>
          취소
        </button>
        <button :disabled="pendingUpdate" class="btn btn-outline-secondary btn-sm" type="button" tag="button"
                data-toggle="modal" data-target="#initModal">
          <icon name="eraser" scale=".9"/>
          원래대로
        </button>
        <button :disabled="pendingUpdate" class="btn btn-success btn-sm float-right">
          <icon name="pencil-alt" scale=".8"/>
          수정
        </button>
        <icon v-if="pendingLoad||pendingUpdate" name="spinner" class="float-right mr-1 mt-1 text-muted" scale="1.3"
              pulse/>
      </div>
    </form>

    <!-- 팝업 -->
    <PopupArticleUpdateInit/>
    <PopupArticleUpdateCancel/>
  </div>
</template>

<script>
  import PopupArticleUpdateInit from "~/components/popup/PopupArticleUpdateInit";
  import PopupArticleUpdateCancel from "~/components/popup/PopupArticleUpdateCancel";

  export default {
    middleware: "authenticated",
    components: {
      PopupArticleUpdateInit,
      PopupArticleUpdateCancel
    },
    data() {
      return {
        request: {
          title: "",
          body: "",
          writerName: "",
          tags: []
        },
        boardId: "",
        tagString: "",
        pendingLoad: false,
        pendingUpdate: false
      };
    },
    computed: {
      articleId() {
        return this.$route.params.id;
      }
    },
    methods: {
      async loadArticle() {
        try {
          this.pendingLoad = true;
          let article = await this.$axios.$get(`/articles/${this.articleId}`);
          this.request.title = article.title;
          this.request.body = article.body;
          this.request.tags = article.tags;
          this.tagString = article.tags.join();
          this.boardId = article.boardId;
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        } finally {
          this.pendingLoad = false;
        }
      },
      async onSubmit() {
        try {
          this.pendingUpdate = true;
          await this.$axios.$put(`/articles/${this.articleId}`, {
            ...this.request,
            writerName: this.authenticatedNickName,
            tags: this.tagString.split(",")
          });
          this.$toast.success("게시글을 수정하였습니다.");
          this.goArticle(this.articleId);
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        } finally {
          this.pendingUpdate = false;
        }
      },
      onCancel() {
        this.$router.back();
      },
      onInit() {
        this.loadArticle();
        this.focus();
      },
      focus() {
        this.$refs.content.focus();
      },
    },
    created() {
      this.loadArticle();
    }
  };
</script>
