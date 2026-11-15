const BIN_ID = "6af9c49eac6210605a89891b";
const API_KEY = "$2a$10$DZPpILN4/v8w7.tBcNSfJew7piPdaWRBuhr2mQSamEzkqhkIBrdpO";

async function loadCloudData(callback) {
    try {
        let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        let data = await res.json();
        if (data && data.record) {
            let rec = data.record;
            if(rec.clan_members) localStorage.setItem('clan_members', JSON.stringify(rec.clan_members));
            if(rec.clan_applications) localStorage.setItem('clan_applications', JSON.stringify(rec.clan_applications));
            if(rec.clan_wars) localStorage.setItem('clan_wars', JSON.stringify(rec.clan_wars));
            if(rec.chat_messages) localStorage.setItem('chat_messages', JSON.stringify(rec.chat_messages));
            if(rec.chat_bans) localStorage.setItem('chat_bans', JSON.stringify(rec.chat_bans));
            localStorage.setItem('chat_locked', rec.chat_locked ? 'true' : 'false');
            if(rec.clan_notice) localStorage.setItem('clan_notice', rec.clan_notice);
        }
    } catch(e) {
        console.log("استفاده از حافظه محلی (آفلاین)");
    }
    if(callback) callback();
}

async function saveCloudData() {
    try {
        let payload = {
            clan_members: JSON.parse(localStorage.getItem('clan_members') || '[]'),
            clan_applications: JSON.parse(localStorage.getItem('clan_applications') || '[]'),
            clan_wars: JSON.parse(localStorage.getItem('clan_wars') || '[]'),
            chat_messages: JSON.parse(localStorage.getItem('chat_messages') || '[]'),
            chat_bans: JSON.parse(localStorage.getItem('chat_bans') || '{}'),
            chat_locked: localStorage.getItem('chat_locked') === 'true',
            clan_notice: localStorage.getItem('clan_notice') || ''
        };
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify(payload)
        });
    } catch(e) {
        console.log("خطا در ذخیره‌سازی ابری");
    }
                                              }
