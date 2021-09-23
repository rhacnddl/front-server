window.addEventListener('load', () => {

    const url = `${origin}/api/stomp/chat`;

    const param = new URLSearchParams(location.search);
    const chatRoomId = param.get("id");

    const memberId = sessionMemberId;
    const nickname = sessionNickname;
    const profileId = sessionProfileId;
    const profileName = sessionProfileName;
    const profilePath = sessionProfilePath;

    const roomBox = document.querySelector('.room-box');
    const chatTitleVal = roomBox.querySelector('.chat-title-val');
    const chats = roomBox.querySelector('.chats');
    const moreBlock = roomBox.querySelector('.more-block');
    const messageContent = roomBox.querySelector('#chat-content');
    const btnSend = roomBox.querySelector('#btn-chat');
    const roomDrop = roomBox.querySelector('.room-drop');
    const roomBreak = roomBox.querySelector('.room-break');
    const roomMembers = roomBox.querySelector('.room-members');
    const roomMembersCount = roomBox.querySelector('.room-members-count');
    const roomMembersBox = roomBox.querySelector('.room-members-box');

    let page = 1;

    /* MODAL */
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const btnRegister = modal.querySelector('.modal-btn-register');
    const btnDrop = modal.querySelector('.modal-btn-drop');
    const btnClose = modal.querySelector('.modal-btn-close');

    const sockJS = new SockJS(`${url}`);
    const stomp = Stomp.over(sockJS);

    /* LOAD시, 채팅방 정보 불러오기 */
    (async () => {
        const chatRoom = await axios({
            url: `${origin}/api/v1/rooms/${chatRoomId}`,
            method: `GET`
        })
        .then(response => response.data);
        console.log(chatRoom)
        chatTitleVal.innerText = chatRoom.name;
        
        if(chatRoom.memberId == memberId){//채팅방 주인
            roomBreak.classList.remove('hide');
            roomDrop.classList.add('hide');
        }
        else{//채팅방 객원
            roomBreak.classList.add('hide');
            roomDrop.classList.remove('hide');
        }
    })();

    /* 채팅방에 가입한 멤버 목록 가져오기 */
    (async() => {
        const result = await axios({
            url: `${origin}/api/v1/rooms/${chatRoomId}/users`,
            method:'GET'
        })
        .then(response => response.data);
        
        const data = result.members;
        const count = result.count;

        roomMembersCount.innerText = count;

        let html = '';
        data.forEach((m) => {
            const profileSrc = m.profileId != ''? `/upload${m.profilePath}/${m.profileId}_${m.profileName}`: `/image/common/profile.png`;

            html += `
            <div class="room-member-box" data-mid="${m.memberId}">
                    <img src="${profileSrc}" class="room-member-profile" alt="멤버 프로필">
                    <div class="room-member-nickname">
                        ${m.nickname}
                    </div>
                </div>
            `;
        });

        roomMembersBox.insertAdjacentHTML('beforeend', html);
    })();
    /* 채팅방에 가입한 멤버 수 CLICK */
    roomMembersCount.addEventListener('click', () => roomMembersBox.classList.toggle('hide'));
    roomMembers.addEventListener('click', () => roomMembersBox.classList.toggle('hide'));


    let isConnect = true;
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

            /* 내가 채팅을 친다면 화면은 맨 아래로 이동 */
            //if(d.memberId == memberId){
                scrollToDown();
            //}
        });

        stomp.send(`/pub/chat/enter`, {}, JSON.stringify({
            memberId,
            chatRoomId
        }));
    });

    /* 입장 */
    window.addEventListener('focus', (e) => {
        if(!isConnect){
            console.log('enter')
            isConnect = true;
            stomp.send(`/pub/chat/enter`, {}, JSON.stringify({
                memberId,
                chatRoomId
            }));
        }
    });
    /* 퇴장 */
    window.addEventListener('beforeunload', (e) => {
        //
        e.preventDefault();
        //e.returnValue = ''; //나갈것인지 확인 창이 뜸
        if(isConnect){
            console.log('exit');
            isConnect = false;
            stomp.send(`/pub/chat/exit`, {}, JSON.stringify({memberId, chatRoomId}));
        }
        
    });

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

        btnClose.classList.add('hide');
        btnRegister.classList.add('hide');
        btnDrop.classList.remove('hide');

        modalTitle.innerText = 'CHAT ROOM DROP';
        modalBody.innerText = `채팅방을 탈퇴하시겠습니까?`;

        modalCanvas.classList.toggle('hide');
    });

    /* 스크롤 이벤트 -> 채팅 불러오기 */
    chats.addEventListener('scroll', (e) => {

        if(chats.scrollTop !== 0) return;

        loadChats();
    });

    /* 채팅 내역 LOAD Func */
    async function loadChats(){
        
        const data = await axios({
            url: `${origin}/api/v1/chats/${chatRoomId}/member/${sessionMemberId}?page=${page}`,
            method: 'GET'
        })
        .then(response => response.data);
        
        const count = data.count;
        const chatList = data.chats;
        
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

    function scrollToDown() {
        chats.scrollTop = chats.scrollHeight;
    }
    function showMoreBlock() {
        setTimeout( () => {
            moreBlock.style.top = '0';
        }, 0)
        
        moreBlock.addEventListener('transitionend', () => {
            moreBlock.style.top = '-30px';
        });
    }

    /* 채팅방 삭제 (주인만 가능) */
    roomBreak.addEventListener('click', (e) => {

        btnClose.classList.remove('hide');
        btnRegister.classList.add('hide');
        btnDrop.classList.add('hide');

        modalTitle.innerText = 'CHAT ROOM CLOSE';
        modalBody.innerText = `채팅방을 닫으시겠습니까?`;

        modalCanvas.classList.toggle('hide');
    });

    /* MODAL */
    /* 채팅방 페쇄 LOGIC */
    btnClose.addEventListener('click', async (e) => {
        const result = await axios({
            url: `${origin}/api/v1/rooms/${chatRoomId}/member/${memberId}`,
            method: `DELETE`,
        })
        .then(response => response.data)
        .then(data => {

            modalCanvas.classList.toggle('hide');

            if(parseInt(data) > 0)
                location = `/chat/rooms`;
            else
                alert('Error Occured..!');
        });


    });
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