const state = {
    nickName: "",
    email: "",
    nickNameConfirmed: false,
    emailConfirmed: false
};

const getters = {
    nickName({ nickName }) {
        return nickName;
    },
    email({ email }) {
        return email;
    },
    nickNameConfirmed({ nickNameConfirmed }) {
        return nickNameConfirmed;
    },
    emailConfirmed({ emailConfirmed }) {
        return emailConfirmed;
    }
};

const mutations = {
    setNickName(state, nickName) {
        state.nickName = nickName;
    },
    setEmail(state, email) {
        state.email = email;
    },
    setNickNameConfirmed(state, nickNameConfirmed) {
        state.nickNameConfirmed = nickNameConfirmed;
    },
    setEmailConfirmed(state, emailConfirmed) {
        state.emailConfirmed = emailConfirmed;
    },
    clear(state) {
        state.nickNameConfirmed = false;
        state.emailConfirmed = false;
        state.nickName = "";
        state.email = "";
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};