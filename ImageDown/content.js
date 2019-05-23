function sendData(data) {
  chrome.extension.sendRequest({
    act : 'senddata',
    data : data
  });
}
function sendImg(info, src, title, alt) {
  chrome.extension.sendRequest({
    act : 'sendimg',
    info : info,
    src : src,
    title : title,
    alt : alt
  });
}
function sendSwf(info, src) {
  chrome.extension.sendRequest({
    act : 'sendswf',
    info : info,
    src : src
  });
}

function genHTML(s_height) {
  var html = '';
  html += '<div class="url" style="background:#ccc;">[document/iframe]'+document.location.href+'</div>';
  html += '<div class="title" style="background:#ccc;">[title]'+document.title+'</div>';
  //DEBUG
  //html+=document.body.outerHTML.replace(/</g, '&lt;');
  sendData(html);
  var isOut = genDoc(document);
  if(!isOut) {
    html = 'Nothing found for this document/frame!<br><br>';
    sendData(html);
  }
}
function genDoc(elm) {
  var isOut = false;
  if(!elm || !elm.firstChild) return isOut;

  try {
   var objects = elm.getElementsByTagName('object');
   for(i = 0; i < objects.length; i++) {
    var embed = objects[i].getElementsByTagName('embed');
    if(embed.length > 0 && embed[0].src) {
      isOut = true;
      sendSwf('<span style="color:red;">[Flash]</span>', embed[0].src);
    }
    var param = objects[i].getElementsByTagName('param');
    for(j = 0; j < param.length; j++) {
      if(param[j].name && param[j].name.toUpperCase() == 'MOVIE' && param[j].value) {
        isOut = true;
        sendSwf('<span style="color:red;">[Flash]</span>', param[j].value);
      }
    }
   }
  }
  catch(e) {
  }

  for(var c = elm.firstChild; c; c = c.nextSibling) {
    try {
      var nm = c.nodeName.toUpperCase();
      var csty = window.getComputedStyle(c, null);
      var bk = csty.getPropertyValue("background-image");
      if(bk && bk != '' && bk != 'initial') {
        isOut = true;
        src = bk.slice(4, -1);
        if(src != '') {
          sendImg('<span style="color:red;">[BackGround]</span>', bk.slice(4, -1), '', '');
          isOut = true;
        }
      }
    }
    catch(e) {
    }
    if(c.style && c.style.backgroundImage && c.style.backgroundImage != '' && c.style.backgroundImage != 'initial') {
      isOut = true;
      src = c.style.backgroundImage.slice(4, -1);
      if(src != '') {
        sendImg('<span style="color:red;">[BackGround]</span>', src, '', '');
      }
    }
    if(nm == 'IMG') {
      if(c.src != '') {
        isOut = true;
        sendImg('', c.src, c.title, c.alt);
      }
    }
    else if(nm == 'EMBED') {
      isOut = true;
      sendSwf('<span style="color:red;">[Flash]</span>', c.src);
    }
    else if(c.firstChild) {
      if(genDoc(c)) {
        isOut = true;
      }
    }
  }
  return isOut;
}

//get document info
function callGenHTML(s_height) {
  try{
    genHTML(s_height);
  }
  catch(err){
    alert('Error while get images info:' + err);
  }
}
