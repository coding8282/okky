import Vue from "vue";
import {mapGetters} from "vuex";
import {createCognitoUser, getCurrentCognitoUser} from "~/utils/cognitoUtil";

Vue.mixin({
    computed: {
        ...mapGetters({
            authenticatedId: "contextModule/authenticatedId",
            authenticatedNickName: "contextModule/authenticatedNickName",
            isAuthenticated: "contextModule/isAuthenticated",
            isAdmin: "contextModule/isAdmin",
            cognitoUser: "contextModule/cognitoUser"
        }),
        replyCountClass() {
            const count = this.article.replyCount;
            return {
                "text-muted": count < 5,
                "text-info": 5 <= count && count < 10,
                "text-danger": count >= 10
            };
        },
        choosedItemClass() {
            return {
                'text-success': this.article.choosed,
                'c-choosed-bg': this.article.choosed,
            }
        },
    },
    methods: {
        goHome() {
            this.$router.push("/");
        },
        goHomeForce() {
            this.$router.replace("/");
        },
        goMyInfo(focus = "name") {
            this.$router.push({
                path: "/member/me/info",
                query: {
                    focus
                }
            });
        },
        goArticle(id) {
          this.$router.push(`/articles/${id}`);
        },
        goArticleList(boardId) {
            this.$router.push(`/boards/${boardId}/articles`);
        },
        goArticleListForce(boardId) {
            this.$router.replace(`/boards/${boardId}/articles`);
        },
        getProfileImage(memberId = this.authenticatedId) {
            return `${process.env.profileServerHost}/${memberId}.jpg`;
        },
        goSignin(email) {
            this.$router.push({
                path: `/member/signin`,
                query: { email }
            });
        },
        goSigninForce(email) {
            this.$router.replace({
                path: `/member/signin`,
                query: { email }
            });
        },
        createCognitoUser(Username) {
            return createCognitoUser(Username);
        },
        getCurrentCognitoUser() {
            return getCurrentCognitoUser();
        },
        checkAuthenticated() {
            if (!this.isAuthenticated) {
                this.$toast.error("로그인이 필요합니다.");
                throw "로그인이 필요합니다.";
            }
        }
    }
});
