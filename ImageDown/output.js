function init() {
  document.getElementById('data').innerHTML = localStorage.data;
  localStorage.data = '';

  if(!localStorage.t) {
    localStorage.t = 1;
  }
  if(!localStorage.h) {
    localStorage.h = 100;
  }
  document.getElementById('t1').checked = (localStorage.t!=2);
  document.getElementById('t2').checked = !(localStorage.t!=2);
  setTimeout(loaded, 100);
}
function chg(obj) {
  var chk = document.getElementById('t1').checked;
  var imgs = document.getElementsByTagName('img');
  for(var i = 0; i < imgs.length; i++) {
    if(chk) {
      imgs[i].style.cssText = 'max-height:'+localStorage.h+'px;';
    }
    else {
      imgs[i].style.cssText = '';
    }
  }

  localStorage.t = (chk?1:2);
}
function loaded() {
  var ok = true;
  var imgs = document.getElementsByTagName('img');
  for(var i = 0; i < imgs.length; i++) {
    if(imgs[i].complete) {
      var c = imgs[i].style.cssText;
      imgs[i].style.cssText = '';
      document.getElementById('s' + imgs[i].id).innerHTML = '['+imgs[i].width+'x'+imgs[i].height+']';
      imgs[i].style.cssText = c;
    }
    else {
      ok = false;
    }
  }
  if(!ok) {
    setTimeout(loaded, 100);
  }
}

window.addEventListener("load", init);
