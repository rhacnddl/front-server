/* 
ServiceWorker는 브라우저가 백그라운드 상태거나 화면이 안보이는 등의 상태일 때 작동한다.
브라우저를 켜놨다면 firebase.messaging.onMessage가 호출된다.
 */
// 전달하여 서비스 워커에서 Firebase 앱을 초기화합니다.
// 앱의 Firebase 구성 객체.
// https://firebase.google.com/docs/web/setup#config-object
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCQX_Ckogcx9f3fuPUnptxv2uuTQCHOACM",
    authDomain: "ichatu-d9085.firebaseapp.com",
    projectId: "ichatu-d9085",
    storageBucket: "ichatu-d9085.appspot.com",
    messagingSenderId: "390106992570",
    appId: "1:390106992570:web:11de721021b09c43961783",
    measurementId: "G-RNMNSRP76P"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/* Work in ServiceWorker */
messaging.onBackgroundMessage((payload) => {
    console.log('ServiceWorekr Received Message => ', payload);

    const type = payload.data.type;
    const sender = payload.data.sender;

    console.log(`type : ${type}`);
    console.log(`sender : ${sender}`);

    //const notification = payload.notification;
});


/* addEventListener('fetch', event => {
    console.log('fetchch');
    event.waitUntil(async function() {
      // Exit early if we don't have access to the client.
      // Eg, if it's cross-origin.
      if (!event.clientId) return;
  
      // Get the client.
      const client = await clients.get(event.clientId);
      // Exit early if we don't get the client.
      // Eg, if it closed.
      if (!client) return;
  
      // Send a message to the client.
      client.postMessage({
        msg: "Hey I just got a fetch from you!",
        url: event.request.url
      });
  
    }());
  }); */