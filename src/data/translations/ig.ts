import type { ArticleTranslations } from '../useLocalizedArticle';

const t = (title: string, excerpt: string, content: string) => ({ title, excerpt, content });

const translations: ArticleTranslations = {
  "building-scalable-design-systems": t("Ịrụ usoro imewe nke ga-abawanye", "Otu usoro imewe si enyere otu aka ịmepụta ngwaahịa nke ọma.", `
## Gịnị mere usoro imewe ji dị mkpa

Usoro imewe karịrị ọba akwụkwọ nke akụkụ. Ọ bụ asụsụ a na-ekekọrịta n'etiti imewe na injinịa.

### 1. Akara imewe
### 2. Nhazi nke akụkụ
### 3. Atụmatụ ụdị dị iche iche

Otu ndị m soro rụọ ọrụ na-ahụ **mbelata nke 40-60%** n'oge imewe ruo mmepe mgbe afọ nke mbụ gasịrị.
  `),
  "designing-ai-native-products": t("Ịme imewe ngwaahịa AI nke ala", "Ụkpụrụ maka imewe ngwaahịa ebe AI bụ ikike bụ isi.", `
## AI nke ala vs. AI emezigharịrị

### 1. Imewe maka enweghị nkwenye
### 2. Nnwere onwe na-abawanye
### 3. Echiche doro anya
### 4. Mbelata dị nro
  `),
  "ai-assisted-design-workflows": t("Usoro ọrụ imewe nke AI na-enyere aka", "Otu AI ga-esi mee ka nyocha, echiche na ntụgharị bụrụ ihe ngwa ngwa.", `
## AI agaghị anọchi anya ndị imewe — mana ọ ga-anọchi anya ndị na-alụghị ọsọ
  `),
  "dashboard-design-clarity-over-complexity": t("Imewe dashboard: Ụzọ doro anya karịa ndakọrịta", "Ụkpụrụ maka imewe dashboard nwere data dị ukwuu.", `
## Okwu mgbagha nke dashboard

1. **"Ihe niile ọ dị mma?"**
2. **"Gịnị mere?"**
3. **"Gịnị ka m kwesịrị ime?"**
  `),
  "designing-trust-fintech-interfaces": t("Ịrụ ntụkwasị obi na interface fintech", "Ụkpụrụ UX bụ isi nke na-arụ ntụkwasị obi mgbe ndị ọrụ na-ebugharị ego.", `
## Ntụkwasị obi bụ ngwaahịa

### 1-5. Ihe ngosi ntụkwasị obi ise
  `),
  "systems-thinking-product-design": t("Gịnị mere echiche usoro ji dị mkpa na imewe ngwaahịa", "Otu iche echiche karịa ihuenyo otu otu si enye ohere maka ahụmịhe ngwaahịa.", `
## Nsogbu nke iche echiche n'ọkwa ihuenyo

> "Kedu iwu ndabere nke na-achị otu ihuenyo ọ bụla kwesịrị isi rụọ ọrụ?"
  `),
  "from-fashion-to-product-design": t("Site n'ejiji ruo imewe ngwaahịa", "Otu nkwurịta okwu m na imewe ejiji si kpụọ ụzọ m na ịrụ ngwaahịa dijitalụ.", `
## Akụkọ mmalite na-atụghị anya

Amaliteghị m na teknụzụ. Asụsụ imewe nke mbụ m bụ akwa, ọ bụghị Figma. Nke a abụghị adịghị ike. Ọ bụ ike pụrụ iche.
  `),
  "mobile-banking-onboarding-ux": t("Nyocha UX: Mmalite ụlọ akụ ekwentị", "Ịtụle otu ngwa fintech kacha mma si ebelata nsogbu na usoro ndị ọrụ ọhụrụ.", `
## Sekọnd 60 mbụ

## Ụkpụrụ 1-4
Mmalite kacha mma adịghị adị ka mmalite.
  `),
  "notion-design-system-teardown": t("Nyocha ngwaahịa: Usoro imewe Notion", "Otu Notion si edozi nnwere onwe na nkwekọrịta na ngwaahịa siri ike.", `
## Okwu mgbagha nke nnwere onwe

## Ihe mbụ Block

## Ihe mmụta maka ndị imewe
  `),
  "ai-beyond-chatbots": t("AI na imewe ngwaahịa: Karịa chatbot", "Otu AI si emegharị usoro ọrụ imewe na ahụmịhe onye ọrụ.", `
## Ọnyà chatbot
## 1. Ụkpụrụ nkwekọrịta nke ọma
## 2. Interface na-emegharị onwe ya
## 3. Ọdịnaya a na-emepụta
  `),
  "systems-thinking-for-designers": t("Echiche usoro maka ndị imewe", "Gịnị mere ịghọta usoro zuru oke ji eduga na mkpebi ka mma.", `
## Akụkụ anaghị adị naanị ha

## Ọkwa atọ nke imewe
  `),
};

export default translations;
