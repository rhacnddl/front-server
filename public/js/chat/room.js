window.addEventListener('load', () => {

    //const origin = 'http://localhost:8080';
    //const origin = 'https://ichatu.ga';
    const url = `${origin}/api/stomp/chat`;

    const param = new URLSearchParams(location.search);
    const chatRoomId = param.get("id");

    const memberId = sessionMemberId;
    const nickname = sessionNickname;
    const profileId = sessionProfileId;
    const profileName = sessionProfileName;
    const profilePath = sessionProfilePath;

    const chats = document.querySelector('.chats');
    const moreBlock = chats.querySelector('.more-block');
    const messageContent = document.querySelector('#chat-content');
    const btnSend = document.querySelector('#btn-chat');
    const roomDrop = document.querySelector('.room-drop');

    let page = 1;

    /* MODAL */
    const btnRegister = modal.querySelector('.modal-btn-register');
    const btnDrop = modal.querySelector('.modal-btn-drop');

    const sockJS = new SockJS(`${url}`);
    const stomp = Stomp.over(sockJS);

    stomp.connect({}, function (frame) { //just stomp

        console.log('STOMP Connected');

        stomp.subscribe(`/sub/room/${chatRoomId}`, function (content) {
            const payload = JSON.parse(content.body);

            const d = {
                id: payload.id,
                chatRoomName: payload.chatRoomName,
                memberId: payload.memberId,
                nickname: payload.nickname,
                profileId: payload.profileId,
                profileName: payload.profileName,
                profilePath: payload.profilePath,
                content: payload.content,
                regDate: payload.regDate
            }
            
            //const className = d.memberId == memberId ? 'mine' : 'yours';

            const profileSrc = (d.profileId != 'null')? `/upload${d.profilePath}/${d.profileId}_${d.profileName}`
                                             : '/image/common/profile-wb.png';

            const html = `
                <div class="chat" data-sender-id="${d.memberId}">
                    <div class="chat-profile-box">
                        <img src="${profileSrc}" class="chat-profile">
                        <div class="chat-dummy"></div>
                    </div>

                    <div class="chat-content-box">
                        <div class="chat-info-box">
                            <div class="chat-sender">
                                ${d.nickname}
                            </div>
                            <div class="chat-time">
                                ${displayedAt(d.regDate)}
                            </div>
                        </div>

                        <div class="chat-content">
                            ${d.content}
                        </div>
                    </div>
                </div>`;

            chats.insertAdjacentHTML('beforeend', html);
        });

    });

    /* 퇴장 */
    window.onbeforeunload = (e) => {

        e.preventDefault();

    }

    //메세지 전송 버튼 click
    btnSend.addEventListener('click', (e) => {
        e.preventDefault();

        const content = messageContent.value;
        messageContent.value = '';

        stomp.send(`/pub/chat/message`, {}, JSON.stringify({
            content: content,
            memberId: memberId,
            chatRoomId: chatRoomId,
            nickname: nickname,
            profileId: profileId,
            profileName: profileName,
            profilePath: profilePath
        }));
    });

    /* 
    keydown : 키를 누를 때
    keyup : 키를 떼었을 때
    */
    messageContent.addEventListener('keyup', (e) => {
        
        if(e.keyCode !== 13) return;

        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        btnSend.dispatchEvent(event);
    });

    /* 채팅방 탈퇴 CLICK */
    roomDrop.addEventListener('click', (e) => {

        btnRegister.classList.add('hide');
        btnDrop.classList.remove('hide');
        modalCanvas.classList.toggle('hide');
    
    });

    chats.addEventListener('scroll', (e) => {

        if(chats.scrollTop !== 0) return;

        loadChats();
    });

    /* 채팅 내역 LOAD Func */
    async function loadChats(){
        
        const chatList = await axios({
            url: `${origin}/api/v1/chats/${chatRoomId}/member/${sessionMemberId}?page=${page}`,
            method: 'GET'
        })
        .then(response => response.data);

        appendChats(chatList);
        
        if(page == 1)
            scrollToDown();

        page++;
    }

    function appendChats(chatList){
        
        if(chatList.length < 1) return;

        showMoreBlock();

        let html = '';

        chatList.forEach((chat) => {

            //const className = chat.memberId == memberId ? 'mine' : '';
            const profileSrc = (chat.profileId != null)? `/upload${chat.profilePath}/${chat.profileId}_${chat.profileName}`
                                             : '/image/common/profile-wb.png';

            html += `
                <div class="chat" data-sender-id="${chat.memberId}">
                    <div class="chat-profile-box">
                        <img src="${profileSrc}" class="chat-profile">
                        <div class="chat-dummy"></div>
                    </div>

                    <div class="chat-content-box">
                        <div class="chat-info-box">
                            <div class="chat-sender">
                                ${chat.nickname}
                            </div>
                            <div class="chat-time">
                                ${displayedAt(chat.regDate)}
                            </div>
                        </div>

                        <div class="chat-content">
                            ${chat.content}
                        </div>
                    </div>
                </div>`;
        });

        chats.insertAdjacentHTML('afterbegin', html);
    };

    loadChats();

    function scrollToDown() {chats.scrollTop = chats.scrollHeight;}
    function showMoreBlock() {
        setTimeout( () => {
            moreBlock.style.top = '0';
        }, 0)
        
        moreBlock.addEventListener('transitionend', () => {
            moreBlock.style.top = '-30px';
        });
    }

    /* MODAL */
    /* 채팅방 탈퇴 LOGIC */
    btnDrop.addEventListener('click', (e) => {

        axios({
            url: `${origin}/api/v1/joins/${chatRoomId}/member/${sessionMemberId}`,
            method: 'DELETE'
        })
        .then(response => response.data)
        .then(data => {
            if(data === 1){
                location = `/chat/rooms`;
            }
            else{
                console.error('Exception Occured.');
            }
        });
    });
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