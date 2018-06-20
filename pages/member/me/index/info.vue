<template>
  <div class="p-3">
    <form @submit.prevent="onSubmit()">
      <!-- 이메일 -->
      <div class="form-group">
        <label for="email"><span>이메일</span></label>
        <nuxt-link :to="`/member/${id}/profile`" ref="profile" id="profile" class="btn btn-outline-primary border-0 btn-sm float-right c-small-font" tag="button">내 프로필 보기</nuxt-link>
        <input v-model="email" type="email" class="form-control form-control-sm" id="email" required disabled>
      </div>

      <div class="form-row">
        <!-- 성함 -->
        <div class="col-4">
          <div class="form-group">
            <label for="name">성함 <span class="text-danger">*</span></label>
            <input v-model="request.name" class="form-control form-control-sm" ref="name" id="name" required>
          </div>
        </div>
        <!-- 닉네임 -->
        <div class="col-8">
          <div class="form-group">
            <label for="nickName">닉네임 <span class="text-danger">*</span></label>
            <input v-model="request.nickName" class="form-control form-control-sm" ref="nickName" id="nickName" required>
            <p class="form-text text-muted c-small-font">사이트 내에서는 <strong class="text-dark">성함을 공개하지 않으며</strong>, 닉네임을 대신 사용합니다.</p>
          </div>
        </div>
      </div>

      <!-- 성별 -->
      <div class="form-group">
        <label for="sex">성별 <span class="text-danger">*</span></label><br/>
        <div class="form-check form-check-inline">
          <input v-model="request.sex" class="form-check-input" type="radio" id="male-radio" name="sex" value="FEMALE" required>
          <label class="form-check-label" for="male-radio"><icon name="venus" color="red" scale=".9"/> 여성</label>
        </div>
        <div class="form-check form-check-inline">
          <input v-model="request.sex" class="form-check-input" type="radio" id="female-radio" name="sex" value="MALE" required>
          <label class="form-check-label" for="female-radio"><icon name="mars" color="blue" scale=".95"/> 남성</label>
        </div>
      </div>      

      <!-- 좌우명 -->
      <div class="form-group">
        <label for="motto">좌우명 <span class="text-danger">*</span></label>
        <textarea v-model="request.motto" class="form-control form-control-sm" id="motto" placeholder="ex) 프로그래머로서 한 점 부끄럼 없이 살고 싶다." maxlength="100" rows="4" ref="motto" required></textarea>
        <p class="form-text text-muted c-small-font">자신을 잘 나타내는 문장을 <strong class="text-dark">100자</strong> 이내로 적어주세요. 좌우명은 게시글/답글에 표시됩니다.</p>
      </div>      

      <!-- 자기 소개 -->
      <div class="form-group">
        <label for="desc">자기 소개</label>
        <textarea v-model="request.description" class="form-control form-control-sm" placeholder="자기를 잘 표현할 수 있는 간단한 소개를 작성해주세요." ref="desc" id="desc" rows="3"></textarea>
      </div>

      <!-- 버튼 -->
      <button class="btn btn-primary btn-block btn-sm mt-2" :disabled="pending">
        <span v-if="pending"> <icon name="spinner" pulse /> 수정 중...</span>
        <span v-else>수정</span>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pending: false,
      id: "",
      email: "",
      request: {
        name: "",
        sex: "",
        nickName: "",
        motto: "",
        description: ""
      }
    };
  },
  computed: {
    focusWhere() {
      return this.$route.query.focus;
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.pending = true;
        await this.$axios.$put("/members/me", this.request);
        this.$store.commit("contextModule/setNickName", this.request.nickName);
        this.$toast.success("수정 완료하였습니다. 내 프로필 보기에서 확인해보세요.");
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    async loadMe() {
      try {
        this.pending = true;
        let { id, email, name, sex, nickName, motto, description } = await this.$axios.$get("/members/me");
        this.id = id;
        this.email = email;
        this.request = { name, sex, nickName, motto, description };
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    focus() {
      if (this.focusWhere) {
        this.$refs[this.focusWhere].focus();
      }
    }
  },
  mounted() {
    this.loadMe();
    this.focus();
  }
};
</script>