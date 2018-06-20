import cookie from "vue-cookie";
import { getCurrentCognitoUser } from "~/utils/cognitoUtil";

const state = {
    context: {
        id: "",
        email: "",
        nickName: "",
        type: ""
    },
    cognitoUser: null,
    timerId: null,
};

const getters = {
    authenticatedId({ context }) {
        return context.id;
    },
    email({ context }) {
        return context.email;
    },
    authenticatedNickName({ context }) {
        return context.nickName;
    },
    isAdmin({ context }) {
        return context.type === "admin";
    },
    isAuthenticated({ context }) {
        return context.id && context.id.length > 0;
    },
    cognitoUser({ cognitoUser }) {
        return cognitoUser;
    }
};

const mutations = {
    setContext(state, context) {
        state.context = context;
        cookie.set("context", JSON.stringify(context));
    },
    loadContext(state) {
        state.context = JSON.parse(cookie.get("context"));
    },
    setCognitoUser(state, cognitoUser) {
        state.cognitoUser = cognitoUser;
    },
    setNickName({ context }, nickName) {
        context.nickName = nickName;
    },
    setTokenTimer(state, timerId) {
        state.timerId = timerId;
    },
    clearContext(state) {
        state.context = {};
        cookie.delete("context");
    },
    clearCognitoUser(state) {
        state.cognitoUser = null;
    }
};

const actions = {
    checkToken({ commit, dispatch }) {
        let context = cookie.get('context');
        if (context) {
            commit("setCognitoUser", getCurrentCognitoUser());
            commit("loadContext");
            dispatch("refreshToken");
            let timerId = setInterval(() => dispatch("refreshToken"), 600 * 1000);
            commit("setTokenTimer", timerId);
        }
    },
    processSignout({ state, commit }) {
        state.cognitoUser.signOut();
        commit("clearContext");
        commit("clearCognitoUser");
    },
    refreshToken({ state, commit }) {
        state.cognitoUser.getSession((err, session) => {
            if (err) {
                alert(err);
                return;
            }
            if (session.isValid()) {
                this.$axios.setToken(session.idToken.jwtToken);
            }
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};