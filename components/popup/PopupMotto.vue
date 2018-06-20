<template>
<div class="modal fade" id="mottoModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header border-0">
        <h5 class="modal-title" id="mottoModalLabel">
          <icon name="smile" color="orange" /> 마음에 드는 좌우명을 선택하세요!
        </h5>
        <button type="button" class="close" data-dismiss="modal">
          <span>&times;</span>
        </button>
      </div>

      <!-- 바디 -->
      <div class="modal-body">
        <template>
          <div v-for="(motto,i) in mottos" :key="i" class="d-flex justify-content-between mb-1 py-1 border-top">
            <span class="text-justify mr-1 c-cute-font">
              <icon name="paperclip" color="#ccc" scale=".8" />
              <a @click="onSelect(i)"> {{motto}}</a>
            </span>
          </div>
        </template>
      </div>

      <!-- 푸터 -->
      <div class="modal-footer">
        <button @click="onRefresh()" :disabled="pending" class="btn btn-outline-secondary btn-sm">
          <icon name="sync-alt" scale=".85" :pulse="pending"/> 다른 좌우명 추천
        </button>
      </div>      
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      mottos: [],
      pending: false
    };
  },
  methods: {
    onSelect(i) {
      this.$emit("mottoSelected", this.mottos[i]);
      this.hide();
    },
    onRefresh() {
      this.loadMottos();
    },
    show() {
      let that = this;
      $("#mottoModal").modal("show");
    },
    hide() {
      $("#mottoModal").modal("hide");
    },
    async loadMottos() {
      try {
        this.pending = true;
        this.mottos = await this.$axios.$get("/members/mottos?size=5");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    }
  },
  created() {
    this.loadMottos();
  }
};
</script>
