/* ==========================================================================
   liyc.pw — Interactive Coffee Chat Scheduler (static/js/coffee-chat.js)
   A Calendly-style meeting booking widget for "Beyond the Lab":
   1. On-site Coffee Chat in Abu Dhabi (UTC+4) — Open on weekends (Sat & Sun)
   2. Online Coffee Chat — Mutual time zone smart matching (Host in UTC+4 vs
      Visitor's local IANA time zone)
   Automatically dispatches a structured booking email to Yuchen and generates
   1-click Google Calendar, .ics calendar invite, Gmail, and mailto links.
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  if (!body || !body.classList.contains('theme-claude')) return;
  if (document.getElementById('coffee-modal')) return;

  var zh = (document.documentElement.lang || '').toLowerCase().indexOf('zh') === 0;
  var HOST_TZ = 'Asia/Dubai'; // UTC+4 (no DST)
  var HOST_OFFSET_MIN = 240;  // +04:00 = +240 minutes from UTC

  // Resolve host email from the Beyond the Lab trigger or fallback
  function getHostEmail() {
    var el = document.querySelector('.js-coffee-trigger[data-u][data-d], .js-email[data-u][data-d]');
    if (el && el.getAttribute('data-u') && el.getAttribute('data-d')) {
      return el.getAttribute('data-u') + '@' + el.getAttribute('data-d');
    }
    return 'yuchen.li@mbzuai.ac.ae';
  }

  // Common global timezones for quick switching
  var TZ_LIST = [
    { id: 'Asia/Dubai', label_en: 'Abu Dhabi / Dubai (UTC+4)', label_zh: '阿布扎比 / 迪拜 (UTC+4)' },
    { id: 'Asia/Shanghai', label_en: 'Beijing / Shanghai / Singapore (UTC+8)', label_zh: '北京时间 / 新加坡 (UTC+8)' },
    { id: 'Asia/Hong_Kong', label_en: 'Hong Kong / Taipei (UTC+8)', label_zh: '香港 / 台北 (UTC+8)' },
    { id: 'Asia/Tokyo', label_en: 'Tokyo / Seoul (UTC+9)', label_zh: '东京 / 首尔 (UTC+9)' },
    { id: 'Asia/Kolkata', label_en: 'India Standard Time (UTC+5:30)', label_zh: '印度标准时间 (UTC+5:30)' },
    { id: 'Asia/Riyadh', label_en: 'Riyadh / KAUST (UTC+3)', label_zh: '利雅得 / KAUST (UTC+3)' },
    { id: 'Europe/London', label_en: 'London / UK (GMT/BST)', label_zh: '伦敦 / 英国 (GMT/BST)' },
    { id: 'Europe/Berlin', label_en: 'Central Europe · Paris / Berlin / Zurich', label_zh: '中欧时间 · 巴黎 / 柏林 / 苏黎世' },
    { id: 'America/New_York', label_en: 'US Eastern · New York / Boston (ET)', label_zh: '美东时间 · 纽约 / 波士顿 (ET)' },
    { id: 'America/Chicago', label_en: 'US Central · Chicago / Austin (CT)', label_zh: '美中时间 · 芝加哥 / 奥斯汀 (CT)' },
    { id: 'America/Denver', label_en: 'US Mountain · Denver (MT)', label_zh: '美山时间 · 丹佛 (MT)' },
    { id: 'America/Los_Angeles', label_en: 'US Pacific · SF / Seattle / LA (PT)', label_zh: '美西时间 · 旧金山 / 西雅图 / 洛杉矶 (PT)' },
    { id: 'America/Toronto', label_en: 'Canada Eastern · Toronto / Montreal', label_zh: '加拿大东部 · 多伦多 / 蒙特利尔' },
    { id: 'Australia/Sydney', label_en: 'Sydney / Melbourne (AEST/AEDT)', label_zh: '悉尼 / 墨尔本 (AEST/AEDT)' }
  ];

  var detectedTz = 'Asia/Dubai';
  try {
    detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dubai';
  } catch (e) {
    detectedTz = 'Asia/Dubai';
  }

  // Ensure visitor's detected timezone is in TZ_LIST
  if (detectedTz && !TZ_LIST.some(function (t) { return t.id === detectedTz; })) {
    TZ_LIST.unshift({
      id: detectedTz,
      label_en: detectedTz.replace(/_/g, ' ') + ' (Local)',
      label_zh: detectedTz.replace(/_/g, ' ') + ' (当前时区)'
    });
  }

  var T = {
    en: {
      badge: 'COFFEE CHAT SCHEDULER',
      hostName: 'Yuchen Li',
      hostSub: 'PhD in Computer Vision · MBZUAI',
      hostTzLabel: 'Host time · Abu Dhabi (UTC+4)',
      yourTzLabel: 'Your local time',
      modeTitle: '1. Select Meeting Mode',
      onsiteTitle: 'On-site Coffee Chat',
      onsiteSub: 'Abu Dhabi · Open on Weekends (Sat & Sun)',
      onsiteBadge: 'Weekend Only · UTC+4',
      onlineTitle: 'Online Coffee Chat',
      onlineSub: 'Video Call · Mutual Time Zone Match',
      onlineBadge: 'Mutual TZ Smart Match',
      durationLabel: 'Duration',
      locationLabel: 'Abu Dhabi Meetup Spot',
      platformLabel: 'Video Platform',
      locations: [
        'MBZUAI Campus Cafe (Masdar City)',
        'Al Maryah Island / The Galleria',
        'Saadiyat Island / Louvre District',
        'Downtown Abu Dhabi / Corniche',
        'Flexible / Suggest a spot in notes'
      ],
      platforms: [
        'Google Meet (Auto-link)',
        'Zoom Meeting',
        'Tencent Meeting / WeChat',
        'Other (share link in notes)'
      ],
      tzSelectLabel: 'Your Time Zone (for Mutual Time Match)',
      overlapSame: 'You are in the same time zone as Abu Dhabi (UTC+4).',
      overlapAhead: function (h) { return 'Your time is ' + h + 'h ahead of Abu Dhabi (UTC+4).'; },
      overlapBehind: function (h) { return 'Your time is ' + h + 'h behind Abu Dhabi (UTC+4).'; },
      calTitle: '2. Select a Date',
      onsiteRuleBanner: '☕ On-site coffee chats in Abu Dhabi are open on weekends (Saturday & Sunday).',
      onlineRuleBanner: '🌐 Showing times matched to both your local timezone and Abu Dhabi (UTC+4).',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      slotTitle: '3. Select a Time Slot',
      mutualFilterOn: '★ Mutual Friendly Hours',
      mutualFilterAll: 'Show All UTC+4 Hours',
      bestBadge: '★ Mutual Best',
      abuDhabiTag: 'Abu Dhabi',
      yourTimeTag: 'Your time',
      noMutualSlots: 'No mutual daytime slots found with strict filter. Click "Show All UTC+4 Hours" above.',
      wkndOnlyHint: 'Weekday (On-site is open Sat & Sun)',
      formTitle: 'Confirm Your Coffee Chat',
      changeSlot: '← Change time',
      nameLabel: 'Your Name *',
      namePh: 'e.g. Alex Chen',
      emailLabel: 'Your Email *',
      emailPh: 'name@university.edu',
      affilLabel: 'Affiliation / Role',
      affilPh: 'e.g. PhD Student @ MIT / Researcher / Reader',
      topicLabel: 'What shall we chat about?',
      topics: [
        { id: 'research', label: '🔬 Research & Collaboration' },
        { id: 'roles', label: '💼 2027 Research Opportunities' },
        { id: 'strangers', label: '☕ 100 Strangers Coffee Project' },
        { id: 'hello', label: '👋 Just Saying Hi' }
      ],
      notesLabel: 'Notes / Specific Questions (Optional)',
      notesPh: 'Anything you would like to discuss, paper links, or preferred coffee spot...',
      autoEmailHint: 'Automatically sends a booking email to Yuchen and generates your calendar invite.',
      submitBtn: 'Schedule Meeting & Send Email →',
      submittingBtn: 'Sending booking email to Yuchen...',
      successTitle: 'Coffee Chat Request Ready!',
      successSentAuto: 'Booking details have been automatically dispatched to Yuchen (' + getHostEmail() + ').',
      successFallbackNote: 'We also opened a pre-filled email / invite option below so Yuchen receives your calendar request right away.',
      gcalBtn: '📅 Add to Google Calendar (Invites Yuchen)',
      icsBtn: '📥 Download .ics Calendar Invite',
      mailtoBtn: '✉️ Send via Default Mail App',
      gmailBtn: '📨 Open in Gmail Web',
      copyBtn: '📋 Copy Booking Summary',
      copiedBtn: '✓ Copied to Clipboard',
      bookAnother: '← Book another time',
      closeLabel: 'Close scheduler',
      dayShiftNext: '+1d your time',
      dayShiftPrev: '-1d your time'
    },
    zh: {
      badge: 'COFFEE CHAT · 预约系统',
      hostName: '李禹陈 (Yuchen Li)',
      hostSub: 'MBZUAI 计算机视觉博士生 · 阿布扎比',
      hostTzLabel: '禹陈所在地 · 阿布扎比 (UTC+4)',
      yourTzLabel: '你的当前时区时间',
      modeTitle: '1. 选择预约方式',
      onsiteTitle: '阿布扎比线下咖啡 (On-site)',
      onsiteSub: '阿布扎比面聊 · 周末开放 (周六 & 周日)',
      onsiteBadge: '仅周末开放 · UTC+4',
      onlineTitle: '线上咖啡交流 (Online)',
      onlineSub: '视频会议 · 智能匹配双方时区',
      onlineBadge: '智能跨时区匹配',
      durationLabel: '会议时长',
      locationLabel: '阿布扎比约见地点',
      platformLabel: '线上会议方式',
      locations: [
        'MBZUAI 校园咖啡厅 (Masdar City)',
        'Al Maryah 岛 / The Galleria',
        '萨迪亚特岛 (Saadiyat / 卢浮宫周边)',
        '阿布扎比市中心 / Corniche 海滨',
        '其他阿布扎比地点（可在备注填写）'
      ],
      platforms: [
        'Google Meet (推荐)',
        'Zoom 视频会议',
        '腾讯会议 / 微信语音视频',
        '其他平台（可在备注附上链接）'
      ],
      tzSelectLabel: '你的所在时区（自动计算双方舒适时段）',
      overlapSame: '你当前与阿布扎比处于同一时区 (UTC+4)。',
      overlapAhead: function (h) { return '你的时区比阿布扎比 (UTC+4) 快 ' + h + ' 小时。'; },
      overlapBehind: function (h) { return '你的时区比阿布扎比 (UTC+4) 慢 ' + h + ' 小时。'; },
      calTitle: '2. 选择日期',
      onsiteRuleBanner: '☕ 阿布扎比线下 Coffee Chat 在周末（周六、周日）开放预约。',
      onlineRuleBanner: '🌐 已根据你的时区与阿布扎比 (UTC+4) 自动换算并高亮「双方黄金时段」。',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      slotTitle: '3. 选择具体时间',
      mutualFilterOn: '★ 仅看双方舒适时段',
      mutualFilterAll: '显示全部 UTC+4 时段',
      bestBadge: '★ 双方黄金时段',
      abuDhabiTag: '阿布扎比',
      yourTimeTag: '你的时间',
      noMutualSlots: '当前严格过滤下暂无重叠时段，请点击上方「显示全部 UTC+4 时段」。',
      wkndOnlyHint: '工作日（线下咖啡仅周六、周日开放）',
      formTitle: '填写预约信息',
      changeSlot: '← 修改时间',
      nameLabel: '你的姓名 / 称呼 *',
      namePh: '例如：张同学 / Alex',
      emailLabel: '你的邮箱（用于接收日历邀请与回复）*',
      emailPh: 'name@example.com',
      affilLabel: '学校 / 机构 / 身份（选填）',
      affilPh: '例如：XX 大学博士生 / 研究员 / 小红书读者',
      topicLabel: '想聊的话题',
      topics: [
        { id: 'research', label: '🔬 学术研究与合作' },
        { id: 'roles', label: '💼 2027 研究机会交流' },
        { id: 'strangers', label: '☕ 100 位陌生人咖啡计划' },
        { id: 'hello', label: '👋 交个朋友 / 打个招呼' }
      ],
      notesLabel: '备注说明 / 想聊的具体问题（选填）',
      notesPh: '可以写下你想聊的方向、论文链接，或者推荐的咖啡馆...',
      autoEmailHint: '点击确认后将自动向禹陈发送预约邮件，并生成日历邀请。',
      submitBtn: '确认预约并自动发送邮件 →',
      submittingBtn: '正在自动发送预约邮件...',
      successTitle: 'Coffee Chat 预约请求已生成！',
      successSentAuto: '预约详情已自动发送至禹陈的邮箱 (' + getHostEmail() + ')。',
      successFallbackNote: '同时为你生成了一键日历邀请与邮件确认入口，确保双方日历同步：',
      gcalBtn: '📅 添加到 Google Calendar（并邀请禹陈）',
      icsBtn: '📥 下载 .ics 日历文件 (Apple / Outlook)',
      mailtoBtn: '✉️ 用本地邮件客户端发送确认信',
      gmailBtn: '📨 用 Gmail 网页版发送',
      copyBtn: '📋 复制预约详情文本',
      copiedBtn: '✓ 已复制到剪贴板',
      bookAnother: '← 重新选择其他时间',
      closeLabel: '关闭预约窗口',
      dayShiftNext: '你的时区 +1天',
      dayShiftPrev: '你的时区 -1天'
    }
  }[zh ? 'zh' : 'en'];

  // ---- Timezone & Date Math Helpers ----

  // Get current date parts in Abu Dhabi (UTC+4)
  function getAbuDhabiNowParts() {
    var now = new Date();
    var utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    var adDate = new Date(utcMs + HOST_OFFSET_MIN * 60000);
    return {
      year: adDate.getFullYear(),
      month: adDate.getMonth(),
      day: adDate.getDate(),
      hour: adDate.getHours(),
      minute: adDate.getMinutes(),
      dow: adDate.getDay()
    };
  }

  // Convert an Abu Dhabi (UTC+4) date (year, month 0-indexed, day, hour, minute) into an exact UTC Date object
  function abuDhabiToDate(year, month, day, hour, minute) {
    // UTC+4 means UTC = AbuDhabiTime - 4 hours
    return new Date(Date.UTC(year, month, day, hour - 4, minute || 0, 0));
  }

  // Extract date/time parts in any target IANA timezone from a Date instant
  function getPartsInTz(dateObj, tz) {
    try {
      var fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      var parts = fmt.formatToParts(dateObj);
      var map = {};
      for (var i = 0; i < parts.length; i++) {
        map[parts[i].type] = parts[i].value;
      }
      var h = parseInt(map.hour, 10);
      if (h === 24) h = 0;
      return {
        year: parseInt(map.year, 10),
        month: parseInt(map.month, 10) - 1,
        day: parseInt(map.day, 10),
        hour: h,
        minute: parseInt(map.minute, 10),
        weekday: map.weekday
      };
    } catch (e) {
      return {
        year: dateObj.getUTCFullYear(),
        month: dateObj.getUTCMonth(),
        day: dateObj.getUTCDate(),
        hour: dateObj.getUTCHours(),
        minute: dateObj.getUTCMinutes(),
        weekday: ''
      };
    }
  }

  // Calculate timezone offset difference (in hours) between visitorTz and Abu Dhabi (UTC+4)
  function getTzDiffHours(visitorTz) {
    var ref = new Date();
    var ad = getPartsInTz(ref, HOST_TZ);
    var vis = getPartsInTz(ref, visitorTz);
    var adUtc = Date.UTC(ad.year, ad.month, ad.day, ad.hour, ad.minute);
    var visUtc = Date.UTC(vis.year, vis.month, vis.day, vis.hour, vis.minute);
    return Math.round(((visUtc - adUtc) / 3600000) * 2) / 2;
  }

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function formatHM(hour, minute, use12h) {
    if (!use12h) {
      return pad2(hour) + ':' + pad2(minute);
    }
    var period = hour >= 12 ? 'PM' : 'AM';
    var h12 = hour % 12 || 12;
    return h12 + ':' + pad2(minute) + ' ' + period;
  }

  function formatYMD(y, m, d) {
    return y + '-' + pad2(m + 1) + '-' + pad2(d);
  }

  function formatReadableDate(y, m, d) {
    var dt = new Date(Date.UTC(y, m, d, 12, 0, 0));
    try {
      return new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', {
        timeZone: 'UTC',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dt);
    } catch (e) {
      return formatYMD(y, m, d);
    }
  }

  // Format UTC Date to YYYYMMDDTHHMMSSZ for Google Calendar / ICS
  function toCalUTCString(dateObj) {
    return (
      dateObj.getUTCFullYear() +
      pad2(dateObj.getUTCMonth() + 1) +
      pad2(dateObj.getUTCDate()) +
      'T' +
      pad2(dateObj.getUTCHours()) +
      pad2(dateObj.getUTCMinutes()) +
      '00Z'
    );
  }

  // ---- Scheduler State ----
  var nowAD = getAbuDhabiNowParts();
  var state = {
    isOpen: false,
    mode: 'onsite', // 'onsite' (weekend in Abu Dhabi) or 'online' (mutual TZ)
    duration: 45,   // minutes
    location: T.locations[0],
    platform: T.platforms[0],
    visitorTz: detectedTz || 'Asia/Dubai',
    use12h: false,
    strictMutual: true,
    viewYear: nowAD.year,
    viewMonth: nowAD.month,
    selectedYear: nowAD.year,
    selectedMonth: nowAD.month,
    selectedDay: nowAD.day,
    selectedSlot: null, // { adHour, adMinute, startUtc, endUtc, visParts, tier, dayDiff }
    step: 'pick',       // 'pick' | 'form' | 'done'
    topic: 'research',
    guestName: '',
    guestEmail: '',
    guestAffil: '',
    guestNotes: '',
    lastBooking: null
  };

  // Check if a calendar date (in Abu Dhabi) is selectable
  function isDateSelectable(y, m, d, mode) {
    var todayAD = getAbuDhabiNowParts();
    var targetVal = y * 10000 + m * 100 + d;
    var todayVal = todayAD.year * 10000 + todayAD.month * 100 + todayAD.day;
    if (targetVal < todayVal) return false;

    var dow = new Date(Date.UTC(y, m, d, 12, 0, 0)).getUTCDay();
    if (mode === 'onsite') {
      // UAE weekend in Abu Dhabi is Saturday (6) and Sunday (0)
      return dow === 0 || dow === 6;
    }
    return true;
  }

  // Ensure selected date is valid for current mode; if not, advance to next valid date
  function ensureValidSelectedDate() {
    if (isDateSelectable(state.selectedYear, state.selectedMonth, state.selectedDay, state.mode)) {
      return;
    }
    var base = new Date(Date.UTC(nowAD.year, nowAD.month, nowAD.day, 12, 0, 0));
    for (var i = 0; i < 21; i++) {
      var cand = new Date(base.getTime() + i * 86400000);
      var cy = cand.getUTCFullYear();
      var cm = cand.getUTCMonth();
      var cd = cand.getUTCDate();
      if (isDateSelectable(cy, cm, cd, state.mode)) {
        state.selectedYear = cy;
        state.selectedMonth = cm;
        state.selectedDay = cd;
        state.viewYear = cy;
        state.viewMonth = cm;
        return;
      }
    }
  }

  ensureValidSelectedDate();

  // Compute time slots for the currently selected date & mode
  function getSlotsForSelectedDate() {
    var y = state.selectedYear;
    var m = state.selectedMonth;
    var d = state.selectedDay;
    var nowMs = Date.now();
    var rawSlots = [];

    if (state.mode === 'onsite') {
      // On-site weekend slots in Abu Dhabi (UTC+4)
      rawSlots = [
        { h: 10, min: 0, tag_en: 'Morning Espresso', tag_zh: '早间咖啡' },
        { h: 11, min: 0, tag_en: 'Late Morning Brew', tag_zh: '上午手冲' },
        { h: 14, min: 0, tag_en: 'Afternoon Coffee', tag_zh: '午后咖啡' },
        { h: 15, min: 30, tag_en: 'Afternoon Chat', tag_zh: '下午茶歇' },
        { h: 17, min: 0, tag_en: 'Golden Hour', tag_zh: '傍晚日落' },
        { h: 18, min: 30, tag_en: 'Evening Catch-up', tag_zh: '晚间交流' },
        { h: 20, min: 0, tag_en: 'Night Specialty', tag_zh: '夜间特调' }
      ];
    } else {
      // Online candidate slots in Abu Dhabi (UTC+4): 09:00 to 22:30 (excluding 12:00-13:00 lunch)
      var hours = [
        [9, 0], [9, 30], [10, 0], [10, 30], [11, 0], [11, 30],
        [13, 30], [14, 0], [14, 30], [15, 0], [15, 30], [16, 0], [16, 30],
        [17, 0], [17, 30], [18, 0], [18, 30], [19, 0], [19, 30],
        [20, 0], [20, 30], [21, 0], [21, 30], [22, 0], [22, 30]
      ];
      for (var i = 0; i < hours.length; i++) {
        rawSlots.push({ h: hours[i][0], min: hours[i][1] });
      }
    }

    var results = [];
    for (var j = 0; j < rawSlots.length; j++) {
      var s = rawSlots[j];
      var startUtc = abuDhabiToDate(y, m, d, s.h, s.min);
      // Skip slots in the past (with 30m buffer)
      if (startUtc.getTime() < nowMs + 1800000) continue;

      var endUtc = new Date(startUtc.getTime() + state.duration * 60000);
      var visParts = getPartsInTz(startUtc, state.visitorTz);

      var adDecimal = s.h + s.min / 60;
      var visDecimal = visParts.hour + visParts.minute / 60;

      // Determine mutual comfort tier
      var tier = 3; // extended
      if (adDecimal >= 10 && adDecimal <= 21.5 && visDecimal >= 9 && visDecimal <= 21) {
        tier = 1; // ★ Mutual Sweet Spot
      } else if (adDecimal >= 9 && adDecimal <= 22.5 && visDecimal >= 7.5 && visDecimal <= 22.5) {
        tier = 2; // Reasonable overlap
      }

      if (state.mode === 'online' && state.strictMutual && tier === 3) {
        continue;
      }

      // Compute day shift between Abu Dhabi date and Visitor local date
      var adDayNum = Date.UTC(y, m, d);
      var visDayNum = Date.UTC(visParts.year, visParts.month, visParts.day);
      var dayDiff = Math.round((visDayNum - adDayNum) / 86400000);

      results.push({
        adHour: s.h,
        adMinute: s.min,
        tag: zh ? s.tag_zh : s.tag_en,
        startUtc: startUtc,
        endUtc: endUtc,
        visParts: visParts,
        tier: tier,
        dayDiff: dayDiff
      });
    }

    return results;
  }

  // ---- Build DOM Modal ----
  var modal = document.createElement('div');
  modal.id = 'coffee-modal';
  modal.className = 'cchat-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', T.badge);
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML =
    '<div class="cchat-backdrop" data-cchat-close></div>' +
    '<div class="cchat-dialog" role="document">' +
      '<button type="button" class="cchat-close" data-cchat-close aria-label="' + T.closeLabel + '">×</button>' +
      '<div class="cchat-grid">' +
        // Left sidebar: Host + Mode Switcher + Mutual TZ Info
        '<aside class="cchat-side">' +
          '<div class="cchat-badge"><span class="cchat-dot"></span>' + T.badge + '</div>' +
          '<div class="cchat-host">' +
            '<div class="cchat-avatar">YL</div>' +
            '<div>' +
              '<div class="cchat-host-name">' + T.hostName + '</div>' +
              '<div class="cchat-host-sub">' + T.hostSub + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cchat-clocks">' +
            '<div class="cchat-clock-row">' +
              '<span class="cchat-clock-label">🇦🇪 ' + T.hostTzLabel + '</span>' +
              '<strong class="cchat-clock-val" id="cchat-clock-ad">--:--</strong>' +
            '</div>' +
            '<div class="cchat-clock-row">' +
              '<span class="cchat-clock-label">🕒 ' + T.yourTzLabel + '</span>' +
              '<strong class="cchat-clock-val" id="cchat-clock-vis">--:--</strong>' +
            '</div>' +
          '</div>' +
          '<div class="cchat-sec-label">' + T.modeTitle + '</div>' +
          '<div class="cchat-modes" role="tablist">' +
            '<button type="button" class="cchat-mode-btn is-active" data-mode="onsite" role="tab" aria-selected="true">' +
              '<div class="cchat-mode-top">' +
                '<span class="cchat-mode-ic">☕</span>' +
                '<span class="cchat-mode-name">' + T.onsiteTitle + '</span>' +
                '<span class="cchat-mode-pill is-onsite">' + T.onsiteBadge + '</span>' +
              '</div>' +
              '<div class="cchat-mode-desc">' + T.onsiteSub + '</div>' +
            '</button>' +
            '<button type="button" class="cchat-mode-btn" data-mode="online" role="tab" aria-selected="false">' +
              '<div class="cchat-mode-top">' +
                '<span class="cchat-mode-ic">🌐</span>' +
                '<span class="cchat-mode-name">' + T.onlineTitle + '</span>' +
                '<span class="cchat-mode-pill is-online">' + T.onlineBadge + '</span>' +
              '</div>' +
              '<div class="cchat-mode-desc">' + T.onlineSub + '</div>' +
            '</button>' +
          '</div>' +
          '<div class="cchat-meta-controls">' +
            '<div class="cchat-field-row">' +
              '<label class="cchat-mini-label">' + T.durationLabel + '</label>' +
              '<div class="cchat-dur-group" id="cchat-dur-group">' +
                '<button type="button" class="cchat-dur-btn" data-dur="30">30m</button>' +
                '<button type="button" class="cchat-dur-btn is-active" data-dur="45">45m</button>' +
                '<button type="button" class="cchat-dur-btn" data-dur="60">60m</button>' +
              '</div>' +
            '</div>' +
            '<div class="cchat-field-row" id="cchat-loc-wrap">' +
              '<label class="cchat-mini-label" for="cchat-loc-select">' + T.locationLabel + '</label>' +
              '<select id="cchat-loc-select" class="cchat-select"></select>' +
            '</div>' +
            '<div class="cchat-field-row" id="cchat-plat-wrap" style="display:none">' +
              '<label class="cchat-mini-label" for="cchat-plat-select">' + T.platformLabel + '</label>' +
              '<select id="cchat-plat-select" class="cchat-select"></select>' +
            '</div>' +
            '<div class="cchat-field-row" id="cchat-tz-wrap">' +
              '<label class="cchat-mini-label" for="cchat-tz-select">' + T.tzSelectLabel + '</label>' +
              '<select id="cchat-tz-select" class="cchat-select"></select>' +
              '<div class="cchat-tz-diff" id="cchat-tz-diff"></div>' +
            '</div>' +
          '</div>' +
        '</aside>' +
        // Main right area: Calendar + Slots OR Form OR Confirmation
        '<div class="cchat-main">' +
          '<div class="cchat-rule-banner" id="cchat-rule-banner"></div>' +
          // Step 1: Calendar + Slots
          '<div class="cchat-step-pick" id="cchat-step-pick">' +
            '<div class="cchat-cal-col">' +
              '<div class="cchat-cal-head">' +
                '<span class="cchat-sec-label">' + T.calTitle + '</span>' +
                '<div class="cchat-cal-nav">' +
                  '<button type="button" class="cchat-nav-btn" id="cchat-prev-month" aria-label="Previous month">‹</button>' +
                  '<span class="cchat-month-label" id="cchat-month-label"></span>' +
                  '<button type="button" class="cchat-nav-btn" id="cchat-next-month" aria-label="Next month">›</button>' +
                '</div>' +
              '</div>' +
              '<div class="cchat-cal-weekdays" id="cchat-cal-weekdays"></div>' +
              '<div class="cchat-cal-days" id="cchat-cal-days"></div>' +
            '</div>' +
            '<div class="cchat-slot-col">' +
              '<div class="cchat-slot-head">' +
                '<div>' +
                  '<span class="cchat-sec-label">' + T.slotTitle + '</span>' +
                  '<div class="cchat-selected-date" id="cchat-selected-date"></div>' +
                '</div>' +
                '<div class="cchat-slot-tools">' +
                  '<button type="button" class="cchat-tool-btn" id="cchat-mutual-toggle" style="display:none"></button>' +
                  '<button type="button" class="cchat-tool-btn" id="cchat-fmt-toggle">24h</button>' +
                '</div>' +
              '</div>' +
              '<div class="cchat-slots-list" id="cchat-slots-list"></div>' +
            '</div>' +
          '</div>' +
          // Step 2: Booking Form
          '<form class="cchat-step-form" id="cchat-step-form" style="display:none">' +
            '<div class="cchat-form-top">' +
              '<h3 class="cchat-form-title">' + T.formTitle + '</h3>' +
              '<button type="button" class="cchat-back-btn" id="cchat-back-pick">' + T.changeSlot + '</button>' +
            '</div>' +
            '<div class="cchat-summary-pill" id="cchat-summary-pill"></div>' +
            '<div class="cchat-form-grid">' +
              '<div class="cchat-input-group">' +
                '<label for="cchat-in-name">' + T.nameLabel + '</label>' +
                '<input type="text" id="cchat-in-name" class="cchat-input" required placeholder="' + T.namePh + '">' +
              '</div>' +
              '<div class="cchat-input-group">' +
                '<label for="cchat-in-email">' + T.emailLabel + '</label>' +
                '<input type="email" id="cchat-in-email" class="cchat-input" required placeholder="' + T.emailPh + '">' +
              '</div>' +
            '</div>' +
            '<div class="cchat-input-group">' +
              '<label for="cchat-in-affil">' + T.affilLabel + '</label>' +
              '<input type="text" id="cchat-in-affil" class="cchat-input" placeholder="' + T.affilPh + '">' +
            '</div>' +
            '<div class="cchat-input-group">' +
              '<label>' + T.topicLabel + '</label>' +
              '<div class="cchat-topic-chips" id="cchat-topic-chips"></div>' +
            '</div>' +
            '<div class="cchat-input-group">' +
              '<label for="cchat-in-notes">' + T.notesLabel + '</label>' +
              '<textarea id="cchat-in-notes" class="cchat-textarea" rows="3" placeholder="' + T.notesPh + '"></textarea>' +
            '</div>' +
            '<div class="cchat-form-foot">' +
              '<span class="cchat-auto-hint">✨ ' + T.autoEmailHint + '</span>' +
              '<button type="submit" class="cchat-submit-btn" id="cchat-submit-btn">' + T.submitBtn + '</button>' +
            '</div>' +
          '</form>' +
          // Step 3: Confirmation & Calendar Invites
          '<div class="cchat-step-done" id="cchat-step-done" style="display:none">' +
            '<div class="cchat-done-ic">☕✓</div>' +
            '<h3 class="cchat-done-title">' + T.successTitle + '</h3>' +
            '<p class="cchat-done-status" id="cchat-done-status"></p>' +
            '<div class="cchat-done-box" id="cchat-done-box"></div>' +
            '<p class="cchat-done-sub">' + T.successFallbackNote + '</p>' +
            '<div class="cchat-done-actions">' +
              '<a id="cchat-act-gcal" class="cchat-action-btn is-primary" target="_blank" rel="noopener">' + T.gcalBtn + '</a>' +
              '<button type="button" id="cchat-act-ics" class="cchat-action-btn">' + T.icsBtn + '</button>' +
              '<a id="cchat-act-mailto" class="cchat-action-btn">' + T.mailtoBtn + '</a>' +
              '<a id="cchat-act-gmail" class="cchat-action-btn" target="_blank" rel="noopener">' + T.gmailBtn + '</a>' +
              '<button type="button" id="cchat-act-copy" class="cchat-action-btn">' + T.copyBtn + '</button>' +
            '</div>' +
            '<button type="button" class="cchat-back-btn cchat-reset-btn" id="cchat-reset-btn">' + T.bookAnother + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  body.appendChild(modal);

  // ---- Populate Static Controls ----
  var locSelect = document.getElementById('cchat-loc-select');
  T.locations.forEach(function (loc) {
    var opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    locSelect.appendChild(opt);
  });

  var platSelect = document.getElementById('cchat-plat-select');
  T.platforms.forEach(function (plat) {
    var opt = document.createElement('option');
    opt.value = plat;
    opt.textContent = plat;
    platSelect.appendChild(opt);
  });

  var tzSelect = document.getElementById('cchat-tz-select');
  TZ_LIST.forEach(function (tz) {
    var opt = document.createElement('option');
    opt.value = tz.id;
    opt.textContent = zh ? tz.label_zh : tz.label_en;
    if (tz.id === state.visitorTz) opt.selected = true;
    tzSelect.appendChild(opt);
  });

  var wkContainer = document.getElementById('cchat-cal-weekdays');
  T.weekdays.forEach(function (w, idx) {
    var sp = document.createElement('span');
    sp.textContent = w;
    if (idx === 0 || idx === 6) sp.className = 'is-wknd';
    wkContainer.appendChild(sp);
  });

  var topicContainer = document.getElementById('cchat-topic-chips');
  T.topics.forEach(function (tp) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cchat-chip' + (tp.id === state.topic ? ' is-active' : '');
    btn.setAttribute('data-topic', tp.id);
    btn.textContent = tp.label;
    btn.addEventListener('click', function () {
      state.topic = tp.id;
      Array.prototype.forEach.call(topicContainer.querySelectorAll('.cchat-chip'), function (c) {
        c.classList.toggle('is-active', c.getAttribute('data-topic') === state.topic);
      });
    });
    topicContainer.appendChild(btn);
  });

  // ---- Live Clocks ----
  function updateClocks() {
    var now = new Date();
    var adP = getPartsInTz(now, HOST_TZ);
    var visP = getPartsInTz(now, state.visitorTz);
    var adEl = document.getElementById('cchat-clock-ad');
    var visEl = document.getElementById('cchat-clock-vis');
    if (adEl) adEl.textContent = formatHM(adP.hour, adP.minute, state.use12h) + ' (UTC+4)';
    if (visEl) visEl.textContent = formatHM(visP.hour, visP.minute, state.use12h);
  }

  // ---- Render Functions ----
  function renderSidebarMeta() {
    Array.prototype.forEach.call(modal.querySelectorAll('.cchat-mode-btn'), function (b) {
      var active = b.getAttribute('data-mode') === state.mode;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    Array.prototype.forEach.call(modal.querySelectorAll('.cchat-dur-btn'), function (b) {
      b.classList.toggle('is-active', parseInt(b.getAttribute('data-dur'), 10) === state.duration);
    });

    document.getElementById('cchat-loc-wrap').style.display = state.mode === 'onsite' ? '' : 'none';
    document.getElementById('cchat-plat-wrap').style.display = state.mode === 'online' ? '' : 'none';

    var diffH = getTzDiffHours(state.visitorTz);
    var diffEl = document.getElementById('cchat-tz-diff');
    if (diffH === 0) {
      diffEl.textContent = T.overlapSame;
    } else if (diffH > 0) {
      diffEl.textContent = T.overlapAhead(diffH);
    } else {
      diffEl.textContent = T.overlapBehind(Math.abs(diffH));
    }

    var banner = document.getElementById('cchat-rule-banner');
    banner.textContent = state.mode === 'onsite' ? T.onsiteRuleBanner : T.onlineRuleBanner;
    banner.className = 'cchat-rule-banner is-' + state.mode;
  }

  function renderCalendar() {
    var y = state.viewYear;
    var m = state.viewMonth;
    var labelEl = document.getElementById('cchat-month-label');
    labelEl.textContent = zh ? y + ' 年 ' + T.months[m] : T.months[m] + ' ' + y;

    var firstDow = new Date(Date.UTC(y, m, 1, 12, 0, 0)).getUTCDay();
    var daysInMonth = new Date(Date.UTC(y, m + 1, 0, 12, 0, 0)).getUTCDate();

    var daysContainer = document.getElementById('cchat-cal-days');
    daysContainer.innerHTML = '';

    for (var e = 0; e < firstDow; e++) {
      var empty = document.createElement('span');
      empty.className = 'cchat-day is-empty';
      daysContainer.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      var selectable = isDateSelectable(y, m, d, state.mode);
      var isSelected = y === state.selectedYear && m === state.selectedMonth && d === state.selectedDay;
      var dow = new Date(Date.UTC(y, m, d, 12, 0, 0)).getUTCDay();
      var isWknd = dow === 0 || dow === 6;

      btn.className =
        'cchat-day' +
        (selectable ? ' is-avail' : ' is-disabled') +
        (isSelected ? ' is-selected' : '') +
        (isWknd ? ' is-wknd' : '');
      btn.textContent = d;

      if (!selectable) {
        btn.disabled = true;
        if (state.mode === 'onsite' && !isWknd) {
          btn.title = T.wkndOnlyHint;
        }
      } else {
        (function (dayNum) {
          btn.addEventListener('click', function () {
            state.selectedYear = y;
            state.selectedMonth = m;
            state.selectedDay = dayNum;
            state.selectedSlot = null;
            renderCalendar();
            renderSlots();
          });
        })(d);
      }
      daysContainer.appendChild(btn);
    }
  }

  function renderSlots() {
    var dateHeading = document.getElementById('cchat-selected-date');
    dateHeading.textContent = formatReadableDate(state.selectedYear, state.selectedMonth, state.selectedDay);

    var mutualBtn = document.getElementById('cchat-mutual-toggle');
    if (state.mode === 'online') {
      mutualBtn.style.display = '';
      mutualBtn.textContent = state.strictMutual ? T.mutualFilterOn : T.mutualFilterAll;
      mutualBtn.classList.toggle('is-active', state.strictMutual);
    } else {
      mutualBtn.style.display = 'none';
    }

    var fmtBtn = document.getElementById('cchat-fmt-toggle');
    fmtBtn.textContent = state.use12h ? '12h / AM·PM' : '24h';

    var listEl = document.getElementById('cchat-slots-list');
    listEl.innerHTML = '';

    var slots = getSlotsForSelectedDate();
    if (!slots.length) {
      var emptyMsg = document.createElement('div');
      emptyMsg.className = 'cchat-slots-empty';
      emptyMsg.textContent = T.noMutualSlots;
      listEl.appendChild(emptyMsg);
      return;
    }

    slots.forEach(function (sl) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cchat-slot-btn' + (sl.tier === 1 && state.mode === 'online' ? ' is-sweet' : '');

      var adStr = formatHM(sl.adHour, sl.adMinute, state.use12h);
      var visStr = formatHM(sl.visParts.hour, sl.visParts.minute, state.use12h);
      var shiftBadge = '';
      if (sl.dayDiff > 0) shiftBadge = ' <em class="cchat-shift">(' + T.dayShiftNext + ')</em>';
      else if (sl.dayDiff < 0) shiftBadge = ' <em class="cchat-shift">(' + T.dayShiftPrev + ')</em>';

      if (state.mode === 'onsite') {
        // On-site in Abu Dhabi: show Abu Dhabi UTC+4 time as primary
        btn.innerHTML =
          '<div class="cchat-slot-main">' +
            '<span class="cchat-slot-primary">' + adStr + ' <small>UTC+4</small></span>' +
            (sl.tag ? '<span class="cchat-slot-tag">' + sl.tag + '</span>' : '') +
          '</div>' +
          (state.visitorTz !== HOST_TZ
            ? '<div class="cchat-slot-sub">' + T.yourTimeTag + ': ' + visStr + shiftBadge + '</div>'
            : '');
      } else {
        // Online Mutual TZ: show Visitor's local time AND Abu Dhabi UTC+4 time side by side
        btn.innerHTML =
          '<div class="cchat-slot-main">' +
            '<span class="cchat-slot-primary">' + visStr + shiftBadge + '</span>' +
            (sl.tier === 1 ? '<span class="cchat-sweet-pill">' + T.bestBadge + '</span>' : '') +
          '</div>' +
          '<div class="cchat-slot-sub">🇦🇪 ' + T.abuDhabiTag + ': ' + adStr + ' (UTC+4)</div>';
      }

      btn.addEventListener('click', function () {
        state.selectedSlot = sl;
        openFormStep();
      });

      listEl.appendChild(btn);
    });
  }

  function showStep(stepName) {
    state.step = stepName;
    document.getElementById('cchat-step-pick').style.display = stepName === 'pick' ? '' : 'none';
    document.getElementById('cchat-step-form').style.display = stepName === 'form' ? '' : 'none';
    document.getElementById('cchat-step-done').style.display = stepName === 'done' ? '' : 'none';
  }

  function buildSlotSummaryText(sl) {
    var dateStrAD = formatReadableDate(state.selectedYear, state.selectedMonth, state.selectedDay);
    var adStart = formatHM(sl.adHour, sl.adMinute, state.use12h);
    var endADParts = getPartsInTz(sl.endUtc, HOST_TZ);
    var adEnd = formatHM(endADParts.hour, endADParts.minute, state.use12h);

    var visStart = formatHM(sl.visParts.hour, sl.visParts.minute, state.use12h);
    var visEndParts = getPartsInTz(sl.endUtc, state.visitorTz);
    var visEnd = formatHM(visEndParts.hour, visEndParts.minute, state.use12h);
    var visDateStr = formatReadableDate(sl.visParts.year, sl.visParts.month, sl.visParts.day);

    return {
      dateStrAD: dateStrAD,
      adRange: adStart + ' – ' + adEnd + ' (Abu Dhabi · UTC+4)',
      visRange: visDateStr + ', ' + visStart + ' – ' + visEnd + ' (' + state.visitorTz + ')',
      where: state.mode === 'onsite' ? state.location : state.platform,
      modeLabel: state.mode === 'onsite' ? T.onsiteTitle : T.onlineTitle
    };
  }

  function openFormStep() {
    if (!state.selectedSlot) return;
    var info = buildSlotSummaryText(state.selectedSlot);
    var pill = document.getElementById('cchat-summary-pill');
    pill.innerHTML =
      '<div><strong>' + (state.mode === 'onsite' ? '☕ ' : '🌐 ') + info.modeLabel + ' (' + state.duration + ' min)</strong> · ' + info.where + '</div>' +
      '<div>🇦🇪 <b>' + info.dateStrAD + ' · ' + info.adRange + '</b></div>' +
      (state.visitorTz !== HOST_TZ ? '<div>🕒 ' + T.yourTimeTag + ': <b>' + info.visRange + '</b></div>' : '');
    showStep('form');
  }

  // Generate .ics file content
  function buildICSContent(booking) {
    var dtStamp = toCalUTCString(new Date());
    var dtStart = toCalUTCString(booking.startUtc);
    var dtEnd = toCalUTCString(booking.endUtc);
    var uid = 'coffee-' + Date.now() + '@liyc.pw';
    var desc = booking.plainSummary.replace(/\r?\n/g, '\\n');
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Yuchen Li//Coffee Chat Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      'UID:' + uid,
      'DTSTAMP:' + dtStamp,
      'DTSTART:' + dtStart,
      'DTEND:' + dtEnd,
      'SUMMARY:' + booking.subject,
      'DESCRIPTION:' + desc,
      'LOCATION:' + booking.info.where,
      'ORGANIZER;CN=' + booking.guestName + ':mailto:' + booking.guestEmail,
      'ATTENDEE;CN=Yuchen Li;RSVP=TRUE:mailto:' + booking.hostEmail,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  // Handle Booking Form Submission
  document.getElementById('cchat-step-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!state.selectedSlot) return;

    var guestName = document.getElementById('cchat-in-name').value.trim();
    var guestEmail = document.getElementById('cchat-in-email').value.trim();
    var guestAffil = document.getElementById('cchat-in-affil').value.trim();
    var guestNotes = document.getElementById('cchat-in-notes').value.trim();
    if (!guestName || !guestEmail) return;

    var hostEmail = getHostEmail();
    var sl = state.selectedSlot;
    var info = buildSlotSummaryText(sl);
    var topicObj = T.topics.find(function (t) { return t.id === state.topic; }) || T.topics[0];

    var subject = '☕ [Coffee Chat] ' + (state.mode === 'onsite' ? 'Abu Dhabi On-site' : 'Online') +
      ' with ' + guestName + ' — ' + info.dateStrAD;

    var plainLines = [
      'Hi Yuchen,',
      '',
      'I would like to book a coffee chat with you via liyc.pw:',
      '',
      '• Mode: ' + info.modeLabel + ' (' + state.duration + ' min)',
      '• Date & Time (Abu Dhabi · UTC+4): ' + info.dateStrAD + ', ' + info.adRange,
      '• Date & Time (Guest Local): ' + info.visRange,
      '• Location / Platform: ' + info.where,
      '• Guest: ' + guestName + (guestAffil ? ' (' + guestAffil + ')' : ''),
      '• Guest Email: ' + guestEmail,
      '• Topic: ' + topicObj.label,
      guestNotes ? '• Notes: ' + guestNotes : '',
      '',
      'Looking forward to chatting!',
      guestName
    ].filter(Boolean).join('\n');

    var gcalDates = toCalUTCString(sl.startUtc) + '/' + toCalUTCString(sl.endUtc);
    var gcalUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent('☕ Coffee Chat: ' + guestName + ' × Yuchen Li') +
      '&dates=' + encodeURIComponent(gcalDates) +
      '&location=' + encodeURIComponent(info.where) +
      '&details=' + encodeURIComponent(plainLines) +
      '&add=' + encodeURIComponent(hostEmail);

    var mailtoUrl =
      'mailto:' + hostEmail +
      '?cc=' + encodeURIComponent(guestEmail) +
      '&subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(plainLines);

    var gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent(hostEmail) +
      '&su=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(plainLines);

    var booking = {
      hostEmail: hostEmail,
      guestName: guestName,
      guestEmail: guestEmail,
      guestAffil: guestAffil,
      guestNotes: guestNotes,
      topicLabel: topicObj.label,
      subject: subject,
      plainSummary: plainLines,
      info: info,
      startUtc: sl.startUtc,
      endUtc: sl.endUtc,
      gcalUrl: gcalUrl,
      mailtoUrl: mailtoUrl,
      gmailUrl: gmailUrl
    };
    state.lastBooking = booking;

    var submitBtn = document.getElementById('cchat-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = T.submittingBtn;

    // 1. Automatically send structured email via FormSubmit AJAX endpoint
    var payload = {
      _subject: subject,
      _replyto: guestEmail,
      _template: 'table',
      Meeting_Mode: info.modeLabel + ' (' + state.duration + ' min)',
      Time_Abu_Dhabi_UTC4: info.dateStrAD + ' · ' + info.adRange,
      Time_Guest_Local: info.visRange,
      Location_or_Platform: info.where,
      Guest_Name: guestName,
      Guest_Email: guestEmail,
      Guest_Affiliation: guestAffil || '—',
      Topic: topicObj.label,
      Notes: guestNotes || '—',
      Quick_Add_Google_Calendar: gcalUrl
    };

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(hostEmail), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var autoOk = data && (data.success === 'true' || data.success === true);
        finishBookingFlow(booking, autoOk);
      })
      .catch(function () {
        finishBookingFlow(booking, false);
      });
  });

  function finishBookingFlow(booking, autoSentOk) {
    var submitBtn = document.getElementById('cchat-submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = T.submitBtn;

    document.getElementById('cchat-done-status').textContent = T.successSentAuto;
    document.getElementById('cchat-done-box').innerHTML =
      '<div><strong>' + booking.subject + '</strong></div>' +
      '<div>🇦🇪 ' + booking.info.dateStrAD + ' · ' + booking.info.adRange + '</div>' +
      '<div>🕒 ' + booking.info.visRange + '</div>' +
      '<div>📍 ' + booking.info.where + '</div>';

    document.getElementById('cchat-act-gcal').href = booking.gcalUrl;
    document.getElementById('cchat-act-mailto').href = booking.mailtoUrl;
    document.getElementById('cchat-act-gmail').href = booking.gmailUrl;

    showStep('done');

    // If FormSubmit AJAX has not been activated yet or network blocked it,
    // automatically open the pre-filled mailto so Yuchen is 100% guaranteed to get the email immediately.
    if (!autoSentOk) {
      var a = document.createElement('a');
      a.href = booking.mailtoUrl;
      a.style.display = 'none';
      body.appendChild(a);
      a.click();
      setTimeout(function () {
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 200);
    }
  }

  // ---- Interactive Controls & Event Listeners ----
  Array.prototype.forEach.call(modal.querySelectorAll('.cchat-mode-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-mode');
      if (m === state.mode) return;
      state.mode = m;
      state.duration = m === 'onsite' ? 45 : 30;
      state.selectedSlot = null;
      ensureValidSelectedDate();
      showStep('pick');
      renderSidebarMeta();
      renderCalendar();
      renderSlots();
    });
  });

  Array.prototype.forEach.call(modal.querySelectorAll('.cchat-dur-btn'), function (btn) {
    btn.addEventListener('click', function () {
      state.duration = parseInt(btn.getAttribute('data-dur'), 10);
      renderSidebarMeta();
      renderSlots();
      if (state.step === 'form' && state.selectedSlot) {
        state.selectedSlot.endUtc = new Date(state.selectedSlot.startUtc.getTime() + state.duration * 60000);
        openFormStep();
      }
    });
  });

  locSelect.addEventListener('change', function () {
    state.location = locSelect.value;
    if (state.step === 'form') openFormStep();
  });

  platSelect.addEventListener('change', function () {
    state.platform = platSelect.value;
    if (state.step === 'form') openFormStep();
  });

  tzSelect.addEventListener('change', function () {
    state.visitorTz = tzSelect.value;
    updateClocks();
    renderSidebarMeta();
    renderSlots();
    if (state.step === 'form' && state.selectedSlot) {
      state.selectedSlot.visParts = getPartsInTz(state.selectedSlot.startUtc, state.visitorTz);
      openFormStep();
    }
  });

  document.getElementById('cchat-prev-month').addEventListener('click', function () {
    if (state.viewYear === nowAD.year && state.viewMonth <= nowAD.month) return;
    state.viewMonth--;
    if (state.viewMonth < 0) {
      state.viewMonth = 11;
      state.viewYear--;
    }
    renderCalendar();
  });

  document.getElementById('cchat-next-month').addEventListener('click', function () {
    state.viewMonth++;
    if (state.viewMonth > 11) {
      state.viewMonth = 0;
      state.viewYear++;
    }
    renderCalendar();
  });

  document.getElementById('cchat-mutual-toggle').addEventListener('click', function () {
    state.strictMutual = !state.strictMutual;
    renderSlots();
  });

  document.getElementById('cchat-fmt-toggle').addEventListener('click', function () {
    state.use12h = !state.use12h;
    updateClocks();
    renderSlots();
    if (state.step === 'form') openFormStep();
  });

  document.getElementById('cchat-back-pick').addEventListener('click', function () {
    showStep('pick');
  });

  document.getElementById('cchat-reset-btn').addEventListener('click', function () {
    showStep('pick');
  });

  document.getElementById('cchat-act-ics').addEventListener('click', function () {
    if (!state.lastBooking) return;
    var ics = buildICSContent(state.lastBooking);
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'coffee-chat-yuchen-li.ics';
    body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  });

  document.getElementById('cchat-act-copy').addEventListener('click', function () {
    if (!state.lastBooking) return;
    var btn = document.getElementById('cchat-act-copy');
    var done = function () {
      btn.textContent = T.copiedBtn;
      setTimeout(function () { btn.textContent = T.copyBtn; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(state.lastBooking.plainSummary).then(done);
    }
  });

  // ---- Open / Close Modal ----
  var clockTimer = null;

  function openScheduler(preferredMode) {
    if (preferredMode === 'onsite' || preferredMode === 'online') {
      state.mode = preferredMode;
      state.duration = preferredMode === 'onsite' ? 45 : 30;
    }
    ensureValidSelectedDate();
    showStep('pick');
    updateClocks();
    renderSidebarMeta();
    renderCalendar();
    renderSlots();

    state.isOpen = true;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('cchat-open');

    if (!clockTimer) {
      clockTimer = setInterval(updateClocks, 15000);
    }
  }

  function closeScheduler() {
    state.isOpen = false;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('cchat-open');
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
    if (window.location.hash === '#coffee-chat') {
      try {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  Array.prototype.forEach.call(modal.querySelectorAll('[data-cchat-close]'), function (el) {
    el.addEventListener('click', closeScheduler);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.isOpen) {
      closeScheduler();
    }
  });

  // Bind triggers on the page (the Beyond the Lab tile and mode pills)
  Array.prototype.forEach.call(document.querySelectorAll('.js-coffee-trigger'), function (trig) {
    trig.addEventListener('click', function (e) {
      e.preventDefault();
      var pill = e.target.closest('[data-coffee-mode]');
      var mode = pill ? pill.getAttribute('data-coffee-mode') : null;
      openScheduler(mode);
    });
  });

  // Open automatically if visited with #coffee-chat
  if (window.location.hash === '#coffee-chat') {
    setTimeout(function () { openScheduler(); }, 250);
  }
})();
