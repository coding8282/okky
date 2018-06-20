<template>
  <div class="px-4 py-2">
    <!-- 관리자 -->
    <section v-if="member.type==='admin'" class="mb-4 alert alert-primary">
      <icon name="info-circle" scale=".9" /> {{member.nickName}}님은 <b>관리자</b>입니다.
    </section>

    <!-- 프로필 -->
    <section class="d-flex mb-3 pb-3 border-bottom">
      <!-- 썸네일 -->
      <img :src="getProfileImage(member.id)" width="150" height="150" alt="thumbnail" class="rounded-circle mr-1 c-img-shadow">

      <!-- 정보 -->
      <div class="ml-2">
        <icon v-if="pending" name="spinner" scale="5" color="#ccc" pulse class="d-block ml-5 mt-3"/>
        <div v-else>
          <h3>
            <span class="l-nick-name c-cute-font">{{member.nickName}}</span>
            <button v-if="isEditable" @click="goMyInfo('nickName')" class="btn btn-outline-primary border-0 btn-sm c-small-font py-0">수정</button>
          </h3>
          <div class="ml-1">
            <span class="c-small-font d-block"><icon name="arrow-alt-circle-right" color="gray" scale=".75"/> 가입: {{member.joinedOn|date}} (<timeago :since="member.joinedOn"/>)</span>
            <span class="c-small-font d-block"><icon name="newspaper" color="gray" scale=".75"/> 게시글: {{member.articleCount}} 개</span>
            <span class="c-small-font d-block"><icon name="comment" color="black" scale=".75"/> 답글: {{member.replyCount}} 개</span>
            <span class="c-small-font d-block"><icon name="heart" color="red" scale=".75"/> 좋아요: {{member.likeCount}} 개</span>
            <span class="c-small-font d-block"><icon name="thumbs-up" color="purple" scale=".75"/> 추천: {{member.upVoteCount}} 개</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 좌우명 -->
    <section>
      <h6>
        <span><icon name="lightbulb" color="purple"/> {{member.nickName}} 님의 좌우명</span>
        <nuxt-link v-if="isEditable" :to="`/member/me/info?focus=motto`" class="btn btn-outline-primary border-0 btn-sm c-small-font py-0">수정</nuxt-link>
      </h6>
      <p class="text-justify text-muted c-cute-font mb-4">{{member.motto}}</p>
    </section>

    <!-- 자기소개 -->
    <section>
      <h6>
        <span><icon name="smile" scale=".95" color="purple"/> {{member.nickName}} 님의 자기 소개</span>
        <nuxt-link v-if="isEditable" :to="`/member/me/info?focus=desc`" class="btn btn-outline-primary border-0 btn-sm c-small-font py-0">수정</nuxt-link>
      </h6>
      <p class="text-justify text-muted c-cute-font">
        <span v-if="member.description">{{member.description}}</span>
        <span v-else>자기소개가 없습니다 ㅜ_ㅜ</span>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      member: {
        articleCount: 0,
        replyCount: 0,
        likeCount: 0,
        upVoteCount: 0
      },
      pending: true
    };
  },
  computed: {
    memberId() {
      return this.$route.params.id;
    },
    isEditable() {
      return this.authenticatedId === this.memberId;
    }
  },
  methods: {
    async loadMember() {
      try {
        this.member = await this.$axios.$get(`/members/${this.memberId}`);
        this.member.articleCount = await this.$axios.$get(`/members/${this.memberId}/articles/count`);
        this.member.replyCount = await this.$axios.$get(`/members/${this.memberId}/replies/count`);
        this.member.likeCount = await this.$axios.$get(`/members/${this.memberId}/likes/count`);
        let voteCount = await this.$axios.$get(`/members/${this.memberId}/votes/count`);
        this.member.upVoteCount = voteCount.up;
      } catch (e) {
        if (e.response) {
          if (e.response.status === 404) this.$toast.error("해당 회원은 존재하지 않습니다.");
          else this.$toast.error(e.response.data.message);
        } else {
          this.$toast.error(e.response.data.message);
        }
      } finally {
        this.pending = false;
      }
    }
  },
  created() {
    this.loadMember();
  }
};
</script>

<style scoped>
.l-nick-name {
  text-shadow: 2px 2px 2px #ccc;
}
</style>