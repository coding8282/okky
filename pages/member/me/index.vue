<template>
  <div>
    <ul class="nav nav-tabs">
      <!-- 기본 정보 -->
      <li class="nav-item">
        <nuxt-link to="/member/me/info" active-class="active" class="nav-link">기본 정보</nuxt-link>
      </li>

      <!-- 비번 -->
      <li class="nav-item">
        <nuxt-link to="/member/me/password" active-class="active" class="nav-link">비밀번호</nuxt-link>
      </li>

      <!-- 나의 글 -->
      <li class="nav-item">
        <a class="nav-link dropdown-toggle" active-class="active" data-toggle="dropdown" role="button">나의글</a>
        <div class="dropdown-menu">
          <nuxt-link to="/member/me/articles" active-class="active" class="dropdown-item">
            <icon name="newspaper" color="gray"/> 나의 게시글
          </nuxt-link>
          <nuxt-link to="/member/me/scraps" active-class="active" class="dropdown-item">
            <icon name="bookmark" color="green"/>&nbsp; 나의 스크랩
          </nuxt-link>
        </div>
      </li>

      <!-- 회원 탈퇴 -->
      <li class="nav-item">
        <nuxt-link to="/member/me/drop" active-class="active" class="nav-link text-danger">회원 탈퇴</nuxt-link>
      </li>
    </ul>

    <nuxt-child/>
  </div>
</template>

<script>
export default {
  middleware: "authenticated"
};
</script>