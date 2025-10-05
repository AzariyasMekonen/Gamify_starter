(async ()=>{
  const socket = io();
  let currentUser = JSON.parse(localStorage.getItem('adwa_user')||'null');
  const el = id => document.getElementById(id);

  function setUserArea(){
    const ua = el('user-area');
    if(currentUser){
      ua.innerHTML = `<div>Hi <strong>${currentUser.username}</strong> <button id='btn-logout'>Logout</button></div>`;
      el('btn-logout').onclick = ()=>{ localStorage.removeItem('adwa_user'); currentUser=null; setUserArea(); }
    } else {
      ua.innerHTML = '';
    }
  }

  setUserArea();

  socket.on('connect', ()=>{
    console.log('socket connected', socket.id);
    if(currentUser) socket.emit('register', currentUser.id);
    socket.emit('joinLeaderboard');
  });

  socket.on('notification', (payload)=>{
    addNotification(payload);
    console.log('notif', payload);
    fetchUser();
  });

  socket.on('leaderboard:update', (payload)=>{
    console.log('leader update', payload);
    fetchLeaderboard();
  });

  el('btn-register').onclick = async ()=>{
    const username = el('inp-username').value.trim();
    const email = el('inp-email').value.trim();
    const password = el('inp-password').value;
    const r = await fetch('/api/auth/register', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ username, email, password }) });
    const j = await r.json();
    if(j.success){ el('auth-msg').textContent='Registered — you can login now'; el('auth-msg').className='muted'; }
    else el('auth-msg').textContent = JSON.stringify(j);
  };

  el('btn-login').onclick = async ()=>{
    const username = el('inp-username').value.trim();
    const password = el('inp-password').value;
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ username, password }) });
    const j = await r.json();
    if(j.success){ currentUser = { id: j.user.id, username: j.user.username, xp: j.user.xp }; localStorage.setItem('adwa_user', JSON.stringify(currentUser)); setUserArea(); socket.emit('register', currentUser.id); fetchUser(); }
    else el('auth-msg').textContent = JSON.stringify(j);
  };

  async function fetchLeaderboard(){
    const r = await fetch('/api/leaderboard'); const top = await r.json();
    const ol = el('leaderboard'); ol.innerHTML='';
    top.forEach(u=>{ const li = document.createElement('li'); li.textContent = `${u.username} — ${u.xp} XP`; ol.appendChild(li); });
  }
  el('btn-refresh-leader').onclick = fetchLeaderboard;
  fetchLeaderboard();

  async function fetchBadges(){
    const r = await fetch('/api/badges'); const b = await r.json();
    const wrap = el('badges'); wrap.innerHTML='';
    b.forEach(x=>{ const d = document.createElement('div'); d.textContent = `${x.name} — rewards ${x.xpReward} XP`; wrap.appendChild(d); });
  }
  fetchBadges();

  async function fetchLabs(){
    const r = await fetch('/api/labs'); const labs = await r.json();
    const wrap = el('labs'); wrap.innerHTML='';
    labs.forEach(l=>{
      const c = document.createElement('div'); c.style.borderTop='1px solid rgba(255,255,255,0.04)'; c.style.padding='8px 0';
      c.innerHTML = `<strong>${l.title}</strong><div class='muted'>${l.description||''}</div><div style='margin-top:8px'><button data-id='${l._id}' class='btn-start'>Start</button></div>`;
      wrap.appendChild(c);
    });
    document.querySelectorAll('.btn-start').forEach(b=>b.onclick = startLab);
  }
  async function startLab(e){
    if(!currentUser) return alert('login first');
    const id = e.target.dataset.id;
    const r = await fetch(`/api/labs/${id}/start`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ userId: currentUser.id })});
    const session = await r.json();
    localStorage.setItem('adwa_session', JSON.stringify(session));
    await fetchSessions();
  }
  fetchLabs();

  async function fetchSessions(){
    const s = JSON.parse(localStorage.getItem('adwa_session')||'null');
    if(!s) return; 
    const lab = await (await fetch(`/api/labs/${s.lab}`)).json();
    const session = { ...s, lab };
    localStorage.setItem('adwa_session', JSON.stringify(session));
    renderSession(session);
  }

  function renderSession(session){
    const wrap = el('session'); wrap.innerHTML='';
    if(!session || !session.lab){ wrap.textContent = 'No active session'; return; }
    const lab = session.lab;
    const h = document.createElement('div'); h.innerHTML = `<strong>${lab.title}</strong><div class='muted'>${lab.description||''}</div>`;
    wrap.appendChild(h);
    lab.tasks.forEach(t=>{
      const row = document.createElement('div'); row.style.marginTop='8px';
      const done = session.tasksCompleted && session.tasksCompleted.map(String).includes(String(t._id));
      row.innerHTML = `<div><strong>${t.title}</strong> <span class='muted'>(${t.xp} XP)</span></div>`+
        `<div class='muted'>${t.description||''}</div>`+
        (done? '<div style="color:#10b981">Solved</div>' : `<div style='margin-top:6px'><input placeholder='answer' id='ans-${t._id}' /> <button data-id='${t._id}' class='btn-submit'>Submit</button></div>`);
      wrap.appendChild(row);
    });
    document.querySelectorAll('.btn-submit').forEach(b=>b.onclick = submitAnswer);
  }

  async function submitAnswer(e){
    if(!currentUser) return alert('login first');
    const taskId = e.target.dataset.id;
    const val = document.getElementById('ans-'+taskId).value;
    const r = await fetch('/api/labs/submit', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ userId: currentUser.id, taskId, answer: val }) });
    const j = await r.json();
    if(j.success){ alert('correct!'); localStorage.removeItem('adwa_session'); fetchUser(); fetchLeaderboard(); fetchNotifications(); fetchLabs(); }
    else alert('wrong or error: '+JSON.stringify(j));
  }

  function addNotification(n){
    const wrap = el('notifications');
    const d = document.createElement('div'); d.className='notif'; d.textContent = n.message || 'update';
    wrap.prepend(d);
  }
  async function fetchNotifications(){
    if(!currentUser) return;
    const r = await fetch(`/api/notifications?userId=${currentUser.id}`);
    const notifs = await r.json();
    el('notifications').innerHTML = '';
    notifs.forEach(n=>addNotification(n));
  }

  async function fetchUser(){
    if(!currentUser) return;
    const r = await fetch(`/api/users/${currentUser.id}`); const u = await r.json();
    el('user-info').innerHTML = `<div><strong>${u.username}</strong></div><div class='muted'>XP: ${u.xp} • Streak: ${u.currentStreak||0} • League: ${u.xp>=2000? 'Diamond': u.xp>=1000? 'Platinum': u.xp>=600? 'Gold': u.xp>=300? 'Silver':'Bronze'}</div>`;
    socket.emit('register', currentUser.id);
    fetchNotifications();
  }

  fetchSessions();
  fetchUser();
})();
