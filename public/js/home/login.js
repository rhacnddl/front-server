    //등록 토큰 액세스
    /*
    메시징 서비스에 firebase-messaging-sw.js 파일이 필요합니다.
    firebase-messaging-sw.js 파일이 아직 없다면 토큰을 가져오기 전에 이 이름으로 빈 파일을 만들어 도메인의 루트에 저장합니다.
    나중에 클라이언트 설정 프로세스에서 중요한 내용을 파일에 추가할 수 있습니다.
    * */
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    /* if('serviceWorker' in navigator){
        navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then((registration) => {
                console.log("Registration successful, scope is:", registration.scope);
                
                messaging.getToken({vapidKey: 'BAOohY0LekDej6CavI2SxllFB4wjh1iPEOIrJaHCgqgc3G7OQfTXlH6P2njfqn68qwYSXexq_gCcqUfCan_e4Dk' }).then((currentToken) => {

                console.log(currentToken);

                if (currentToken) {
                    // Send the token to your server and update the UI if necessary
                    inputToken.value = currentToken;
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                    // ...
                }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    // ...
                });
            }).catch(function(err) {
                console.log("Service worker registration failed, error:"  , err );
            }); 
    } */
    const inputToken = document.querySelector('input[name="token"]');

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
    
    messaging.requestPermission()
        .then(function() {
            console.log('Have permission');

            return messaging.getToken({vapidKey: 'BAOohY0LekDej6CavI2SxllFB4wjh1iPEOIrJaHCgqgc3G7OQfTXlH6P2njfqn68qwYSXexq_gCcqUfCan_e4Dk' });
        })
        .then((currentToken) => {
            console.log(currentToken);

            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                inputToken.value = currentToken;
            } 
            else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
        })
        .catch(function(err) {
            console.log(err);
            console.log('Error Occured');
        });

    const formLogin = document.querySelector('#form-login');
    const inputNickname = formLogin.querySelector('input[name="nickname"]');
    const inputPassword = formLogin.querySelector('input[name="password"]');
    const btnLogin = formLogin.querySelector('#btn-login');

    const btnSignup = formLogin.querySelector('#btn-signup');

    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        /* request for login */
        axios({
            url: `${origin}/api/v1/login`,
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                nickname: inputNickname.value,
                password: inputPassword.value,
                token: inputToken.value
            }
        })
            .then(result => result.data)
            .then((data) => {
                /* login 성공 */
                if(data !== 'fail'){

                    /* save datas in session storage */
                    storeData(data);
                    location = `/chat/rooms`;
                }
                /* login 실패 */
                else{
                    inputNickname.value = '';
                    inputPassword.value = '';
                    modalCanvas.classList.toggle('hide');
                }
                    
            });
    });

    btnSignup.addEventListener('click', (e) => {
        e.preventDefault();

        location = 'signup';
    });

    function storeData(data){

        let profileId = null;
        let profileName = null;
        let profilePath = null;

        if(data.profileDTO) {
            profileId = data.profileDTO.profileId;
            profileName = data.profileDTO.name;
            profilePath = data.profileDTO.path;
        }

        sessionStorage.setItem('memberId', data.id);
        sessionStorage.setItem('nickname', data.nickname);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('loginDate', data.loginDate);
        sessionStorage.setItem('profileId', profileId);
        sessionStorage.setItem('profileName', profileName);
        sessionStorage.setItem('profilePath', profilePath);
    };