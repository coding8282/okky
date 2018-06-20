<template>
<div class="modal fade" id="initModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header">
        <h5 class="modal-title" id="initModalLabel">비밀번호 재설정</h5>
        <button type="button" class="close" data-dismiss="modal">
          <span>&times;</span>
        </button>
      </div>

      <!-- 바디 -->
      <div class="modal-body">
        <form @submit.prevent="onSubmit()">
          <!-- 인증코드 -->
          <div class="form-group">
            <div class="input-group">
              <input v-model="code" ref="code" :disabled="pending" class="form-control" id="code" placeholder="인증코드 입력" maxlength="10" required autocomplete="off">
            </div>
            <p class="form-text text-muted c-small-font">{{email}}로 전송된 인증코드를 입력해주세요.</p>
          </div>

          <!-- 비밀번호1 -->
          <div class="form-group">
            <input v-model="password1" :disabled="pending" ref="password1" type="password" class="form-control" placeholder="비밀번호" required>
            <p class="form-text text-muted c-small-font">숫자 또는 특수문자 포함 8~20자</p>
          </div>

          <!-- 비밀번호2 -->
          <div class="form-group">
            <input v-model="password2" :disabled="pending" ref="password2" type="password" class="form-control" placeholder="비밀번호 확인" required>
          </div>

          <!-- 버튼 -->
          <button :disabled="pending" class="btn btn-outline-success btn-block">비밀번호 재설정</button>          
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      password1: "",
      password2: "",
      pending: false
    };
  },
  props: {
    email: {
      type: String
    }
  },
  methods: {
    onSubmit() {
      this.pending = true;
      setTimeout(this.onSubmitInternal, 1500);
    },
    onSubmitInternal() {
      let that = this;
      this.createCognitoUser(this.email).confirmPassword(this.code, this.password1, {
        onSuccess(result) {
          that.pending = false;
          that.focus();
          that.hide();
          that.$emit("passwordInitialized");
        },
        onFailure(err) {
          that.pending = false;
          if (err.code === "CodeMismatchException") {
            that.$toast.error("인증코드가 일치하지 않습니다.");
          } else {
            that.$toast.error(err.message);
          }
          that.focus();
        }
      });
    },
    show() {
      let that = this;
      $("#initModal")
        .modal({
          backdrop: "static"
        })
        .on("shown.bs.modal", e => {
          that.focus();
        });
      this.code = "";
    },
    hide() {
      $("#initModal").modal("hide");
      this.code = "";
    },
    focus() {
      this.$refs.code.focus();
    }
  }
};
</script>
