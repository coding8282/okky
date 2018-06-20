<template>
<div>
  <!-- 캡션 -->
  <h3 class="mb-0">
    <icon :name="boardId|toBoardIcon" scale="1.4" color="#999"/>
    <span class="c-text-shadow"> {{boardId|toBoardName}}</span>
    <button @click="showDesc=!showDesc" class="btn btn-outline-secondary float-right px-1 py-0 m-0 border-0">
      <icon :name="showDesc?'angle-down':'angle-up'" scale="1.5" class="text-muted"/>
    </button>
  </h3>

  <!-- 간단한 설명 -->
  <p v-if="showDesc" class="text-muted text-justify px-1 mt-1">
    <small>{{boardId|toBoardDesc}}</small>
  </p>
  <form @submit.prevent="onSubmit()" class="border p-3 mt-3">
    <!-- 썸네일 -->
    <div class="d-flex mb-4 pb-2">
      <img :src="getProfileImage()" width="80" height="80" alt="thumbnail" class="rounded-circle c-img-shadow mr-1">
      <nuxt-link :to="`/member/${authenticatedId}/profile`" class="c-cute-font c-text-shadow" tag="h2">{{authenticatedNickName}}</nuxt-link>
    </div>

    <!-- 제목 -->
    <div class="form-group mb-2">
      <input v-model="request.title" class="form-control form-control-sm" ref="title" id="title" 
        placeholder="제목"  
        :disabled="pending" 
        minlength="1" maxlength="150" required>
    </div>

    <!-- 바디 -->
    <div class="form-group mb-2">
      <textarea 
        v-model="request.body"
        class="form-control form-control-sm" 
        id="content" rows="13" 
        placeholder="5~3000자" 
        :disabled="pending"
        minlength="5" maxlength="3000"
        required >
      </textarea>
    </div>

    <!-- 태그 -->
    <div class="form-group mb-2">
      <input 
        v-model="tagString" 
        class="form-control form-control-sm" 
        :disabled="pending" 
        required
        placeholder="ex) Spring,일상,잡담">
      <p class="form-text text-muted c-small-font">태그는 ,로 구분해주세요(1~7개)</p>
    </div>

    <!-- 버튼 그룹 -->
    <div class="form-group">
      <button @click="$router.back()" type="button" tag="button" class="btn btn-outline-secondary btn-sm mr-1" :disabled="pending"> 
        <icon name="undo" scale=".8"/> 취소
      </button>
      <button @click="init()" type="button" tag="button" class="btn btn-outline-secondary btn-sm" :disabled="pending"> 
        <icon name="eraser" scale=".9"/> 지우기
      </button>
      <button class="btn btn-success btn-sm float-right" :disabled="pending">
        <icon name="pencil-alt" scale=".8"/> 등록
      </button>
      <icon v-if="pending" name="spinner" class="float-right mr-1 mt-1 text-muted" scale="1.3" pulse/>
    </div>
  </form>
</div>
</template>

<script>
export default {
  middleware: "authenticated",
  data() {
    return {
      request: {
        title: "",
        body: "",
        writerName: "",
        tags: []
      },
      tagString: "",
      showDesc: true,
      pending: false
    };
  },
  computed: {
    boardId() {
      return this.$route.params.id;
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.pending = true;
        this.request.tags = this.tagString.split(",");
        this.request.writerName = this.authenticatedNickName;
        await this.$axios.$post(`/boards/${this.boardId}/articles`, this.request);
        this.goArticleListForce(this.boardId);
        this.$toast.success("게시글 작성을 완료하였습니다.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
        this.focus();
      } finally {
        this.pending = false;
      }
    },
    init() {
      this.clear();
      this.focus();
    },
    clear() {
      this.request = {};
      this.tagString = "";
      this.showDesc = false;
    },
    focus() {
      this.$refs.title.focus();
    },
    loadDefaultTag() {
      let boardName = this.$options.filters.toBoardName(this.boardId);
      this.tagString = boardName.replace("/", ",");
    }
  },
  mounted() {
    this.loadDefaultTag();
  }
};
</script>
