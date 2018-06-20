import Vue from "vue";

const map = new Map();
map.set("notice", { name: "공지사항", icon: "bell", desc: "오키의 중요 이슈 및 공지사항을 정리한 게시판입니다. 모든 중요 이슈는 이메일과 공지사항을 통해 관리되므로 항상 주시해주세요." });
map.set("life", { name: "사는얘기", icon: "comment", desc: "인생 살기 힘드시죠? 직장 동료 간의 문제, 급여 문제, 알고리즘 어려움 등 엔지니어가 해결할 일이 대내외적으로 너무 많은 것 같습니다. 어떤 고민이라도 좋으니 이곳에 남겨주세요. 인생 선후배로서 많은 조언을 얻어갈 수 있습니다." });
map.set("qna", { name: "묻고답하기", icon: "question", desc: "공부하다가 막힌 것이 있나요? 여기에 질문해보세요." });
map.set("study", { name: "스터디", icon: "code", desc: "스터디원을 구하는 게시판입니다. 스터디는 운영자가 관여하지 않으며 지역에서 자발적으로 모이는 활동입니다. 스터디의 분야는 제한이 없지만 가능한 커뮤니티의 성격에 맞는 모임에 참여해주세요 ^^" });
map.set("forum", { name: "포럼", icon: "coffee", desc: "포럼은 아직 형식이 정해지지 않은 게시판입니다. 하지만 토론할 거리가 있다면 무엇이든 자유롭게 올려주세요." });
map.set("bug", { name: "버그/건의사항", icon: "bug", desc: "사이트를 이용 중에 버그를 발견하셨나요? 또는 개선하고 싶은 건의사항이 있나요? 여기에 자유롭게 남겨주세요. 관리자가 확인 후 내부적으로 검토를 거쳐 적극적으로 반영하겠습니다. OKKY는 여러분들의 활동에 따라 발전하므로 많은 참여 부탁드립니다." });

// 게시판 필터
Vue.filter("toBoardName", boardId => {
    if (!boardId) return null;
    return map.get(boardId).name;
});
Vue.filter("toBoardIcon", boardId => {
    if (!boardId) return null;
    return map.get(boardId).icon;
});
Vue.filter("toBoardDesc", boardId => {
    if (!boardId) return null;
    return map.get(boardId).desc;
});

// 문자 필터
Vue.filter("uppercase", value => {
    return value.toUpperCase();
});
Vue.filter("lowercase", value => {
    return value.toLowerCase();
});

// 날짜 필터
Vue.filter("date", value => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
});
Vue.filter("full-time", value => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    return `${year}/${month}/${day} ${hour}:${min}`;
});