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

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);

    const sender = payload.data.sender;
    const type = payload.data.type;
    const senderProfileId = payload.data.senderProfileId;
    const senderProfileName = payload.data.senderProfileName;
    const senderProfilePath = payload.data.senderProfilePath;

    console.log(`sender: ${sender}, type: ${type}`);

    const data = {
        sender,
        type,
        senderProfileId,
        senderProfileName,
        senderProfilePath
    };

    header.onBell();
    header.showToast(data);
    header.addNotification(data);
    setTimeout(header.hideToast, 2500);
});

/* navigator.serviceWorker.addEventListener('message', event => {
    console.log(event.data.msg, event.data.url);
}); */