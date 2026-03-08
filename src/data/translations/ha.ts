import type { ArticleTranslations } from '../useLocalizedArticle';

const t = (title: string, excerpt: string, content: string) => ({ title, excerpt, content });

const translations: ArticleTranslations = {
  "building-scalable-design-systems": t("Gina tsarin ƙira mai girma", "Yadda tsarin ƙira ke taimaka wa ƙungiyoyi su haɓaka samfuran cikin inganci.", `
## Me ya sa tsarin ƙira ke da muhimmanci

Tsarin ƙira ya fi ɗakin karatu na sassan. Shi harshe ne da aka raba tsakanin ƙira da injiniyanci.

### 1. Alamomin ƙira
### 2. Tsarin gine-ginen sassan
### 3. Dabarun bambance-bambance

Ƙungiyoyin da na yi aiki da su suna ganin **raguwar 40-60%** a lokacin ƙira zuwa ci gaba bayan shekara ta farko.
  `),
  "designing-ai-native-products": t("Ƙirar samfuran AI na asali", "Ƙa'idoji don ƙirar samfuran da AI ke zama ƙarfin asali.", `
## AI-Asali vs. AI-Ingantacce

### 1. Ƙira don rashin tabbas
### 2. 'Yancin kai mai ci gaba
### 3. Tunani mai gaskiya
### 4. Lalacewa mai kyau
  `),
  "ai-assisted-design-workflows": t("Hanyoyin aikin ƙira tare da taimakon AI", "Yadda AI zai iya hanzarta bincike da tunani a cikin ƙirar samfur na zamani.", `
## AI ba zai maye gurbin masu ƙira ba — amma zai maye gurbin marasa sauri
  `),
  "dashboard-design-clarity-over-complexity": t("Ƙirar dashboard: Bayyanawa a kan rikitarwa", "Ƙa'idoji don ƙirar dashboards masu yawan bayanai.", `
## Saɓanin dashboard

1. **"Komai yana lafiya?"**
2. **"Me ya faru?"**
3. **"Me ya kamata in yi?"**
  `),
  "designing-trust-fintech-interfaces": t("Ƙirar amana a cikin atọka fintech", "Alamomin UX masu muhimmanci da ke gina amana yayin da masu amfani ke motsa kuɗi.", `
## Amana ita ce samfurin

### 1-5. Alamomin amana biyar
  `),
  "systems-thinking-product-design": t("Me ya sa tunanin tsari ke da muhimmanci a cikin ƙirar samfur", "Yadda tunani fiye da allon mutum ɗaya ke ba da damar ƙwarewar samfur mai girma.", `
## Matsalar tunanin matakin allo

> "Waɗanne ƙa'idoji ne ke jagorantar yadda kowane allo ya kamata ya yi aiki?"
  `),
  "from-fashion-to-product-design": t("Daga sutura zuwa ƙirar samfur", "Yadda asalina a cikin ƙirar sutura ya tsara hanyata wajen gina samfuran dijital.", `
## Labarin asali mai ban mamaki

Ban fara a fasaha ba. Harshen ƙira na farko shi ne masaka, ba Figma ba. Wannan ba rauni ba ne. Ƙarfi ne na musamman.
  `),
  "mobile-banking-onboarding-ux": t("Binciken UX: Shigar da bankin wayar hannu", "Nazarin yadda manyan apps fintech ke rage matsala a cikin hanyoyin masu amfani sababbi.", `
## Daƙiƙa 60 na farko

## Tsari 1-4
Mafi kyawun shigarwa ba ya ji kamar shigarwa.
  `),
  "notion-design-system-teardown": t("Binciken samfur: Tsarin ƙira na Notion", "Yadda Notion ke daidaita sassauci da daidaituwa a cikin samfur mai rikitarwa.", `
## Saɓanin sassauci

## Block na asali

## Darussa ga masu ƙira
  `),
  "ai-beyond-chatbots": t("AI a cikin ƙirar samfur: Bayan chatbots", "Yadda AI ke sake fasalin hanyoyin aikin ƙira da ƙwarewar mai amfani.", `
## Tarkon chatbot
## 1. Ƙimar farko masu hankali
## 2. Atọka masu dacewa
## 3. Abun ciki mai samarwa
  `),
  "systems-thinking-for-designers": t("Tunanin tsari ga masu ƙira", "Me ya sa fahimtar dukkan tsarin ke haifar da yanke shawara mafi kyau.", `
## Sassan ba su wanzu su kaɗai ba

## Matakai uku na ƙira
  `),
};

export default translations;
