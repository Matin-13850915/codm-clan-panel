// باز و بسته کردن مودال‌های صفحه اصلی
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// بررسی لاگین ادمین و لیدر
function checkLogin() {
    let pass = document.getElementById('adminPassword').value;
    if (pass === "admin" || pass === "1234") {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanelContent').style.display = 'block';
        alert("✅ ورود موفقیت‌آمیز به پنل لیدر/ادمین!");
    } else {
        alert("❌ رمز عبور اشتباه است!");
    }
}

// رفرش اطلاعات
function refreshData() {
    alert("✨ اطلاعات با موفقیت به‌روزرسانی شد!");
    location.reload();
}

// جستجوی ممبرها
function filterMembers() {
    let input = document.getElementById('searchMember');
    let filter = input.value.toLowerCase();
    let table = document.getElementById('membersTable');
    let tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// ویرایش ممبر
function editMember(id) {
    let row = document.querySelector(`tr[data-id='${id}']`);
    let nameCell = row.getElementsByTagName('td')[0];
    let newName = prompt("نام جدید ممبر:", nameCell.textContent);
    if (newName && newName.trim() !== "") {
        nameCell.textContent = newName.trim();
        alert("✅ ویرایش شد.");
    }
}

// حذف ممبر
function deleteMember(id) {
    if (confirm("آیا از حذف این ممبر مطمئن هستید؟")) {
        document.querySelector(`tr[data-id='${id}']`).remove();
        alert("🗑️ حذف شد.");
    }
}

// بن و رفع بن
function toggleBan(id) {
    let btn = document.getElementById(`banBtn-${id}`);
    let statusSpan = document.getElementById(`status-${id}`);

    if (btn.classList.contains('btn-ban')) {
        let duration = prompt("مدت زمان بن (مثلاً ۲۴ ساعت یا دائمی):", "۲۴ ساعت");
        if (duration) {
            btn.textContent = "رفع بن 🔓";
            btn.className = "btn-action btn-unban";
            statusSpan.textContent = "بن شده ⛔ (" + duration + ")";
            statusSpan.style.color = "#dc3545";
            alert("🚫 کاربر بن شد.");
        }
    } else {
        if (confirm("رفع بن کاربر؟")) {
            btn.textContent = "بن ⛔";
            btn.className = "btn-action btn-ban";
            statusSpan.textContent = "فعال ✅";
            statusSpan.style.color = "#28a745";
            alert("✅ کاربر رفع بن شد.");
        }
    }
}

// حذف اطلاعیه
function deleteAnnouncement() {
    if (confirm("اطلاعیه حذف شود؟")) {
        document.getElementById('announcementArea').style.display = 'none';
    }
}

// حذف پیام چت
function deleteMessage(msgId) {
    if (confirm("پیام حذف شود؟")) {
        document.getElementById(msgId).remove();
    }
}

// ارسال پیام با ایموجی کیبورد
function sendMessage() {
    let input = document.getElementById('chatMessage');
    let text = input.value.trim();
    if (text === "") return;

    let chatBox = document.getElementById('chatBox');
    let msgId = 'msg-' + Date.now();

    let msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg';
    msgDiv.id = msgId;
    msgDiv.innerHTML = `<span><b>مدیر:</b> ${escapeHtml(text)}</span> <button onclick="deleteMessage('${msgId}')" class="btn-action btn-delete">حذف 🗑️</button>`;

    chatBox.appendChild(msgDiv);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
