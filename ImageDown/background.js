var data = '';
var imgArr = new Array();
var s_height = 100;
var s_type = 1;
var s_imgcnt = 0;
function output(tab) {
  localStorage.title = tab.title;
  data = '<style>.sdiv{overflow-y:auto;overflow-x:auto;max-height:'+(localStorage.h/1+3)+'px;} .bdiv{border:solid 1px red;}</style>' + data;
  data += '<iframe src="http://uuware.com/about_imgdown.htm" height="160" width="100%" border="0" frameborder="no" framespacing="0"></iframe><br>';
  localStorage.data = data;
  data = '';
  chrome.tabs.getSelected(null, function(tab2) {
    if(!tab2.url.search(/^chrome/)) {
      alert('Do nothing for current page.');
      return;
    }
    chrome.tabs.create( {
      index : tab2.index + 1,
      url : chrome.extension.getURL('output.html')
    });
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  data = '';
  s_imgcnt = 0;
  imgArr = new Array();
  chrome.tabs.executeScript(tab.id, {
    file : 'content.js',
    allFrames : true
  }, function() {
    if(!localStorage.h) {
      localStorage.h = 100;
    }
    if(!localStorage.t) {
      localStorage.t = 1;
    }
    if(!(localStorage.h > 100)) {
      localStorage.h = 100;
    }
    if(!(localStorage.t > 0)) {
      localStorage.t = 1;
    }
    s_height = localStorage.h;
    s_type = localStorage.t;

    var code = 'callGenHTML("'+s_height+'");';
    chrome.tabs.executeScript(tab.id, {
    code : code,
    allFrames : true
    }, function() {
      output(tab);
    });
  });
});

function inArr(arr, item) {
  for(var i=0,j=arr.length;i<j;i++) {
    if(arr[i]==item) return true;
  }
  return false;
}
function genSWF(info, src) {
  var html = '<div><br><table><tr><td><span class="picurl"><a target=_blank href="'+src+'">'+info+src+'</a></span></td></tr></table><br>';
  return html;
}
function genIMG(info, src, title, alt) {
  s_imgcnt++;
  var html = '';
  html += '<div><br><table width="100%"><tr><td><span class="picurl"><a target=_blank href="'+src+'"><span id="si_'+s_imgcnt+'"></span>'+info+src+'</a></span></td></tr>';
  html += '<tr><td><div class="sdiv">';
  if(s_type == 1) { //Reduce the size of the image
    html += '<img id="i_'+s_imgcnt+'" class="bdiv" title="'+title+'" alt="'+alt+'" src="'+src+'" style="max-height:'+s_height+'px;"/>';
  }
  else {
    html += '<img id="i_'+s_imgcnt+'" class="bdiv" title="'+title+'" alt="'+alt+'" src="'+src+'"/>';
  }
  html += '</div></td></tr></table></div>';
  return html;
}
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if(request.act == 'sendimg') {
    if(!inArr(imgArr, request.src)) {
      imgArr.push(request.src);
      data += genIMG(request.info, request.src, request.title, request.alt);
    }
  }
  else if(request.act == 'sendswf') {
    if(!inArr(imgArr, request.src)) {
      imgArr.push(request.src);
      data += genSWF(request.info, request.src);
    }
  }
  else if(request.act == 'senddata') {
    data += request.data;
  }
});
