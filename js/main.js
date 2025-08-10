function initUploads(namespace){
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const nameInput = document.getElementById('uploaderName');
  const listDiv = document.getElementById('uploadsList');
  const storageKey = 'uploads_' + namespace;

  function render(){
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
    listDiv.innerHTML = '';
    if(data.length === 0){
      listDiv.innerHTML = '<p class="note">Belum ada tugas yang diupload.</p>';
      return;
    }
    data.forEach((it, idx)=>{
      const wrapper = document.createElement('div');
      wrapper.className = 'upload-item';
      const left = document.createElement('div');
      left.innerHTML = `<strong>${it.name}</strong><div style="font-size:.9rem;color:#666">${it.uploader||'Anonim'} • ${new Date(it.time).toLocaleString()}</div>`;
      const right = document.createElement('div');
      const a = document.createElement('a');
      a.href = it.dataUrl;
      a.download = it.name;
      a.textContent = 'Download';
      a.style.marginRight = '10px';
      const del = document.createElement('button');
      del.textContent = 'Hapus';
      del.onclick = ()=> {
        const arr = JSON.parse(localStorage.getItem(storageKey)||'[]');
        arr.splice(idx,1);
        localStorage.setItem(storageKey, JSON.stringify(arr));
        render();
      };
      right.appendChild(a); right.appendChild(del);
      wrapper.appendChild(left); wrapper.appendChild(right);
      listDiv.appendChild(wrapper);
    });
  }

  if(!form || !listDiv) return;
  form.onsubmit = (e)=>{
    e.preventDefault();
    const f = fileInput.files[0];
    if(!f){ alert('Pilih file dulu.'); return; }
    const reader = new FileReader();
    reader.onload = function(ev){
      const dataUrl = ev.target.result;
      const arr = JSON.parse(localStorage.getItem(storageKey) || '[]');
      arr.push({
        name: f.name,
        uploader: nameInput.value || '',
        time: Date.now(),
        dataUrl
      });
      localStorage.setItem(storageKey, JSON.stringify(arr));
      fileInput.value = '';
      nameInput.value = '';
      render();
    };
    reader.readAsDataURL(f);
  };

  render();
}
