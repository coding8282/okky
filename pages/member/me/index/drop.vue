<template>
  <div class="p-3">
    <form>
      <!-- 제목 -->
      <h5 class="pb-2">주요 탈퇴 사유 선택</h5>

      <!-- 이유 -->
      <div class="form-check">
        <input v-model="request.dropReason" class="form-check-input" type="radio" id="reason3" value="서비스가 더 이상 불필요해서">
        <label class="form-check-label c-normal-font" for="reason3">서비스가 더 이상 불필요해서</label>
      </div>
      <div class="form-check">
        <input v-model="request.dropReason" class="form-check-input" type="radio" id="reason2" value="개인 정보 유출이 걱정되어서">
        <label class="form-check-label c-normal-font" for="reason2">개인 정보 유출이 걱정되어서</label>
      </div>
      <div class="form-check">
        <input v-model="request.dropReason" class="form-check-input" type="radio" id="reason1" value="탈퇴 후 재가입">
        <label class="form-check-label c-normal-font" for="reason1">탈퇴 후 재가입</label>
      </div>
      <div class="form-check">
        <input v-model="request.dropReason" class="form-check-input" type="radio" id="reason4" value="기타">
        <label class="form-check-label c-normal-font" for="reason1">기타</label>
      </div>

      <button :disabled="!request.dropReason" class="btn btn-danger btn-sm btn-block mt-3" data-toggle="modal" data-target="#dropModal">
        탈퇴
      </button>
    </form>

    <!-- Modal -->
    <div class="modal fade" id="dropModal" tabindex="-1" role="dialog" aria-labelledby="dropModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <!-- 타이틀 -->
          <div class="modal-header">
            <h4 class="modal-title text-danger" id="popup"><strong>주의</strong></h4>
          </div>

          <!-- 탈퇴 경고 문구 -->
          <div class="modal-body">
            <p class="c-normal-font">탈퇴 시 모든 정보는 즉시 삭제되며, <strong class="text-danger">복구가 불가능</strong>합니다. 계속할까요?</p>
            <button class="btn btn-outline-secondary btn-sm" data-dismiss="modal">취소</button>
            <button @click="onDrop()" class="btn btn-outline-danger btn-sm float-right">예, 탈퇴합니다</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        dropReason: ""
      }
    };
  },
  methods: {
    async onDrop() {
      try {
        await this.$axios.$delete("/members/me/drop", this.request);
        this.closeDialog();
        this.$store.commit("contextModule/clearContext");
        this.$toast.success("그 동안 서비스를 이용해주셔서 감사합니다. 안녕히 가십시오!");
        setTimeout(this.goHome, 2000);
      } catch({response}) {
        this.$toast.error(response.data.message);
      }
    },
    closeDialog() {
      $("#modal").modal("toggle");
    }
  }
};
</script>