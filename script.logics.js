// ۱. تابع رفرش اطلاعات صفحه
function refreshData() {
    alert("✨ اطلاعات پنل و تالار گفتگو با موفقیت به‌روزرسانی شد!");
    location.reload();
}

// ۲. تابع جستجوی زنده اعضا در جدول
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

// ۳. ویرایش ممبر
function editMember(id) {
    let row = document.querySelector(`tr[data-id='${id}']`);
    let nameCell = row.getElementsByTagName('td')[0];
    let newName = prompt("نام جدید ممبر را وارد کنید:", nameCell.textContent);
    if (newName && newName.trim() !== "") {
        nameCell.textContent = newName.trim();
        alert("✅ نام ممبر با موفقیت ویرایش شد.");
    }
}

// ۴. حذف ممبر از جدول
function deleteMember(id) {
    if (confirm("⚠️ آیا از حذف این ممبر اطمینان دارید؟")) {
        document.querySelector(`tr[data-id='${id}']`).remove();
        alert("🗑️ ممبر حذف شد.");
    }
}

// ۵. سیستم بن کردن با مدت زمان دلخواه و رفع بن
function toggleBan(id) {
    let btn = document.getElementById(`banBtn-${id}`);
    let statusSpan = document.getElementById(`status-${id}`);

    if (btn.classList.contains('btn-ban')) {
        let duration = prompt("مدت زمان بن کاربر را وارد کنید (مثلاً: ۲۴ ساعت، ۷ روز یا دائمی):", "۲۴ ساعت");
        if (duration) {
            btn.textContent = "رفع بن 🔓";
            btn.className = "btn-action btn-unban";
            statusSpan.textContent = "بن شده ⛔ (" + duration + ")";
            statusSpan.style.color = "#dc3545";
            alert("🚫 کاربر به مدت (" + duration + ") از تالار گفتگو بن شد.");
        }
    } else {
        if (confirm("🔓 آیا می‌خواهید کاربر را رفع بن کنید؟")) {
            btn.textContent = "بن ⛔";
            btn.className = "btn-action btn-ban";
            statusSpan.textContent = "فعال ✅";
            statusSpan.style.color = "#28a745";
            alert("✅ کاربر رفع بن شد.");
        }
    }
}

// ۶. حذف اطلاعیه توسط ادمین/لیدر
function deleteAnnouncement() {
    if (confirm("❌ اطلاعیه حذف شود؟")) {
        document.getElementById('announcementArea').style.display = 'none';
        alert("اطلاعیه برداشته شد.");
    }
}

// ۷. حذف پیام در تالار گفتگو توسط ادمین/لیدر
function deleteMessage(msgId) {
    if (confirm("🗑️ پیام توسط ادمین حذف شود؟")) {
        document.getElementById(msgId).remove();
        alert("پیام مورد نظر پاک شد.");
    }
}

// ۸. ارسال پیام با پشتیبانی کامل از ایموجی‌های کیبورد
function sendMessage() {
    let input = document.getElementById('chatMessage');
    let text = input.value.trim();
    if (text === "") return;

    let chatBox = document.getElementById('chatBox');
    let msgId = 'msg-' + Date.now();

    let msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg';
    msgDiv.id = msgId;
    msgDiv.innerHTML = `<span><b>مدیر/عضو:</b> ${escapeHtml(text)}</span> <button onclick="deleteMessage('${msgId}')" class="btn-action btn-delete">حذف پیام 🗑️</button>`;

    chatBox.appendChild(msgDiv);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// تابع امنیتی برای جلوگیری از تگ‌های اضافی
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
