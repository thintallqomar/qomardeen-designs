import type { ArticleTranslations } from '../useLocalizedArticle';

const translations: ArticleTranslations = {
  "building-scalable-design-systems": {
    title: "Gina tsarin ƙira mai girma",
    excerpt: "Yadda tsarin ƙira ke taimaka wa ƙungiyoyi su haɓaka samfuran cikin inganci tare da kiyaye amfani da daidaiton gani.",
    content: `
## Me ya sa tsarin ƙira ke da muhimmanci a girma

Tsarin ƙira ya fi ɗakin karatu na sassan. Shi harshe ne da aka raba tsakanin ƙira da injiniyanci wanda ke ba ƙungiyoyi damar gina ƙwarewar da ke daidai cikin sauri.

Ba tare da shi ba, kowane sabon fasali yana zama damar warwarewa. Tare da shi, kowane sabon fasali *yana ƙarfafa* ingancin da ke akwai.

## Jikin Tsarin Mai Girma

### 1. Alamomin Ƙira

Alamomi su ne ƙwayoyin tsarinku — launuka, tazara, rubutu, inuwa, motsi:

\`\`\`css
:root {
  --color-primary: hsl(185, 84%, 55%);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-lg: 1rem;
  --font-heading: 'Inter', sans-serif;
}
\`\`\`

Alamomi suna tabbatar da cewa canjin "launi na farko" yana yaɗuwa ko'ina nan take.

### 2. Tsarin Gine-ginen Sassan

Sassan ya kamata su bi tsarin da ke a fili:

\`\`\`
Tushe (Button, Input, Badge)
  → Tsari (SearchBar, FormField, Card)
    → Fasaloli (UserProfile, PaymentForm, Dashboard)
      → Shafuka (Home, Settings, Checkout)
\`\`\`

Kowane mataki yana yin amfani da matakin da ke ƙasansa kawai. Wannan yana hana dogaro na zagaye kuma yana sa canje-canje su zama abin da za a iya hasashe.

### 3. Dabarun Bambance-bambance

Kowane sashe yana buƙatar tsarin bambance-bambance mai ma'ana:

\`\`\`typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

// Wannan yana ba ku 4 × 3 = 12 haɗe-haɗe daga sashe ƊAYA
\`\`\`

> Dokar yatsa: Idan kuna ƙirƙirar sabon sashe wanda yake kama da wani da ke akwai 80%, ku ƙara bambance-bambance a maimakon haka.

## Tsarin Mulki

### Na tsakiya
Ƙungiyar tsarin ƙira guda ɗaya ce ke da komai. Yana aiki ga manyan ƙungiyoyi (50+ masu ƙira).

### Na tarayya
Ƙungiyoyin samfur suna ba da gudummawa, ƙungiyar tsarin tana nazari tana kuma kula. Ya fi kyau ga ƙungiyoyin matsakaici.

### Na al'umma
Kowa zai iya gabatar da canje-canje ta hanyar gudummawa. Yana aiki ga buɗaɗɗen tushe da ƙungiyoyi masu warwarewa.

## Haɗin Kai Tsakanin Ƙungiyoyi

Mafi wahalar ɓangarenin tsarin ƙira ba na fasaha ba ne — na ƙungiya ne:

1. **Lokutan bude ofis na yau da kullum** — Zaman mako-mako inda ƙungiyoyi za su iya yin tambayoyi
2. **Jagororin ƙaura** — Lokacin da sassan suka sabunta, a samar da hanyoyin ƙaura mataki-mataki
3. **Ma'aunin karɓa** — Bi diddigin ƙungiyoyin da ke amfani da tsarin da waɗanda ba su yi ba
4. **Hanyoyin ra'ayi** — Sauƙaƙe rahoton matsaloli da neman fasaloli

## Auna Nasara

| Ma'auni | Abin da yake auna |
|---------|-------------------|
| Rufin sassan | % na UI da ke amfani da sassan tsarin |
| Lokacin ƙira zuwa ci gaba | Lokaci daga ƙirar zuwa samarwa |
| Ƙimar daidaito | Sakamakon binciken daidaiton gani |
| Adadin karɓa | Ƙungiyoyin da ke amfani da tsarin |

## Tasirin Haɗuwa

Tsarin ƙira yana da ribar da ke ƙaruwa. Watanni 6 na farko suna jin jinkiri — kuna gina tushe. Bayan haka, kowane sabon fasali yana fitowa cikin sauri saboda tushe yana da ƙarfi. Ƙungiyoyin da na yi aiki da su suna ganin **raguwar 40-60%** a lokacin ƙira zuwa ci gaba bayan shekara ta farko.

Mabuɗin shine haƙuri da sadaukarwa. Tsarin ƙira samfur ne, ba aikin wucin gadi ba.
    `
  },
  "designing-ai-native-products": {
    title: "Ƙirar samfuran AI na asali",
    excerpt: "Ƙa'idoji don ƙirar samfuran da AI ke zama ƙarfin asali maimakon fasalin da aka ƙara.",
    content: `
## AI na Asali vs. AI Mai Ingantawa

Akwai bambanci mai muhimmanci da yawancin ƙungiyoyi ke rasawa:

- **AI Mai Ingantawa**: Samfurin gargajiya tare da fasalin AI da aka ƙara (misali "shawarwari masu wayo" a cikin fom)
- **AI na Asali**: Samfurin da aka ƙera daga asali game da iyawar AI (misali mu'amalar tattaunawa, ayyukan da suka dace)

Ƙa'idojin ƙira ga kowanne sun bambanta sosai.

## Ƙa'idoji na Asali

### 1. Ƙira don Rashin Tabbas

UI na gargajiya yana da tabbas — danna maɓalli, sami sakamako mai hasashe. Mu'amalar AI yana da yiwuwa — shigar da iri ɗaya na iya samar da fitarwa daban.

\`\`\`
Gargajiya:   Shiga → Sarrafawa → Fitarwa
AI na Asali: Shiga → Sarrafawa → Fitarwa + Amincewa + Madadin
\`\`\`

Ku nuna a koyaushe:
- **Alamomin amincewa** — Yaya AI ke da tabbas?
- **Shawarwarin madadin** — Me kuma zai iya zama?
- **Gyara mai sauƙi** — Yaya za a gyara sakamako mara kyau?

### 2. 'Yancin Kai Mai Ci Gaba

Kada ku ba AI cikakken iko nan take. Bari masu amfani su gina amincewa a hankali:

| Matakin Amincewa | Matsayin AI | Matsayin Mai Amfani |
|------------------|-------------|---------------------|
| Sabon mai amfani | Ya ba da shawara | Ya yanke shawara + ya aiwatar |
| Mai amfani na yau da kullum | Ya ba da shawarar | Ya amince |
| Gwanin mai amfani | Ya yi aiki | Ya kula + ya soke |

### 3. Tunani Mai Gaskiya

Masu amfani suna buƙatar fahimtar *me ya sa* AI ya yanke shawara:

\`\`\`
❌ "Muna ba da shawarar Samfuri A"
✅ "Muna ba da shawarar Samfuri A saboda ya dace da kasafin ku 
   ($50-100) kuma yana da ƙimar 4.8★ a cikin rukunin da kuka fi so"
\`\`\`

### 4. Lalacewa Mai Kyau

Lokacin da AI ya gaza (kuma zai gaza), samfurin ya kamata ya ci gaba da aiki:

\`\`\`typescript
const getRecommendation = async (userId: string) => {
  try {
    const aiResult = await ai.recommend(userId);
    if (aiResult.confidence > 0.7) return aiResult;
    return fallbackRecommender.recommend(userId);
  } catch {
    return getPopularItems();
  }
};
\`\`\`

## Ƙalubalen Ƙira

Mafi wahalar ɓangarenin ƙirar samfurin AI ba fasaha ba ce — gudanar da tsammanin masu amfani ne. AI da ke aiki 90% na lokaci yana haifar da takaici a cikin 10% da ya gaza, musamman idan masu amfani suna tsammanin 100%.

Ku ƙera don yanayin gazawa da farko. Idan mafi munin ƙwarewa ya karɓu, samfurin zai yi nasara.
    `
  },
  "ai-assisted-design-workflows": {
    title: "Hanyoyin aikin ƙira tare da taimakon AI",
    excerpt: "Yadda AI zai iya hanzarta bincike, tunani, da maimaituwa a cikin ƙirar samfur na zamani.",
    content: `
## AI ba zai maye gurbin masu ƙira ba — amma zai maye gurbin marasa sauri

Masana'antar ƙira ta rabu tsakanin masu shakka da masu yabawa game da AI. Ni ba ɗaya daga cikinsu ba ne. Ni mai amfani ne wanda ke amfani da AI a duk inda yake hanzarta aikina da gaske.

Ga hanyar aikina ta gaske.

## Mataki na 1: Hanzarta Bincike

### Binciken Gasa
Maimakon in ɓata kwanaki 3 wajen binciken samfuran abokan gasa, ina amfani da AI don:

1. **Taƙaita bita na shagon app** — Fitar da manyan korafe-korafe da yabo 5
2. **Binciken matakan fasaloli** — Kwatanta 10+ abokan gasa a cikin muhimman ma'auni
3. **Gano tsare-tsare** — Nuna tsare-tsaren UX na yau da kullum a cikin rukuni

\`\`\`
Umarni: "Bincika manyan apukan fintech 10 a Najeriya.
Ga kowanne, jera: manyan fasaloli, babban korafin 
daga bita, da tsare-tsaren UX na musamman."
\`\`\`

Wannan yana ba ni tushen bincike cikin sa'o'i maimakon kwanaki.

## Mataki na 2: Inganta Tunani

AI yana da kyau wajen samar da *yawa* — wanda shi ne ainihin abin da tunani ke buƙata.

### Madaidaicin Takwas, Mai Ƙarfi
Maimakon in zana ra'ayoyi 8 a cikin minti 8 ni kaɗai, ina:
1. Samar da 20+ bayanan ra'ayi tare da AI
2. Zana mafi alkawarin 8
3. Haɗa da maimaita kan mafi kyau 3

## Mataki na 3: Kula da Tsarin Ƙira

A nan ne AI ke adana lokaci mafi yawa:

- **Samar da takardun sassan** daga ƙayyadaddun Figma
- **Rubuta bayanan isa ga kowa** don mika mulki
- **Ƙirƙirar yanayin gwaji** don yanayin gefen

## Abin da AI ba zai iya ba

Masu ƙira da za su bunƙasa za su kasance waɗanda ke amfani da AI don aikin injiniya kuma suna saka lokacinsu na 'yanci a cikin ɓangarorin ɗan adam na zurfi na ƙira.
    `
  },
  "dashboard-design-clarity-over-complexity": {
    title: "Ƙirar dashboard: Bayyanawa a kan rikitarwa",
    excerpt: "Ƙa'idoji don ƙirar dashboards masu yawan bayanai da ke taimaka wa masu amfani su fahimci bayanan da suka yi rikitarwa cikin sauri.",
    content: `
## Saɓanin Dashboard

Dashboards ya kamata su sauƙaƙe rikitarwa. Maimakon haka, yawancin dashboards *suna ƙara* rikitarwa ta hanyar nuna komai a lokaci guda.

Gyaran ba shine cire bayanai ba — shine tsara su ta hanyar manufa.

## Tsarin da Ya Dogara ga Manufa

Kowane ɓangaren dashboard ya kamata ya amsa ɗaya daga cikin tambayoyi uku:

1. **"Komai yana lafiya?"** → Alamomin matsayi, faɗakarwa
2. **"Me ya faru?"** → Yanayi, kwatancen, tarihi
3. **"Me ya kamata in yi?"** → Abubuwan da za a yi, shawarwari

### Mataki na 1: Lafiya a Duba Ɗaya

Saman kowane dashboard ya kamata a iya amsawa cikin daƙiƙa 2:

\`\`\`
✅ Dukkan tsari suna aiki | 📦 Isar da kaya 142 a yau | ⚠️ Abubuwa 3 suna buƙatar kulawa
\`\`\`

Babu zane, babu tebur — matsayi kawai.

### Mataki na 2: Zurfi Mai Ma'ana

Ƙasan sandar lafiya, nuna bayanan da ke bayanin *me ya sa* abubuwa suke haka:

- **Layukan yanayi** tare da bayanan da suka yi fili
- **Katunan kwatancen** ("12% a saman Talatar da ta gabata")
- **Teburan da aka tace** waɗanda ke nuna bambance-bambance kawai

### Mataki na 3: Saman Aiki

Ƙasan mataki yana nuna abin da mai amfani ya kamata *ya yi*:

- Amince da abubuwan da ke jiran
- Warware matsalolin da aka yiwa alama
- Bincika shawarwari

## Gwajin Daƙiƙa 5

Kafin in fitar da kowane dashboard, ina yin gwajin daƙiƙa 5:

> Nuna dashboard ga wani na daƙiƙa 5. Sannan ka tambaya: "Me wannan yake gaya maka?"

Idan ba zai iya amsawa ba, tsarin ba daidai ba ne.
    `
  },
  "designing-trust-fintech-interfaces": {
    title: "Ƙirar amana a cikin mu'amalar fintech",
    excerpt: "Tsare-tsaren UX masu muhimmanci da ke gina amana lokacin da masu amfani ke motsa kuɗi ta hanyar dandamali na dijital.",
    content: `
## Amana ita ce Samfurin

A cikin fintech, mu'amala *ita ce* alamar amana. Masu amfani ba za su iya ganin sabobin ba, ɓoyayyen bayanai, ko takaddun bin doka. Abin da suke da shi kawai shine abin da ke kan allo.

## Alamomin Amana Biyar

### 1. Bayyana Tsaro a Hankali

Kada ku jefa dukkan fasalin tsaro ga mai amfani a lokaci guda. Bayyana su bisa yanayi:

- **Kafin mu'amala**: Nuna alamar ɓoye bayanai
- **Yayin tabbatarwa**: Nuna ainihin adadi da mai karɓa
- **Bayan kammalawa**: Samar da rasit mai alamar lokaci tare da lambar mu'amala

### 2. Madaurin Ra'ayi Masu Hasashe

Kowane aiki ya kamata ya sami amsa mai ma'ana nan take.

### 3. Yanayin Kuskure Masu Gaskiya

Lokacin da wani abu ya gaza, ku zama takamaimai:

| ❌ Mara kyau | ✅ Mai kyau |
|-------------|------------|
| "Mu'amala ta gaza" | "Bankinku ya ƙi wannan mu'amala. Gwada wata kati ko tuntubi bankinku." |

### 4. Harshen Gani Mai Sani

Ku yi amfani da al'adun da masu amfani suka riga suka amince da su.

### 5. Sokewa da Farfaɗo

Bari masu amfani su ji aminci ta hanyar samar da hanyoyin tserewa.

## Wannan tsari ya mayar da tsaro na zahiri zuwa amincewar mai amfani mai amfani.
    `
  },
  "systems-thinking-product-design": {
    title: "Me ya sa tunanin tsari ke da muhimmanci a cikin ƙirar samfur",
    excerpt: "Yadda tunani fiye da allon mutum ɗaya ke ba da damar ƙwarewar samfur mai girma da daidaito.",
    content: `
## Matsalar Tunanin Matakin Allo

Yawancin masu ƙira suna farawa da alluna. Shafin shiga a nan, dashboard a can, panelin saiti a wani wuri. Wannan hanya tana aiki ga ƙananan samfuran, amma tana rugujewa lokacin da samfurinka ya girma.

Tunanin tsari yana nufin duba daga nesa kafin duba da kusa. Maimakon tambayi *"Yaya wannan allon ya kamata ya yi kama?"*, ka tambaya:

> "Waɗanne ƙa'idoji ne ke jagorantar yadda kowane allo ya kamata ya yi aiki?"

\`\`\`
Matsayin Mai Amfani → Saitin Izini → Ayyukan da ke Akwai → Saman UI
\`\`\`

\`\`\`typescript
const DashboardView = ({ role, permissions }) => {
  const widgets = getWidgetsForRole(role);
  const actions = filterByPermissions(permissions);
  
  return (
    <DashboardLayout>
      {widgets.map(widget => (
        <Widget key={widget.id} actions={actions} />
      ))}
    </DashboardLayout>
  );
};
\`\`\`

## Sakamakon

Tunanin tsari ba kawai yana sa ƙira ya zama daidai ba — yana sa dukkan ƙungiyar samfur ta zama mai sauri.

Fara ƙanƙani: *"Shin akwai tsari a nan da nake maimaitawa?"* Idan haka ne, fitar da shi, ba shi suna, ka kuma rubuta shi.
    `
  },
  "from-fashion-to-product-design": {
    title: "Daga sutura zuwa ƙirar samfur",
    excerpt: "Yadda asalina a cikin ƙirar sutura ya tsara hanyata wajen gina samfuran dijital da ƙwarewar masu amfani.",
    content: `
## Labarin Asali Mai Ban Mamaki

Ban fara a fasaha ba. Harshen ƙira na farko shi ne masaka, ba Figma ba. Na yi karatun ƙirar sutura kafin in koma ƙirar samfuran dijital — kuma wannan asalin yana ba ni fa'ida da yawancin masu ƙira ba su da ita.

## Abin da Sutura ta Koya Mani

### 1. Tunanin Kayan Aiki

A cikin sutura, kana ƙira *tare da* kayan aiki, ba a kansa ba. Siliki yana faɗuwa dabam da jeans.

### 2. Muhimmancin Dacewa

Sutura mai kyau da ba ta dace ba ba ta da amfani. Haka ma mu'amalar: "Mafi kyawun ƙira a duniya za ta gaza idan ba ta dace da tunanin mai amfani ba."

### 3. Tunanin Tarin

Masu ƙirar sutura ba sa ƙirar abubuwa guda ɗaya — suna ƙirar *tarin*. Kowane yanki dole ya yi aiki shi kaɗai KUMA tare. Tsarin ƙira ke nan daidai.

### 4. Gabatarwa ita ce Ɓangare na Samfurin

A cikin sutura, nuna sutura *ita ce* ɓangare na ƙira.

## Ìdí tí ó fi ṣe pàtàkì

Masana'antar fasaha tana ba da lada ga bin diddigin al'ada. Zuwa daga sutura yana ba ni hangen nesa na dabam.

Wannan ba rauni ba ne. Ƙarfi ne na musamman.
    `
  },
  "mobile-banking-onboarding-ux": {
    title: "Binciken UX: Shigar da bankin wayar hannu",
    excerpt: "Nazarin yadda manyan apps fintech ke rage matsala a cikin hanyoyin masu amfani sababbi.",
    content: `
## Daƙiƙa 60 na Farko

Shigar da bankin wayar hannu yana da ƙayyadaddun tsauri: masu amfani dole su ba da bayanan sirri na keɓance *kafin* su sami kowane daraja. Mafi kyawun apps suna warware wannan ta hanyar ƙirar UX mai kulawa.

## Tsari na 1: Nuna Daraja Kafin Rajista

Mafi ƙarfin apps suna nuna maka abin da za ka samu *kafin* su nemi komai.

## Tsari na 2: KYC Mai Ci Gaba

Maimakon fom ɗin filayen 12, raba tabbatar da ainihi zuwa matakan da za a iya sha:

1. **Mataki na 0**: Imel + kalmar wucewa → Za a iya bincika app ɗin
2. **Mataki na 1**: Lambar waya → Za a iya karɓar kuɗi
3. **Mataki na 2**: Tabbatar da BVN/ID → Za a iya aika kuɗi
4. **Mataki na 3**: Tabbatar da adireshi → An buɗe cikakkun iyakoki

## Tsari na 3: Bayani na Tsaro Mai Ma'ana

Kada ku nemi hoton selfie kawai — ku bayyana me ya sa:

| Mataki | Abin da suke nema | Abin da suke bayyanawa |
|--------|-------------------|------------------------|
| BVN | "Shigar da BVN ɗinku" | "Wannan yana tabbatar da asalinku tare da Babban Banki" |
| Selfie | "Ɗauki hoto" | "Muna daidaita wannan da ID ɗinku don hana zamba" |
| PIN | "Ƙirƙiri PIN" | "Wannan yana kare kowane mu'amala da kuke yi" |

## Tsari na 4: Adana Ci Gaba

Idan mai amfani ya tsaya a tsakiyar shigarwa, a adana ci gabansa. Mafi munin ƙwarewa ita ce sake farawa.

## Mabuɗin Darasi

Mafi kyawun shigarwa ba ya ji kamar shigarwa. Yana jin kamar samfurin yana buɗe maka a hankali.
    `
  },
  "notion-design-system-teardown": {
    title: "Binciken samfur: Tsarin ƙira na Notion",
    excerpt: "Yadda Notion ke daidaita sassauci da daidaituwa a cikin samfur mai rikitarwa.",
    content: `
## Saɓanin Sassauci

Notion yana ɗaya daga cikin kayan aikin ƙirƙira mafi sassauci da aka taɓa ginawa. Masu amfani za su iya ƙirƙirar bayanan bayanai, wikis, kwamitin ayyuka, da takardu — duk a cikin mu'amala ɗaya. Duk da haka bai taɓa jin hargitsi ba.

## Tushen Block

Komai a cikin Notion **block** ne.

\`\`\`
Block
├── Block na Rubutu (sakin layi, taken, jeri, juya)
├── Block na Kafofin Watsa Labarai (hoto, bidiyo, fayil, shafin yabo)
├── Block na Bayanan Bayanai (tebur, kwamiti, jadawalin lokaci, kalandar, gallery)
├── Block na Shigarwa (lambar, lissafi, tweet, figma)
└── Block na Tsari (shafi, mai raba, kira)
\`\`\`

### Me ya sa Wannan ke Aiki

1. **Tsarin mu'amala mai daidaito** — Ana iya jan kowane block, kwafin sa, share shi, da yin sharhi a kansa
2. **Haɗawa** — Kowane block na iya ƙunsar blocks ɗin wasu
3. **Ƙari** — Sabbin nau'ikan block ba sa buƙatar sabbin tsare-tsaren mu'amala

## Darussa ga Masu Ƙira

1. **Nemo tushenku** — Menene mafi ƙanƙantar sashe na samfurinka? Ku ƙera shi daidai.
2. **Ƙayyadaddun akwati** — Yadda abun ciki ke da sassauci, haka tsarin ya kamata ya zama mai tsauri.
3. **Launi bayanai ne** — Ku yi amfani da launi don sadarwa, ba don ado ba.
4. **Kewayawa = tsarin tunani** — Sandar gefen ku ya kamata ya nuna yadda masu amfani ke tunani.

Ko da mafi kyawun tsarin ƙira suna da musayar ra'ayi. Mabuɗin shine yin musayar *da gangan*, ba da kwatsam ba.
    `
  },
  "ai-beyond-chatbots": {
    title: "AI a cikin ƙirar samfur: Bayan chatbots",
    excerpt: "Yadda AI ke sake fasalin hanyoyin aikin ƙira, bincike, da ƙwarewar mai amfani.",
    content: `
## Tarkon Chatbot

Lokacin da yawancin mutane suka yi tunani "AI a cikin ƙirar samfur," suna tunanin chatbots. Amma chatbots ɗaya ne kawai — wataƙila mafi rashin ban sha'awa — daga cikin abubuwan da AI ke yi a cikin ƙira.

Ainihin juyin juya halin yana faruwa a wurare uku.

## 1. Ƙimar Farko Masu Hankali

Mafi ƙarfin fasalin AI shine wanda masu amfani ba sa lura da shi: **ƙimar farko masu hankali**.

- **Cike fom da wuri** bisa yanayi (wuri, lokaci, halayen da suka gabata)
- **Ba da shawarar saituna** bisa masu amfani iri ɗaya
- **Hasashen ayyukan gaba** da nuna su a gaba

## 2. Mu'amalar da ke Dacewa

AI yana ba da damar mu'amala su sake tsara kansu bisa mai amfani:
- **Safe**: Nuna bayanin yau da jerin ayyuka
- **Ƙarshen rana**: Nuna taƙaitawa da jadawalin gobe
- **Ƙarshen mako**: Nuna abubuwan keɓantacce, ɓoye fasalin aiki

## 3. Abun Ciki Mai Samarwa

AI na iya ƙirƙirar abun ciki na musamman a cikin samfuran:
- **Shigarwa mai motsi** — Koyarwar da ke dacewa bisa matsayin mai amfani
- **Taimakon da ya dace** — Takardun da ke amsa takamaiman tambayar da mai amfani zai iya yi
- **Taƙaitawar masu hankali** — Taƙaita dogayen tattaunawa zuwa abubuwa masu aiki

## Ƙalubalen Ƙira

Samfuran da za su yi nasara ba za su kasance waɗanda ke da fasalin AI mafi yawa ba. Za su kasance waɗanda AI ya haɗu sosai har masu amfani su manta cewa yana nan.
    `
  },
  "systems-thinking-for-designers": {
    title: "Tunanin tsari ga masu ƙira",
    excerpt: "Me ya sa fahimtar dukkan tsarin ke haifar da yanke shawara mafi kyau a matakin sassan.",
    content: `
## Sassan ba su Wanzu su Kaɗai ba

Kowane maɓalli, kati, da modal da kuka ƙera suna cikin tsari. Ingancin yanke shawarar matakin sassanku ya dogara da yadda kuka fahimci wannan tsarin.

## Matakai Uku na Ƙira

### Mataki na 1: Ƙirar Sassan
*"Yaya wannan maɓallin ya kamata ya yi kama?"*

### Mataki na 2: Ƙirar Tsari
*"Yaya maɓallan ya kamata su yi aiki a cikin dukkan samfurin?"*

### Mataki na 3: Ƙirar Tsarin
*"Me ya sa muke buƙatar maɓallai kwata-kwata? Waɗanne ayyuka ne za a iya yi a cikin samfurinmu, yaya masu amfani ke gano su kuma suke aiwatar da su?"*

## Tsarin Aiki

\`\`\`
1. YANAYI:   A cikin wane tsari wannan yake?
2. GUDANA:   Me ke faruwa kafin da bayan wannan?
3. HALI:     Menene dukkan halaye masu yiwuwa?
4. GEFEN:    Me zai iya yin kuskure?
5. GIRMA:    Me zai faru a girman 10×?
\`\`\`

## Fa'idar Gasa

Kamfanoni suna ɗaukar masu tunanin tsari ba saboda suna yin alluna masu kyau ba, amma saboda suna yin *ƙarancin alluna*. Lokacin da kuka fahimci tsarin, kuna samun mafita masu kyau da ke magance yanayi 10 da ƙira 1 maimakon ƙira 10 daban-daban.
    `
  },
};

export default translations;
