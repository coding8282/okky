<template>
  <div class="p-3">
    <form @submit.prevent="onSubmit()">
      <!-- 현재 비밀번호 -->
      <div class="form-group">
        <label for="oldPassword">현재 비밀번호</label>
        <input v-model="oldPassword" ref="oldPassword" type="password" class="form-control form-control-sm" id="oldPassword" minlength="6" maxlength="20" required>
      </div>

      <!-- 새 비밀번호 -->
      <div class="form-group">
        <label for="newPassword">새 비밀번호</label>
        <input v-model="newPassword" type="password" class="form-control form-control-sm" id="newPassword" minlength="6" maxlength="20" required>
        <p class="form-text text-muted c-small-font">숫자 또는 특수문자 포함 8~20자</p>
      </div>

      <!-- 새 비밀번호 확인 -->
      <div class="form-group">
        <label for="newPassword2">새 비밀번호 확인</label>
        <input v-model="newPassword2" type="password" class="form-control form-control-sm" id="newPassword2" minlength="6" maxlength="20" required>
      </div>

      <!-- 버튼 -->
      <button class="btn btn-primary btn-block mt-2 btn-sm" :disabled="pending">
        <icon v-if="pending" name="spinner" pulse scale=".8" class="mr-1"/> 수정
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      newPassword2: "",
      pending: false
    };
  },
  methods: {
    async onSubmit() {
      try {
        this.pending = true;
        this.cognitoUser.changePassword(this.oldPassword, this.newPassword, (err, result) => {
          if (err) {
            if (err.code === "NotAuthorizedException") {
              this.$toast.error("기존 비밀번호가 맞지 않습니다.");
            } else if (err.code === "LimitExceededException") {
              this.$toast.error("비밀번호를 너무 자주 변경하였습니다. 잠시 후 다시 시도해주세요.");
            } else {
              this.$toast.error(err.message);
            }
          } else {
            this.clearPassword();
            this.$toast.success("비밀번호를 성공적으로 수정하였습니다.");
          }
        });
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.focus();
        this.pending = false;
      }
    },
    clearPassword() {
      this.oldPassword = "";
      this.newPassword = "";
      this.newPassword2 = "";
    },
    focus() {
      this.$refs.oldPassword.focus();
    }
  },
  mounted() {
    this.focus();
  }
};
</script>
