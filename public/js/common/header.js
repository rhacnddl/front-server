//const origin = 'http://localhost:8080';
//const origin = 'https://ichatu.ga';
const uri = '/api/v1';

const header = document.querySelector('#header');
const bell = header.querySelector('.bell');
const toast = header.querySelector('.toast');
const notificationBox = header.querySelector('.notification-box');
const btnRemoveAll = header.querySelector('.btn-remove-all');
const btnCheckAll = header.querySelector('.btn-check-all');
const btnNtMore = header.querySelector('.btn-nt-more');

const notifications = notificationBox.querySelector('.notifications');

const iconBox = header.querySelector('.icon-box');
const hdButtonBox = header.querySelector('.hd-button-box');
const hdMenu = header.querySelector('.hd-menu');
const hdProfile = header.querySelector('.hd-profile');

const hdBtnLogin = header.querySelector('.hd-btn-login');
const hdBtnSignup = header.querySelector('.hd-btn-signup');

/* hd-profile-content */
const hdProfileContent = header.querySelector('.hd-profile-content');
const hdProfileIcon = hdProfileContent.querySelector('.hd-profile-icon');
const hdProfileLastLogin = hdProfileContent.querySelector('.hd-profile-last-login');
const hdProfileNickname = hdProfileContent.querySelector('.hd-profile-nickname');
const hdProfileToMypage = hdProfileContent.querySelector('.hd-profile-to-mypage');
const hdProfileToLogout = hdProfileContent.querySelector('.hd-profile-to-logout');

const aside = document.querySelector('#aside');

let asideFlag = false;
let notificationBoxFlag = false; //false : 알림 박스 닫힘, true : 알림 박스 열림

/* export part */
export const addNotification = (data) => {

    const type = data.type;
    const destination = type === 'chat'? `/chat/room?id=${data.targetId}` : `/board/read?id=${data.targetId}`;
    const ntProfile = data.senderProfileId? `/upload/${data.senderProfilePath}/${data.senderProfileId}_${data.senderProfileName}` : `/image/common/mini.png`;
    const ntBody = type === 'chat'? `${data.sender}님이 메세지를 보냈습니다.` : `${data.sender}님이 댓글을 남겼습니다.`;

    const html = `<a href="${destination}">
                <div class="notification notification-on">
                    <div class="nt-profile-box"><img src="${ntProfile}" class="nt-profile"></div>
                    <div class="nt-body">${ntBody}</div>
                </div></a>`;

    notifications.insertAdjacentHTML('afterbegin', html);
}
export const onBell = () => {

    bell.classList.remove('bell-off');
    bell.classList.add('bell-on');
}
export const offBell = () => {

    bell.classList.add('bell-off');
    bell.classList.remove('bell-on');
}
export const showToast = (data) => {
    const content = data.type === 'chat'? '님이 메세지를 보냈습니다.': '님이 댓글을 남겼습니다.';
    toast.innerHTML = `<b>${data.sender}</b>${content}`;

    toast.classList.remove('toast-off');
    toast.classList.add('toast-on');
}
export const hideToast = () => {
    toast.classList.add('toast-off');
    toast.classList.remove('toast-on');

    toast.innerHTML = ``;
}

/* --- Logic --- */
/* 페이지 처음 로드 시, 미확인 알림 개수가 0개? bell-off : bell-on */
(() => {

    if(!sessionMemberId) return;

    axios({
        url:`${origin}${uri}/notifications/${sessionMemberId}`,
        method: 'GET',
    })
    .then(response => response.data)
    .then((data) => {
        console.log(`미확인 알림 : `, data);
        if(data == 0) offBell();
        else          onBell();
    });
})();

/* 로그인 / 비로그인 시 헤더에 보여지는 정보가 달라짐 */
(() => {
    if(sessionMemberId){
        iconBox.classList.remove('hide');
        hdButtonBox.classList.add('hide');
    }
    else{
        iconBox.classList.add('hide');
        hdButtonBox.classList.remove('hide');
    }
})();

/* Header의 Profile Icon 변경 */
(() => {
    if(sessionProfileId == 'null') return;

    const headerSrc = `url("/upload${sessionProfilePath}/${sessionProfileId}_${sessionProfileName}")`;
    hdProfile.style.backgroundImage = headerSrc;
})();

/* Header Profile Content (Box) */
/* 마우스 커서 enter/leave에 따라 박스 보여짐/숨겨짐 */
let hdProfileContentFlag = false;
hdProfile.addEventListener('click', (e) => {
    if(!hdProfileContentFlag){
        hdProfileContent.classList.remove('hide');
    }
    else{
        hdProfileContent.classList.add('hide');
    }
    hdProfileContentFlag = !hdProfileContentFlag;
});
hdProfile.addEventListener('mouseover', (e) => hdProfileContent.classList.remove('hide'));
hdProfile.addEventListener('mouseout', (e) => hdProfileContent.classList.add('hide'));
hdProfileContent.addEventListener('mouseover', (e) => hdProfileContent.classList.remove('hide'));
hdProfileContent.addEventListener('mouseout', (e) => hdProfileContent.classList.add('hide'));

(() => {
    if(!sessionProfileId) return;

    const iconSrc = `/upload${sessionProfilePath}/${sessionProfileId}_${sessionProfileName}`;
    hdProfileIcon.src = iconSrc;
})();
(() => {
    if(!sessionNickname) return;
    hdProfileNickname.innerText = sessionNickname;
})();
(() => {
    if(!sessionLoginDate) return;
    hdProfileLastLogin.innerText = `로그인 한 지 : ${displayedAt(sessionLoginDate)}`;
})();

/* text Click 시 */
hdProfileToLogout.addEventListener('click', (e) => {
    console.log('logout');
    axios({
        url: `${origin}/api/v1/logout`,
        method: 'POST',
        headers: {'content-type' : 'application/json'},
        data: {
            id: sessionMemberId,
            nickname: sessionNickname
        }
    }).then((response) => {
        if(response.data === 'success'){
            sessionStorage.clear();
            location = `/login`;
        }
    }).catch(err => console.log(err));
});
hdProfileToMypage.addEventListener('click', (e) => location = `/mypage/info`);

/* ASIDE */
/* MOBILE에서 MENU CLICK -> ASIDE SHOW + 화면 resize 시*/
hdMenu.addEventListener('click', (e) => {
    e.preventDefault();

    if(asideFlag){
        hideAside();
        hideBlackScreen();
    }
    else{
        /* 알림이 SHOW일 때 ASIDE를 누르면 알림이 HIDE */
        if(notificationBoxFlag){
            notificationBox.classList.toggle('hide');
            notificationBoxFlag = false;
        }

        showAside();
        createBlackScreen();
    }
});
window.addEventListener('resize', () => {
    const width = window.innerWidth;

    if(width < 700){
        hideAside();
        hideBlackScreen();
    }
    else{
        showAside();
        hideBlackScreen();
    }
});
function hideAside(){
    aside.style.left = '-60%';
    asideFlag = false;
}
function showAside(){
    aside.style.left = '0';
    asideFlag = true;
}
function createBlackScreen(){

    const body = document.querySelector('body');
    const blackScreen = document.createElement('DIV');

    blackScreen.classList.add('black-screen');
    body.insertAdjacentElement('beforeend', blackScreen);

    blackScreen.onclick = function (e) {

        hideAside();
        this.remove();
    }
}
function hideBlackScreen(){
    const blackScreen = document.querySelector('.black-screen');
    blackScreen.remove();
}
/* MOBILE에서 MENU CLICK -> ASIDE SHOW + 화면 resize 시*/
/* ASIDE */

let defaultSentence = '';
let page = 1;

/* 단건 알림 CLICK -> 단건 알림 확인 처리 */
notifications.addEventListener('click', async (e) => {
    e.preventDefault();

    if(!e.target.classList.contains('nt-body')) return;
    
    const notificationId = e.target.dataset.ntid;
    const parentDiv = e.target.parentNode.parentNode;
    const href = e.target.parentNode.href;

    await axios({
        url: `${origin}/api/v1/notifications/${notificationId}/confirm`,
        method: 'POST'
    })
    .then(response => response.data)
    .then((data) => {
        if(data === 'success'){
            parentDiv.classList.remove('notification-on');
            parentDiv.classList.add('notification-off');

            window.open(href);
        }
    })
    .catch(err => console.log('알림 단건 확인 중 예외 : ', err));

});

/* 종(알림) CLICK -> 알림 목록 조회 + 벨 OFF */
bell.addEventListener('click', async (e) => {
    
    //case : 알림 창이 닫혀있을 때
    if(!notificationBoxFlag){
        page = 1;
        defaultSentence = '받은 알림이 없어요!';
        notifications.innerText = '';

        getNotificationList(notificationBox, notifications, page);

        /* ASIDE가 SHOW 일 때 알림을 누르면 ASIDE가 hide */
        // if(asideFlag){
        //     hideAside();
        //     hideBlackScreen();
        // }

        notificationBox.classList.toggle('hide');
        notificationBoxFlag = true;
    }
    //case : 알림 창이 열려있을 때
    else{
        notificationBox.classList.toggle('hide');
        notificationBoxFlag = false;
    }
});

/* 알림 목록 조회 with 페이징 */
async function getNotificationList(parent, target, p){

    /* 알림 목록 조회 */
    const notificationList = await axios({
        url: `${origin}${uri}/notifications/${sessionMemberId}/member/${p}`,
        method: `GET`,
        headers: {'content-type':'application/json'},
    })
    .then(response => {
        offBell();
        return response.data;
    })
    .catch(err => console.log(err));

    let html = defaultSentence;

    if(notificationList.length > 0){
        html = '';
        notificationList.forEach((data, idx) => {

            const type = data.type;
            const isConfirmed = data.confirm === '1';
            const destination = type === 'CHAT'? `/chat/room?id=${data.targetId}` : `/board/read?id=${data.targetId}`;
            const ntProfile = data.senderProfileId? `/upload/${data.senderProfilePath}/${data.senderProfileId}_${data.senderProfileName}` : `/image/common/mini.png`;
            const ntBody = type === 'CHAT'? `${data.senderNickname}님이 메세지를 보냈습니다.` : `${data.senderNickname}님이 댓글을 남겼습니다.`;

            html += `
                    <div class="notification ${isConfirmed? 'notification-off' : 'notification-on'}">
                        <div class="nt-profile-box"><img src="${ntProfile}" class="nt-profile"></div>
                        <a href="${destination}">
                            <div class="nt-body" data-ntid=${data.id}>${ntBody}</div>
                        </a>
                    </div>`;
        });
    }

    target.insertAdjacentHTML('beforeend', html);
}

/* 알림 더보기 */
btnNtMore.addEventListener('click', (e) => {
    e.preventDefault();

    page++;
    defaultSentence = '';

    getNotificationList(notificationBox, notifications, page);
});

/* 확인한 알림만 전체 삭제 CLICK */
btnRemoveAll.addEventListener('click', (e) => {

    axios({
        url: `${origin}/api/v1/notifications/${sessionMemberId}`,
        method: `DELETE`
    })
    .then(response => response.data)
    .then((data) => {
        if(data > 0){
            const dataList = notifications.querySelectorAll('.notification-off');

            dataList.forEach((nt) => {
                console.log(nt);
                nt.remove();
            });

            if(notifications.innerText == '')
                notifications.innerText = defaultSentence;
        }
    });
});
/* 알림 전체 확인 CLICK */
btnCheckAll.addEventListener('click', (e) => {

    axios({
        url: `${origin}/api/v1/notifications/${sessionMemberId}`,
        method: `PUT`
    })
    .then(response => response.data)
    .then((data) => {
        console.log(`data : `, data);
        if(data < 1) return;

        const dataList = notifications.querySelectorAll('.notification-on');

        dataList.forEach((nt) => {
            nt.classList.remove('notification-on');
            nt.classList.add('notification-off');
        });
    });
});

/* LOGIN CLICK */
hdBtnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    location = `/login`;
});
/* SINGUP CLICK */
hdBtnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    location = `/signup`;
});

/* N초전 N분전 N시간전 N일전 ... */
function displayedAt(createdAt) {
    const milliSeconds = new Date() - new Date(createdAt);
    const seconds = milliSeconds / 1000;

    if (seconds < 60) return `방금 전`;

    const minutes = seconds / 60;

    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;

    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;

    if (days < 7) return `${Math.floor(days)}일 전`;

    const weeks = days / 7;

    if (weeks < 5) return `${Math.floor(weeks)}주 전`;

    const months = days / 30;

    if (months < 12) return `${Math.floor(months)}개월 전`;

    const years = days / 365;

    return `${Math.floor(years)}년 전`;
}