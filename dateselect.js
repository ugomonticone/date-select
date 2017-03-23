var datePick = (function () {
  var targetInput, d, base, head, days, corpo, prev, next, curdate;
  var myConstructor = function DatePick(el) {
    if (false === (this instanceof DatePick)) {
      return new DatePick(el);
    } else {
      targetInput = document.getElementById(el);
      targetInput.onfocus = function () {
        show();
      }
      targetInput.onclick = function () {
        show();
      }
    }
  }
  myConstructor.prototype.init = function () {
    window.onkeydown = function () {
      if (event.keyCode == 27)
        hide();
    }

    document.onclick = function (e) {
      var target = (e && e.target) || (event && event.srcElement);
      var p = document.getElementById(target.id);

      if (exitOnClick(p)) hide();
    }


    d = new Date(Date.now());
    base = document.createElement('div');
    head = document.createElement('div');
    days = document.createElement('div');
    corpo = document.createElement('div');
    prev = document.createElement('span');
    next = document.createElement('span');
    curdate = document.createElement('span');

    days.id = 'divDaysCalendar';
    corpo.id = 'divBodyCalendar';
    base.id = 'divCalendarBase';
    head.id = 'divHeaderCalendar';
    prev.id = 'spanPrev';
    next.id = 'spanNext';
    curdate.id = 'spanCurrent';
    for (var i = 0; i < 7; i++) {
      var gg = document.createElement('span');
      gg.innerHTML = getNomeGiorno(i, 2);
      days.appendChild(gg);
    }
    head.appendChild(prev);
    head.appendChild(curdate);
    head.appendChild(next);
    base.appendChild(head);
    base.appendChild(days);
    base.appendChild(corpo);
    base.style.left = targetInput.offsetLeft + 'px';
    base.style.top = (targetInput.offsetHeight + 10) + 'px';
    if (curdate.innerHTML == '') {
      curdate.setAttribute('data-date', new Date().toString());
      curdate.innerHTML = getNomeMese(d.getMonth()) + ' ' + d.getFullYear();
      var result = popola(d.getFullYear(), d.getMonth());
      creaViewMese(result);
    }
    else {
      d = new Date();
      d = Date.parse(curdate.getAttribute('data-date'));
    }
    base.style.display = 'none';
    document.body.appendChild(base);
    prev.innerHTML = "<<";
    next.innerHTML = ">>";

    prev.onclick = function (e) {
      var x = document.getElementById('spanCurrent').getAttribute('data-date');
      moveCalendar('P', x);
    }
    next.onclick = function (e) {
      var x = document.getElementById('spanCurrent').getAttribute('data-date');
      moveCalendar('N', x);
    }
  }

  function exitOnClick(elem) {
    if (elem && elem.parentElement) {
      if (elem.parentElement.id === 'divCalendarBase' || elem.id === targetInput.id || elem.id === 'divCalendarBase')
        return false;
      else
        return exitOnClick(elem.parentElement);
    }
    return true;
  }

  function creaViewMese(result) {
    if (corpo)
      corpo.innerHTML = '';
    for (var i = 0; i < result.length; i++) {
      var newLine;
      if (i == 0 || (i > 0 && (i) % 7 == 0)) {
        newLine = document.createElement('div');
        newLine.id = 'rigaSettimana_' + i;
      }

      var cell = document.createElement('span');

      if (result[i]) {
        cell.setAttribute('class', 'calendarDay');
        cell.innerHTML = result[i];
        cell.id = 'day_' + result[i];
        cell.onclick = function (e) {
          getSelectedDate((e || window.event).target);
        }
      }
      else {
        cell.id = 'day_void_' + i;
        cell.setAttribute('class', 'calendarDayVoid');
      }
      newLine.appendChild(cell);
      corpo.appendChild(newLine);
    }
  }
  function popola(anno, mese) {
    var pagina = [];
    var inizio = new Date(anno, mese, 1);
    var inizioW = inizio.getDay();
    var offset = (inizioW == 0) ? 6 : (inizioW - 1);
    var quanti = daysInMonth(anno, mese);
    for (var j = 0; j < quanti + offset; j++) {
      if (j >= offset)
        pagina[j] = (j - offset + 1) + '';
    }
    return pagina;
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function moveCalendar(dir, ora) {
    var t = new Date(ora);
    var anno, mese, a, m;
    anno = t.getFullYear();
    mese = t.getMonth();
    if (dir == 'N') {
      a = (mese + 1) > 11 ? anno + 1 : anno;
      m = (mese + 1) == 12 ? 0 : mese + 1;
    }
    if (dir == 'P') {
      a = (mese == 0) ? anno - 1 : anno;
      m = (mese == 0) ? 11 : mese - 1;
    }
    curdate.innerHTML = getNomeMese(m) + ' ' + a;
    curdate.setAttribute('data-date', new Date(a, m, 1));
    creaViewMese(popola(a, m));
  }

  function getNomeMese(x) {
    var mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Sttembre', 'Ottobre', 'Novembre', 'Dicembre'];
    if (x >= 0 && x < 12) return mesi[x];
  }

  function getNomeGiorno(g, l) {
    var giorni = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'];
    return giorni[g].substr(0, l);
  }

  function show() {
    base.style.display = 'block';
  }

  function hide() {
    base.style.display = 'none';
  }

  function getSelectedDate(e) {
    var l = (navigator.language ? navigator.language : navigator[userLanguage]) + '';
    var f = (l) ? l.substr(0, 2) : 'it';
    var x = e.innerHTML;
    var q = new Date(curdate.getAttribute('data-date'));
    q.setDate(x);
    targetInput.value = formatDate(f, q)
    base.style.display = 'none';
  }

  function formatDate(locale, data) {
    var result = '';
    var y = data.getFullYear();
    var m = parseInt(data.getMonth()) + 1;
    var d = parseInt(data.getDate());
    if (locale === 'it') {
      result += (d < 10) ? '0' + d : d;
      result += (m < 10) ? '/0' + m : '/' + m;
      result += '/' + y;
    }
    return result;
  }

  return myConstructor;

})();