#!/usr/bin/env python3
"""One-off: English titles / outlets for the Chinese-language items in data/press.json,
and Chinese words removed from the English-facing fields. Quoted evidence (ev_en) keeps
the original Chinese on purpose — it is the verbatim proof — and is shown as such.
Run from the repo root: python3 scripts/press_en.py
"""
import json, pathlib

P = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'press.json'
d = json.loads(P.read_text())

T = {  # id: (title_en, outlet_en)
 'm1': ('Perceptio: a perception-enhanced VLM that first works out what is near and far, then answers', 'Zhihu column · Nanxiaohuan (his own account)'),
 'm2': ('Real stories of AI and people on film | 72-Hour AI Survival Challenge', 'Tencent News · 5Y Capital'),
 'm3': ('72-Hour AI Survival Challenge | An AI PhD\'s 72 hours', 'Bilibili · 5Y Capital'),
 'm4': ('72-Hour AI Survival Challenge: what happened?', '36Kr · 5Y Capital'),
 'm5': ('72 hours, fully documented: humans\' first close encounter with AI', '36Kr · Chen Zhiyan'),
 'm6': ('72-Hour AI Survival Challenge trailer | Three days relying only on AI — what did they go through?', 'Bilibili · 5Y Capital'),
 'm7': ('Ep. 07 — Studying in the Middle East: funded by the sheikhs, no tuition, and paid to study', 'DeepMENA podcast'),
 'm8': ('NextCapital\'s notes on going global in the Middle East: "economic transformation" and "ambitious narratives"', 'NextCapital · WeChat'),
 'm9': ('Dubai Business Associate Li Yuchen on the Middle East 2030 vision — opportunities and challenges for Chinese founders | NextCapital founder salon #202 recap', 'NextCapital'),
 'm10': ('7 Dec: opportunities for young people in the Middle East — startups, study, Chinese, Arab and Western companies | NextCapital founder salon #202', 'NextCapital'),
 'm11': ('How SUSTech students and staff spent the double holiday', 'SUSTech · official WeChat'),
 'm12': ('Dubai Business Associates | A thank-you letter from the Shenzhen associates of Year 8', 'Shenzhen Foundation for International Exchange and Cooperation (SFIEC)'),
 'm13': ('DBA global selection announced: three talents with Shenzhen backgrounds selected', 'SFIEC · WeChat'),
 'm14': ('National Day reunion: what is life like for students abroad? | "Houlang Chat Room" — Let\'s chat!', 'Bilibili · TechBeat AI Community (Jiangmen Ventures)'),
 'c1': ('Word is the rescue team turns out outstanding graduates', 'SUSTech Emergency Rescue Team · WeChat'),
 'c2': ('Department of CSE class-of-2021 graduation night and alumni association launch', 'SUSTech Dept. of Computer Science · WeChat'),
 'c3': ('Outstanding CS graduates | Luo Yunsheng: "less slacking, more striving"', 'SUSTech Dept. of Computer Science · WeChat'),
 'c4': ('Zhiren College class-of-2021 outstanding graduates announced', 'SUSTech Zhiren College · WeChat'),
 'c5': ('Emergency Rescue Team: first general assembly', 'SUSTech Emergency Rescue Team · WeChat'),
 'c6': ('Zhiren College 2018 graduation night: four years cannot hold all our memories', 'SUSTech Zhiren College · WeChat'),
 'c7': ('Student self-management council handover recap', 'SUSTech Zhiren College · WeChat'),
 'c8': ('News | Emergency Rescue Team elects its new council', 'SUSTech Youth League · WeChat'),
 'c9': ('We take team-building seriously!', 'SUSTech Zhiren College · WeChat'),
 'c10': ('Zhiren family night: capturing the good moments', 'SUSTech Zhiren College · WeChat'),
 'c11': ('Ding! Your new student-council members have arrived', 'SUSTech Zhiren College · WeChat'),
 'c12': ('4 more photo & editing credits (Sep–Nov 2017)', 'Zhiren College / Emergency Rescue Team · WeChat'),
 'n1': ('WAVES 2025: riding the waves in a new era of venture', '36Kr · official WeChat'),
 'n2': ('"I, the Dubai Prince, have shaken hands with a sheikh"', 'Bilibili · Waves (36Kr)'),
 'n3': ('At Waves Liangzhu: young people who refuse to be defined', 'Freelancer Quanquan · WeChat'),
 'n4': ('100 creators and student founders stay for free: Recharge Programme, season 2', 'NCC community (Link Island) · WeChat'),
 'n5': ('72-Hour AI Survival Challenge | An AI PhD\'s 72 hours', 'rednote · 5Y Capital'),
 'n6': ('Dubai Business Associate Li Yuchen on the Middle East 2030 vision — opportunities and challenges for Chinese founders', 'Bilibili · NextCapital Business Review'),
 'n7': ('Seniors are here! Study-abroad dos and don\'ts', 'SUSTech Global · WeChat'),
 'x_03bc44': ('What is it like to drive a go-kart through the streets? (POV)', 'rednote · Dubai Prince · video'),
 'x_00ef32': ('Turns out an executive earning nine figures a year went to my school 😅', 'rednote · Dubai Prince'),
 'x_01796c': ('Take on only what you can deliver — if your boss doesn\'t get tech but loves to direct, run', 'rednote · Dubai Prince'),
 'x_000363': ('I got an offer from the Ruler of Dubai (DBA)', 'rednote · Dubai Prince'),
 'x_021be4': ('The Gulf money-making guide the Ruler of Dubai paid a Rolls-Royce to teach me — all of it, today', 'rednote · Dubai Prince'),
 'x_01edb2': ('CXMT is hiring engineers en masse — degrees matter more than majors; PhDs from top schools in demand', 'rednote · Dubai Prince'),
 'x_012921': ('Only about 2,000 computer-science PhDs graduate in the US each year', 'rednote · Dubai Prince'),
 'x_01eca5': ('Where are the informatics-olympiad stars now? Hefei edition', 'rednote · Dubai Prince'),
 'x_00b5e2': ('No wonder everyone wants to intern at NVIDIA — Jensen grills BBQ at the intern party', 'rednote · Dubai Prince'),
 'x_013c73': ('Cambridge machine-learning summer school, free — why not go all in?', 'rednote · Dubai Prince'),
 'x_004f7c': ('Graphics researcher Lingqi Yan is coming to teach in the Middle East', 'rednote · Dubai Prince'),
 'x_029f55': ('Half of China\'s investors are here today', 'rednote · Dubai Prince'),
 'x_038412': ('UAE / Dubai bank-card perks: the 2023 guide', 'rednote · Dubai Prince'),
 'x_03e86a': ('Where AI PhDs should go: OpenAI ≥ DeepMind ≥ Anthropic > MS', 'rednote · Dubai Prince'),
 'x_00c3c7': ('What happened to people who turned down US top-10 offers for a CS PhD in the Middle East? (KAUST)', 'rednote · Dubai Prince'),
 'x_00d5cd': ('Studying in the Middle East: funded by the sheikhs, no tuition, and paid to study!', 'rednote · Dubai Prince'),
 'x_004875': ('Shenzhen meetup | Go to the Middle East! A new option for young Chinese', 'rednote · Dubai Prince'),
 'x_02c4f4': ('🇨🇳 Hefei edition: I buy coffee for 100 strangers ☕️', 'rednote · Dubai Prince'),
 'z_369241705': ('Which Chinese university has the best physics department — PKU, Tsinghua or USTC?', 'Zhihu answer · Nanxiaohuan'),
 'z_334668070': ('Who does better at university: olympiad admits or gaokao top scorers?', 'Zhihu answer · Nanxiaohuan'),
 'z_1914363103': ('How do Point Transformer and Point Cloud Transformer compare?', 'Zhihu answer · Nanxiaohuan'),
 'z_1987105555': ('After two doses of Sinovac, can I get Pfizer?', 'Zhihu answer · Nanxiaohuan'),
 'z_598338492': ('What to make of 2014 IPhO gold medallist Xu Xiaoyu joining Citadel?', 'Zhihu answer · Nanxiaohuan'),
 'z_447005221': ('Why have HIT Shenzhen\'s admission ranks surged across provinces?', 'Zhihu answer · Nanxiaohuan'),
 'z_2863224977': ('What do you think of PointNeXt?', 'Zhihu answer · Nanxiaohuan'),
 'z_1912935613': ('How much do KAUST PhD graduates earn in Saudi Arabia (or back in China)?', 'Zhihu answer · Nanxiaohuan'),
 'z_1778272050': ('Where did SUSTech CS class of 2021 go after graduation?', 'Zhihu answer · Nanxiaohuan'),
 'z_a584719447': ('PointNeXt: revisiting PointNet++ with improved training and scaling strategies (Chinese write-up)', 'Zhihu column · Nanxiaohuan'),
 'z_a370777840': ('[Hiring] KAUST Vision-CAIR is recruiting CV postdocs, scientists and visiting scholars — please share', 'Zhihu column · Nanxiaohuan'),
 'p1': ('2017 gaokao results: 99.4% of Hefei No. 8 students reach the undergraduate line, 92.3% the first tier', 'Hefei No. 8 High School · WeChat'),
 'p2': ('Grade office | Physics olympiad success brings autumn honours to No. 8', 'Hefei No. 8 High School · WeChat'),
}

S = {  # Chinese fragments inside English summaries
 'his own Zhihu account 南小环': 'his own Zhihu account Nanxiaohuan',
 'host 徐皓天': 'host Xu Haotian', 'rednote ID 迪拜王子': 'rednote ID "Dubai Prince"',
 'Wing Go CTO 程颢 and Pixeltra co-founder 王启州': 'Wing Go CTO Cheng Hao and Pixeltra co-founder Wang Qizhou',
 "from 将门 TechBeat's": "from TechBeat (Jiangmen Ventures)'s",
 'Photo credit: 李禹陈、温林锋': 'Photo credit: Li Yuchen and Wen Linfeng',
 'recognised as 良好/称职部员': 'recognised as "good / competent" members',
 'captain 栾闻迪, … publicity head 李禹陈': 'captain Luan Wendi, … publicity head Li Yuchen',
 'copy credited to 常成 and 李禹陈': 'copy credited to Chang Cheng and Li Yuchen',
 'among the photographers (摄影)': 'among the photographers',
 'the publicity department (宣传部)': 'the publicity department',
 "'Let's WAVES · 00后之夜' talk show": "'Let's WAVES · Gen-Z night' talk show",
 "36Kr's 暗涌Waves channel": "36Kr's Waves channel",
 '"Arm许 who builds AI memoirs': '"Arm Xu who builds AI memoirs',
 'Companion note to the 掘金中东 podcast episode (m7).': 'Companion note to the DeepMENA podcast episode (m7).',
 'with 斑马星球:': 'with Zebra Planet:',
 "('沙特王子爱学习' and Guocheng Qian)": "('Saudi Prince Loves Learning' and Guocheng Qian)",
 'Under 学科竞赛 · 省级一等奖 · 物理 (5 students): 费浩旻 李禹陈 李玉辉 张易中 周辛宁.': 'Under academic competitions · provincial first prize · physics (5 students): Fei Haomin, Li Yuchen, Li Yuhui, Zhang Yizhong, Zhou Xinning.',
 'including 李禹陈, won': 'including Li Yuchen, won',
}
c12 = "Four posts: 'We met a fake team-building?' (09-26, photo) · 'Red Cross first-aid training completed!' (10-16, photo) · 'The national-scholarship legends are here!' (10-17, post-production) · 'More than GRE — Uncle Qi's GRE talk' (11-28, photo). Open via Sogou WeChat search."

L = {'小红书版 (五源资本)': 'rednote version (5Y Capital)', '今日头条 mirror': 'Toutiao mirror', '小宇宙': 'Xiaoyuzhou',
     '看中东 DeepMENA 公众号 (05-14)': 'DeepMENA WeChat (05-14)', '公众号版': 'WeChat version', '公众号 (12-06)': 'WeChat (12-06)',
     '公众号「迪拜留学」转载 (08-08)': 'Repost by "Study in Dubai" WeChat (08-08)', '将门创投 公众号 (10-01)': 'Jiangmen Ventures WeChat (10-01)',
     '文字实录': 'Transcript'}

n = 0
for it in d['items']:
    if it['id'] in T:
        it['title_en'], it['outlet_en'] = T[it['id']]; n += 1
    s = it.get('sum_en', '')
    for a, b in S.items():
        s = s.replace(a, b)
    if it['id'] == 'c12':
        s = c12
    it['sum_en'] = s
    for l in it.get('links', []):
        if l['l'] in L:
            l['l_en'] = L[l['l']]

HC = {'m5': '72 hours, fully documented: humans\' first close encounter with AI',
      'm9': 'Dubai Business Associate Li Yuchen on the Middle East 2030 vision',
      'm7': 'Ep. 07 — Studying in the Middle East: funded by the sheikhs, no tuition, and paid to study!'}
for c in d['home_cards']:
    if c['ref'] in HC: c['title_en'] = HC[c['ref']]
    c['blurb_en'] = c['blurb_en'].replace('Guest on 掘金中东,', 'Guest on the DeepMENA podcast,')
for t in d['talks']:
    t['venue_en'] = (t['venue_en'].replace('Shenzhen, with 斑马星球', 'Shenzhen, with Zebra Planet')
                     .replace('掘金中东 · DeepMENA', 'DeepMENA podcast').replace('TechBeat (将门)', 'TechBeat (Jiangmen Ventures)'))
    t['title_en'] = t['title_en'].replace('“后浪聊天室”', '“Houlang Chat Room”')
VT = {'m3': '72-Hour AI Survival Challenge | An AI PhD\'s 72 hours',
      'n2': '"I, the Dubai Prince, have shaken hands with a sheikh" — stand-up',
      'n6': 'Li Yuchen on the Middle East 2030 vision — opportunities for Chinese founders',
      'm14': 'National Day: what is life like for students abroad? | Houlang Chat Room'}
for v in d['videos']:
    if v['ref'] in VT: v['title_en'] = VT[v['ref']]
for a in d['accounts']:
    if a['key'] == 'xhs': a['label_en'], a['handle_en'] = 'rednote (Xiaohongshu)', 'Dubai Prince · DubaiPrince'
    if a['key'] == 'zhihu': a['label_en'], a['handle_en'] = 'Zhihu', 'Nanxiaohuan'

P.write_text(json.dumps(d, indent=1, ensure_ascii=False) + '\n')
print('titles', n, 'of', sum(1 for i in d['items'] if i['lang'] != 'en'))
missing = [v['ref'] for v in d['videos'] if 'title_en' not in v]
print('videos missing', missing)
