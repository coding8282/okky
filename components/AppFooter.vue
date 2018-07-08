<template>
    <div class="bg-light text-center p-3 ">
        <!-- copyright -->
        <p class="text-muted">2017-{{currentYear}} &copy;  Designed by coding8282</p>

        <!-- 링크 -->
        <small>
          <icon name="info-circle" scale=".80" class="mr-1"/>
          <nuxt-link to="/miscs/about">About</nuxt-link>
          |
          <icon name="code-branch" scale=".80" class="mr-1"/>
          <a href="https://github.com/coding8282" target="_blank">github</a> |
          <icon name="rss" scale=".75" class="mr-1"/>
          <a href="http://blog.coding8282.com" target="_blank">블로그</a> |
            <icon name="smile" scale=".75" class="mr-1"/> <a href="https://facebook.com/coding8282" target="_blank">facebook</a>
        </small>
    </div>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>
