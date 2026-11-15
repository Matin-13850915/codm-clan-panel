let users = JSON.parse(localStorage.getItem('lk1_users')) || [
    { user: "Vexor", pass: "reymysterio619", role: "ادمین" },
    { user: "leader_matin", pass: "1385", role: "لیدر" }
];

let applications = JSON.parse(localStorage.getItem('lk1_apps')) || [];

let members = JSON.parse(localStorage.getItem('lk1_members')) || [
    { name: "ŁK¹・Matin", score: 9800, winRate: 92, role: "لیدر اصلی" },
    { name: "ŁK¹・Shadow", score: 8900, winRate: 88, role: "کاپیتان کلن وار" }
];

let newsList = JSON.parse(localStorage.getItem('lk1_news')) || [
    { title: "شروع کلن‌وارها", desc: "آمادگی کامل تمام اعضا الزامی است.", author: "Vexor" }
];

let chatMessages = JSON.parse(localStorage.getItem('lk1_chats')) || [
    { author: "Vexor (ادمین)", text: "خوش آمدید به کلن اینویکتوس 🔥" }
];

let homeData = JSON.parse(localStorage.getItem('lk1_home')) || {
    title: "🔥 خانه رسمی الیت کلن ŁK¹",
    desc: `<p>به پورتال رسمی و حرفه‌ای قدرتمندترین تیم Call of Duty Mobile خوش آمدید.</p><p><strong>شرایط ورود:</strong></p><ul style="margin-right: 20px; color: #b0b0b0; line-height: 1.9;"><li>حداقل لول اکانت: ۳۰۰</li><li>دیسیپلین بالا و حضور منظم در کلن‌وار</li><li>قبولی در تست ورودی حضوری</li></ul>`
};

let currentActiveUser = null;

function initSite() {
    renderMembers();
    renderNews();
    renderChat();
    renderApplications();
    loadHomeContent();
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    
    const btn = document.querySelector(`.nav-btn[data-target="${tabId}"]`);
    if(btn) btn.classList.add('active');
}

function loadHomeContent() {
    document.getElementById('homeTitleDisplay').innerHTML = homeData.title;
    document.getElementById('homeDescDisplay').innerHTML = homeData.desc;
    document.getElementById('editHomeTitle').value = homeData.title;
    document.getElementById('editHomeDesc').value = homeData.desc;
}

function updateHomeContent() {
    const newTitle = document.getElementById('editHomeTitle').value.trim();
    const newDesc = document.getElementById('editHomeDesc').value.trim();
    if(!newTitle || !newDesc) {
        alert('فیلدها نباید خالی باشند!');
        return;
    }
    homeData = { title: newTitle, desc: newDesc };
    localStorage.setItem('lk1_home', JSON.stringify(homeData));
    loadHomeContent();
    alert('صفحه خانه با موفقیت بروزرسانی و ویرایش شد!');
}

function submitApplication() {
    const name = document.getElementById('appName').value.trim();
    const level = document.getElementById('appLevel').value.trim();
    const contact = document.getElementById('appContact').value.trim();
    const bio = document.getElementById('appBio').value.trim();

    if(!name || !level || !contact) {
        alert('لطفاً فیلدهای ضروری را پر کنید!');
        return;
    }

    applications.push({ name, level, contact, bio });
    localStorage.setItem('lk1_apps', JSON.stringify(applications));

    document.getElementById('appFormBox').style.display = 'none';
    document.getElementById('appSuccessMsg').style.display = 'block';
    renderApplications();
}

function renderApplications() {
    const container = document.getElementById('pendingApplicationsList');
    if(!container) return;
    container.innerHTML = '';
    if(applications.length === 0) {
        container.innerHTML = '<p style="color:#777; font-size:0.9rem;">درخواست جدیدی وجود ندارد.</p>';
        return;
    }
    applications.forEach((app, index) => {
        container.innerHTML += `
            <div class="req-box">
                <div>
                    <strong style="color:var(--gold);">${app.name}</strong> (لول: ${app.level})<br>
                    <span style="font-size:0.85rem; color:#aaa;">ارتباط: ${app.contact} | ${app.bio}</span>
                </div>
                <div>
                    <button class="btn-success" onclick="approveApp(${index})">تایید</button>
                    <button class="btn-danger" onclick="deleteApp(${index})" style="margin-right:5px;">رد</button>
                </div>
            </div>
        `;
    });
}

function approveApp(index) {
    const app = applications[index];
    members.push({ name: app.name, score: 5000, winRate: 75, role: "ممبر جدید" });
    localStorage.setItem('lk1_members', JSON.stringify(members));
    applications.splice(index, 1);
    localStorage.setItem('lk1_apps', JSON.stringify(applications));
    renderApplications();
    renderMembers();
    alert(`پلیر ${app.name} با موفقیت تایید و به رنکینگ اضافه شد!`);
}

function deleteApp(index) {
    applications.splice(index, 1);
    localStorage.setItem('lk1_apps', JSON.stringify(applications));
    renderApplications();
}

function renderMembers() {
    members.sort((a, b) => b.score - a.score);
    const list = document.getElementById('membersList');
    if(!list) return;
    list.innerHTML = '';
    members.forEach((m, idx) => {
        let badge = idx === 0 ? '👑 رتبه ۱' : `رتبه ${idx + 1}`;
        list.innerHTML += `
            <div class="member-card">
                <div class="member-info">
                    <h4>${m.name} <span style="font-size:0.8rem; color:var(--gold);">(${m.role})</span></h4>
                    <div class="member-stats">
                        <span>امتیاز: <strong>${m.score}</strong></span>
                        <span>وین‌ریت: <strong>${m.winRate}%</strong></span>
                    </div>
                </div>
                <div><span class="rank-badge">${badge}</span></div>
            </div>
        `;
    });
}

function savePlayerRank() {
    const name = document.getElementById('rankPlayerName').value.trim();
    const score = parseInt(document.getElementById('rankPlayerScore').value);
    const winRate = parseInt(document.getElementById('rankPlayerWinRate').value);
    const role = document.getElementById('rankPlayerRoleTitle').value.trim();

    if(!name || isNaN(score) || isNaN(winRate) || !role) {
        alert('اطلاعات را کامل وارد کنید!');
        return;
    }

    let existing = members.find(m => m.name === name);
    if(existing) {
        existing.score = score;
        existing.winRate = winRate;
        existing.role = role;
    } else {
        members.push({ name, score, winRate, role });
    }

    localStorage.setItem('lk1_members', JSON.stringify(members));
    renderMembers();
    alert('رنک و امتیاز پلیر ذخیره و مرتب شد!');
}

function loginAndChatUser() {
    const u = document.getElementById('chatUsername').value.trim();
    const p = document.getElementById('chatPassword').value.trim();

    let found = users.find(x => x.user === u && x.pass === p);
    if(found) {
        currentActiveUser = found;
        document.getElementById('chatLoginPrompt').style.display = 'none';
        document.getElementById('chatControlArea').style.display = 'block';
        document.getElementById('chatUserStatus').innerHTML = `وضعیت: آنلاین [ <strong style="color:var(--gold);">${found.user} (${found.role})</strong> ] ✅`;
        renderChat();
    } else {
        alert('نام کاربری یا رمز عبور اشتباه است!');
    }
}

function addEmoji(emoji) {
    document.getElementById('chatText').value += emoji;
}

function sendChatMessage() {
    if(!currentActiveUser) return;
    const text = document.getElementById('chatText').value.trim();
    if(!text) return;

    chatMessages.push({ author: `${currentActiveUser.user} (${currentActiveUser.role})`, text });
    localStorage.setItem('lk1_chats', JSON.stringify(chatMessages));
    document.getElementById('chatText').value = '';
    renderChat();
}

function renderChat() {
    const box = document.getElementById('chatBox');
    if(!box) return;
    box.innerHTML = '';
    chatMessages.forEach(msg => {
        box.innerHTML += `<div class="chat-msg"><span class="author">${msg.author}:</span> ${msg.text}</div>`;
    });
    box.scrollTop = box.scrollHeight;
}

function performLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    let found = users.find(x => x.user === user && x.pass === pass);
    if(found) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('welcomeRoleBadge').innerText = `خوش آمدید ${found.user} | مقام: ${found.role} ✅`;

        if(found.role === 'ادمین' || user === 'Vexor') {
            document.getElementById('superAdminTools').style.display = 'block';
        }
        renderApplications();
    } else {
        alert('نام کاربری یا رمز عبور اشتباه است!');
    }
}

function logoutSystem() {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
}

function createNewUser() {
    const u = document.getElementById('newAccUser').value.trim();
    const p = document.getElementById('newAccPass').value.trim();
    const r = document.getElementById('newAccRole').value;

    if(!u || !p) {
        alert('یوزرنیم و پسوورد را وارد کنید!');
        return;
    }

    users.push({ user: u, pass: p, role: r });
    localStorage.setItem('lk1_users', JSON.stringify(users));
    alert(`اکانت جدید برای ${u} با موفقیت ساخته شد!`);
    document.getElementById('newAccUser').value = '';
    document.getElementById('newAccPass').value = '';
}

function publishNews() {
    const title = document.getElementById('newsTitleInput').value.trim();
    const desc = document.getElementById('newsDescInput').value.trim();
    if(!title || !desc) {
        alert('عنوان و متن را وارد کنید!');
        return;
    }

    newsList.push({ title, desc, author: "مدیریت کلن" });
    localStorage.setItem('lk1_news', JSON.stringify(newsList));
    renderNews();
    alert('اطلاعیه منتشر شد!');
    document.getElementById('newsTitleInput').value = '';
    document.getElementById('newsDescInput').value = '';
}

function renderNews() {
    const list = document.getElementById('newsList');
    if(!list) return;
    list.innerHTML = '';
    newsList.forEach(n => {
        list.innerHTML += `
            <div style="background:#151515; border-right:4px solid var(--gold); padding:15px; margin-bottom:12px; border-radius:8px;">
                <h4 style="color:var(--gold); margin-bottom:5px;">${n.title}</h4>
                <p style="margin-bottom:8px; font-size:0.9rem;">${n.desc}</p>
                <span style="font-size:0.75rem; color:#777;">توسط: ${n.author}</span>
            </div>
        `;
    });
}

// اجرای اولیه هنگام لود کامل صفحه
window.addEventListener('DOMContentLoaded', initSite);
    
