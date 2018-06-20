import axios from "axios";

const state = {
    article: {
        blocked: false,
        boardId: "",
        boardName: "",
        body: "",
        choosed: false,
        choosedOn: 0,
        hitCount: 0,
        id: "",
        replyCount: 0,
        scrapCount: 0,
        scrappedByMe: false,
        status: "",
        tags: [],
        title: "",
        updatedOn: 0,
        writerId: "",
        writerMotto: "",
        writerName: "",
        wroteByMe: false,
        wroteOn: 0,
        hasReplies() {
            return this.replyCount > 0;
        }
    },
    replies: []
};

const getters = {
    article({ article }) {
        return article;
    },
    replies({ replies }) {
        return replies;
    }
};

const mutations = {
    setArticle(state, article) {
        Object.assign(state.article, article);
    },
    setReplies(state, replies) {
        state.replies = replies;
    },
    toggleScrap({ article }) {
        article.scrappedByMe = !article.scrappedByMe;
    },
    toggleBlock({ article }) {
        article.blocked = !article.blocked;
    },
    toggleChoice({ article }) {
        article.choosed = !article.choosed;
    },
    setArticleScrapCount({ article }, scrapCount) {
        article.scrapCount = scrapCount;
    },
    setArticleReplyCount({ article }, replyCount) {
        article.replyCount = replyCount;
    },
    increaseReplyCommentCount({ replies }, id) {
        let reply = _.find(replies, { id });
        reply.commentCount++;
    },
    decreaseReplyCommentCount({ replies }, id) {
        let reply = _.find(replies, { id });
        reply.commentCount--;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};