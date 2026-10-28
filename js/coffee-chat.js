/* ==========================================================================
   liyc.pw — Interactive Coffee Chat Scheduler (static/js/coffee-chat.js)
   A Calendly-style meeting booking widget for "Beyond the Lab":
   1. On-site Coffee Chat in Abu Dhabi (UTC+4) — Open on weekends (Sat & Sun),
      afternoon/evening slots only (14:00, 16:00, 18:00, 20:00).
   2. Online Coffee Chat — Mutual time zone smart matching (Host in UTC+4 vs
      Visitor's auto-detected local time or any of the 24 global UTC time zones).
   Instant (0ms) confirmation with 1-click Google Calendar invite (which
   automatically emails Yuchen an invitation), .ics download, Gmail, and mailto,
   plus non-blocking background email dispatch.
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  if (!body || !body.classList.contains('theme-claude')) return;
  if (document.getElementById('coffee-modal')) return;

  var zh = (document.documentElement.lang || '').toLowerCase().indexOf('zh') === 0;
  var HOST_OFFSET_MIN = 240; // Abu Dhabi = UTC+4 (+240 minutes)

  function getHostEmail() {
    var el = document.querySelector('.js-coffee-trigger[data-u][data-d], .js-email[data-u][data-d]');
    if (el && el.getAttribute('data-u') && el.getAttribute('data-d')) {
      return el.getAttribute('data-u') + '@' + el.getAttribute('data-d');
    }
    return 'yuchen.li@mbzuai.ac.ae';
  }

  // Format offset minutes (e.g. 240 -> "UTC+4", 330 -> "UTC+5:30", -300 -> "UTC-5")
  function formatUtcOffset(offsetMin) {
    if (offsetMin === 0) return 'UTC+0';
    var sign = offsetMin > 0 ? '+' : '-';
    var abs = Math.abs(offsetMin);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    return 'UTC' + sign + h + (m ? ':' + (m < 10 ? '0' + m : m) : '');
  }

  // All 24 standard global time zones (UTC-12 to UTC+12, plus common half-hour & +13/+14 zones)
  var ALL_TIMEZONES = [
    { offset: -720, en: 'UTC-12:00 · Baker Island (IDLW)', zh: 'UTC-12:00 · 贝克岛 (国际换日线西)' },
    { offset: -660, en: 'UTC-11:00 · Pago Pago / American Samoa', zh: 'UTC-11:00 · 美属萨摩亚 / 中途岛' },
    { offset: -600, en: 'UTC-10:00 · Honolulu / Hawaii (HST)', zh: 'UTC-10:00 · 夏威夷 / 檀香山 (HST)' },
    { offset: -540, en: 'UTC-09:00 · Anchorage / Alaska (AKST)', zh: 'UTC-09:00 · 阿拉斯加 / 安克雷奇' },
    { offset: -480, en: 'UTC-08:00 · US Pacific · LA / Seattle / SF (PST)', zh: 'UTC-08:00 · 美西冬令时 · 洛杉矶 / 西雅图 (PST)' },
    { offset: -420, en: 'UTC-07:00 · US Pacific Daylight / Mountain (PDT/MST)', zh: 'UTC-07:00 · 美西夏令时 / 美山时间 (PDT/MST)' },
    { offset: -360, en: 'UTC-06:00 · US Central · Chicago / Austin / Mexico (CST)', zh: 'UTC-06:00 · 美中时间 · 芝加哥 / 奥斯汀 / 墨西哥城' },
    { offset: -300, en: 'UTC-05:00 · US Eastern (EST) / Central Daylight', zh: 'UTC-05:00 · 美东冬令时 · 纽约 / 波士顿 / 多伦多 (EST)' },
    { offset: -240, en: 'UTC-04:00 · US Eastern Daylight (EDT) / Santiago', zh: 'UTC-04:00 · 美东夏令时 (EDT) / 圣地亚哥' },
    { offset: -180, en: 'UTC-03:00 · São Paulo / Buenos Aires (BRT/ART)', zh: 'UTC-03:00 · 圣保罗 / 布宜诺斯艾利斯' },
    { offset: -120, en: 'UTC-02:00 · South Georgia / Mid-Atlantic', zh: 'UTC-02:00 · 南乔治亚 / 中大西洋时间' },
    { offset: -60,  en: 'UTC-01:00 · Azores / Cape Verde', zh: 'UTC-01:00 · 亚速尔群岛 / 佛得角' },
    { offset: 0,    en: 'UTC+00:00 · London / Dublin / Lisbon (GMT/UTC)', zh: 'UTC+00:00 · 伦敦 / 都柏林 / 里斯本 (GMT/UTC)' },
    { offset: 60,   en: 'UTC+01:00 · London (BST) / Paris / Berlin / Zurich (CET)', zh: 'UTC+01:00 · 英国夏令时 / 巴黎 / 柏林 / 苏黎世 (CET)' },
    { offset: 120,  en: 'UTC+02:00 · Central Europe Summer (CEST) / Cairo / Athens', zh: 'UTC+02:00 · 欧洲夏令时 (CEST) / 开罗 / 雅典' },
    { offset: 180,  en: 'UTC+03:00 · Riyadh / KAUST / Doha / Moscow / Istanbul', zh: 'UTC+03:00 · 利雅得 (KAUST) / 多哈 / 莫斯科 / 伊斯坦布尔' },
    { offset: 240,  en: 'UTC+04:00 · Abu Dhabi / Dubai (UAE · Host Time)', zh: 'UTC+04:00 · 阿布扎比 / 迪拜 (阿联酋 · 禹陈所在地)' },
    { offset: 300,  en: 'UTC+05:00 · Tashkent / Karachi / Maldives', zh: 'UTC+05:00 · 塔什干 / 卡拉奇 / 马尔代夫' },
    { offset: 330,  en: 'UTC+05:30 · India Standard Time · Mumbai / Bengaluru (IST)', zh: 'UTC+05:30 · 印度标准时间 · 孟买 / 班加罗尔 (IST)' },
    { offset: 360,  en: 'UTC+06:00 · Almaty / Dhaka', zh: 'UTC+06:00 · 阿拉木图 / 达卡' },
    { offset: 420,  en: 'UTC+07:00 · Bangkok / Jakarta / Hanoi (ICT)', zh: 'UTC+07:00 · 曼谷 / 雅加达 / 河内' },
    { offset: 480,  en: 'UTC+08:00 · Beijing / Shanghai / HK / Singapore / Taipei', zh: 'UTC+08:00 · 北京 / 上海 / 香港 / 新加坡 / 台北' },
    { offset: 540,  en: 'UTC+09:00 · Tokyo / Seoul (JST/KST)', zh: 'UTC+09:00 · 东京 / 首尔 (JST/KST)' },
    { offset: 600,  en: 'UTC+10:00 · Sydney / Melbourne / Brisbane (AEST)', zh: 'UTC+10:00 · 悉尼 / 墨尔本 / 布里斯班 (AEST)' },
    { offset: 660,  en: 'UTC+11:00 · Sydney Daylight (AEDT) / Nouméa', zh: 'UTC+11:00 · 悉尼夏令时 (AEDT) / 努美阿' },
    { offset: 720,  en: 'UTC+12:00 · Auckland / Fiji (NZST)', zh: 'UTC+12:00 · 奥克兰 / 斐济 (NZST)' },
    { offset: 780,  en: 'UTC+13:00 · Auckland Daylight (NZDT) / Tonga', zh: 'UTC+13:00 · 新西兰夏令时 (NZDT) / 汤加' },
    { offset: 840,  en: 'UTC+14:00 · Kiritimati / Line Islands', zh: 'UTC+14:00 · 圣诞岛 (莱恩群岛)' }
  ];

  // Auto-detect visitor's local UTC offset & IANA name directly from the browser clock
  var detectedOffsetMin = HOST_OFFSET_MIN;
  var detectedIana = '';
  try {
    detectedOffsetMin = -new Date().getTimezoneOffset();
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      detectedIana = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    }
  } catch (e) {
    detectedOffsetMin = HOST_OFFSET_MIN;
  }

  // Ensure the exact detected offset exists in ALL_TIMEZONES
  if (!ALL_TIMEZONES.some(function (z) { return z.offset === detectedOffsetMin; })) {
    var tag = formatUtcOffset(detectedOffsetMin);
    ALL_TIMEZONES.push({
      offset: detectedOffsetMin,
      en: tag + ' · Local Time' + (detectedIana ? ' (' + detectedIana + ')' : ''),
      zh: tag + ' · 本地时间' + (detectedIana ? ' (' + detectedIana + ')' : '')
    });
    ALL_TIMEZONES.sort(function (a, b) { return a.offset - b.offset; });
  }

  var T = {
    en: {
      badge: 'COFFEE CHAT SCHEDULER',
      hostName: 'Yuchen Li',
      hostSub: 'PhD in Computer Vision · MBZUAI',
      hostTzLabel: 'Abu Dhabi (UTC+4)',
      yourTzLabel: 'Your local time',
      autoDetectedTag: 'Auto-detected from your device',
      changeTzBtn: 'Change time zone ▾',
      modeTitle: '1. Select Meeting Mode',
      onsiteTitle: 'On-site Coffee Chat',
      onsiteSub: 'Abu Dhabi · Open on Weekends (Sat & Sun)',
      onsiteBadge: 'Weekend · UTC+4',
      onlineTitle: 'Online Coffee Chat',
      onlineSub: 'Video Call · Mutual Time Zone Match',
      onlineBadge: 'Mutual Time Zone',
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
        'Google Meet',
        'Zoom Meeting',
        'Tencent Meeting / WeChat',
        'Other (share link in notes)'
      ],
      tzSelectLabel: 'Time Zone (24 Global Time Zones)',
      overlapSame: 'Same time zone as Abu Dhabi (UTC+4).',
      overlapAhead: function (h) { return 'Your time is ' + h + 'h ahead of Abu Dhabi (UTC+4).'; },
      overlapBehind: function (h) { return 'Your time is ' + h + 'h behind Abu Dhabi (UTC+4).'; },
      calTitle: '2. Select a Date',
      onsiteRuleBanner: '☕ On-site coffee chats in Abu Dhabi are open on weekends (Sat & Sun) — afternoon & evening.',
      onlineRuleBanner: '🌐 Afternoon & evening slots (2 PM – 8 PM UTC+4), automatically converted to your local time.',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      slotTitle: '3. Select a Time (Afternoon / Evening)',
      bestBadge: '★ Best Mutual Time',
      abuDhabiTag: 'Abu Dhabi',
      yourTimeTag: 'Your time',
      noSlotsToday: 'Today\'s afternoon/evening slots have passed. Please pick an upcoming date.',
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
      autoEmailHint: 'Instant confirmation: book via Google Calendar invite or send a pre-filled email.',
      submitBtn: 'Confirm Time & Continue →',
      successTitle: 'Time Selected! Choose How to Send:',
      successDesc: 'Pick either option below — both will notify Yuchen (' + getHostEmail() + ') with the exact meeting time:',
      gcalBtn: '📅 Add to Google Calendar & Invite Yuchen (Recommended)',
      gcalHint: 'Creates the event on your calendar and automatically emails a calendar invite to Yuchen.',
      mailtoBtn: '✉️ Send Booking Email via Mail App',
      gmailBtn: '📨 Send via Gmail Web',
      icsBtn: '📥 Download .ics File (Apple / Outlook)',
      copyBtn: '📋 Copy Details',
      copiedBtn: '✓ Copied',
      bgSentNote: '✓ A background notification was also sent to Yuchen\'s inbox.',
      bookAnother: '← Pick another time',
      closeLabel: 'Close scheduler',
      dayShiftNext: '+1d your time',
      dayShiftPrev: '-1d your time'
    },
    zh: {
      badge: 'COFFEE CHAT · 预约系统',
      hostName: '李禹陈 (Yuchen Li)',
      hostSub: 'MBZUAI 计算机视觉博士生 · 阿布扎比',
      hostTzLabel: '阿布扎比时间 (UTC+4)',
      yourTzLabel: '你的本地时间',
      autoDetectedTag: '已自动读取你的设备时间',
      changeTzBtn: '切换其他时区 (24个时区) ▾',
      modeTitle: '1. 选择预约方式',
      onsiteTitle: '阿布扎比线下咖啡 (On-site)',
      onsiteSub: '阿布扎比面聊 · 周末开放 (周六 & 周日)',
      onsiteBadge: '仅周末 · UTC+4',
      onlineTitle: '线上咖啡交流 (Online)',
      onlineSub: '视频会议 · 自动换算双方时区',
      onlineBadge: '智能跨时区',
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
      tzSelectLabel: '选择时区（覆盖全球 24 个标准时区）',
      overlapSame: '你当前与阿布扎比处于同一时区 (UTC+4)。',
      overlapAhead: function (h) { return '你的本地时间比阿布扎比 (UTC+4) 快 ' + h + ' 小时。'; },
      overlapBehind: function (h) { return '你的本地时间比阿布扎比 (UTC+4) 慢 ' + h + ' 小时。'; },
      calTitle: '2. 选择日期',
      onsiteRuleBanner: '☕ 阿布扎比线下咖啡在周末（周六、周日）下午及晚上开放。',
      onlineRuleBanner: '🌐 已自动读取你的本地时间，并与阿布扎比下午/晚上时段（14:00 – 20:00 UTC+4）对齐。',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      slotTitle: '3. 选择时间段（下午 / 晚上）',
      bestBadge: '★ 双方黄金时段',
      abuDhabiTag: '阿布扎比',
      yourTimeTag: '你的本地时间',
      noSlotsToday: '今天的下午/晚上预约时段已过，请在左侧选择后续日期。',
      wkndOnlyHint: '工作日（线下咖啡仅周六、周日开放）',
      formTitle: '填写预约信息',
      changeSlot: '← 修改时间',
      nameLabel: '你的姓名 / 称呼 *',
      namePh: '例如：张同学 / Alex',
      emailLabel: '你的邮箱 *',
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
      autoEmailHint: '毫秒级响应：下一步可直接添加 Google Calendar 邀请或一键发邮件。',
      submitBtn: '确认时间并继续 →',
      successTitle: '时间已锁定！请选择通知方式：',
      successDesc: '任选下方一种方式即可（都会把具体时间发送到禹陈的邮箱 ' + getHostEmail() + '）：',
      gcalBtn: '📅 添加到 Google Calendar 并自动发邀请给禹陈（推荐）',
      gcalHint: '会在你的日历创建日程，并由 Google 自动向禹陈发送带 Yes/No 的日历邀请邮件。',
      mailtoBtn: '✉️ 直接用邮件客户端发预约信',
      gmailBtn: '📨 用 Gmail 网页版发送',
      icsBtn: '📥 下载 .ics 日历文件 (Apple / Outlook)',
      copyBtn: '📋 复制预约信息',
      copiedBtn: '✓ 已复制',
      bgSentNote: '✓ 系统同时已在后台向禹陈发送了一条预约通知备份。',
      bookAnother: '← 重新选择其他时间',
      closeLabel: '关闭预约窗口',
      dayShiftNext: '你的时间 +1天',
      dayShiftPrev: '你的时间 -1天'
    }
  }[zh ? 'zh' : 'en'];

  // ---- Pure Offset-Based Time Math (Fast, Deterministic, 24 Timezones) ----

  function getPartsFromOffset(dateObj, offsetMin) {
    var shifted = new Date(dateObj.getTime() + offsetMin * 60000);
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth(),
      day: shifted.getUTCDate(),
      hour: shifted.getUTCHours(),
      minute: shifted.getUTCMinutes(),
      dow: shifted.getUTCDay()
    };
  }

  function getAbuDhabiNowParts() {
    return getPartsFromOffset(new Date(), HOST_OFFSET_MIN);
  }

  function abuDhabiToDate(year, month, day, hour, minute) {
    return new Date(Date.UTC(year, month, day, hour - 4, minute || 0, 0));
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
      return y + '-' + pad2(m + 1) + '-' + pad2(d);
    }
  }

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
    mode: 'onsite',                   // 'onsite' (weekend in Abu Dhabi) or 'online' (mutual TZ)
    duration: 30,                     // 30 or 60 minutes
    location: T.locations[0],
    platform: T.platforms[0],
    visitorOffsetMin: detectedOffsetMin, // auto-read from user's device clock!
    tzPickerExpanded: false,
    use12h: true,                     // default to clear 2:00 PM / 4:00 PM / 6:00 PM / 8:00 PM display
    viewYear: nowAD.year,
    viewMonth: nowAD.month,
    selectedYear: nowAD.year,
    selectedMonth: nowAD.month,
    selectedDay: nowAD.day,
    selectedSlot: null,
    step: 'pick',                     // 'pick' | 'form' | 'done'
    topic: 'research',
    lastBooking: null
  };

  function isDateSelectable(y, m, d, mode) {
    var todayAD = getAbuDhabiNowParts();
    var targetVal = y * 10000 + m * 100 + d;
    var todayVal = todayAD.year * 10000 + todayAD.month * 100 + todayAD.day;
    if (targetVal < todayVal) return false;

    var dow = new Date(Date.UTC(y, m, d, 12, 0, 0)).getUTCDay();
    if (mode === 'onsite') {
      return dow === 0 || dow === 6; // Saturday & Sunday in Abu Dhabi
    }
    return true;
  }

  function ensureValidSelectedDate() {
    if (isDateSelectable(state.selectedYear, state.selectedMonth, state.selectedDay, state.mode)) {
      if (getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay).length > 0) {
        return;
      }
    }
    var base = new Date(Date.UTC(nowAD.year, nowAD.month, nowAD.day, 12, 0, 0));
    for (var i = 0; i < 21; i++) {
      var cand = new Date(base.getTime() + i * 86400000);
      var cy = cand.getUTCFullYear();
      var cm = cand.getUTCMonth();
      var cd = cand.getUTCDate();
      if (isDateSelectable(cy, cm, cd, state.mode) && getSlotsForDate(cy, cm, cd).length > 0) {
        state.selectedYear = cy;
        state.selectedMonth = cm;
        state.selectedDay = cd;
        state.viewYear = cy;
        state.viewMonth = cm;
        return;
      }
    }
  }

  // Core afternoon/evening slots in Abu Dhabi (UTC+4): 2:00 PM, 4:00 PM, 6:00 PM, 8:00 PM
  var CORE_SLOTS = [
    { h: 14, min: 0, tag_en: '2:00 PM · Afternoon Coffee', tag_zh: '下午 2:00 · 午后咖啡' },
    { h: 16, min: 0, tag_en: '4:00 PM · Late Afternoon', tag_zh: '下午 4:00 · 下午茶歇' },
    { h: 18, min: 0, tag_en: '6:00 PM · Evening Chat', tag_zh: '下午 6:00 · 傍晚交流' },
    { h: 20, min: 0, tag_en: '8:00 PM · Night Coffee', tag_zh: '晚上 8:00 · 晚间咖啡' }
  ];

  function getSlotsForDate(y, m, d) {
    var nowMs = Date.now();
    var results = [];

    for (var i = 0; i < CORE_SLOTS.length; i++) {
      var s = CORE_SLOTS[i];
      var startUtc = abuDhabiToDate(y, m, d, s.h, s.min);
      if (startUtc.getTime() < nowMs + 900000) continue; // skip past slots

      var endUtc = new Date(startUtc.getTime() + state.duration * 60000);
      var visParts = getPartsFromOffset(startUtc, state.visitorOffsetMin);
      var visDecimal = visParts.hour + visParts.minute / 60;

      // Best mutual overlap: when visitor's local time is between 08:30 and 22:30
      var isSweet = visDecimal >= 8.5 && visDecimal <= 22.5;

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
        isSweet: isSweet,
        dayDiff: dayDiff
      });
    }
    return results;
  }

  ensureValidSelectedDate();

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
        // Left sidebar
        '<aside class="cchat-side">' +
          '<div class="cchat-badge"><span class="cchat-dot"></span>' + T.badge + '</div>' +
          '<div class="cchat-host">' +
            '<div class="cchat-avatar">YL</div>' +
            '<div>' +
              '<div class="cchat-host-name">' + T.hostName + '</div>' +
              '<div class="cchat-host-sub">' + T.hostSub + '</div>' +
            '</div>' +
          '</div>' +
          // Live Dual Clocks + Auto-detected Local Time
          '<div class="cchat-clocks">' +
            '<div class="cchat-clock-row">' +
              '<span class="cchat-clock-label">🇦🇪 ' + T.hostTzLabel + '</span>' +
              '<strong class="cchat-clock-val" id="cchat-clock-ad">--:--</strong>' +
            '</div>' +
            '<div class="cchat-clock-row">' +
              '<span class="cchat-clock-label">🕒 ' + T.yourTzLabel + '</span>' +
              '<strong class="cchat-clock-val" id="cchat-clock-vis">--:--</strong>' +
            '</div>' +
            '<div class="cchat-tz-auto-bar">' +
              '<span class="cchat-tz-diff" id="cchat-tz-diff"></span>' +
              '<button type="button" class="cchat-tz-toggle-btn" id="cchat-tz-toggle-btn">' + T.changeTzBtn + '</button>' +
            '</div>' +
            '<div class="cchat-tz-Manual" id="cchat-tz-manual" style="display:none">' +
              '<label class="cchat-mini-label" for="cchat-tz-select">' + T.tzSelectLabel + '</label>' +
              '<select id="cchat-tz-select" class="cchat-select"></select>' +
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
              '<div class="cchat-dur-group cchat-dur-two" id="cchat-dur-group">' +
                '<button type="button" class="cchat-dur-btn is-active" data-dur="30">30 min</button>' +
                '<button type="button" class="cchat-dur-btn" data-dur="60">60 min</button>' +
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
          '</div>' +
        '</aside>' +
        // Main right area
        '<div class="cchat-main">' +
          '<div class="cchat-rule-banner" id="cchat-rule-banner"></div>' +
          // Step 1: Calendar + 4 Afternoon/Evening Slots
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
                  '<button type="button" class="cchat-tool-btn" id="cchat-fmt-toggle">12h</button>' +
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
              '<textarea id="cchat-in-notes" class="cchat-textarea" rows="2" placeholder="' + T.notesPh + '"></textarea>' +
            '</div>' +
            '<div class="cchat-form-foot">' +
              '<span class="cchat-auto-hint">⚡ ' + T.autoEmailHint + '</span>' +
              '<button type="submit" class="cchat-submit-btn" id="cchat-submit-btn">' + T.submitBtn + '</button>' +
            '</div>' +
          '</form>' +
          // Step 3: Instant Confirmation & 1-Click Calendar / Email
          '<div class="cchat-step-done" id="cchat-step-done" style="display:none">' +
            '<div class="cchat-done-ic">☕✓</div>' +
            '<h3 class="cchat-done-title">' + T.successTitle + '</h3>' +
            '<p class="cchat-done-sub">' + T.successDesc + '</p>' +
            '<div class="cchat-done-box" id="cchat-done-box"></div>' +
            '<div class="cchat-done-primary-wrap">' +
              '<a id="cchat-act-gcal" class="cchat-action-btn is-primary is-big" target="_blank" rel="noopener">' + T.gcalBtn + '</a>' +
              '<div class="cchat-gcal-hint">' + T.gcalHint + '</div>' +
            '</div>' +
            '<div class="cchat-done-actions">' +
              '<a id="cchat-act-mailto" class="cchat-action-btn">' + T.mailtoBtn + '</a>' +
              '<a id="cchat-act-gmail" class="cchat-action-btn" target="_blank" rel="noopener">' + T.gmailBtn + '</a>' +
              '<button type="button" id="cchat-act-ics" class="cchat-action-btn">' + T.icsBtn + '</button>' +
              '<button type="button" id="cchat-act-copy" class="cchat-action-btn">' + T.copyBtn + '</button>' +
            '</div>' +
            '<div class="cchat-bg-note" id="cchat-bg-note">' + T.bgSentNote + '</div>' +
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
  ALL_TIMEZONES.forEach(function (tz) {
    var opt = document.createElement('option');
    opt.value = String(tz.offset);
    opt.textContent = zh ? tz.zh : tz.en;
    if (tz.offset === state.visitorOffsetMin) opt.selected = true;
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

  // ---- Live Clocks (Reads User's Real Device Time Directly) ----
  function updateClocks() {
    var now = new Date();
    var adP = getPartsFromOffset(now, HOST_OFFSET_MIN);
    var visP = getPartsFromOffset(now, state.visitorOffsetMin);
    var adEl = document.getElementById('cchat-clock-ad');
    var visEl = document.getElementById('cchat-clock-vis');
    if (adEl) adEl.textContent = formatHM(adP.hour, adP.minute, state.use12h);
    if (visEl) {
      visEl.textContent =
        formatHM(visP.hour, visP.minute, state.use12h) +
        ' (' + formatUtcOffset(state.visitorOffsetMin) + ')';
    }
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

    var diffH = Math.round(((state.visitorOffsetMin - HOST_OFFSET_MIN) / 60) * 2) / 2;
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

    var fmtBtn = document.getElementById('cchat-fmt-toggle');
    fmtBtn.textContent = state.use12h ? '12h (PM)' : '24h';

    var listEl = document.getElementById('cchat-slots-list');
    listEl.innerHTML = '';

    var slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);
    if (!slots.length) {
      var emptyMsg = document.createElement('div');
      emptyMsg.className = 'cchat-slots-empty';
      emptyMsg.textContent = T.noSlotsToday;
      listEl.appendChild(emptyMsg);
      return;
    }

    var visTzTag = formatUtcOffset(state.visitorOffsetMin);

    slots.forEach(function (sl) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cchat-slot-btn' + (sl.isSweet ? ' is-sweet' : '');

      var adStr = formatHM(sl.adHour, sl.adMinute, state.use12h);
      var visStr = formatHM(sl.visParts.hour, sl.visParts.minute, state.use12h);
      var shiftBadge = '';
      if (sl.dayDiff > 0) shiftBadge = ' <em class="cchat-shift">(' + T.dayShiftNext + ')</em>';
      else if (sl.dayDiff < 0) shiftBadge = ' <em class="cchat-shift">(' + T.dayShiftPrev + ')</em>';

      if (state.mode === 'onsite') {
        btn.innerHTML =
          '<div class="cchat-slot-main">' +
            '<span class="cchat-slot-primary">' + adStr + ' <small>UTC+4</small></span>' +
            '<span class="cchat-slot-tag">' + sl.tag + '</span>' +
          '</div>' +
          (state.visitorOffsetMin !== HOST_OFFSET_MIN
            ? '<div class="cchat-slot-sub">🕒 ' + T.yourTimeTag + ' (' + visTzTag + '): ' + visStr + shiftBadge + '</div>'
            : '');
      } else {
        btn.innerHTML =
          '<div class="cchat-slot-main">' +
            '<span class="cchat-slot-primary">' + visStr + ' <small>' + visTzTag + '</small>' + shiftBadge + '</span>' +
            (sl.isSweet ? '<span class="cchat-sweet-pill">' + T.bestBadge + '</span>' : '') +
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
    var endADParts = getPartsFromOffset(sl.endUtc, HOST_OFFSET_MIN);
    var adEnd = formatHM(endADParts.hour, endADParts.minute, state.use12h);

    var visStart = formatHM(sl.visParts.hour, sl.visParts.minute, state.use12h);
    var visEndParts = getPartsFromOffset(sl.endUtc, state.visitorOffsetMin);
    var visEnd = formatHM(visEndParts.hour, visEndParts.minute, state.use12h);
    var visDateStr = formatReadableDate(sl.visParts.year, sl.visParts.month, sl.visParts.day);
    var visTzTag = formatUtcOffset(state.visitorOffsetMin);

    return {
      dateStrAD: dateStrAD,
      adRange: adStart + ' – ' + adEnd + ' (Abu Dhabi · UTC+4)',
      visRange: visDateStr + ', ' + visStart + ' – ' + visEnd + ' (' + visTzTag + ')',
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
      (state.visitorOffsetMin !== HOST_OFFSET_MIN ? '<div>🕒 ' + T.yourTimeTag + ': <b>' + info.visRange + '</b></div>' : '');
    showStep('form');
  }

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

  // Handle Booking Form Submission — INSTANT (0ms wait!)
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

    // 1. Immediately render confirmation screen (0ms delay!)
    document.getElementById('cchat-done-box').innerHTML =
      '<div><strong>' + booking.subject + '</strong></div>' +
      '<div>🇦🇪 ' + booking.info.dateStrAD + ' · ' + booking.info.adRange + '</div>' +
      '<div>🕒 ' + booking.info.visRange + '</div>' +
      '<div>📍 ' + booking.info.where + '</div>';

    document.getElementById('cchat-act-gcal').href = booking.gcalUrl;
    document.getElementById('cchat-act-mailto').href = booking.mailtoUrl;
    document.getElementById('cchat-act-gmail').href = booking.gmailUrl;

    showStep('done');

    // 2. Fire non-blocking background email notification so the UI never waits
    try {
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (err) {}
  });

  // ---- Interactive Controls & Event Listeners ----
  document.getElementById('cchat-tz-toggle-btn').addEventListener('click', function () {
    state.tzPickerExpanded = !state.tzPickerExpanded;
    document.getElementById('cchat-tz-manual').style.display = state.tzPickerExpanded ? '' : 'none';
  });

  Array.prototype.forEach.call(modal.querySelectorAll('.cchat-mode-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-mode');
      if (m === state.mode) return;
      state.mode = m;
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
    state.visitorOffsetMin = parseInt(tzSelect.value, 10);
    updateClocks();
    renderSidebarMeta();
    renderSlots();
    if (state.step === 'form' && state.selectedSlot) {
      state.selectedSlot.visParts = getPartsFromOffset(state.selectedSlot.startUtc, state.visitorOffsetMin);
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

  Array.prototype.forEach.call(document.querySelectorAll('.js-coffee-trigger'), function (trig) {
    trig.addEventListener('click', function (e) {
      e.preventDefault();
      var pill = e.target.closest('[data-coffee-mode]');
      var mode = pill ? pill.getAttribute('data-coffee-mode') : null;
      openScheduler(mode);
    });
  });

  if (window.location.hash === '#coffee-chat') {
    setTimeout(function () { openScheduler(); }, 250);
  }
})();
