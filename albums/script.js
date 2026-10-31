/**
 * PHOTO ARCHIVE — INTERACTIVE 3D PHOTO ALBUM SHELF
 * Vanilla JS · CSS 3D Transforms · Web Animations API · Scroll-Driven Parallax
 */

const albums = [
  {
    id: "petra-jordan",
    vol: "01",
    title: "Rose-Red Petra",
    titleZh: "约旦 · 佩特拉卡兹尼神殿",
    category: "TRAVEL",
    location: "PETRA / JORDAN",
    locationZh: "约旦 佩特拉",
    year: "2021",
    coordinates: "30.3285° N, 35.4444° E",
    cover: "assets/photos/jordan-petra.jpg",
    coverStyle: "editorial",
    spineColor: "#7A3E2E",
    introEn: "Emerging from the narrow, winding chasm of the Siq, the rose-red sandstone facade of Al-Khazneh appears like an ancient mirage carved directly into the desert cliffside. A week traversing Aqaba, Petra, and Amman across the Levantine desert.",
    introZh: "穿过狭窄幽深的蛇道（Siq），玫瑰红色的卡兹尼神殿从砂岩峭壁间豁然显现。一周时间横跨亚喀巴、佩特拉与安曼，在骆驼铃声与千年岩壁之间记录下中东古文明的壮阔回响。",
    quote: "Carved into rose-red cliffside, time stands still where the canyon opens to the sun.",
    photos: [
      {
        src: "assets/photos/jordan-petra.jpg",
        title: "Before the Treasury (Al-Khazneh)",
        description: "Petra Archaeological Park, Jordan · Camel caravan before the Nabataean facade (Dec 2021)"
      },
      {
        src: "assets/photos/egypt-giza-pyramids.jpg",
        title: "Across the Red Sea — Giza Plateau",
        description: "Cairo, Egypt · Perspective by the Great Pyramid of Khufu"
      },
      {
        src: "assets/photos/city-alexandria.jpg",
        title: "Levantine & Mediterranean Horizon",
        description: "Eastern Mediterranean coast · Corniche light at dusk"
      },
      {
        src: "assets/photos/lebanon-anjar-school.jpg",
        title: "Bekaa Valley — Anjar",
        description: "Anjar, Lebanon · Community & school visit in the historic valley"
      }
    ]
  },
  {
    id: "dubai-marina-yacht",
    vol: "02",
    title: "Helm at Dubai Marina",
    titleZh: "阿联酋 · 迪拜游艇出海与世博纪行",
    category: "MOMENTS",
    location: "DUBAI / UAE",
    locationZh: "阿联酋 迪拜",
    year: "2021",
    coordinates: "25.0805° N, 55.1403° E",
    cover: "assets/photos/uae-dubai-yacht.jpg",
    coverStyle: "cloth",
    spineColor: "#1C3A63",
    introEn: "Taking the helm out of Dubai Marina into the Arabian Gulf during the winter of Expo 2020. Between supertall glass towers and warm turquoise water, life in the Emirates blends futuristic ambition with open-sea serenity.",
    introZh: "2020 迪拜世博会期间自迪拜码头乘游艇出海。手握船舵驶向阿拉伯湾，身后是摩天大楼林立的天际线，眼前是海湾冬日温润的碧波与阳光。",
    quote: "Between vertical glass and open Gulf water, every horizon feels newly minted.",
    photos: [
      {
        src: "assets/photos/uae-dubai-yacht.jpg",
        title: "At the Helm — Dubai Marina",
        description: "Dubai, UAE · Yacht excursion off the Marina skyline (Dec 2021)"
      },
      {
        src: "assets/photos/city-dubai.jpg",
        title: "Downtown Spire & Desert Light",
        description: "Dubai, UAE · Architectural silhouette above the clouds"
      },
      {
        src: "assets/photos/city-abu-dhabi.jpg",
        title: "Capital Waters — Abu Dhabi",
        description: "Abu Dhabi, UAE · Home base along the mangrove and corniche"
      },
      {
        src: "assets/photos/bahrain-manama.jpg",
        title: "Gulf Neighbor — Manama Waterfront",
        description: "Manama, Bahrain · Contemporary Gulf architecture by the sea"
      }
    ]
  },
  {
    id: "fuji-perspective",
    vol: "03",
    title: "Fujiyoshida Perspective",
    titleZh: "日本 · 富士山街景与东海道纪行",
    category: "CITY",
    location: "MT. FUJI & TOKYO / JAPAN",
    locationZh: "日本 富士山与东京",
    year: "2024",
    coordinates: "35.4925° N, 138.8041° E",
    cover: "assets/photos/japan-mount-fuji-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#24364D",
    introEn: "Looking down the quiet shopfronts and overhead utility lines of Fujiyoshida toward the snow-crowned cone of Mount Fuji. A journey through Tokyo, Kyoto, and the foothills of Yamanashi exploring the dialogue between everyday streetscapes and sacred geography.",
    introZh: "顺着吉田本町安静的街巷与交错的电线望去，雪顶富士山在尽头巍然矗立。穿行于东京、京都与富士山麓，在日常街景与自然圣山之间捕捉日本独特的秩序与诗意。",
    quote: "Overhead wires and quiet shopfronts frame the mountain that anchors a nation's gaze.",
    photos: [
      {
        src: "assets/photos/japan-mount-fuji.jpg",
        title: "Honcho Street Toward Mount Fuji",
        description: "Fujiyoshida, Japan · Snow-capped summit at the end of the avenue (2024)"
      },
      {
        src: "assets/photos/city-tokyo.jpg",
        title: "Metropolis After Rain — Tokyo",
        description: "Tokyo, Japan · Dense urban grid glowing into twilight"
      },
      {
        src: "assets/photos/city-kobe.jpg",
        title: "Kansai Harbor Light",
        description: "Kobe & Kyoto corridor · Port reflections at dusk"
      },
      {
        src: "assets/photos/city-sapporo.jpg",
        title: "Northern Lanterns — Hokkaido",
        description: "Sapporo, Japan · Evening glow across the northern boulevard"
      },
      {
        src: "assets/photos/city-asahikawa.jpg",
        title: "Winter Geometry — Asahikawa",
        description: "Hokkaido, Japan · Crisp alpine air and quiet northern streets"
      }
    ]
  },
  {
    id: "samarkand-azure",
    vol: "04",
    title: "Samarkand Azure",
    titleZh: "乌兹别克斯坦 · 撒马尔罕与布哈拉",
    category: "TRAVEL",
    location: "SAMARKAND / UZBEKISTAN",
    locationZh: "乌兹别克斯坦 撒马尔罕",
    year: "2023",
    coordinates: "39.6548° N, 66.9758° E",
    cover: "assets/photos/uzbekistan-samarkand-cover.jpg",
    coverStyle: "bleed",
    spineColor: "#1E5B63",
    introEn: "Along the ancient Silk Road through Samarkand and Bukhara, glazed majolica tiles in cobalt, turquoise, and lapis lazuli catch the high Central Asian sun. Monumental madrasah portals and ribbed domes stand as living manuscripts of Timurid geometry.",
    introZh: "沿着古老丝绸之路走入撒马尔罕与布哈拉，钴蓝、松石绿与青金石色的釉面瓷砖在中亚澄澈的阳光下熠熠生辉。宏伟的经学院拱门与肋状穹顶，将帖木儿王朝的几何美学凝固成永恒。",
    quote: "Every turquoise dome is a verse of geometry written against the steppe sky.",
    photos: [
      {
        src: "assets/photos/uzbekistan-samarkand.jpg",
        title: "Timurid Turquoise — Samarkand Madrasah",
        description: "Samarkand, Uzbekistan · Intricate glazed tilework and iwan arches (Feb 2023)"
      },
      {
        src: "assets/photos/kazakhstan-almaty.jpg",
        title: "Northern Silk Road — Almaty in Snow",
        description: "Almaty, Kazakhstan · Ascension Cathedral in Panfilov Park"
      },
      {
        src: "assets/photos/azerbaijan-baku.jpg",
        title: "Caspian Crossroads — Old Baku",
        description: "Baku, Azerbaijan · Cobblestone alleys of Icherisheher"
      },
      {
        src: "assets/photos/armenia-yerevan-attire.jpg",
        title: "Highland Heritage — Yerevan",
        description: "Yerevan, Armenia · Traditional woven velvet attire"
      }
    ]
  },
  {
    id: "doha-desert-rose",
    vol: "05",
    title: "Desert Rose of Doha",
    titleZh: "卡塔尔 · 多哈国家博物馆",
    category: "CITY",
    location: "DOHA / QATAR",
    locationZh: "卡塔尔 多哈",
    year: "2022",
    coordinates: "25.2954° N, 51.5492° E",
    cover: "assets/photos/qatar-doha-museum-cover.jpg",
    coverStyle: "cloth",
    spineColor: "#631D32",
    introEn: "Wearing traditional blue-and-white Chinese hanfu before Jean Nouvel's interlocking disc architecture at the National Museum of Qatar. Inspired by crystalline desert rose formations, the museum bridges nomadic heritage and contemporary form.",
    introZh: "身着蓝白汉服立于让·努维尔设计的卡塔尔国家博物馆前。这座以“沙漠玫瑰”结晶为灵感的建筑，在交错的圆盘切面与高耸国旗之间，见证了东方衣冠与海湾现代建筑的跨文化对话。",
    quote: "Interlocking discs of desert stone meet flowing silk beneath the Gulf meridian.",
    photos: [
      {
        src: "assets/photos/qatar-doha-museum.jpg",
        title: "Hanfu Before the Desert Rose",
        description: "National Museum of Qatar, Doha · Architectural discs and flagpole plaza (Jul 2022)"
      },
      {
        src: "assets/photos/city-doha.jpg",
        title: "West Bay Corniche — Doha",
        description: "Doha, Qatar · Dhow boats and illuminated skyline across the bay"
      },
      {
        src: "assets/photos/saudi-kaust.jpg",
        title: "Arabian Peninsula — Thuwal",
        description: "KAUST, Saudi Arabia · Cultural evening along the Red Sea"
      },
      {
        src: "assets/photos/oman-muscat-rozna.jpg",
        title: "Muscat Fort Gathering",
        description: "Muscat, Oman · Traditional Omani architecture at Rozna"
      }
    ]
  },
  {
    id: "banff-turquoise-rockies",
    vol: "06",
    title: "Turquoise Rockies",
    titleZh: "加拿大 · 班夫落基山脉与温哥华",
    category: "NATURE",
    location: "BANFF & VANCOUVER / CANADA",
    locationZh: "加拿大 班夫与温哥华",
    year: "2018",
    coordinates: "51.3217° N, 116.1860° W",
    cover: "assets/photos/canada-banff-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#1E4640",
    introEn: "During a summer research and study program at UBC Vancouver, a journey east into the Canadian Rockies revealed glacial-fed lakes of surreal emerald and turquoise ringed by subalpine firs and rugged limestone peaks.",
    introZh: "2018 年夏赴温哥华英属哥伦比亚大学（UBC）参加暑期项目期间，一路向东深入落基山脉。冰川融水汇聚成翡翠般的湖泊，在冷杉林与巍峨雪峰的环抱中静谧如画。",
    quote: "Glacial rock flour turns alpine water into liquid turquoise under the northern sun.",
    photos: [
      {
        src: "assets/photos/canada-banff.jpg",
        title: "Glacial Lake in the Canadian Rockies",
        description: "Banff National Park, Alberta · Subalpine pines and snow-dusted peaks (Jul 2018)"
      },
      {
        src: "assets/photos/usa-oak-alley.jpg",
        title: "North American Canopy — Live Oaks",
        description: "Louisiana, USA · Three-century-old avenue of southern live oaks"
      },
      {
        src: "assets/photos/city-seattle.jpg",
        title: "Pacific Northwest Horizon",
        description: "Cascadia coast · Emerald skyline and mountain backdrop"
      },
      {
        src: "assets/photos/city-san-francisco.jpg",
        title: "Golden Gate Headlands",
        description: "San Francisco Bay · Coastal fog and suspension span"
      }
    ]
  },
  {
    id: "giza-pyramids-cairo",
    vol: "07",
    title: "Giza Horizon",
    titleZh: "埃及 · 开罗吉萨金字塔",
    category: "TRAVEL",
    location: "CAIRO / EGYPT",
    locationZh: "埃及 开罗",
    year: "2023",
    coordinates: "29.9792° N, 31.1342° E",
    cover: "assets/photos/egypt-giza-pyramids.jpg",
    coverStyle: "editorial",
    spineColor: "#8C6239",
    introEn: "Standing on the sunlit limestone plateau of Giza where four-and-a-half millennia of history rise directly above the edge of modern Cairo. From the Great Pyramid to the temples of Luxor along the Nile.",
    introZh: "站在阳光炽烈的吉萨高原，四千五百年的巨石金字塔在现代开罗的边缘拔地而起。从吉萨高地到卢克索神庙，顺着尼罗河溯流而上，触摸古埃及文明的刻度。",
    quote: "Forty-five centuries of limestone geometry resting beneath an unchanged desert sky.",
    photos: [
      {
        src: "assets/photos/egypt-giza-pyramids.jpg",
        title: "Apex of the Great Pyramid",
        description: "Giza Plateau, Cairo · Sun hat, desert camel, and ancient limestone blocks (Jun 2023)"
      },
      {
        src: "assets/photos/city-alexandria.jpg",
        title: "Mediterranean Gate — Alexandria",
        description: "Alexandria, Egypt · Harbor curve along the ancient coast"
      },
      {
        src: "assets/photos/jordan-petra.jpg",
        title: "Nabataean Canyon — Petra",
        description: "Petra, Jordan · Rose-red sanctuary across the Sinai"
      },
      {
        src: "assets/photos/turkey-hagia-sophia.jpg",
        title: "Eastern Mediterranean Sanctuary",
        description: "Istanbul, Türkiye · Domes and roses in the courtyard"
      }
    ]
  },
  {
    id: "kaust-red-sea",
    vol: "08",
    title: "Red Sea Fellowship",
    titleZh: "沙特阿拉伯 · KAUST 传统服饰聚会",
    category: "PEOPLE",
    location: "THUWAL & JEDDAH / SAUDI ARABIA",
    locationZh: "沙特 图瓦尔与吉达",
    year: "2020",
    coordinates: "22.3095° N, 39.1047° E",
    cover: "assets/photos/saudi-kaust.jpg",
    coverStyle: "cloth",
    spineColor: "#7B2D26",
    introEn: "Invited to the KAUST Undergraduate Poster Competition on the shores of the Red Sea in Thuwal. Dressed in traditional Saudi thobe and red-checkered shemagh alongside fellow researchers—the very first spark of a multi-year journey in the Gulf.",
    introZh: "2020 年初受邀赴红海之畔的阿卜杜拉国王科技大学（KAUST）参加本科生海报竞赛。换上传统白色长袍（Thobe）与红白格头巾（Shemagh），这段经历也成为后来结缘海湾与中东的起点。",
    quote: "Hospitality in white cotton and red weave on the warm shores of the Red Sea.",
    photos: [
      {
        src: "assets/photos/saudi-kaust.jpg",
        title: "In Traditional Thobe & Shemagh at KAUST",
        description: "Thuwal, Saudi Arabia · International research gathering at KAUST (Jan 2020)"
      },
      {
        src: "assets/photos/city-jeddah.jpg",
        title: "Bride of the Red Sea — Jeddah",
        description: "Jeddah, Saudi Arabia · Coral heritage and Red Sea waterfront"
      },
      {
        src: "assets/photos/city-riyadh.jpg",
        title: "Najd Plateau Skyline — Riyadh",
        description: "Riyadh, Saudi Arabia · Desert metropolis glowing at dusk"
      },
      {
        src: "assets/photos/oman-muscat-rozna.jpg",
        title: "Arabian Table — Muscat",
        description: "Muscat, Oman · Evening fellowship in a traditional Omani fort"
      }
    ]
  },
  {
    id: "berlin-pergamon-heidelberg",
    vol: "09",
    title: "Pergamon & Neckar",
    titleZh: "德国 · 柏林博物馆岛与海德堡学者论坛",
    category: "CITY",
    location: "BERLIN & HEIDELBERG / GERMANY",
    locationZh: "德国 柏林与海德堡",
    year: "2023—2026",
    coordinates: "52.5212° N, 13.3969° E",
    cover: "assets/photos/germany-berlin-pergamon.jpg",
    coverStyle: "cloth",
    spineColor: "#2B2E33",
    introEn: "From the neoclassical colonnades of Museum Island in Berlin along the Spree to the Old Bridge of Heidelberg during the Heidelberg Laureate Forum—where 200 young researchers gathered with Turing, Abel, and Fields laureates.",
    introZh: "从柏林施普雷河畔博物馆岛的新古典主义柱廊，到内卡河畔的海德堡学者论坛（HLF）。在古典人文建筑与前沿计算机科学的交汇处，记录下与全球青年学者及图灵奖、菲尔兹奖得主共度的时光。",
    quote: "Classical colonnades on the Spree and golden sunset over the Neckar valley.",
    photos: [
      {
        src: "assets/photos/germany-berlin-pergamon.jpg",
        title: "Colonnade at the Pergamon Museum",
        description: "Museum Island, Berlin · Evening queue beneath the classical portico (Aug 2023)"
      },
      {
        src: "assets/photos/germany-heidelberg-stage.jpg",
        title: "Heidelberg Laureate Forum — Main Hall",
        description: "Heidelberg, Germany · Carl-Zeiss-Stiftung Abbe Grant Fellow at HLF"
      },
      {
        src: "assets/photos/germany-heidelberg-cruise.jpg",
        title: "Fellows Aboard the Neckar Cruise",
        description: "Heidelberg, Germany · Young researchers from around the world on the Neckar"
      },
      {
        src: "assets/photos/germany-heidelberg-group.jpg",
        title: "Laureates & Young Researchers",
        description: "Heidelberg University · Group portrait on the historic steps"
      },
      {
        src: "assets/photos/city-berlin.jpg",
        title: "Spree River & Cathedral Dome",
        description: "Berlin, Germany · Golden hour reflections in the capital"
      }
    ]
  },
  {
    id: "aegean-caldera-greece",
    vol: "10",
    title: "Aegean Caldera",
    titleZh: "希腊 · 圣托里尼蓝顶与雅典卫城",
    category: "TRAVEL",
    location: "SANTORINI & ATHENS / GREECE",
    locationZh: "希腊 圣托里尼与雅典",
    year: "2023",
    coordinates: "36.4618° N, 25.3753° E",
    cover: "assets/photos/greece-santorini-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#1D4B8F",
    introEn: "Whitewashed Cycladic chapels and cobalt domes perched high above the volcanic caldera of Santorini, where crisp Aegean light dissolves the boundary between sea and sky. Paired with antiquity in Athens.",
    introZh: "圣托里尼伊亚小镇的纯白礼拜堂与钴蓝穹顶悬于火山口峭壁之上，爱琴海纯粹的阳光将海天融为一色。从雅典卫城的古典柱式到基克拉泽斯群岛的海风。",
    quote: "Lime-washed walls and cobalt domes suspended between volcanic rock and Aegean blue.",
    photos: [
      {
        src: "assets/photos/greece-santorini.jpg",
        title: "Blue Domes Over the Caldera",
        description: "Oia, Santorini, Greece · Cycladic chapel overlooking the Aegean Sea (Sep 2023)"
      },
      {
        src: "assets/photos/city-athens.jpg",
        title: "Acropolis Above Athens",
        description: "Athens, Greece · The Parthenon crowned in warm Mediterranean light"
      },
      {
        src: "assets/photos/albania-tirana.jpg",
        title: "Ionian & Adriatic Neighbor — Albania",
        description: "Tirana & Durrës · Sunlit piazzas and mountain horizons"
      },
      {
        src: "assets/photos/north-macedonia-ohrid.jpg",
        title: "Balkan Waters — North Macedonia",
        description: "Skopje & Lake Ohrid · Historic stone bridges and lakeside cliffs"
      }
    ]
  },
  {
    id: "pattaya-skydive",
    vol: "11",
    title: "13,000 Feet Over Pattaya",
    titleZh: "泰国 · 芭提雅高空双人跳伞",
    category: "MOMENTS",
    location: "PATTAYA & BANGKOK / THAILAND",
    locationZh: "泰国 芭提雅与曼谷",
    year: "2020",
    coordinates: "12.9236° N, 100.8825° E",
    cover: "assets/photos/thailand-skydive-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#1F4A7C",
    introEn: "Leaping from 13,000 feet into pure freefall above the Gulf of Thailand in Pattaya. Five unforgettable days traversing Chiang Mai, Bangkok, and the eastern coast during the spring semester exchange in Southeast Asia.",
    introZh: "从一万三千英尺高空纵身跃入暹罗湾的云海之上，在自由落体的呼啸风声中振臂高呼。五天时间穿行清迈、曼谷与芭提雅，定格二十岁出头最无畏的瞬间。",
    quote: "At terminal velocity above the Gulf of Thailand, the earth becomes a painted map.",
    photos: [
      {
        src: "assets/photos/thailand-skydive.jpg",
        title: "Freefall Over the Gulf of Thailand",
        description: "Pattaya, Thailand · Tandem skydive at 13,000 ft with Skydive Thailand (Feb 2020)"
      },
      {
        src: "assets/photos/city-bangkok.jpg",
        title: "Chao Phraya Spires — Bangkok",
        description: "Bangkok, Thailand · Golden temple roofs and river bends at sunset"
      },
      {
        src: "assets/photos/city-phuket.jpg",
        title: "Andaman Coastline",
        description: "Southern Thailand · Limestone karsts and tropical waters"
      },
      {
        src: "assets/photos/singapore-merlion.jpg",
        title: "Southeast Asian Hub — Marina Bay",
        description: "Singapore · Night lights along the bay during NUS exchange"
      }
    ]
  },
  {
    id: "yerevan-velvet-studio",
    vol: "12",
    title: "Studio in Yerevan",
    titleZh: "亚美尼亚 · 埃里温传统绒袍写真",
    category: "PEOPLE",
    location: "YEREVAN / ARMENIA",
    locationZh: "亚美尼亚 埃里温",
    year: "2023",
    coordinates: "40.1792° N, 44.4991° E",
    cover: "assets/photos/armenia-yerevan-attire.jpg",
    coverStyle: "cloth",
    spineColor: "#4A253B",
    introEn: "A classic portrait studio in Yerevan wearing traditional Armenian taraz—deep plum velvet robes banded with hand-woven crimson silk and a matching headwrap. Exploring ancient monasteries carved into volcanic tuff beneath Mount Ararat.",
    introZh: "在埃里温传统摄影工坊换上亚美尼亚民族服饰（Taraz）——深紫丝绒长袍配以酒红织锦纹饰与头巾。在亚拉拉特山脚下探访凝灰岩筑成的古老修道院与高加索人文。",
    quote: "Woven crimson and deep velvet carry the memory of highland artisans.",
    photos: [
      {
        src: "assets/photos/armenia-yerevan-attire.jpg",
        title: "Portrait in Traditional Armenian Taraz",
        description: "Yerevan, Armenia · Studio portrait in velvet and woven crimson stripes (Jan 2023)"
      },
      {
        src: "assets/photos/city-yerevan.jpg",
        title: "Cascade & Mount Ararat Horizon",
        description: "Yerevan, Armenia · Pink tuff stone architecture facing the snow peak"
      },
      {
        src: "assets/photos/georgia-tbilisi.jpg",
        title: "Caucasus Courtyard — Tbilisi",
        description: "Tbilisi, Georgia · Leafy guesthouse courtyard in the old quarter"
      },
      {
        src: "assets/photos/azerbaijan-baku.jpg",
        title: "Eastern Caucasus — Baku Old City",
        description: "Baku, Azerbaijan · Traditional papakha hat in Icherisheher"
      }
    ]
  },
  {
    id: "cambridge-river-cam",
    vol: "13",
    title: "Punting on the Cam",
    titleZh: "英国 · 剑桥大学康河撑船",
    category: "MOMENTS",
    location: "CAMBRIDGE & LONDON / UK",
    locationZh: "英国 剑桥与伦敦",
    year: "2022",
    coordinates: "52.2043° N, 0.1149° E",
    cover: "assets/photos/uk-cambridge-punting-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#3B5249",
    introEn: "Gliding along The Backs of the River Cam in Cambridge during the July summer school, pole in hand past centuries-old college chapels, weeping willows, and stone bridges before continuing north to Edinburgh.",
    introZh: "盛夏七月在剑桥参加暑期学校，亲手执长篙撑船漫游康河后园（The Backs）。两岸是百年学院的哥特式礼拜堂、垂柳与古石桥，随后一路北上探访伦敦与爱丁堡。",
    quote: "A wooden punt, a long pole, and stone bridges reflected in the slow green Cam.",
    photos: [
      {
        src: "assets/photos/uk-cambridge-punting.jpg",
        title: "At the Punt Pole — River Cam",
        description: "Cambridge University, UK · Punting along the college backs (Jul 2022)"
      },
      {
        src: "assets/photos/germany-berlin-pergamon.jpg",
        title: "European Classical Colonnade",
        description: "Berlin, Germany · Evening museum architecture"
      },
      {
        src: "assets/photos/germany-heidelberg-sunset.jpg",
        title: "Old University Town — Heidelberg",
        description: "Heidelberg, Germany · Sunset over the Neckar and Old Bridge"
      },
      {
        src: "assets/photos/city-frankfurt.jpg",
        title: "Main River Skyline",
        description: "Central Europe · Bridges and evening reflections"
      }
    ]
  },
  {
    id: "singapore-merlion-nights",
    vol: "14",
    title: "Merlion After Dark",
    titleZh: "新加坡 · 滨海湾夜景与国大交换",
    category: "CITY",
    location: "MARINA BAY / SINGAPORE",
    locationZh: "新加坡 滨海湾",
    year: "2020",
    coordinates: "1.2868° N, 103.8545° E",
    cover: "assets/photos/singapore-merlion.jpg",
    coverStyle: "cloth",
    spineColor: "#1B2A3D",
    introEn: "Five months living and studying as an exchange student at the National University of Singapore (NUS). Warm equatorial nights along Marina Bay watching the illuminated Merlion and the cantilevered skyward silhouette of Marina Bay Sands.",
    introZh: "在新加坡国立大学（NUS）交换学习的五个月时光。赤道温润的晚风中漫步鱼尾狮公园，对岸金沙酒店的空中花园与城市灯火在海面上铺开金色倒影。",
    quote: "Five months on the equator where tropical rain and neon towers meet the bay.",
    photos: [
      {
        src: "assets/photos/singapore-merlion.jpg",
        title: "Merlion Park & Marina Bay Sands at Night",
        description: "Marina Bay, Singapore · Illuminated fountain and skyline (Spring 2020)"
      },
      {
        src: "assets/photos/city-singapore.jpg",
        title: "Marina Bay Architectural Panorama",
        description: "Singapore · Lotus art museum and financial district towers"
      },
      {
        src: "assets/photos/thailand-skydive.jpg",
        title: "Weekend Flight North — Pattaya",
        description: "Pattaya, Thailand · Skydiving excursion from Singapore"
      },
      {
        src: "assets/photos/city-bangkok.jpg",
        title: "Southeast Asian Crossroads",
        description: "Bangkok, Thailand · Twilight over the temple spires"
      }
    ]
  },
  {
    id: "oak-alley-louisiana",
    vol: "15",
    title: "Beneath the Live Oaks",
    titleZh: "美国 · 新奥尔良橡树庄园",
    category: "NATURE",
    location: "NEW ORLEANS / UNITED STATES",
    locationZh: "美国 新奥尔良",
    year: "2022",
    coordinates: "30.0042° N, 90.7762° W",
    cover: "assets/photos/usa-oak-alley.jpg",
    coverStyle: "editorial",
    spineColor: "#354A2F",
    introEn: "Standing beneath the quarter-mile vaulted cathedral of three-hundred-year-old southern live oaks near New Orleans—part of a coast-to-coast journey across the United States from New York to San Francisco.",
    introZh: "站在新奥尔良郊外绵延四分之一英里的三百年古橡树拱廊下，虬曲苍劲的枝干在头顶交织成绿色的穹顶。那年秋天横跨美国东西海岸，走过纽约、新奥尔良与旧金山。",
    quote: "Three-hundred-year-old branches weave a living vault of shadow and filtered gold.",
    photos: [
      {
        src: "assets/photos/usa-oak-alley.jpg",
        title: "Cathedral of Southern Live Oaks",
        description: "Oak Alley, Louisiana, USA · Beneath the historic avenue of trees (Sep 2022)"
      },
      {
        src: "assets/photos/city-new-york.jpg",
        title: "East Coast Anchor — Manhattan",
        description: "New York City, USA · Midtown towers at golden hour"
      },
      {
        src: "assets/photos/city-san-francisco.jpg",
        title: "West Coast Span — Golden Gate",
        description: "San Francisco, California · Pacific headlands and bridge"
      },
      {
        src: "assets/photos/city-san-jose.jpg",
        title: "Silicon Valley Foothills",
        description: "San Jose, California · Sunlit valley and palm boulevards"
      }
    ]
  },
  {
    id: "anjar-school-lebanon",
    vol: "16",
    title: "Children of Anjar",
    titleZh: "黎巴嫩 · 安加尔难民学校志愿纪行",
    category: "PEOPLE",
    location: "ANJAR & BEIRUT / LEBANON",
    locationZh: "黎巴嫩 安加尔",
    year: "2022",
    coordinates: "33.7279° N, 35.9311° E",
    cover: "assets/photos/lebanon-anjar-school-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#2D4739",
    introEn: "Visiting a refugee school in Anjar in Lebanon's Bekaa Valley between Beirut and the Roman ruins of Baalbek. Surrounded by bright, resilient children whose laughter filled the courtyard—one of the most meaningful chapters of all 26 countries.",
    introZh: "在贝鲁特与巴勒贝克古迹之间的贝卡谷地，走进安加尔（Anjar）的一所难民学校。蹲下身与孩子们并肩合影，操场上清澈的笑容与掌声，是二十六国旅途中最温暖、最难忘的一页。",
    quote: "In the Bekaa Valley courtyard, every smile carries a quiet, unyielding light.",
    photos: [
      {
        src: "assets/photos/lebanon-anjar-school.jpg",
        title: "With the Students at Anjar School",
        description: "Anjar, Bekaa Valley, Lebanon · Volunteer visit and courtyard group photo (Oct 2022)"
      },
      {
        src: "assets/photos/jordan-petra.jpg",
        title: "Levantine Neighbor — Petra",
        description: "Petra, Jordan · Ancient caravan routes of the Levant"
      },
      {
        src: "assets/photos/turkey-hagia-sophia.jpg",
        title: "Courtyard Fountain — Istanbul",
        description: "Istanbul, Türkiye · Roses and Ottoman stonework"
      },
      {
        src: "assets/photos/armenia-yerevan-attire.jpg",
        title: "Armenian Heritage — Yerevan",
        description: "Yerevan, Armenia · Cultural ties connecting Anjar and the Caucasus"
      }
    ]
  },
  {
    id: "baku-flame-towers",
    vol: "17",
    title: "Flame Towers & Old Baku",
    titleZh: "阿塞拜疆 · 巴库古城与火焰塔",
    category: "CITY",
    location: "BAKU / AZERBAIJAN",
    locationZh: "阿塞拜疆 巴库",
    year: "2023",
    coordinates: "40.3661° N, 49.8372° E",
    cover: "assets/photos/azerbaijan-baku.jpg",
    coverStyle: "cloth",
    spineColor: "#232730",
    introEn: "Walking the honey-toned limestone alleys of Icherisheher (Old Baku) in a traditional black-and-gold embroidered robe and astrakhan papakha hat, while the glass curves of the modern Flame Towers rise directly above the medieval walls.",
    introZh: "头戴高加索传统羊羔皮帽（Papakha）、身披黑金刺绣长袍，漫步在里海之畔的巴库内城（Icherisheher）石板街。古老城墙的尽头，现代感十足的火焰塔在蓝天下交相辉映。",
    quote: "Medieval limestone alleys frame glass towers shaped like Caspian fire.",
    photos: [
      {
        src: "assets/photos/azerbaijan-baku.jpg",
        title: "Icherisheher Street Toward the Flame Towers",
        description: "Baku Old City, Azerbaijan · Traditional papakha and robe on cobblestone street (Jun 2023)"
      },
      {
        src: "assets/photos/georgia-tbilisi.jpg",
        title: "Transcaucasian Trail — Tbilisi",
        description: "Tbilisi, Georgia · Wooden balconies and courtyard vines"
      },
      {
        src: "assets/photos/armenia-yerevan-attire.jpg",
        title: "Caucasus Trilogy — Yerevan",
        description: "Yerevan, Armenia · Studio portrait in traditional velvet"
      },
      {
        src: "assets/photos/uzbekistan-samarkand.jpg",
        title: "Across the Caspian — Samarkand",
        description: "Samarkand, Uzbekistan · Silk Road arches and azure domes"
      }
    ]
  },
  {
    id: "sarajevo-jahorina-ski",
    vol: "18",
    title: "Powder at Jahorina",
    titleZh: "波黑 · 萨拉热窝冬奥雪场同游",
    category: "MOMENTS",
    location: "SARAJEVO / BOSNIA & HERZEGOVINA",
    locationZh: "波黑 萨拉热窝",
    year: "2022",
    coordinates: "43.7369° N, 18.5675° E",
    cover: "assets/photos/bosnia-ski-sarajevo-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#234175",
    introEn: "Carving down the sunlit alpine runs of Jahorina—the historic 1984 Winter Olympic slopes above Sarajevo—with three close friends. Pine forests, timber chalets, and crisp Balkan mountain air.",
    introZh: "与好友相约波黑萨拉热窝郊外的雅霍里纳山（1984 年冬奥会高山滑雪赛场）。在阳光明媚的雪道与松林木屋前扛起单板与双板，开启一周的巴尔干冰雪与山城之旅。",
    quote: "Blue skies, fresh Balkan powder, and four friends on the Olympic ridge.",
    photos: [
      {
        src: "assets/photos/bosnia-ski-sarajevo.jpg",
        title: "Four Friends on the Slopes of Ski Sarajevo",
        description: "Jahorina, Sarajevo, Bosnia & Herzegovina · Snowboard and ski session (Mar 2022)"
      },
      {
        src: "assets/photos/serbia-drvengrad.jpg",
        title: "Across the Drina — Drvengrad at Dusk",
        description: "Mokra Gora, Serbia · Timber village on the mountain ridge"
      },
      {
        src: "assets/photos/north-macedonia-ohrid.jpg",
        title: "Southern Balkans — Ohrid & Skopje",
        description: "North Macedonia · Mountain lakes and historic fortress"
      },
      {
        src: "assets/photos/albania-tirana.jpg",
        title: "Adriatic Horizon — Albania",
        description: "Tirana, Albania · Balkan peaks meeting the coast"
      }
    ]
  },
  {
    id: "almaty-cathedral-snow",
    vol: "19",
    title: "Almaty in Winter Light",
    titleZh: "哈萨克斯坦 · 阿拉木图升天主教座堂",
    category: "TRAVEL",
    location: "ALMATY / KAZAKHSTAN",
    locationZh: "哈萨克斯坦 阿拉木图",
    year: "2023",
    coordinates: "43.2588° N, 76.9530° E",
    cover: "assets/photos/kazakhstan-almaty-cover.jpg",
    coverStyle: "bleed",
    spineColor: "#7D532D",
    introEn: "In the snow-draped woodland of Panfilov Park in Almaty stands Zenkov's Ascension Cathedral—built entirely of Tian Shan spruce without iron nails, its butter-yellow walls and gilded domes glowing against the winter sky.",
    introZh: "冬日白雪覆盖的阿拉木图潘菲洛夫公园里，升天主教座堂（Zenkov Cathedral）静立于天山云杉林间。这座全木结构建筑在澄澈的冬日晴空下闪耀着明黄与金色的光泽。",
    quote: "Built of Tian Shan timber without a single nail, glowing golden in February snow.",
    photos: [
      {
        src: "assets/photos/kazakhstan-almaty.jpg",
        title: "Ascension Cathedral in Panfilov Park",
        description: "Almaty, Kazakhstan · Wooden Orthodox cathedral in winter snow (Feb 2023)"
      },
      {
        src: "assets/photos/uzbekistan-samarkand.jpg",
        title: "Southern Steppe — Samarkand",
        description: "Samarkand, Uzbekistan · Azure tilework along the Silk Road"
      },
      {
        src: "assets/photos/bosnia-ski-sarajevo.jpg",
        title: "Alpine Snowfields — Jahorina",
        description: "Sarajevo, Bosnia · Winter mountain companions"
      },
      {
        src: "assets/photos/canada-banff.jpg",
        title: "Northern Conifers & Peaks",
        description: "Banff, Canada · Subalpine forest and glacial waters"
      }
    ]
  },
  {
    id: "hagia-sophia-istanbul",
    vol: "20",
    title: "Roses of Hagia Sophia",
    titleZh: "土耳其 · 伊斯坦布尔圣索菲亚庭院",
    category: "NATURE",
    location: "ISTANBUL / TÜRKIYE",
    locationZh: "土耳其 伊斯坦布尔",
    year: "2022",
    coordinates: "41.0086° N, 28.9802° E",
    cover: "assets/photos/turkey-hagia-sophia-cover.jpg",
    coverStyle: "cloth",
    spineColor: "#6B3040",
    introEn: "June roses blooming beside the ornate Ottoman ablution fountain (Şadırvan) in the outer courtyard of Hagia Sophia. Six days exploring Istanbul along the Bosphorus and the fairy chimneys of Cappadocia.",
    introZh: "六月初夏的伊斯坦布尔，圣索菲亚大教堂庭院里的奥斯曼净礼喷泉（Şadırvan）旁玫瑰盛放，身后是拜占庭巨型穹顶与宣礼塔。一周行程横跨博斯普鲁斯海峡与卡帕多西亚。",
    quote: "Summer roses frame the fountain where Byzantine domes meet Ottoman minarets.",
    photos: [
      {
        src: "assets/photos/turkey-hagia-sophia.jpg",
        title: "Courtyard Fountain & Roses at Hagia Sophia",
        description: "Sultanahmet, Istanbul, Türkiye · Blooming roses before the great dome (Jun 2022)"
      },
      {
        src: "assets/photos/city-istanbul.jpg",
        title: "Golden Horn & Bosphorus Strait",
        description: "Istanbul, Türkiye · Ferry wakes between Europe and Asia"
      },
      {
        src: "assets/photos/city-ankara.jpg",
        title: "Anatolian Highland — Ankara",
        description: "Central Anatolia · Warm stone and plateau light"
      },
      {
        src: "assets/photos/greece-santorini.jpg",
        title: "Across the Aegean — Santorini",
        description: "Cyclades, Greece · Blue domes above the caldera"
      }
    ]
  },
  {
    id: "muscat-rozna-oman",
    vol: "21",
    title: "Table at Rozna Fort",
    titleZh: "阿曼 · 马斯喀特古堡餐厅聚会",
    category: "PEOPLE",
    location: "MUSCAT / OMAN",
    locationZh: "阿曼 马斯喀特",
    year: "2023",
    coordinates: "23.5880° N, 58.3829° E",
    cover: "assets/photos/oman-muscat-rozna.jpg",
    coverStyle: "editorial",
    spineColor: "#6E473B",
    introEn: "Gathered around a traditional Omani feast with close friends inside the mud-brick and castellated stone walls of Rozna Restaurant in Muscat—celebrating exams passed, friendships forged in the Gulf, and the timeless warmth of Omani hospitality.",
    introZh: "在阿曼马斯喀特筑如古堡般的 Rozna 传统餐厅内，与好友围坐共享阿曼风味晚宴。斑驳的石墙与暖光下比出胜利手势，定格海湾求学岁月里真挚的同窗情谊。",
    quote: "Within earthen fort walls in Muscat, shared bread and laughter turn travel into home.",
    photos: [
      {
        src: "assets/photos/oman-muscat-rozna.jpg",
        title: "Four Friends at Rozna Fort Restaurant",
        description: "Muscat, Oman · Traditional Omani architecture and dinner gathering (Mar 2023)"
      },
      {
        src: "assets/photos/saudi-kaust.jpg",
        title: "Red Sea Companions — KAUST",
        description: "Thuwal, Saudi Arabia · Traditional attire with fellow students"
      },
      {
        src: "assets/photos/uae-dubai-yacht.jpg",
        title: "Gulf Voyages — Dubai Marina",
        description: "Dubai, UAE · Afternoon out on the Arabian Gulf"
      },
      {
        src: "assets/photos/qatar-doha-museum.jpg",
        title: "Doha Cultural Stop",
        description: "Doha, Qatar · National Museum of Qatar plaza"
      }
    ]
  },
  {
    id: "tbilisi-courtyard-georgia",
    vol: "22",
    title: "Courtyard in Tbilisi",
    titleZh: "格鲁吉亚 · 第比利斯二十世纪民宿",
    category: "PEOPLE",
    location: "TBILISI / GEORGIA",
    locationZh: "格鲁吉亚 第比利斯",
    year: "2022",
    coordinates: "41.7151° N, 44.8271° E",
    cover: "assets/photos/georgia-tbilisi.jpg",
    coverStyle: "editorial",
    spineColor: "#522B38",
    introEn: "A leafy, string-lit guesthouse courtyard in old Tbilisi filled with terracotta pots, postcard memories, and warm Georgian hospitality during a six-day journey from the sulfur baths of the capital to the Black Sea coast of Batumi.",
    introZh: "在第比利斯老城绿意盎然的“20世纪民宿”庭院里，串灯、陶盆绿植与满墙的格鲁吉亚风景明信片交织出家的温度。六天行程从第比利斯一路延伸至黑海之滨的巴统。",
    quote: "Under courtyard vines and warm string lights, Tbilisi welcomes every traveler like old family.",
    photos: [
      {
        src: "assets/photos/georgia-tbilisi.jpg",
        title: "Morning at the 20th Century Guesthouse",
        description: "Tbilisi, Georgia · Courtyard garden and photo wall (May 2022)"
      },
      {
        src: "assets/photos/armenia-yerevan-attire.jpg",
        title: "Southern Neighbor — Yerevan Studio",
        description: "Yerevan, Armenia · Traditional highland velvet attire"
      },
      {
        src: "assets/photos/azerbaijan-baku.jpg",
        title: "Caspian Neighbor — Baku Old City",
        description: "Baku, Azerbaijan · Flame Towers above medieval stone"
      },
      {
        src: "assets/photos/serbia-drvengrad.jpg",
        title: "Mountain Timber — Drvengrad",
        description: "Mokra Gora, Serbia · Evening steps in the wooden village"
      }
    ]
  },
  {
    id: "drvengrad-dusk-serbia",
    vol: "23",
    title: "Dusk at Drvengrad",
    titleZh: "塞尔维亚 · 木头城黄昏木阶",
    category: "MOMENTS",
    location: "DRVENGRAD & BELGRADE / SERBIA",
    locationZh: "塞尔维亚 木头城",
    year: "2022",
    coordinates: "43.7961° N, 19.5083° E",
    cover: "assets/photos/serbia-drvengrad.jpg",
    coverStyle: "cloth",
    spineColor: "#4E3829",
    introEn: "Sitting on the hand-hewn timber steps of Drvengrad (Küstendorf)—Emir Kusturica's hilltop wooden village in Mokra Gora—as mountain twilight settles over the log cabins and miniature wooden church steeple.",
    introZh: "黄昏时分坐在塞尔维亚木头城（Drvengrad / Küstendorf）的原木台阶上，身后是导演库斯图里卡建造的童话木屋与木质小教堂尖顶，山间暮色温柔而宁静。",
    quote: "Hand-hewn pine steps and a wooden steeple catching the last ember of Balkan twilight.",
    photos: [
      {
        src: "assets/photos/serbia-drvengrad.jpg",
        title: "Timber Steps at Drvengrad (Küstendorf)",
        description: "Mokra Gora, Serbia · Hilltop wooden village at dusk (Mar 2022)"
      },
      {
        src: "assets/photos/bosnia-ski-sarajevo.jpg",
        title: "Across the Border — Ski Sarajevo",
        description: "Jahorina, Bosnia & Herzegovina · Friends on the snow slope"
      },
      {
        src: "assets/photos/north-macedonia-ohrid.jpg",
        title: "Balkan Meridian — North Macedonia",
        description: "Skopje & Ohrid · Stone heritage and mountain valleys"
      },
      {
        src: "assets/photos/city-budapest.jpg",
        title: "Danube Evening Glow",
        description: "Central & Southeastern Europe · River bridges at nightfall"
      }
    ]
  },
  {
    id: "manama-modernism-bahrain",
    vol: "24",
    title: "Manama Modernism",
    titleZh: "巴林 · 麦纳麦海湾天际线",
    category: "CITY",
    location: "MANAMA / BAHRAIN",
    locationZh: "巴林 麦纳麦",
    year: "2021",
    coordinates: "26.2285° N, 50.5860° E",
    cover: "assets/photos/bahrain-manama-cover.jpg",
    coverStyle: "bleed",
    spineColor: "#2F4858",
    introEn: "An autumn weekend in the island kingdom of Bahrain, where bold modernist towers, wind-turbine skybridges, and pearl-diving history meet the shallow turquoise waters of the Persian Gulf.",
    introZh: "2021 年秋日的巴林麦纳麦之旅。在这座素有“海湾珍珠”之称的岛国，大胆的现代主义摩天楼与碧蓝浅海交织出独特的海湾天际线。",
    quote: "An island kingdom where modernist geometry rises straight from shallow pearl waters.",
    photos: [
      {
        src: "assets/photos/bahrain-manama.jpg",
        title: "Manama Waterfront & Towers",
        description: "Manama, Kingdom of Bahrain · Gulf architecture and coastal light (Sep 2021)"
      },
      {
        src: "assets/photos/city-manama.jpg",
        title: "Bahrain Bay Panorama",
        description: "Manama, Bahrain · Sculptural skyline mirrored in the bay"
      },
      {
        src: "assets/photos/qatar-doha-museum.jpg",
        title: "Across the Gulf — Doha",
        description: "Doha, Qatar · National Museum desert-rose architecture"
      },
      {
        src: "assets/photos/uae-dubai-yacht.jpg",
        title: "Southern Gulf — Dubai Marina",
        description: "Dubai, UAE · Yachting beneath the Marina towers"
      }
    ]
  },
  {
    id: "ohrid-skopje-macedonia",
    vol: "25",
    title: "Lake Ohrid & Skopje",
    titleZh: "北马其顿 · 奥赫里德湖与斯科普里",
    category: "NATURE",
    location: "OHRID & SKOPJE / NORTH MACEDONIA",
    locationZh: "北马其顿 斯科普里与奥赫里德",
    year: "2022",
    coordinates: "41.1231° N, 20.8016° E",
    cover: "assets/photos/north-macedonia-ohrid-cover.jpg",
    coverStyle: "editorial",
    spineColor: "#264E5A",
    introEn: "Five summer days traversing North Macedonia from the historic stone bridges of Skopje to the crystal-clear tectonic waters of Lake Ohrid—one of Europe's oldest and deepest lakes.",
    introZh: "六月盛夏游历北马其顿，从斯科普里的古老石桥与城堡出发，抵达欧洲最古老、最澄澈的构造湖之一——奥赫里德湖，感受巴尔干腹地的山湖静美。",
    quote: "Ancient tectonic water surrounded by Byzantine cliff chapels and Balkan hills.",
    photos: [
      {
        src: "assets/photos/north-macedonia-ohrid.jpg",
        title: "Summer in North Macedonia",
        description: "Skopje & Lake Ohrid, North Macedonia · Balkan heritage and lakeside cliffs (Jun 2022)"
      },
      {
        src: "assets/photos/albania-tirana.jpg",
        title: "Western Border — Tirana & Durrës",
        description: "Albania · Across the mountain pass to the Adriatic"
      },
      {
        src: "assets/photos/greece-santorini.jpg",
        title: "Southern Neighbor — Aegean Blue",
        description: "Greece · Whitewashed walls and deep blue sea"
      },
      {
        src: "assets/photos/serbia-drvengrad.jpg",
        title: "Northern Neighbor — Mokra Gora",
        description: "Serbia · Wooden chalets in the mountain mist"
      }
    ]
  },
  {
    id: "tirana-adriatic-albania",
    vol: "26",
    title: "Tirana & Adriatic Coast",
    titleZh: "阿尔巴尼亚 · 地拉那与杜勒斯海岸",
    category: "TRAVEL",
    location: "TIRANA & DURRËS / ALBANIA",
    locationZh: "阿尔巴尼亚 地拉那",
    year: "2022",
    coordinates: "41.3275° N, 19.8187° E",
    cover: "assets/photos/albania-tirana-cover.jpg",
    coverStyle: "cloth",
    spineColor: "#3A4D39",
    introEn: "Completing the Balkan summer arc across Tirana and the Adriatic port of Durrës. Vibrant painted facades, broad sunlit squares framed by Mount Dajti, and warm Mediterranean breezes along the coast.",
    introZh: "巴尔干夏日旅途的最后一站：走入阿尔巴尼亚首都地拉那与亚得里亚海港城杜勒斯。在达伊蒂山（Mount Dajti）的映衬下，色彩鲜明的建筑与海滨微风展现出独特的南欧生机。",
    quote: "Where Mount Dajti watches over painted facades and the warm Adriatic breeze.",
    photos: [
      {
        src: "assets/photos/albania-tirana.jpg",
        title: "Horizon of Tirana & the Albanian Coast",
        description: "Tirana & Durrës, Albania · Balkan mountain and coastal journey (Jun 2022)"
      },
      {
        src: "assets/photos/north-macedonia-ohrid.jpg",
        title: "Shared Waters — Lake Ohrid",
        description: "North Macedonia & Albania border · Alpine lake vista"
      },
      {
        src: "assets/photos/greece-santorini.jpg",
        title: "Ionian & Aegean Light",
        description: "Santorini, Greece · Caldera horizon to the south"
      },
      {
        src: "assets/photos/turkey-hagia-sophia.jpg",
        title: "Eastern Anchor — Istanbul",
        description: "Istanbul, Türkiye · Beginning of the June 2022 Balkan trail"
      }
    ]
  },
{
  "id": "abudhabi-lisa-su",
  "vol": "27",
  "title": "Meeting Dr. Lisa Su",
  "titleZh": "阿联酋 · 阿布扎比见 AMD 总裁苏姿丰",
  "category": "PEOPLE",
  "location": "ABU DHABI / UAE",
  "locationZh": "阿联酋 阿布扎比",
  "year": "2026",
  "coordinates": "24.4539° N, 54.3773° E",
  "cover": "assets/photos/uae-abudhabi-lisasu-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#1E3A5F",
  "introEn": "Meeting AMD Chair & CEO Dr. Lisa Su in Abu Dhabi—an inspiring dialogue on frontier AI compute, semiconductor leadership, and next-generation systems.",
  "introZh": "在阿联酋阿布扎比与 AMD 董事会主席兼首席执行官苏姿丰（Dr. Lisa Su）博士合影交流，见证算力时代的前沿盛会。",
  "quote": "Where semiconductor engineering meets the future of frontier intelligence.",
  "photos": [
    {
      "src": "assets/photos/uae-abudhabi-lisasu.jpg",
      "title": "With Dr. Lisa Su in Abu Dhabi",
      "description": "Abu Dhabi, UAE · Meeting AMD Chair & CEO Dr. Lisa Su"
    },
    {
      "src": "assets/photos/uae-dubai-motf.jpg",
      "title": "Museum of the Future — Dubai",
      "description": "Dubai, UAE · Illuminated torus calligraphy at night"
    },
    {
      "src": "assets/photos/uae-dubai-difc.jpg",
      "title": "DIFC Gate Village",
      "description": "Dubai, UAE · Financial center evening walk"
    }
  ]
},
{
  "id": "heidelberg-hlf-2025",
  "vol": "28",
  "title": "Heidelberg Laureate Forum",
  "titleZh": "德国 · 海德堡参加 HLF 学者论坛",
  "category": "PEOPLE",
  "location": "HEIDELBERG / GERMANY",
  "locationZh": "德国 海德堡",
  "year": "2025",
  "coordinates": "49.4106° N, 8.7064° E",
  "cover": "assets/photos/germany-heidelberg-hlf-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#28385E",
  "introEn": "Selected as a Young Researcher & Carl-Zeiss-Stiftung Abbe Grant Fellow at the Heidelberg Laureate Forum, exchanging ideas with Turing, Abel, and Fields laureates.",
  "introZh": "受邀赴德国海德堡参加海德堡桂冠学者论坛（HLF），与图灵奖、阿贝尔奖、菲尔兹奖得主及全球青年学者深度交流。",
  "quote": "Generations of mathematics and computer science gathered by the Neckar.",
  "photos": [
    {
      "src": "assets/photos/germany-heidelberg-hlf.jpg",
      "title": "At the Heidelberg Laureate Forum",
      "description": "Heidelberg, Germany · Young Researcher at HLF (Sep 2025)"
    },
    {
      "src": "assets/photos/germany-heidelberg-stage.jpg",
      "title": "HLF Main Auditorium",
      "description": "Heidelberg University · Forum stage and plenary hall"
    },
    {
      "src": "assets/photos/germany-heidelberg-cruise.jpg",
      "title": "Neckar River Fellowship Cruise",
      "description": "Heidelberg, Germany · Fellow researchers aboard the Neckar boat"
    }
  ]
},
{
  "id": "sanfran-y-combinator",
  "vol": "29",
  "title": "Y Combinator in SF",
  "titleZh": "美国 · 旧金山 Y Combinator",
  "category": "MOMENTS",
  "location": "SAN FRANCISCO / USA",
  "locationZh": "美国 旧金山",
  "year": "2025",
  "coordinates": "37.7618° N, 122.3885° W",
  "cover": "assets/photos/usa-sanfran-yc-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#D95D24",
  "introEn": "Standing before the iconic orange Y Combinator sign in San Francisco—at the epicenter of builders, founders, and AI innovation in the Bay Area.",
  "introZh": "在美国旧金山造访创业圣地 Y Combinator，在标志性的橙色 YC 门牌前定格硅谷与湾区创业浪潮的活力瞬间。",
  "quote": "Make something people want—under the California sun in Dogpatch.",
  "photos": [
    {
      "src": "assets/photos/usa-sanfran-yc.jpg",
      "title": "At Y Combinator — San Francisco",
      "description": "San Francisco, California · Outside the Y Combinator campus (Nov 2025)"
    },
    {
      "src": "assets/photos/usa-la-hollywood.jpg",
      "title": "Hollywood Hills — Los Angeles",
      "description": "Los Angeles, California · Overlooking the Hollywood Sign"
    },
    {
      "src": "assets/photos/usa-portland-falls.jpg",
      "title": "Multnomah Falls — Oregon",
      "description": "Columbia River Gorge, Oregon · Two-tier cascade and Benson Bridge"
    }
  ]
},
{
  "id": "dubai-museum-of-the-future",
  "vol": "30",
  "title": "Museum of the Future",
  "titleZh": "阿联酋 · 迪拜未来博物馆夜景",
  "category": "CITY",
  "location": "DUBAI / UAE",
  "locationZh": "阿联酋 迪拜",
  "year": "2025",
  "coordinates": "25.2192° N, 55.2819° E",
  "cover": "assets/photos/uae-dubai-motf-cover.jpg",
  "coverStyle": "bleed",
  "spineColor": "#2E3545",
  "introEn": "Beneath the stainless-steel torus of Dubai Museum of the Future, where illuminated Arabic calligraphy wraps around an architectural window into tomorrow.",
  "introZh": "夜幕下的迪拜未来博物馆（Museum of the Future），流线型银色环状建筑上镌刻的阿拉伯书法在灯光下熠熠生辉。",
  "quote": "The future belongs to those who can imagine it, design it, and execute it.",
  "photos": [
    {
      "src": "assets/photos/uae-dubai-motf.jpg",
      "title": "Museum of the Future at Night",
      "description": "Sheikh Zayed Road, Dubai · Illuminated calligraphic facade"
    },
    {
      "src": "assets/photos/uae-dubai-difc.jpg",
      "title": "Dubai International Financial Centre",
      "description": "DIFC, Dubai · Evening architecture and promenade"
    },
    {
      "src": "assets/photos/uae-dubai-yacht.jpg",
      "title": "Dubai Marina Yacht Excursion",
      "description": "Dubai Marina · Cruising into the Arabian Gulf"
    }
  ]
},
{
  "id": "dubai-difc-nights",
  "vol": "31",
  "title": "DIFC Financial Hub",
  "titleZh": "阿联酋 · 迪拜 DIFC 金融中心",
  "category": "CITY",
  "location": "DUBAI / UAE",
  "locationZh": "阿联酋 迪拜",
  "year": "2025",
  "coordinates": "25.2116° N, 55.2797° E",
  "cover": "assets/photos/uae-dubai-difc-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#1F2833",
  "introEn": "An evening walk through the Dubai International Financial Centre (DIFC), where galleries, fine dining, and sculptural high-rises converge in the heart of Dubai.",
  "introZh": "漫步阿联酋迪拜国际金融中心（DIFC），现代摩天楼群、艺术画廊与充满活力的夜间街区交织出中东金融中枢的独特气质。",
  "quote": "Glass towers and warm desert evenings in the financial heart of the Gulf.",
  "photos": [
    {
      "src": "assets/photos/uae-dubai-difc.jpg",
      "title": "Evening in DIFC",
      "description": "Dubai International Financial Centre · Urban architecture after dark"
    },
    {
      "src": "assets/photos/uae-dubai-motf.jpg",
      "title": "Adjacent Landmark — Museum of the Future",
      "description": "Dubai, UAE · Iconic torus skyline"
    },
    {
      "src": "assets/photos/uae-abudhabi-lisasu.jpg",
      "title": "UAE Tech & Leadership — Abu Dhabi",
      "description": "Abu Dhabi, UAE · With Dr. Lisa Su"
    }
  ]
},
{
  "id": "heidelberg-castle-panorama",
  "vol": "32",
  "title": "Overlooking Heidelberg",
  "titleZh": "德国 · 海德堡古堡与内卡河远眺",
  "category": "NATURE",
  "location": "HEIDELBERG / GERMANY",
  "locationZh": "德国 海德堡",
  "year": "2025",
  "coordinates": "49.4106° N, 8.7153° E",
  "cover": "assets/photos/germany-heidelberg-castle-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#3A523F",
  "introEn": "Looking out from the hillside terraces of Heidelberg Castle across terracotta rooftops, the Old Bridge, and the green hills of the Neckar River valley.",
  "introZh": "登上海德堡山腰远眺，红瓦连绵的老城屋顶、横跨内卡河的老桥与葱郁山谷尽收眼底，浪漫主义的诗意在此流淌。",
  "quote": "Red sandstone ruins and river bridges framed by the Odenwald hills.",
  "photos": [
    {
      "src": "assets/photos/germany-heidelberg-castle.jpg",
      "title": "Heidelberg Valley Panorama",
      "description": "Heidelberg, Germany · View over the Old Town and Neckar valley (Sep 2025)"
    },
    {
      "src": "assets/photos/germany-heidelberg-hlf.jpg",
      "title": "Heidelberg Laureate Forum",
      "description": "Heidelberg, Germany · Academic gathering in the historic city"
    },
    {
      "src": "assets/photos/germany-frankfurt-bundesliga.jpg",
      "title": "Nearby Main Metropolis — Frankfurt",
      "description": "Frankfurt, Germany · Bundesliga matchday atmosphere"
    }
  ]
},
{
  "id": "frankfurt-bundesliga-match",
  "vol": "33",
  "title": "Bundesliga Matchday",
  "titleZh": "德国 · 法兰克福看德甲联赛现场",
  "category": "MOMENTS",
  "location": "FRANKFURT / GERMANY",
  "locationZh": "德国 法兰克福",
  "year": "2025",
  "coordinates": "50.0686° N, 8.6455° E",
  "cover": "assets/photos/germany-frankfurt-bundesliga-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#8C1D24",
  "introEn": "Inside Deutsche Bank Park in Frankfurt experiencing the thunderous chants, flags, and electric passion of live German Bundesliga football.",
  "introZh": "走进德国法兰克福德意志银行公园球场（Deutsche Bank Park），在震耳欲聋的助威歌声与漫天旗帜中亲历德甲联赛的狂热现场。",
  "quote": "Sixty thousand voices rising in unison under the stadium floodlights.",
  "photos": [
    {
      "src": "assets/photos/germany-frankfurt-bundesliga.jpg",
      "title": "Live at the Bundesliga — Frankfurt",
      "description": "Frankfurt am Main, Germany · Stadium atmosphere and pitch view (Sep 2025)"
    },
    {
      "src": "assets/photos/city-frankfurt.jpg",
      "title": "Mainhattan Skyline",
      "description": "Frankfurt, Germany · Main River bridges at dusk"
    },
    {
      "src": "assets/photos/germany-heidelberg-castle.jpg",
      "title": "South Along the Rhine-Main — Heidelberg",
      "description": "Heidelberg, Germany · Hillside panorama"
    }
  ]
},
{
  "id": "helsinki-central-station",
  "vol": "34",
  "title": "Helsinki Central Station",
  "titleZh": "芬兰 · 赫尔辛基中央火车站站台",
  "category": "TRAVEL",
  "location": "HELSINKI / FINLAND",
  "locationZh": "芬兰 赫尔辛基",
  "year": "2026",
  "coordinates": "60.1719° N, 24.9414° E",
  "cover": "assets/photos/finland-helsinki-station-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#2C4251",
  "introEn": "Arriving on the platforms of Eliel Saarinen’s iconic granite station in Helsinki—beginning a winter Nordic rail journey across Finland.",
  "introZh": "站在芬兰赫尔辛基中央火车站的站台，从埃利尔·萨里宁设计的花岗岩经典车站出发，开启横跨芬兰南北的北欧冬日铁道之旅。",
  "quote": "Granite arches and Nordic rail tracks leading north into the Finnish winter.",
  "photos": [
    {
      "src": "assets/photos/finland-helsinki-station.jpg",
      "title": "Platform at Helsinki Central Station",
      "description": "Helsinki, Finland · Nordic rail departure (Feb 2026)"
    },
    {
      "src": "assets/photos/finland-turku-castle.jpg",
      "title": "Medieval Fortress — Turku Castle",
      "description": "Turku, Finland · Historic stone walls on the Aura River"
    },
    {
      "src": "assets/photos/finland-tampere-night.jpg",
      "title": "Nordic Evening — Tampere",
      "description": "Tampere, Finland · Illuminated winter streetscape"
    }
  ]
},
{
  "id": "turku-medieval-castle",
  "vol": "35",
  "title": "Turku Medieval Castle",
  "titleZh": "芬兰 · 图尔库中世纪城堡",
  "category": "TRAVEL",
  "location": "TURKU / FINLAND",
  "locationZh": "芬兰 图尔库",
  "year": "2026",
  "coordinates": "60.4353° N, 22.2289° E",
  "cover": "assets/photos/finland-turku-castle-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#5B4636",
  "introEn": "Exploring Turku Castle (Turun linna), dating back to the 1280s at the mouth of the Aura River—the oldest medieval monument in Finland’s former capital.",
  "introZh": "探访芬兰最古老的城市图尔库，走进始建于 13 世纪末的图尔库城堡（Turun linna），在厚重的石墙与雪地中触摸北欧中世纪历史。",
  "quote": "Seven centuries of Baltic stone guarding the mouth of the Aura River.",
  "photos": [
    {
      "src": "assets/photos/finland-turku-castle.jpg",
      "title": "Before Turku Castle",
      "description": "Turku, Finland · 13th-century medieval fortress in winter (Feb 2026)"
    },
    {
      "src": "assets/photos/finland-helsinki-station.jpg",
      "title": "Coastal Line to Helsinki",
      "description": "Helsinki, Finland · Central railway terminal"
    },
    {
      "src": "assets/photos/finland-tampere-night.jpg",
      "title": "Inland Lakeland — Tampere",
      "description": "Tampere, Finland · Winter city lights"
    }
  ]
},
{
  "id": "tampere-nordic-night",
  "vol": "36",
  "title": "Nordic Night in Tampere",
  "titleZh": "芬兰 · 坦佩雷北欧夜色街景",
  "category": "CITY",
  "location": "TAMPERE / FINLAND",
  "locationZh": "芬兰 坦佩雷",
  "year": "2026",
  "coordinates": "61.4978° N, 23.7610° E",
  "cover": "assets/photos/finland-tampere-night-cover.jpg",
  "coverStyle": "bleed",
  "spineColor": "#1D263B",
  "introEn": "Quiet snow-dusted avenues and warm streetlamp glow in Tampere, nestled between lakes Näsijärvi and Pyhäjärvi in the heart of Finnish Lakeland.",
  "introZh": "漫步在芬兰内陆湖区名城坦佩雷（Tampere）的冬夜街头，静谧的白雪与温暖的街灯勾勒出北欧城市独有的澄澈与安宁。",
  "quote": "Between two frozen lakes, warm Nordic streetlights glow against the winter night.",
  "photos": [
    {
      "src": "assets/photos/finland-tampere-night.jpg",
      "title": "Winter Evening in Tampere",
      "description": "Tampere, Finland · Nordic streetscape after dark (Feb 2026)"
    },
    {
      "src": "assets/photos/finland-helsinki-station.jpg",
      "title": "Southern Capital — Helsinki",
      "description": "Helsinki, Finland · Central station platforms"
    },
    {
      "src": "assets/photos/finland-turku-castle.jpg",
      "title": "Southwest Coast — Turku",
      "description": "Turku, Finland · Medieval fortress"
    }
  ]
},
{
  "id": "riga-national-ballet",
  "vol": "37",
  "title": "Ballet at Riga Opera",
  "titleZh": "拉脱维亚 · 里加国家歌剧院看芭蕾",
  "category": "MOMENTS",
  "location": "RIGA / LATVIA",
  "locationZh": "拉脱维亚 里加",
  "year": "2026",
  "coordinates": "56.9504° N, 24.1142° E",
  "cover": "assets/photos/latvia-riga-ballet-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#6B242B",
  "introEn": "An evening of classical ballet inside the gilded 19th-century auditorium of the Latvian National Opera and Ballet in Riga.",
  "introZh": "走进拉脱维亚首都里加的国家歌剧院（Latvian National Opera），在十九世纪古典主义金色包厢与天鹅绒帷幕间欣赏一场芭蕾舞剧。",
  "quote": "Crimson velvet and gilded balconies in the cultural jewel of the Baltics.",
  "photos": [
    {
      "src": "assets/photos/latvia-riga-ballet.jpg",
      "title": "Inside the Latvian National Opera",
      "description": "Riga, Latvia · Classical ballet performance (Feb 2026)"
    },
    {
      "src": "assets/photos/finland-helsinki-station.jpg",
      "title": "Across the Baltic — Helsinki",
      "description": "Helsinki, Finland · Northern Baltic journey"
    },
    {
      "src": "assets/photos/finland-turku-castle.jpg",
      "title": "Baltic Heritage — Turku",
      "description": "Turku, Finland · Historic Baltic fortress"
    }
  ]
},
{
  "id": "hanoi-train-street",
  "vol": "38",
  "title": "Hanoi Train Street",
  "titleZh": "越南 · 河内网红火车街夜市",
  "category": "CITY",
  "location": "HANOI / VIETNAM",
  "locationZh": "越南 河内",
  "year": "2026",
  "coordinates": "21.0294° N, 105.8439° E",
  "cover": "assets/photos/vietnam-hanoi-trainstreet-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#8F4A27",
  "introEn": "Lantern-lit trackside cafes along Hanoi’s famous Train Street in the Old Quarter, where daily life unfolds inches from the narrow-gauge railway.",
  "introZh": "置身越南河内老城区著名的火车街（Train Street），铁轨两侧紧挨着灯火通明的咖啡座与彩灯，感受东南亚街头极具张力的烟火气息。",
  "quote": "Lanterns, espresso cups, and steel rails weaving through the heart of Old Hanoi.",
  "photos": [
    {
      "src": "assets/photos/vietnam-hanoi-trainstreet.jpg",
      "title": "Night Along Hanoi Train Street",
      "description": "Old Quarter, Hanoi, Vietnam · Trackside lanterns and cafes (Feb 2026)"
    },
    {
      "src": "assets/photos/philippines-cebu-sunrise.jpg",
      "title": "Southeast Asian Dawn — Cebu",
      "description": "Cebu Island, Philippines · Tropical coastal morning"
    },
    {
      "src": "assets/photos/singapore-merlion.jpg",
      "title": "Marina Bay — Singapore",
      "description": "Singapore · Equatorial harbor skyline"
    }
  ]
},
{
  "id": "cebu-island-sunrise",
  "vol": "39",
  "title": "Sunrise in Cebu",
  "titleZh": "菲律宾 · 宿务岛海滨民宿日出",
  "category": "NATURE",
  "location": "CEBU / PHILIPPINES",
  "locationZh": "菲律宾 宿务岛",
  "year": "2026",
  "coordinates": "10.3157° N, 123.8854° E",
  "cover": "assets/photos/philippines-cebu-sunrise-cover.jpg",
  "coverStyle": "bleed",
  "spineColor": "#2A5C6A",
  "introEn": "First morning light breaking over the tranquil tropical waters of Cebu Island in the Visayas—warm island breezes and palm-fringed horizons.",
  "introZh": "在菲律宾宿务岛（Cebu）海滨民宿迎接破晓晨光，椰林、礁石与平静的热带海面在朝霞中缓缓苏醒。",
  "quote": "Tropical dawn painting the Visayan Sea in quiet gold and turquoise.",
  "photos": [
    {
      "src": "assets/photos/philippines-cebu-sunrise.jpg",
      "title": "Coastal Guesthouse in Cebu",
      "description": "Cebu Island, Philippines · Tropical island retreat (Jan 2026)"
    },
    {
      "src": "assets/photos/vietnam-hanoi-trainstreet.jpg",
      "title": "Indochina Evening — Hanoi",
      "description": "Hanoi, Vietnam · Vibrant Train Street nightscape"
    },
    {
      "src": "assets/photos/thailand-skydive.jpg",
      "title": "Gulf of Thailand — Pattaya",
      "description": "Pattaya, Thailand · 13,000 ft over the tropical coast"
    }
  ]
},
{
  "id": "beijing-liangmaqiao-river",
  "vol": "40",
  "title": "Liangmaqiao by Night",
  "titleZh": "中国 · 北京亮马桥河畔夜景",
  "category": "CITY",
  "location": "BEIJING / CHINA",
  "locationZh": "中国 北京",
  "year": "2025",
  "coordinates": "39.9497° N, 116.4633° E",
  "cover": "assets/photos/china-beijing-liangmaqiao-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#1E2D40",
  "introEn": "Strolling along the illuminated waterfront promenade of Liangma River in Beijing, where bridges, reflections, and evening strollers animate the capital night.",
  "introZh": "漫步北京亮马河国际风情水岸，流光溢彩的跨河桥廊倒映在静谧河面之上，展现京城夏夜的松弛与灵动。",
  "quote": "Warm reflections along the Liangma River under the Beijing night sky.",
  "photos": [
    {
      "src": "assets/photos/china-beijing-liangmaqiao.jpg",
      "title": "Liangma River Waterfront at Night",
      "description": "Chaoyang, Beijing, China · Illuminated bridges and river reflections (Aug 2025)"
    },
    {
      "src": "assets/photos/japan-hokkaido-train.jpg",
      "title": "East Asian Journey — Hokkaido",
      "description": "Hokkaido, Japan · Scenic summer train through green fields"
    },
    {
      "src": "assets/photos/singapore-merlion.jpg",
      "title": "Asian Metropolis — Marina Bay",
      "description": "Singapore · Waterfront lights"
    }
  ]
},
{
  "id": "hokkaido-scenic-train",
  "vol": "41",
  "title": "Hokkaido Summer Rail",
  "titleZh": "日本 · 北海道夏日绿野观光列车",
  "category": "TRAVEL",
  "location": "HOKKAIDO / JAPAN",
  "locationZh": "日本 北海道",
  "year": "2025",
  "coordinates": "43.3421° N, 142.3832° E",
  "cover": "assets/photos/japan-hokkaido-train-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#355E3B",
  "introEn": "Riding a single-car countryside train across the lush green farmlands and rolling hills of summer Hokkaido.",
  "introZh": "搭乘北海道夏日田园观光列车穿行在翠绿的旷野与远山之间，车窗外是北国盛夏最治愈的色彩。",
  "quote": "Rolling along steel tracks through Hokkaido’s emerald summer fields.",
  "photos": [
    {
      "src": "assets/photos/japan-hokkaido-train.jpg",
      "title": "Countryside Train in Hokkaido",
      "description": "Hokkaido, Japan · Summer rail journey across the northern plains (Jul 2025)"
    },
    {
      "src": "assets/photos/japan-mount-fuji.jpg",
      "title": "Volcanic Summit & Clouds",
      "description": "Japan · High above the volcanic crater sea of clouds"
    },
    {
      "src": "assets/photos/city-sapporo.jpg",
      "title": "Northern Capital — Sapporo",
      "description": "Sapporo, Hokkaido · Evening boulevard"
    }
  ]
},
{
  "id": "doha-lamp-bear",
  "vol": "42",
  "title": "Doha Lamp Bear",
  "titleZh": "卡塔尔 · 多哈机场大黄熊地标",
  "category": "MOMENTS",
  "location": "DOHA / QATAR",
  "locationZh": "卡塔尔 多哈",
  "year": "2025",
  "coordinates": "25.2731° N, 51.6081° E",
  "cover": "assets/photos/qatar-doha-lampbear-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#8C6D1F",
  "introEn": "Beneath Urs Fischer’s 23-foot canary-yellow bronze Lamp Bear at Hamad International Airport in Doha—the unmistakable art landmark of Gulf transit.",
  "introZh": "在卡塔尔多哈哈马德国际机场标志性的巨型黄色台灯泰迪熊（Lamp Bear）雕塑前驻足，连接东西方航线的海湾艺术坐标。",
  "quote": "A twenty-three-foot bronze bear beneath the vaulted glass of Doha.",
  "photos": [
    {
      "src": "assets/photos/qatar-doha-lampbear.jpg",
      "title": "Urs Fischer’s Lamp Bear — Doha",
      "description": "Hamad International Airport, Doha, Qatar · Iconic contemporary sculpture (Sep 2025)"
    },
    {
      "src": "assets/photos/qatar-doha-museum.jpg",
      "title": "National Museum of Qatar",
      "description": "Doha, Qatar · Desert Rose architectural discs"
    },
    {
      "src": "assets/photos/city-doha.jpg",
      "title": "Doha Corniche Skyline",
      "description": "Doha, Qatar · Bay reflections"
    }
  ]
},
{
  "id": "istanbul-bosphorus-crossroads",
  "vol": "43",
  "title": "Bosphorus Crossroads",
  "titleZh": "土耳其 · 伊斯坦布尔亚欧大陆十字路口",
  "category": "TRAVEL",
  "location": "ISTANBUL / TÜRKIYE",
  "locationZh": "土耳其 伊斯坦布尔",
  "year": "2025",
  "coordinates": "41.0256° N, 28.9742° E",
  "cover": "assets/photos/turkey-istanbul-bosphorus-cover.jpg",
  "coverStyle": "bleed",
  "spineColor": "#284B63",
  "introEn": "Standing at the maritime crossroads of Europe and Asia along the Bosphorus in Istanbul, where ferries, domes, and seagulls bridge two continents.",
  "introZh": "重返土耳其伊斯坦布尔，站在连接欧洲与亚洲大陆的博斯普鲁斯海峡之畔，看渡轮与海鸥在两座大洲的天际线之间穿梭。",
  "quote": "One city, two continents, and the timeless current of the Bosphorus.",
  "photos": [
    {
      "src": "assets/photos/turkey-istanbul-bosphorus.jpg",
      "title": "Crossroads of Europe and Asia",
      "description": "Istanbul, Türkiye · Overlooking the Bosphorus and historic peninsula (Sep 2025)"
    },
    {
      "src": "assets/photos/turkey-hagia-sophia.jpg",
      "title": "Courtyard of Hagia Sophia",
      "description": "Sultanahmet, Istanbul · Ottoman fountain and summer roses"
    },
    {
      "src": "assets/photos/city-istanbul.jpg",
      "title": "Golden Horn Panorama",
      "description": "Istanbul, Türkiye · Minarets at twilight"
    }
  ]
},
{
  "id": "aegina-pistachio-ferry",
  "vol": "44",
  "title": "Ferry to Aegina",
  "titleZh": "希腊 · 乘游船前往埃伊纳开心果岛",
  "category": "TRAVEL",
  "location": "AEGINA / GREECE",
  "locationZh": "希腊 埃伊纳岛",
  "year": "2025",
  "coordinates": "37.7476° N, 23.4285° E",
  "cover": "assets/photos/greece-aegina-ferry-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#1A5276",
  "introEn": "On the open sun deck of the ferry crossing the Saronic Gulf from Athens toward Aegina—Greece’s beloved pistachio island.",
  "introZh": "从雅典比雷埃夫斯港乘游船驶入萨罗尼克湾，在湛蓝海风中前往盛产开心果的希腊埃伊纳岛（Aegina）。",
  "quote": "Salt wind, white wake, and deep Saronic blue on the deck to Aegina.",
  "photos": [
    {
      "src": "assets/photos/greece-aegina-ferry.jpg",
      "title": "Aboard the Ferry to Aegina Island",
      "description": "Saronic Gulf, Greece · Sea crossing toward the pistachio island (Sep 2025)"
    },
    {
      "src": "assets/photos/greece-santorini.jpg",
      "title": "The Parthenon — Athens Acropolis",
      "description": "Athens, Greece · Classical Doric columns against the Aegean sky"
    },
    {
      "src": "assets/photos/city-athens.jpg",
      "title": "Athens From Above",
      "description": "Athens, Greece · Acropolis rock in golden light"
    }
  ]
},
{
  "id": "newyork-statue-of-liberty",
  "vol": "45",
  "title": "New York Harbor & Liberty",
  "titleZh": "美国 · 纽约自由女神像游船",
  "category": "CITY",
  "location": "NEW YORK / USA",
  "locationZh": "美国 纽约",
  "year": "2025",
  "coordinates": "40.6892° N, 74.0445° W",
  "cover": "assets/photos/usa-newyork-liberty-cover.jpg",
  "coverStyle": "editorial",
  "spineColor": "#2C4A52",
  "introEn": "Cruising across Upper New York Bay past the Statue of Liberty and the towering skyline of Lower Manhattan.",
  "introZh": "乘游船驶过纽约港，在海风中近距离仰望自由女神像，远眺曼哈顿下城摩天大楼群构成的经典天际线。",
  "quote": "Copper patina and harbor spray before the towers of Manhattan.",
  "photos": [
    {
      "src": "assets/photos/usa-newyork-liberty.jpg",
      "title": "By the Statue of Liberty — New York Harbor",
      "description": "New York City, USA · Harbor cruise past Liberty Island (Nov 2025)"
    },
    {
      "src": "assets/photos/city-new-york.jpg",
      "title": "Manhattan Skyline",
      "description": "New York City, USA · Midtown towers at sunset"
    },
    {
      "src": "assets/photos/usa-oak-alley.jpg",
      "title": "Southern Historic Trail — Louisiana",
      "description": "New Orleans, USA · Live oak canopy"
    }
  ]
},
{
  "id": "los-angeles-hollywood-hills",
  "vol": "46",
  "title": "Hollywood Hills",
  "titleZh": "美国 · 洛杉矶好莱坞山远眺",
  "category": "MOMENTS",
  "location": "LOS ANGELES / USA",
  "locationZh": "美国 洛杉矶",
  "year": "2025",
  "coordinates": "34.1341° N, 118.3215° W",
  "cover": "assets/photos/usa-la-hollywood-cover.jpg",
  "coverStyle": "bleed",
  "spineColor": "#7E513A",
  "introEn": "Up in the sunlit chaparral ridges of the Santa Monica Mountains overlooking the iconic white letters of the Hollywood Sign in Los Angeles.",
  "introZh": "登上加州洛杉矶好莱坞山（Hollywood Hills），在澄澈的南加州阳光下与远山上的 HOLLYWOOD 标志同框。",
  "quote": "California sunshine and canyon trails high above Los Angeles.",
  "photos": [
    {
      "src": "assets/photos/usa-la-hollywood.jpg",
      "title": "Before the Hollywood Sign — Los Angeles",
      "description": "Hollywood Hills, Los Angeles, California · Autumn sun on the ridge (Sep 2025)"
    },
    {
      "src": "assets/photos/city-los-angeles.jpg",
      "title": "City of Angels Panorama",
      "description": "Los Angeles, California · Palm silhouettes and basin glow"
    },
    {
      "src": "assets/photos/usa-sanfran-yc.jpg",
      "title": "Northern California — Y Combinator",
      "description": "San Francisco, California · Bay Area innovation"
    }
  ]
},
{
  "id": "portland-multnomah-falls",
  "vol": "47",
  "title": "Multnomah Falls",
  "titleZh": "美国 · 波特兰摩特诺玛瀑布",
  "category": "NATURE",
  "location": "PORTLAND / USA",
  "locationZh": "美国 波特兰",
  "year": "2025",
  "coordinates": "45.5762° N, 122.1158° W",
  "cover": "assets/photos/usa-portland-falls-cover.jpg",
  "coverStyle": "cloth",
  "spineColor": "#2D4A3E",
  "introEn": "Standing before the 620-foot roaring double cascade of Multnomah Falls and the historic Benson Footbridge in Oregon’s Columbia River Gorge.",
  "introZh": "在俄勒冈州波特兰郊外的哥伦比亚河峡谷，仰望落差近两百米的摩特诺玛双层瀑布（Multnomah Falls）与横跨飞瀑的本森石桥。",
  "quote": "Six hundred feet of Pacific Northwest snowmelt thundering beneath Benson Bridge.",
  "photos": [
    {
      "src": "assets/photos/usa-portland-falls.jpg",
      "title": "At Multnomah Falls — Oregon",
      "description": "Columbia River Gorge, Portland, Oregon · Benson Footbridge and upper falls (Oct 2025)"
    },
    {
      "src": "assets/photos/city-seattle.jpg",
      "title": "Pacific Northwest — Seattle",
      "description": "Cascadia · Emerald skyline"
    },
    {
      "src": "assets/photos/usa-sanfran-yc.jpg",
      "title": "West Coast Trail — San Francisco",
      "description": "San Francisco, California · Y Combinator"
    }
  ]
}
];

const CATEGORIES = ["ALL", "TRAVEL", "CITY", "PEOPLE", "NATURE", "MOMENTS"];
const REVEAL_MODES = ["clip-up", "mask-slide", "vertical-wipe", "scale-reveal"];

/* ==========================================================================
   APPLICATION STATE & DOM REFERENCES
   ========================================================================== */

const state = {
  activeCategory: "ALL",
  filteredAlbums: [...albums],
  virtualSlots: [],       // Ring of >= 24 book slots for infinite wrap
  current: 0,             // Continuous floating-point index on virtual ring
  target: 0,              // Target floating-point index on virtual ring
  activeSlotIndex: 0,     // Math.round(target) mod M
  hoveredSlotIndex: -1,
  coverTiltX: 0,
  coverTiltY: 0,
  targetTiltX: 0,
  targetTiltY: 0,

  // Dimensions (recomputed on resize)
  bookH: 390,
  spineW: 47,
  coverW: 281,
  bookGap: 10,

  // Dragging state
  isDragging: false,
  dragStartX: 0,
  dragStartTarget: 0,
  dragMoved: 0,
  lastPointerX: 0,
  lastPointerTime: 0,
  dragVelocity: 0,

  // Gallery & Lightbox state
  isGalleryOpen: false,
  isTransitioning: false,
  openAlbum: null,
  isLightboxOpen: false,
  lightboxIndex: 0,
  lightboxOriginEl: null,

  // Custom Cursor
  cursorX: window.innerWidth / 2,
  cursorY: window.innerHeight / 2,
  cursorTargetX: window.innerWidth / 2,
  cursorTargetY: window.innerHeight / 2,
  reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

const dom = {
  shelfStage: document.getElementById("shelfStage"),
  shelf: document.getElementById("shelf"),
  shelfWorld: document.getElementById("shelfWorld"),
  categoryTrack: document.getElementById("categoryTrack"),
  categoryGlider: document.getElementById("categoryGlider"),
  collectionCountLabel: document.getElementById("collectionCountLabel"),
  prevAlbumBtn: document.getElementById("prevAlbumBtn"),
  nextAlbumBtn: document.getElementById("nextAlbumBtn"),
  infoIndexLine: document.getElementById("infoIndexLine"),
  infoTitleLine: document.getElementById("infoTitleLine"),
  infoLocationLine: document.getElementById("infoLocationLine"),
  infoMetaLine: document.getElementById("infoMetaLine"),
  paperSheet: document.getElementById("paperSheet"),
  galleryOverlay: document.getElementById("galleryOverlay"),
  galleryScroller: document.getElementById("galleryScroller"),
  galleryArticle: document.getElementById("galleryArticle"),
  galleryTopTitle: document.getElementById("galleryTopTitle"),
  galleryTopSub: document.getElementById("galleryTopSub"),
  galleryTopCount: document.getElementById("galleryTopCount"),
  closeGalleryBtn: document.getElementById("closeGalleryBtn"),
  lightbox: document.getElementById("lightbox"),
  lightboxBackdrop: document.getElementById("lightboxBackdrop"),
  lightboxCounter: document.getElementById("lightboxCounter"),
  lightboxAlbumTag: document.getElementById("lightboxAlbumTag"),
  lightboxCloseBtn: document.getElementById("lightboxCloseBtn"),
  lightboxPrevBtn: document.getElementById("lightboxPrevBtn"),
  lightboxNextBtn: document.getElementById("lightboxNextBtn"),
  lightboxImgCurrent: document.getElementById("lightboxImgCurrent"),
  lightboxImgNext: document.getElementById("lightboxImgNext"),
  lightboxTitle: document.getElementById("lightboxTitle"),
  lightboxDesc: document.getElementById("lightboxDesc"),
  customCursor: document.getElementById("customCursor"),
  cursorLabelEn: document.getElementById("cursorLabelEn"),
  cursorLabelZh: document.getElementById("cursorLabelZh"),
  navBackLink: document.getElementById("navBackLink")
};

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const mod = (n, m) => ((n % m) + m) % m;
const smoothstep = (x) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

/* ==========================================================================
   1. DYNAMIC VIEWPORT DIMENSIONS
   ========================================================================== */

function updateDimensions() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Follow specification: H = min(46vh, 31vw) on desktop, adapted on mobile so cover + spines fit
  let H;
  if (vw <= 680) {
    H = Math.min(vh * 0.41, vw * 0.54);
    H = clamp(H, 210, 320);
  } else if (vw <= 1024) {
    H = Math.min(vh * 0.44, vw * 0.36);
    H = clamp(H, 260, 380);
  } else {
    H = Math.min(vh * 0.46, vw * 0.31);
    H = clamp(H, 280, 460);
  }

  const S = Math.max(30, Math.round(H * 0.12));
  const W = Math.round(H * 0.72);
  const G = Math.max(6, Math.round(H * 0.025));

  state.bookH = H;
  state.spineW = S;
  state.coverW = W;
  state.bookGap = G;

  document.documentElement.style.setProperty("--book-h", `${H}px`);
  document.documentElement.style.setProperty("--spine-w", `${S}px`);
  document.documentElement.style.setProperty("--cover-w", `${W}px`);
  document.documentElement.style.setProperty("--book-gap", `${G}px`);

  updateCategoryGlider();
}

/* ==========================================================================
   2. CATEGORY FILTER BAR & GLIDER
   ========================================================================== */

function initCategories() {
  if (!dom.categoryTrack) return;
  const availableCategories = CATEGORIES.filter((cat) =>
    cat === "ALL" ? albums.length > 0 : albums.some((a) => a.category === cat)
  );

  // Keep glider element and append buttons
  availableCategories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn";
    btn.role = "tab";
    btn.dataset.category = cat;
    btn.dataset.cursor = "link";
    btn.setAttribute("aria-selected", cat === state.activeCategory ? "true" : "false");
    btn.textContent = cat;
    btn.addEventListener("click", () => selectCategory(cat));
    dom.categoryTrack.appendChild(btn);
  });

  requestAnimationFrame(updateCategoryGlider);
}

function updateCategoryGlider() {
  if (!dom.categoryTrack || !dom.categoryGlider) return;
  const activeBtn = dom.categoryTrack.querySelector(
    `.category-btn[data-category="${state.activeCategory}"]`
  );
  if (!activeBtn) return;

  const trackRect = dom.categoryTrack.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const offsetX = btnRect.left - trackRect.left - 2;

  dom.categoryGlider.style.width = `${btnRect.width}px`;
  dom.categoryGlider.style.transform = `translate3d(${offsetX}px, 0, 0)`;
}

function selectCategory(cat) {
  if (cat === state.activeCategory || state.isGalleryOpen || state.isTransitioning) return;

  state.activeCategory = cat;
  const buttons = dom.categoryTrack.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.category === cat ? "true" : "false");
  });
  updateCategoryGlider();

  state.filteredAlbums =
    cat === "ALL" ? [...albums] : albums.filter((a) => a.category === cat);

  if (dom.collectionCountLabel) {
    dom.collectionCountLabel.textContent = `${state.filteredAlbums.length} MONOGRAPHS`;
  }

  state.current = 0;
  state.target = 0;
  state.activeSlotIndex = 0;
  buildShelfDOM();
  updateCaptionInfo(state.filteredAlbums[0], 0, state.filteredAlbums.length, 1, true);
}

/* ==========================================================================
   3. BUILD 3D BOOKSHELF DOM (VIRTUAL INFINITE RING)
   ========================================================================== */

function buildShelfDOM() {
  dom.shelfWorld.innerHTML = "";
  state.virtualSlots = [];

  const source = state.filteredAlbums;
  if (!source.length) return;

  // Ensure at least 24 books on the ring so spines always reach both screen edges and wrap smoothly
  const minSlots = 24;
  const repeats = Math.max(1, Math.ceil(minSlots / source.length));
  const totalSlots = source.length * repeats;

  const fragment = document.createDocumentFragment();

  for (let s = 0; s < totalSlots; s++) {
    const albumIndex = s % source.length;
    const album = source[albumIndex];

    const albumEl = document.createElement("div");
    albumEl.className = "album";
    albumEl.dataset.slot = String(s);
    albumEl.dataset.albumId = album.id;
    albumEl.style.setProperty("--spine-bg", album.spineColor);
    albumEl.setAttribute("role", "group");
    albumEl.setAttribute("aria-label", `${album.title} (${album.year})`);

    const coverVariantClass = `album-cover--${album.coverStyle || "editorial"}`;

    albumEl.innerHTML = `
      <div class="album-shadow" aria-hidden="true"></div>
      <div class="album-book">
        <div class="album-back" aria-hidden="true"></div>
        <div class="album-pages" aria-hidden="true"></div>

        <!-- Narrow Spine (visible when unselected) -->
        <div class="album-spine">
          <span class="spine-vol">${album.vol}</span>
          <div class="spine-title-wrap">
            <span class="spine-title-en">${album.title}</span>
            <span class="spine-title-zh">${album.locationZh}</span>
          </div>
          <span class="spine-year">${album.year.slice(0, 4)}</span>
        </div>

        <!-- Front Cover (rotates out when selected) -->
        <div class="album-cover ${coverVariantClass}">
          <div class="cover-hinge" aria-hidden="true"></div>
          <div class="cover-glaze" aria-hidden="true"></div>

          <div class="cover-header">
            <span>VOL. ${album.vol}</span>
            <span>${album.category}</span>
          </div>

          <div class="cover-title-block">
            <h2 class="cover-title">${album.title}</h2>
            <span class="cover-subtitle">${album.titleZh}</span>
          </div>

          <div class="cover-photo-frame">
            <img class="cover-photo" src="${album.cover}" alt="${album.title}" decoding="async" />
          </div>

          <div class="cover-footer">
            <span>${album.location}</span>
            <span>${album.year}</span>
          </div>
        </div>
      </div>
    `;

    const spineEl = albumEl.querySelector(".album-spine");
    const coverEl = albumEl.querySelector(".album-cover");
    const shadowEl = albumEl.querySelector(".album-shadow");

    // Pointer hover states for custom cursor & 3D cover tilt
    albumEl.addEventListener("pointerenter", () => {
      state.hoveredSlotIndex = s;
      updateCursorForHoveredSlot(s);
    });

    albumEl.addEventListener("pointermove", (e) => {
      const isCenter = s === state.activeSlotIndex;
      updateCursorForHoveredSlot(s);
      if (isCenter) {
        const rect = coverEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          state.targetTiltY = clamp(nx * 6.5, -7, 7);
          state.targetTiltX = clamp(-ny * 5.5, -6, 6);
        }
      }
    });

    albumEl.addEventListener("pointerleave", () => {
      if (state.hoveredSlotIndex === s) {
        state.hoveredSlotIndex = -1;
      }
      state.targetTiltX = 0;
      state.targetTiltY = 0;
      setCursorMode("default");
    });

    // Click handler: if center book -> open gallery; if side spine -> glide to center
    albumEl.addEventListener("click", (e) => {
      if (state.dragMoved > 8 || state.isGalleryOpen || state.isTransitioning) return;
      e.stopPropagation();

      const M = state.virtualSlots.length;
      const diff = getShortestRingDelta(s, state.target, M);

      if (Math.abs(diff) < 0.35) {
        openAlbumGallery(s);
      } else {
        stepToTarget(Math.round(state.target + diff));
      }
    });

    state.virtualSlots.push({
      slotIndex: s,
      albumIndex,
      album,
      el: albumEl,
      spineEl,
      coverEl,
      shadowEl,
      hoverLift: 0
    });

    fragment.appendChild(albumEl);
  }

  dom.shelfWorld.appendChild(fragment);
  preloadNearbyAlbums();
}

function getShortestRingDelta(slotIndex, ref, M) {
  let d = (slotIndex - ref) % M;
  if (d > M / 2) d -= M;
  if (d < -M / 2) d += M;
  return d;
}

function updateCursorForHoveredSlot(slotIndex) {
  if (state.isGalleryOpen) return;
  const M = state.virtualSlots.length;
  const d = Math.abs(getShortestRingDelta(slotIndex, state.current, M));
  if (d < 0.42) {
    setCursorMode("cover", "OPEN", "相册");
  } else {
    setCursorMode("spine");
  }
}

/* ==========================================================================
   4. CONTINUOUS 3D SHELF ANIMATION ENGINE (requestAnimationFrame)
   ========================================================================== */

let lastFrameTime = performance.now();

function animateLoop(now) {
  const dt = Math.min((now - lastFrameTime) / 1000, 0.064);
  lastFrameTime = now;

  // 1. Update Custom Cursor position
  const cursorLerp = 1 - Math.exp(-18 * dt);
  state.cursorX += (state.cursorTargetX - state.cursorX) * cursorLerp;
  state.cursorY += (state.cursorTargetY - state.cursorY) * cursorLerp;
  if (dom.customCursor) {
    dom.customCursor.style.transform = `translate3d(${state.cursorX.toFixed(1)}px, ${state.cursorY.toFixed(1)}px, 0)`;
  }

  // 2. Update 3D Shelf Physics & Book Transforms
  const M = state.virtualSlots.length;
  if (M > 0 && !state.isGalleryOpen) {
    const smoothFactor = state.reducedMotion ? 1 : 1 - Math.exp(-5.2 * dt);
    state.current += (state.target - state.current) * smoothFactor;

    // Smooth 3D Cover Tilt interpolation
    const tiltLerp = 1 - Math.exp(-10 * dt);
    state.coverTiltX += (state.targetTiltX - state.coverTiltX) * tiltLerp;
    state.coverTiltY += (state.targetTiltY - state.coverTiltY) * tiltLerp;

    // Detect active book index change to trigger mask-scroll caption update
    const nearestSlot = mod(Math.round(state.current), M);
    if (nearestSlot !== state.activeSlotIndex) {
      const prevSlot = state.activeSlotIndex;
      state.activeSlotIndex = nearestSlot;
      const dir = getShortestRingDelta(nearestSlot, prevSlot, M) >= 0 ? 1 : -1;
      const slotObj = state.virtualSlots[nearestSlot];
      if (slotObj) {
        updateCaptionInfo(
          slotObj.album,
          slotObj.albumIndex,
          state.filteredAlbums.length,
          dir,
          false
        );
        preloadNearbyAlbums();
      }
    }

    renderShelfFrame(dt);
  }

  // 3. Update Scroll-Driven Parallax inside Gallery when open
  if (state.isGalleryOpen) {
    updateGalleryParallax();
  }

  requestAnimationFrame(animateLoop);
}

function renderShelfFrame(dt) {
  const M = state.virtualSlots.length;
  const S = state.spineW;
  const W = state.coverW;
  const G = state.bookGap;
  const pitch = S + G;

  // Clearance space pushed open on both sides of the active rotating book
  const openClearance = (W - S) * 0.56 + S * 0.92;

  for (let i = 0; i < M; i++) {
    const slot = state.virtualSlots[i];
    const d = getShortestRingDelta(i, state.current, M);
    const absD = Math.abs(d);

    // Hide far wrap-around slots outside the visible horizon
    if (absD > 11.2) {
      slot.el.style.visibility = "hidden";
      slot.el.style.pointerEvents = "none";
      continue;
    }

    // Openness progress p in [0, 1]: 1 when centered, 0 when |d| >= 1
    const p = absD < 1 ? smoothstep(1 - absD) : 0;

    // Smooth hover lift for unselected spines
    const isHoveredSpine = state.hoveredSlotIndex === i && p < 0.25 && !state.isDragging;
    const targetLift = isHoveredSpine ? -11 : 0;
    slot.hoverLift += (targetLift - slot.hoverLift) * (1 - Math.exp(-14 * dt));

    // Continuous trigonometric shelf parting so rotating cover never clips neighbors
    const pushFactor = Math.sin(Math.PI * 0.5 * clamp(d, -1, 1));
    const shelfX = d * pitch + pushFactor * openClearance;

    // Center compensation as hinge rotates from spine (width S) to cover (width W)
    const pivotCenterShift = -((W - S) * 0.5 + S) * p;
    const x = shelfX + pivotCenterShift;

    // Vertical lift & Z prominence for active book
    const y = -14 * p + slot.hoverLift * (1 - p);
    const z = 115 * p - Math.min(absD * 4, 36) * (1 - p);

    // 3D Rotations: rotateY from 0deg (spine) to -90deg (front cover), plus -4deg tilt & mouse tilt
    const rotY = -90 * p + state.coverTiltY * p;
    const rotZ = -4 * p;
    const rotX = state.coverTiltX * p;

    // Edge fade near wrap boundary (only apply opacity when p === 0 so preserve-3d is never flattened!)
    const edgeOpacity = absD > 9.5 ? clamp(1 - (absD - 9.5) / 1.7, 0, 1) : 1;

    slot.el.style.visibility = "visible";
    slot.el.style.opacity = edgeOpacity < 0.999 ? edgeOpacity.toFixed(3) : "";
    slot.el.style.pointerEvents = edgeOpacity > 0.2 ? "auto" : "none";
    slot.el.style.zIndex = String(Math.round(100 - absD * 8 + p * 50));
    slot.el.classList.toggle("is-active", p > 0.65);

    slot.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

    // Dynamic ground shadow under the open cover
    if (slot.shadowEl) {
      const shadowOpacity = (0.58 * p * p).toFixed(2);
      slot.shadowEl.style.opacity = shadowOpacity;
    }
  }
}

function stepToTarget(newTarget) {
  if (state.isGalleryOpen || state.isTransitioning) return;
  state.target = newTarget;
}

/* ==========================================================================
   5. BELOW-SHELF MASK-SCROLL TEXT TRANSITION (Web Animations API)
   ========================================================================== */

function updateCaptionInfo(album, indexInCat, totalInCat, dir = 1, immediate = false) {
  if (!album) return;

  const indexStr = `VOL. ${String(indexInCat + 1).padStart(2, "0")} / ${String(totalInCat).padStart(2, "0")}`;
  const titleStr = album.title;
  const locStr = `${album.location} · ${album.locationZh}`;
  const metaStr = `${album.year} · ${album.photos.length} PHOTOS`;

  const items = [
    { el: dom.infoIndexLine, text: indexStr, delay: 0 },
    { el: dom.infoTitleLine, text: titleStr, delay: 35 },
    { el: dom.infoLocationLine, text: locStr, delay: 70 },
    { el: dom.infoMetaLine, text: metaStr, delay: 105 }
  ];

  if (immediate || state.reducedMotion || !Element.prototype.animate) {
    items.forEach(({ el, text }) => {
      if (el) el.textContent = text;
    });
    return;
  }

  const enterFrom = dir >= 0 ? "108%" : "-108%";

  items.forEach(({ el, text, delay }) => {
    if (!el) return;
    el.textContent = text;
    el.getAnimations().forEach((anim) => anim.cancel());
    el.animate(
      [
        { transform: `translateY(${enterFrom})` },
        { transform: "translateY(0%)" }
      ],
      {
        duration: 640,
        delay,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "both"
      }
    );
  });
}

/* ==========================================================================
   6. PAPER EXPANSION ANIMATION & CINEMATIC GALLERY
   ========================================================================== */

function getActiveSlotObject() {
  const M = state.virtualSlots.length;
  if (!M) return null;
  const idx = mod(Math.round(state.current), M);
  return state.virtualSlots[idx];
}

function getCoverInsetClip(coverEl) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!coverEl) {
    return "inset(25% 35% 25% 35% round 4px)";
  }
  const rect = coverEl.getBoundingClientRect();
  const top = clamp(Math.round(rect.top), 0, vh - 20);
  const left = clamp(Math.round(rect.left), 0, vw - 20);
  const right = clamp(Math.round(vw - rect.right), 0, vw - 20);
  const bottom = clamp(Math.round(vh - rect.bottom), 0, vh - 20);
  return `inset(${top}px ${right}px ${bottom}px ${left}px round 4px)`;
}

function openAlbumGallery(slotIdx) {
  if (state.isGalleryOpen || state.isTransitioning) return;

  const M = state.virtualSlots.length;
  const targetSlot = state.virtualSlots[mod(slotIdx, M)] || getActiveSlotObject();
  if (!targetSlot) return;

  state.isTransitioning = true;
  state.target = Math.round(state.current);
  state.openAlbum = targetSlot.album;
  setCursorMode("default");

  // Populate Gallery DOM before starting expansion
  renderGalleryArticle(targetSlot.album);
  dom.galleryScroller.scrollTop = 0;

  const coverEl = targetSlot.coverEl;
  const startClip = getCoverInsetClip(coverEl);
  const endClip = "inset(0px 0px 0px 0px round 0px)";

  // Stage 1: Pull 3D book slightly forward & straighten cover
  if (!state.reducedMotion && targetSlot.el.animate) {
    targetSlot.el.animate(
      [
        { transform: targetSlot.el.style.transform },
        {
          transform: "translate3d(0px, -18px, 195px) rotateZ(0deg) rotateX(0deg) rotateY(-90deg)"
        }
      ],
      {
        duration: 380,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      }
    );
  }

  // Stage 2: Expand Warm Cream Paper Sheet from exact cover coordinates to fullscreen
  dom.paperSheet.classList.add("is-active");
  dom.paperSheet.getAnimations().forEach((a) => a.cancel());

  const expandAnim = dom.paperSheet.animate(
    [
      { clipPath: startClip, opacity: 0.92 },
      { clipPath: endClip, opacity: 1 }
    ],
    {
      duration: state.reducedMotion ? 180 : 960,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );

  // Stage 3: Reveal Gallery Overlay & Trigger Mask Reveals
  setTimeout(() => {
    state.isGalleryOpen = true;
    dom.galleryOverlay.classList.add("is-open");
    dom.galleryOverlay.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      dom.galleryOverlay.classList.add("is-revealed");
      observeGalleryPhotoReveals();
      updateGalleryParallax();
    });
  }, state.reducedMotion ? 60 : 540);

  expandAnim.onfinish = () => {
    state.isTransitioning = false;
  };
}

function closeAlbumGallery() {
  if (!state.isGalleryOpen || state.isTransitioning) return;
  if (state.isLightboxOpen) {
    closeLightbox();
    return;
  }

  state.isTransitioning = true;
  setCursorMode("default");

  const activeSlot = getActiveSlotObject();
  const targetClip = getCoverInsetClip(activeSlot ? activeSlot.coverEl : null);
  const fullClip = "inset(0px 0px 0px 0px round 0px)";

  // Fade out gallery content while shrinking paper back to the 3D cover
  dom.galleryOverlay.classList.remove("is-revealed");
  dom.galleryOverlay.classList.remove("is-open");
  dom.galleryOverlay.setAttribute("aria-hidden", "true");

  dom.paperSheet.getAnimations().forEach((a) => a.cancel());
  const shrinkAnim = dom.paperSheet.animate(
    [
      { clipPath: fullClip, opacity: 1 },
      { clipPath: targetClip, opacity: 0.94 }
    ],
    {
      duration: state.reducedMotion ? 160 : 900,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );

  shrinkAnim.onfinish = () => {
    dom.paperSheet.classList.remove("is-active");
    state.isGalleryOpen = false;
    state.isTransitioning = false;
  };
}

/* ==========================================================================
   7. GALLERY EDITORIAL RENDERER & SCROLL-DRIVEN PARALLAX
   ========================================================================== */

let galleryObserver = null;

function renderGalleryArticle(album) {
  dom.galleryTopTitle.textContent = album.title;
  dom.galleryTopSub.textContent = `${album.location} · ${album.year}`;
  dom.galleryTopCount.textContent = `${String(album.photos.length).padStart(2, "0")} PHOTOS`;

  const heroPhoto = album.photos[0];
  const p1 = album.photos[1] || heroPhoto;
  const p2 = album.photos[2] || heroPhoto;
  const p3 = album.photos[3] || p1;
  const p4 = album.photos[4] || null;

  let extraDiptychHTML = "";
  if (p4) {
    extraDiptychHTML = `
      <div class="spread--bleed">
        <figure class="photo-card" data-photo-index="4">
          <div class="photo-frame" data-reveal="${REVEAL_MODES[3]}" data-parallax-speed="0.11">
            <img class="photo-frame__img" src="${p4.src}" alt="${p4.title}" loading="lazy" decoding="async" />
          </div>
          <figcaption class="photo-caption" data-caption-speed="-0.03">
            <span class="photo-caption__num">PLATE 05</span>
            <div class="photo-caption__text">
              <span class="photo-caption__title">${p4.title}</span>
              <span class="photo-caption__desc">${p4.description}</span>
            </div>
          </figcaption>
        </figure>
      </div>
    `;
  }

  dom.galleryArticle.innerHTML = `
    <!-- Editorial Monograph Title & Metadata Header -->
    <header class="gallery-hero">
      <div class="gallery-hero__title-col">
        <div class="gallery-eyebrow">MONOGRAPH VOL. ${album.vol} · ${album.category}</div>
        <span class="gallery-mask">
          <h1 class="gallery-main-title gallery-mask__inner">${album.title}</h1>
        </span>
        <span class="gallery-mask">
          <p class="gallery-sub-zh gallery-mask__inner" style="transition-delay: 90ms">${album.titleZh}</p>
        </span>
      </div>

      <div class="gallery-hero__meta-grid">
        <div class="meta-cell">
          <span class="meta-cell__label">LOCATION / 地点</span>
          <span class="meta-cell__val">${album.location}</span>
        </div>
        <div class="meta-cell">
          <span class="meta-cell__label">YEAR / 年份</span>
          <span class="meta-cell__val">${album.year}</span>
        </div>
        <div class="meta-cell">
          <span class="meta-cell__label">COORDINATES / 坐标</span>
          <span class="meta-cell__val">${album.coordinates}</span>
        </div>
        <div class="meta-cell">
          <span class="meta-cell__label">PLATES / 收录影像</span>
          <span class="meta-cell__val">${album.photos.length} Photographs</span>
        </div>
      </div>
    </header>

    <!-- Full-Width Cover Plate with Ken Burns & Parallax -->
    <figure class="gallery-hero-plate" data-photo-index="0">
      <img class="gallery-hero-plate__img" src="${heroPhoto.src}" alt="${heroPhoto.title}" decoding="async" />
      <figcaption class="gallery-hero-plate__badge">
        PLATE 01 · ${heroPhoto.title}
      </figcaption>
    </figure>

    <!-- Bilingual Editorial Essay & Field Notes -->
    <section class="gallery-intro">
      <div class="gallery-intro__kicker">
        FIELD NOTES<br />
        ARCHIVE NO. ${album.vol}<br />
        ${album.locationZh}
      </div>
      <div class="gallery-intro__body">
        <p class="gallery-intro__en">${album.introEn}</p>
        <p class="gallery-intro__zh">${album.introZh}</p>
      </div>
    </section>

    <!-- Curated Multi-Layout Photography Narrative -->
    <section class="gallery-spreads">
      <!-- Spread 1: Asymmetric Two-Column Editorial Composition -->
      <div class="spread--asymmetric">
        <figure class="photo-card photo-card--primary" data-photo-index="0">
          <div class="photo-frame" data-reveal="${REVEAL_MODES[0]}" data-parallax-speed="0.09">
            <img class="photo-frame__img" src="${heroPhoto.src}" alt="${heroPhoto.title}" loading="lazy" decoding="async" />
          </div>
          <figcaption class="photo-caption" data-caption-speed="-0.025">
            <span class="photo-caption__num">PLATE 01</span>
            <div class="photo-caption__text">
              <span class="photo-caption__title">${heroPhoto.title}</span>
              <span class="photo-caption__desc">${heroPhoto.description}</span>
            </div>
          </figcaption>
        </figure>

        <div class="photo-card photo-card--secondary">
          <figure class="photo-card" data-photo-index="1">
            <div class="photo-frame" data-reveal="${REVEAL_MODES[1]}" data-parallax-speed="0.14">
              <img class="photo-frame__img" src="${p1.src}" alt="${p1.title}" loading="lazy" decoding="async" />
            </div>
            <figcaption class="photo-caption" data-caption-speed="-0.03">
              <span class="photo-caption__num">PLATE 02</span>
              <div class="photo-caption__text">
                <span class="photo-caption__title">${p1.title}</span>
                <span class="photo-caption__desc">${p1.description}</span>
              </div>
            </figcaption>
          </figure>

          <blockquote class="spread-quote">
            “${album.quote}”
            <cite class="spread-quote__cite">— ARCHIVE JOURNAL · ${album.location}</cite>
          </blockquote>
        </div>
      </div>

      <!-- Spread 2: Full-Bleed Cinema Panorama -->
      <div class="spread--bleed">
        <figure class="photo-card" data-photo-index="2">
          <div class="photo-frame" data-reveal="${REVEAL_MODES[2]}" data-parallax-speed="0.12">
            <img class="photo-frame__img" src="${p2.src}" alt="${p2.title}" loading="lazy" decoding="async" />
          </div>
          <figcaption class="photo-caption" data-caption-speed="-0.02">
            <span class="photo-caption__num">PLATE 03</span>
            <div class="photo-caption__text">
              <span class="photo-caption__title">${p2.title}</span>
              <span class="photo-caption__desc">${p2.description}</span>
            </div>
          </figcaption>
        </figure>
      </div>

      <!-- Spread 3: Large Portrait + Curatorial Note -->
      <div class="spread--portrait">
        <div class="spread--portrait__note">
          <div class="spread--portrait__note-label">CURATORIAL NOTE · 影像手记</div>
          <p class="spread--portrait__note-text">${album.introEn}</p>
          <p class="spread--portrait__note-zh">${album.introZh}</p>
        </div>

        <figure class="photo-card" data-photo-index="3">
          <div class="photo-frame" data-reveal="${REVEAL_MODES[3]}" data-parallax-speed="0.10">
            <img class="photo-frame__img" src="${p3.src}" alt="${p3.title}" loading="lazy" decoding="async" />
          </div>
          <figcaption class="photo-caption" data-caption-speed="-0.025">
            <span class="photo-caption__num">PLATE 04</span>
            <div class="photo-caption__text">
              <span class="photo-caption__title">${p3.title}</span>
              <span class="photo-caption__desc">${p3.description}</span>
            </div>
          </figcaption>
        </figure>
      </div>

      ${extraDiptychHTML}
    </section>

    <!-- Bottom Gallery Navigation -->
    <footer class="gallery-footer">
      <button type="button" class="gallery-return-cta" id="bottomReturnBtn" data-cursor="link">
        ← BACK TO BOOKSHELF / 返回书架
      </button>
      <button type="button" class="gallery-next-book" id="bottomNextVolumeBtn" data-cursor="link">
        NEXT MONOGRAPH / 下一本相册 →
      </button>
    </footer>
  `;

  // Bind Lightbox click & hover cursor on all gallery figures
  const clickableFigures = dom.galleryArticle.querySelectorAll("[data-photo-index]");
  clickableFigures.forEach((fig) => {
    fig.addEventListener("pointerenter", () => setCursorMode("photo", "VIEW", "放大"));
    fig.addEventListener("pointerleave", () => setCursorMode("default"));
    fig.addEventListener("click", () => {
      const idx = parseInt(fig.dataset.photoIndex || "0", 10);
      const imgEl = fig.querySelector("img");
      openLightbox(idx, imgEl);
    });
  });

  const bottomReturnBtn = document.getElementById("bottomReturnBtn");
  if (bottomReturnBtn) {
    bottomReturnBtn.addEventListener("click", closeAlbumGallery);
  }

  const bottomNextBtn = document.getElementById("bottomNextVolumeBtn");
  if (bottomNextBtn) {
    bottomNextBtn.addEventListener("click", () => {
      closeAlbumGallery();
      setTimeout(() => {
        stepToTarget(Math.round(state.target) + 1);
      }, 940);
    });
  }
}

function observeGalleryPhotoReveals() {
  if (galleryObserver) {
    galleryObserver.disconnect();
  }

  const frames = dom.galleryArticle.querySelectorAll(".photo-frame");
  galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Reversible on scroll: reveals when entering viewport, resets if scrolled far below viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.95) {
          entry.target.classList.remove("is-inview");
        }
      });
    },
    {
      root: dom.galleryScroller,
      threshold: 0.12
    }
  );

  frames.forEach((f) => galleryObserver.observe(f));
}

function updateGalleryParallax() {
  if (!state.isGalleryOpen || state.reducedMotion) return;

  const vh = window.innerHeight;
  const frames = dom.galleryArticle.querySelectorAll(".photo-frame");

  frames.forEach((frame) => {
    const rect = frame.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) return;

    // Normalized progress v in [-1, 1] relative to viewport center
    const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
    const v = clamp(centerOffset / (vh * 0.65), -1, 1);

    const speed = parseFloat(frame.dataset.parallaxSpeed || "0.1");
    const translateY = -v * rect.height * speed;
    const scale = 1.09 + (1 - Math.abs(v)) * 0.03;

    const img = frame.querySelector(".photo-frame__img");
    if (img) {
      img.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }

    const caption = frame.parentElement.querySelector(".photo-caption");
    if (caption) {
      const capSpeed = parseFloat(caption.dataset.captionSpeed || "-0.025");
      const capY = v * vh * capSpeed;
      caption.style.transform = `translate3d(0, ${capY.toFixed(1)}px, 0)`;
    }
  });
}

/* ==========================================================================
   8. FULLSCREEN PHOTO LIGHTBOX WITH CINEMATIC TRANSITIONS
   ========================================================================== */

function openLightbox(index, originImgEl = null) {
  if (!state.openAlbum) return;
  const photos = state.openAlbum.photos;
  state.lightboxIndex = mod(index, photos.length);
  state.lightboxOriginEl = originImgEl;
  state.isLightboxOpen = true;

  const photo = photos[state.lightboxIndex];
  dom.lightboxImgCurrent.src = photo.src;
  dom.lightboxImgCurrent.alt = photo.title;
  updateLightboxMeta();

  dom.lightbox.classList.add("is-open");
  dom.lightbox.setAttribute("aria-hidden", "false");

  // FLIP-style smooth expansion from clicked photo
  if (originImgEl && !state.reducedMotion && dom.lightboxImgCurrent.animate) {
    const originRect = originImgEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = originRect.left + originRect.width / 2 - vw / 2;
    const dy = originRect.top + originRect.height / 2 - vh / 2;
    const scale = clamp(originRect.width / (vw * 0.68), 0.25, 0.85);

    dom.lightboxImgCurrent.animate(
      [
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`, opacity: 0.4 },
        { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 }
      ],
      {
        duration: 520,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
      }
    );
  }
}

function closeLightbox() {
  if (!state.isLightboxOpen) return;
  state.isLightboxOpen = false;
  dom.lightbox.classList.remove("is-open");
  dom.lightbox.setAttribute("aria-hidden", "true");
}

function stepLightbox(dir) {
  if (!state.isLightboxOpen || !state.openAlbum) return;
  const photos = state.openAlbum.photos;
  if (photos.length <= 1) return;

  const nextIdx = mod(state.lightboxIndex + dir, photos.length);
  const nextPhoto = photos[nextIdx];
  state.lightboxIndex = nextIdx;
  updateLightboxMeta();

  if (state.reducedMotion || !dom.lightboxImgCurrent.animate) {
    dom.lightboxImgCurrent.src = nextPhoto.src;
    dom.lightboxImgCurrent.alt = nextPhoto.title;
    return;
  }

  // Layered Magazine Mask Transition (no black flash)
  dom.lightboxImgNext.src = nextPhoto.src;
  dom.lightboxImgNext.alt = nextPhoto.title;
  dom.lightboxImgNext.style.opacity = "1";

  const slideOffset = dir >= 0 ? 48 : -48;
  const clipStart = dir >= 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  dom.lightboxImgCurrent.animate(
    [
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
      { transform: `translate3d(${-slideOffset}px, 0, 0) scale(0.96)`, opacity: 0.2 }
    ],
    {
      duration: 520,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    }
  );

  const nextAnim = dom.lightboxImgNext.animate(
    [
      { clipPath: clipStart, transform: `translate3d(${slideOffset}px, 0, 0) scale(1.04)` },
      { clipPath: "inset(0 0% 0 0%)", transform: "translate3d(0, 0, 0) scale(1)" }
    ],
    {
      duration: 540,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    }
  );

  nextAnim.onfinish = () => {
    dom.lightboxImgCurrent.src = nextPhoto.src;
    dom.lightboxImgCurrent.alt = nextPhoto.title;
    dom.lightboxImgNext.style.opacity = "0";
  };
}

function updateLightboxMeta() {
  if (!state.openAlbum) return;
  const photos = state.openAlbum.photos;
  const photo = photos[state.lightboxIndex];
  dom.lightboxCounter.textContent = `${String(state.lightboxIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  dom.lightboxAlbumTag.textContent = `${state.openAlbum.title} · ${state.openAlbum.location}`;
  dom.lightboxTitle.textContent = photo.title;
  dom.lightboxDesc.textContent = photo.description;
}

/* ==========================================================================
   9. CUSTOM INTERACTIVE CURSOR
   ========================================================================== */

function setCursorMode(mode, labelEn = "OPEN", labelZh = "相册") {
  if (!dom.customCursor) return;
  dom.customCursor.classList.remove("is-spine", "is-cover", "is-photo", "is-link");
  if (mode === "spine") {
    dom.customCursor.classList.add("is-spine");
  } else if (mode === "cover") {
    dom.cursorLabelEn.textContent = labelEn;
    dom.cursorLabelZh.textContent = labelZh;
    dom.customCursor.classList.add("is-cover");
  } else if (mode === "photo") {
    dom.cursorLabelEn.textContent = labelEn;
    dom.cursorLabelZh.textContent = labelZh;
    dom.customCursor.classList.add("is-photo");
  } else if (mode === "link") {
    dom.customCursor.classList.add("is-link");
  }
}

function initCursorListeners() {
  window.addEventListener(
    "pointermove",
    (e) => {
      state.cursorTargetX = e.clientX;
      state.cursorTargetY = e.clientY;
    },
    { passive: true }
  );

  document.querySelectorAll("[data-cursor='link']").forEach((el) => {
    el.addEventListener("pointerenter", () => setCursorMode("link"));
    el.addEventListener("pointerleave", () => setCursorMode("default"));
  });
}

/* ==========================================================================
   10. WHEEL, POINTER DRAG, TOUCH & KEYBOARD INTERACTION
   ========================================================================== */

function initShelfInteractions() {
  // 1. Wheel & Trackpad Scrubbing on Shelf
  let wheelAccumulator = 0;
  let wheelSnapTimer = null;

  window.addEventListener(
    "wheel",
    (e) => {
      if (state.isGalleryOpen || state.isTransitioning) return;
      e.preventDefault();

      const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccumulator += dominantDelta;

      // Smooth continuous step proportional to wheel/trackpad gesture
      const stepDelta = clamp(dominantDelta / 110, -1.2, 1.2);
      state.target += stepDelta;

      clearTimeout(wheelSnapTimer);
      wheelSnapTimer = setTimeout(() => {
        state.target = Math.round(state.target);
        wheelAccumulator = 0;
      }, 140);
    },
    { passive: false }
  );

  // 2. Pointer / Touch Horizontal Drag on Shelf
  dom.shelfStage.addEventListener("pointerdown", (e) => {
    if (state.isGalleryOpen || state.isTransitioning || e.button > 0) return;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.lastPointerX = e.clientX;
    state.lastPointerTime = performance.now();
    state.dragStartTarget = state.target;
    state.dragMoved = 0;
    state.dragVelocity = 0;
    dom.shelf.classList.add("is-dragging");
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      if (!state.isDragging) return;
      const now = performance.now();
      const dx = e.clientX - state.dragStartX;
      const dt = Math.max(1, now - state.lastPointerTime);

      state.dragMoved = Math.max(state.dragMoved, Math.abs(dx));
      state.dragVelocity = (e.clientX - state.lastPointerX) / dt;
      state.lastPointerX = e.clientX;
      state.lastPointerTime = now;

      // Dragging left moves shelf left (next book -> target increases)
      const dragSensitivity = Math.max(58, state.spineW + state.bookGap);
      state.target = state.dragStartTarget - dx / dragSensitivity;
    },
    { passive: true }
  );

  const endDrag = () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    dom.shelf.classList.remove("is-dragging");

    // Apply momentum throw & snap to integer book slot
    const momentum = clamp(-state.dragVelocity * 2.2, -3, 3);
    state.target = Math.round(state.target + momentum);
  };

  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // 3. Prev / Next Arrow Buttons
  dom.prevAlbumBtn.addEventListener("click", () => {
    stepToTarget(Math.round(state.target) - 1);
  });

  dom.nextAlbumBtn.addEventListener("click", () => {
    stepToTarget(Math.round(state.target) + 1);
  });

  // 4. Gallery & Lightbox Controls
  dom.closeGalleryBtn.addEventListener("click", closeAlbumGallery);
  dom.lightboxCloseBtn.addEventListener("click", closeLightbox);
  dom.lightboxBackdrop.addEventListener("click", closeLightbox);
  dom.lightboxPrevBtn.addEventListener("click", () => stepLightbox(-1));
  dom.lightboxNextBtn.addEventListener("click", () => stepLightbox(1));

  // 5. Keyboard Navigation
  window.addEventListener("keydown", (e) => {
    if (state.isLightboxOpen) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
      }
      return;
    }

    if (state.isGalleryOpen) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAlbumGallery();
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepToTarget(Math.round(state.target) - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepToTarget(Math.round(state.target) + 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAlbumGallery(state.activeSlotIndex);
    }
  });

  // 6. Resize handler
  window.addEventListener("resize", () => {
    updateDimensions();
  });
}

/* ==========================================================================
   11. PRELOAD NEARBY ALBUM ASSETS
   ========================================================================== */

const preloadedUrls = new Set();

function preloadImage(url) {
  if (!url || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

function preloadNearbyAlbums() {
  const M = state.virtualSlots.length;
  if (!M) return;
  const center = mod(Math.round(state.current), M);
  for (let offset = -3; offset <= 3; offset++) {
    const slot = state.virtualSlots[mod(center + offset, M)];
    if (!slot) continue;
    preloadImage(slot.album.cover);
    if (Math.abs(offset) <= 1) {
      slot.album.photos.forEach((p) => preloadImage(p.src));
    }
  }
}

/* ==========================================================================
   12. INITIALIZATION
   ========================================================================== */

function init() {
  updateDimensions();
  initCategories();
  buildShelfDOM();
  updateCaptionInfo(state.filteredAlbums[0], 0, state.filteredAlbums.length, 1, true);
  initShelfInteractions();
  initCursorListeners();
  requestAnimationFrame(animateLoop);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
