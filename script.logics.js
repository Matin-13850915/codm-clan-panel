const defaultClanData = {
    users: [
        { id: 1, username: "Vexor", pass: "matin2006", role: "admin", status: "فعال ✅", banned: false, banDuration: "" },
        { id: 2, username: "Leader_Sina", pass: "sina123", role: "leader", status: "فعال ✅", banned: false, banDuration: "" },
        { id: 3, username: "Ali_Member", pass: "ali123", role: "member", status: "فعال ✅", banned: false, banDuration: "" }
    ],
    chatLocked: false,
    announcement: "قوانین کلن رعایت شود! 😊"
};

let clanData = JSON.parse(localStorage.getItem('clanPortalData')) || defaultClanData;

function saveClanData() {
    localStorage.setItem('clanPortalData', JSON.stringify(clanData));
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function loginPortal(type) {
    let u, p;
    if(type === 'admin') {
        u = document.getElementById('adminUser').value.trim();
        p = document.getElementById('adminPass').value.trim();
    } else if(type === 'leader') {
        u = document.getElementById('leaderUser').value.trim();
        p = document.getElementById('leaderPass').value.trim();
    } else {
        u = document.getElementById('memberUser').value.trim();
        p = document.getElementById('memberPass').value.trim();
    }

    if(type === 'admin' && u === 'Vexor' && p === 'matin2006') {
        sessionStorage.setItem('loggedUser', JSON.stringify({username: 'Vexor', role: 'admin'}));
        location.href = 'admin.html';
        return;
    }

    let found = clanData.users.find(x => x.username === u && x.pass === p && x.role === type);
    if(found) {
        if(found.banned) {
            alert("❌ حساب کاربری شما بن شده است!");
            return;
        }
        sessionStorage.setItem('loggedUser', JSON.stringify(found));
        location.href = 'admin.html';
    } else {
        alert("❌ آیدی یا رمز عبور اشتباه است!");
    }
}

window.onload = function() {
    if(window.location.pathname.includes('admin.html')) {
        let logged = JSON.parse(sessionStorage.getItem('loggedUser'));
        if(!logged) {
            alert("لطفاً ابتدا وارد شوید!");
            location.href = 'index.html';
            return;
        }

        let sub = document.getElementById('panelRoleSub');
        if(logged.role === 'admin') {
            sub.textContent = "مدیر کل سیستم (دسترسی کامل ادمین)";
        } else if(logged.role === 'leader') {
            sub.textContent = "لیدر کلن (دسترسی مدیریت تالار و بن)";
        } else {
            sub.textContent = "ممبر کلن (دسترسی تالار گفتگو)";
        }

        renderMembersTable();
    }
}

function renderMembersTable() {
    let tbody = document.getElementById('membersTableBody');
    if(!tbody) return;
    tbody.innerHTML = "";

    let logged = JSON.parse(sessionStorage.getItem('loggedUser'));

    clanData.users.forEach(m => {
        let badge = m.role === 'admin' ? '<span class="badge role-admin">ادمین 👑</span>' : (m.role === 'leader' ? '<span class="badge role-leader">لیدر ⭐</span>' : '<span class="badge role-member">ممبر 👤</span>');
        
        let actions = `
            <button onclick="editUser(${m.id})" class="btn-action btn-edit">ویرایش آیدی/رمز ✏️</button>
        `;
        if(logged.role === 'admin' || logged.role === 'leader') {
            let banText = m.banned ? "رفع بن 🔓" : "بن ⛔";
            let banClass = m.banned ? "btn-unban" : "btn-ban";
            actions += `
                <button onclick="toggleBan(${m.id})" class="btn-action ${banClass}">${banText}</button>
                <button onclick="deleteUser(${m.id})" class="btn-action btn-delete">حذف 🗑️</button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td><b>${m.username}</b><br><small style="color:#888;">رمز: ${m.pass}</small></td>
                <td>${badge}</td>
                <td>${m.banned ? '<span style="color:#dc3545">بن شده ⛔</span>' : '<span style="color:#28a745">فعال ✅</span>'}</td>
                <td>${actions}</td>
            </tr>
        `;
    });
}

function filterMembers() {
    let filter = document.getElementById('searchMember').value.toLowerCase();
    let tr = document.getElementById('membersTableBody').getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            tr[i].style.display = td.textContent.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

function editUser(id) {
    let user = clanData.users.find(x => x.id === id);
    if(!user) return;

    let newU = prompt("آیدی جدید کاربر را وارد کنید:", user.username);
    if(newU && newU.trim() !== "") {
        let newP = prompt("رمز عبور جدید کاربر را وارد کنید:", user.pass);
        if(newP && newP.trim() !== "") {
            user.username = newU.trim();
            user.pass = newP.trim();
            saveClanData();
            renderMembersTable();
            alert("✅ اطلاعات کاربر با موفقیت ویرایش شد.");
        }
    }
}

function deleteUser(id) {
    let logged = JSON.parse(sessionStorage.getItem('loggedUser'));
    if(logged.role !== 'admin') {
        alert("❌ فقط ادمین کلن اجازه حذف کاربر را دارد!");
        return;
    }
    if(confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
        clanData.users = clanData.users.filter(x => x.id !== id);
        saveClanData();
        renderMembersTable();
        alert("🗑️ کاربر حذف شد.");
    }
}

function toggleBan(id) {
    let user = clanData.users.find(x => x.id === id);
    if(!user) return;

    if(!user.banned) {
        let dur = prompt("مدت زمان بن:", "۲۴ ساعت");
        if(dur) {
            user.banned = true;
            user.banDuration = dur;
            saveClanData();
            renderMembersTable();
            alert("🚫 کاربر بن شد.");
        }
    } else {
        user.banned = false;
        user.banDuration = "";
        saveClanData();
        renderMembersTable();
        alert("✅ کاربر رفع بن شد.");
    }
}

function refreshData() {
    alert("✨ اطلاعات با موفقیت به‌روزرسانی شد!");
    location.reload();
}

function toggleChatLock() {
    clanData.chatLocked = !clanData.chatLocked;
    saveClanData();
    let btn = document.getElementById('lockChatBtn');
    btn.textContent = clanData.chatLocked ? "🔓 باز کردن تالار" : "🔒 قفل کردن تالار";
    alert(clanData.chatLocked ? "🔒 تالار گفتگو قفل شد." : "🔓 تالار گفتگو باز شد.");
}

function deleteAnnouncement() {
    if(confirm("اطلاعیه حذف شود؟")) {
        document.getElementById('announcementArea').style.display = 'none';
    }
}

function deleteMessage(msgId) {
    if(confirm("پیام حذف شود؟")) {
        document.getElementById(msgId).remove();
    }
}

function sendMessage() {
    if(clanData.chatLocked) {
        let logged = JSON.parse(sessionStorage.getItem('loggedUser'));
        if(logged.role === 'member') {
            alert("⛔ تالار گفتگو در حال حاضر قفل است!");
            return;
        }
    }

    let input = document.getElementById('chatMessage');
    let text = input.value.trim();
    if(text === "") return;

    let logged = JSON.parse(sessionStorage.getItem('loggedUser'));
    let chatBox = document.getElementById('chatBox');
    let msgId = 'msg-' + Date.now();

    let msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg';
    msgDiv.id = msgId;
    msgDiv.innerHTML = `<span><b>${logged.username} (${logged.role}):</b> ${text}</span> <button onclick="deleteMessage('${msgId}')" class="btn-action btn-delete">حذف 🗑️</button>`;

    chatBox.appendChild(msgDiv);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
                  }
        
