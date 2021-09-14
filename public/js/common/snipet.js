import * as header from "/js/common/header.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCQX_Ckogcx9f3fuPUnptxv2uuTQCHOACM",
    authDomain: "ichatu-d9085.firebaseapp.com",
    projectId: "ichatu-d9085",
    storageBucket: "ichatu-d9085.appspot.com",
    messagingSenderId: "390106992570",
    appId: "1:390106992570:web:11de721021b09c43961783",
    measurementId: "G-RNMNSRP76P"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app(); // if already initialized, use that one
}

const messaging = firebase.messaging();
const myrooms = aside.querySelector('.my-rooms');
/* Foreground에서 Notification 수신시 발생하는 Logic */
messaging.onMessage((payload) => {
    
    const sender = payload.data.sender;
    const type = payload.data.type;
    const senderProfileId = payload.data.senderProfileId;
    const senderProfileName = payload.data.senderProfileName;
    const senderProfilePath = payload.data.senderProfilePath;
    const targetId = payload.data.targetId;

    console.log('Message received. ', payload);
    //console.log(`sender: ${sender}, type: ${type}`);

    const data = {
        sender,
        type,
        senderProfileId,
        senderProfileName,
        senderProfilePath,
        targetId
    };

    /* Header의 종 변화 + 알림 메세지 Toast + 알림 박스에 알림 추가 */
    header.onBell();
    header.showToast(data);
    header.addNotification(data);
    setTimeout(header.hideToast, 2500);

    /* ASIDE 나의 채팅방 목록에 접근 -> DOM UPDATE */
    const myroom = myrooms.querySelector(`div[data-rid="${targetId}"]`);
    if(myroom){
        const myroomChat = myroom.querySelector('.my-room-chat');
        const myroomChatDate = myroom.querySelector('.my-room-chat-date');
        const myroomCount = myroom.querySelector('.my-room-count');
    
        const currentCount = myroomCount.innerText == ''? 0 : parseInt(myroomCount.innerText);
        const nextCount = currentCount > 8? '9+' : `${currentCount + 1}`;

        myroomChat.innerText = '새로운 메세지';
        myroomChatDate.innerText = '방금 전';
        myroomCount.innerText = nextCount;
        
        myroomCount.classList.remove('my-room-count-none');
    }
    
});

/* navigator.serviceWorker.addEventListener('message', event => {
    console.log(event.data.msg, event.data.url);
}); */