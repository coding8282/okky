<template>
<div class="modal fade" id="verifyModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header">
        <h5 class="modal-title" id="verifyModalLabel">이메일 인증</h5>
        <button type="button" class="close" data-dismiss="modal">
          <span>&times;</span>
        </button>
      </div>

      <!-- 바디 -->
      <div class="modal-body">
        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <div class="input-group">
              <input v-model="code" ref="code" :disabled="pendingVerify" class="form-control" id="code" placeholder="인증코드 입력" maxlength="10" required autocomplete="off">
              <div class="input-group-prepend">
                <button :disabled="pendingVerify" class="btn btn-outline-success btn-sm">
                  <icon v-if="pendingVerify" name="spinner" scale=".9" pulse/> 
                  <icon v-else name="check" scale=".9"/> 
                  <span> 인증</span>
                </button>
              </div>
            </div>
            <p class="form-text text-muted c-small-font">{{email}}로 전송된 인증코드를 입력해주세요.</p>
          </div>
        </form>
      </div>

      <!-- 푸터 -->
      <div class="modal-footer justify-content-end">
        <button @click="onResend()" :disabled="pendingResend" class="btn btn-outline-secondary btn-sm">
          <icon name="sync" scale=".8" :pulse="pendingResend"/> 
          <span> 인증코드 재전송</span>
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
      code: "",
      pendingVerify: false,
      pendingResend: false
    };
  },
  props: {
    email: {
      type: String
    }
  },
  computed: {
    cognitoUser() {
      return this.$store.getters["contextModule/cognitoUser"];
    }
  },
  methods: {
    onSubmit() {
      this.pendingVerify = true;
      setTimeout(this.onSubmitInternal, 1500);
    },
    onSubmitInternal() {
      this.cognitoUser.confirmRegistration(this.code, true, err => {
        this.pendingVerify = false;
        this.checkConfirmError(err);
        this.$toast.success("인증을 완료하였습니다.");
        this.$emit("verifyCompleted");
        setTimeout(this.hide, 300);
      });
    },
    checkConfirmError(err) {
      if (!err) return;
      if (err.code === "CodeMismatchException") {
        this.$toast.error("인증코드가 일치하지 않습니다.");
      } else {
        this.$toast.error(err.message);
      }
      throw "An error occured while verifying.";
    },
    onResend() {
      this.pendingResend = true;
      setTimeout(this.onResendIntenal, 2000);
    },
    onResendIntenal() {
      this.cognitoUser.resendConfirmationCode(err => {
        this.pendingResend = false;
        this.checkResendError(err);
        this.$toast.success("인증코드를 재전송하였습니다.");
        this.code = "";
        this.focus();
      });
    },
    checkResendError(err) {
      if (!err) return;
      if (err.code === "LimitExceededException") {
        this.$toast.error("요청이 너무 많습니다. 잠시 후에 다시 요청해주세요.");
      } else {
        this.$toast.error(err.message);
      }
      throw "An error occured while resending code.";
    },
    show() {
      let that = this;
      $("#verifyModal")
        .modal({
          backdrop: "static"
        })
        .on("shown.bs.modal", function(e) {
          that.focus();
        });
      this.code = "";
    },
    hide() {
      $("#verifyModal").modal("hide");
      this.code = "";
    },
    focus() {
      this.$refs.code.focus();
    }
  }
};
</script>
