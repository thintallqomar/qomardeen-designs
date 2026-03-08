import type { ArticleTranslations } from '../useLocalizedArticle';

const translations: ArticleTranslations = {
  "building-scalable-design-systems": {
    title: "Ṣíṣe àwọn ètò àpẹẹrẹ tó lè gbòòrò",
    excerpt: "Bí àwọn ètò àpẹẹrẹ ṣe ń ran àwọn ẹgbẹ́ lọ́wọ́ láti mú àwọn ọja dàgbà ní ọ̀nà tó múnadọ́kọ̀ nígbà tí wọ́n ń pa ìṣàmúlò àti ìṣọ̀kan ojú mọ́.",
    content: `
## Ìdí tí àwọn ètò àpẹẹrẹ fi ṣe pàtàkì ní ìwọ̀n ńlá

Ètò àpẹẹrẹ jẹ́ ju àkójọ àwọn kọ́ǹpónẹ́ǹtì lọ. Ó jẹ́ èdè àjọ laarin àpẹẹrẹ àti iṣẹ́ ẹ̀rọ tó ń jẹ́ kí àwọn ẹgbẹ́ kọ́ ìrírí tó ṣọ̀kan ní iyara.

Láìsí rẹ̀, gbogbo ẹ̀yà tuntun di àǹfààní fún ìtúká. Pẹ̀lú rẹ̀, gbogbo ẹ̀yà tuntun *mú* dídára tó wà tẹ́lẹ̀ pọ̀ sí i.

## Ètò Ètò tó lè Gbòòrò

### 1. Àwọn tókẹ́nì àpẹẹrẹ

Àwọn tókẹ́nì jẹ́ àtọ́mù ètò rẹ — àwọ̀, àlàfo, irú lẹ́tà, ojìji, ìṣípayá:

\`\`\`css
:root {
  --color-primary: hsl(185, 84%, 55%);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-lg: 1rem;
  --font-heading: 'Inter', sans-serif;
}
\`\`\`

Àwọn tókẹ́nì rí i dájú pé ìyípadà "àwọ̀ àkọ́kọ́" tàn kaakiri lẹ́sẹ̀kẹsẹ̀.

### 2. Ìtòlẹ́sẹẹsẹ kọ́ǹpónẹ́ǹtì

Àwọn kọ́ǹpónẹ́ǹtì gbọ́dọ̀ tẹ̀lé àtòkùn tó ṣe kedere:

\`\`\`
Àwọn ìpìlẹ̀ (Button, Input, Badge)
  → Àwọn àpẹẹrẹ (SearchBar, FormField, Card)
    → Àwọn ẹ̀yà (UserProfile, PaymentForm, Dashboard)
      → Àwọn ojú-ewé (Home, Settings, Checkout)
\`\`\`

Ìpele kọ̀ọ̀kan kàn ń lo ìpele tó wà nísàlẹ̀ rẹ̀. Èyí dẹ́kun ìgbẹ́kẹ̀lé yíyípadà ó sì jẹ́ kí àwọn àyípadà ṣe àsọtẹ́lẹ̀.

### 3. Ètò ìyàtọ̀

Kọ́ǹpónẹ́ǹtì kọ̀ọ̀kan nílò àwòṣe ìyàtọ̀ tó ṣe kedere:

\`\`\`typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

// Èyí fún ọ ní 4 × 3 = 12 àpapọ̀ láti inú kọ́ǹpónẹ́ǹtì KAN
\`\`\`

> Òfin àfọwọ́yà: Tí o bá ń ṣẹ̀dá kọ́ǹpónẹ́ǹtì tuntun tó jọra 80% pẹ̀lú èyí tó wà tẹ́lẹ̀, fi ìyàtọ̀ kún dípò rẹ̀.

## Àwọn àwòṣe ìṣàkóso

### Àárín gbùngbùn
Ẹgbẹ́ ètò àpẹẹrẹ kan ni ohun gbogbo. Ó ṣiṣẹ́ fún àwọn àjọ ńlá (50+ olùṣe àpẹẹrẹ).

### Fẹ́dẹ́rà
Àwọn ẹgbẹ́ ọja ń ṣàfikún kọ́ǹpónẹ́ǹtì, ẹgbẹ́ ètò ń ṣàyẹ̀wò tí wọ́n sì ń tọ́jú. Ó dára jùlọ fún àwọn àjọ àárín gbèdéke.

### Àwùjọ
Ẹnikẹ́ni lè dábàá àwọn àyípadà nípasẹ̀ ìlànà ìṣàfikún. Ó ṣiṣẹ́ fún kóòdù ṣíṣí àti àwọn ẹgbẹ́ tó tàn kaakiri.

## Ìfọwọ́sowọ́pọ̀ laarin Àwọn Ẹgbẹ́

Apá tó ṣòro jùlọ nínú àwọn ètò àpẹẹrẹ kìí ṣe ti ìmọ̀-ẹ̀rọ — ó jẹ́ ti ètò:

1. **Àwọn wákàtí ọ́fíìsì déédéé** — Àwọn ìgbà lóòṣù kan tí àwọn ẹgbẹ́ lè bi ìbéèrè
2. **Àwọn ìtọ́sọ́nà ìyípadà** — Nígbàtí àwọn kọ́ǹpónẹ́ǹtì bá yípadà, pèsè ọ̀nà ìyípadà ní ìgbésẹ̀-ní-ìgbésẹ̀
3. **Àwọn ìwọ̀n ìgbàmú** — Ṣàmójútó àwọn ẹgbẹ́ tó ń lo ètò àti àwọn tí kò lo
4. **Àwọn lúùpù ìsìnrú** — Jẹ́ kó rọrùn láti ṣe ìjábọ̀ ìṣòro àti béèrè àwọn ẹ̀yà

## Ṣíṣe Ìwọ̀n Àṣeyọrí

| Ìwọ̀n | Kíni ó ṣe ìwọ̀n |
|-------|-----------------|
| Ìbòrí kọ́ǹpónẹ́ǹtì | % UI tó ń lo kọ́ǹpónẹ́ǹtì ètò |
| Àkókò àpẹẹrẹ-sí-ìdàgbà | Àkókò láti àwòṣe sí iṣẹ́ gidi |
| Iye ìṣọ̀kan | Àwọn àbájáde ìṣàyẹ̀wò ìṣọ̀kan ojú |
| Ìwọ̀n ìgbàmú | Àwọn ẹgbẹ́ tó ń lo ètò ní ṣíṣe |

## Ipa Ìṣàpapọ̀

Àwọn ètò àpẹẹrẹ ní èrè tó ń pọ̀ sí i lọ́pọ̀lọpọ̀. Oṣù mẹ́fà àkọ́kọ́ dà bí ẹni pé ó lọ́ra — o ń kọ́ àwọn ìpìlẹ̀. Lẹ́yìn náà, ẹ̀yà tuntun kọ̀ọ̀kan ń jáde yára sí i nítorí pé àwọn ìpìlẹ̀ le. Àwọn ẹgbẹ́ tí mo ti bá ṣiṣẹ́ sábà máa ń rí **ìdínkù 40-60%** nínú àkókò àpẹẹrẹ-sí-ìdàgbà lẹ́yìn ọdún àkọ́kọ́.

Kọ́kọ́rọ́ náà ni sùúrù àti ìfaramọ́. Ètò àpẹẹrẹ jẹ́ ọja, kìí ṣe iṣẹ́ àkànṣe.
    `
  },
  "designing-ai-native-products": {
    title: "Ṣíṣe àpẹẹrẹ àwọn ọja tó dá lórí AI",
    excerpt: "Àwọn ìlànà fún ṣíṣe àpẹẹrẹ àwọn ọja níbi tí àtetékọ́ṣe jẹ́ agbára pàtàkì dípò ẹ̀yà àfikún.",
    content: `
## AI-Ìbílẹ̀ vs. AI-Ìmúdára

Ìyàtọ̀ pàtàkì kan wà tí ọ̀pọ̀lọpọ̀ ẹgbẹ́ ń pàdánù:

- **AI-Ìmúdára**: Ọja àtijọ́ pẹ̀lú àwọn ẹ̀yà AI tí a fi kún (b.a. "àwọn àbá ọlọ́gbọ́n" nínú fọ́ọ̀mù)
- **AI-Ìbílẹ̀**: Ọja tí a ṣe àpẹẹrẹ rẹ̀ láti ìpìlẹ̀ yíká àwọn agbára AI (b.a. àwọn atọ́ka ìfọ̀rọ̀wánilẹ́nuwò, àwọn ìṣiṣẹ́ aládàáṣe)

Àwọn ìlànà àpẹẹrẹ fún ọ̀kọ̀ọ̀kan yàtọ̀ ní pàtàkì.

## Àwọn Ìlànà Pàtàkì

### 1. Ṣe àpẹẹrẹ fún Àìdánilójú

Àwọn UI àtijọ́ jẹ́ pípinnu — tẹ bọ́tìnì kan, gba àbájáde tó ṣe àsọtẹ́lẹ̀. Àwọn atọ́ka AI jẹ́ ìṣeéṣe — ìfọwọ́sí kanna lè mú àbájáde tó yàtọ̀ jade.

Èyí nílò àwọn àpẹẹrẹ ìbáṣepọ̀ tuntun:

\`\`\`
Àtijọ́:      Ìfọwọ́sí → Ìṣiṣẹ́ → Àbájáde
AI-Ìbílẹ̀:   Ìfọwọ́sí → Ìṣiṣẹ́ → Àbájáde + Ìgbẹ́kẹ̀lé + Àwọn yíyàn
\`\`\`

Máa fi hàn nígbàgbogbo:
- **Àwọn àfihàn ìgbẹ́kẹ̀lé** — Báwo ni AI ṣe dájú tó?
- **Àwọn àbá mìíràn** — Kíni mìíràn tó lè jẹ́?
- **Àtúnṣe tó rọrùn** — Báwo ni a ṣe lè ṣàtúnṣe àwọn àbájáde tí kò tọ́?

### 2. Ìdásílẹ̀ aládàáṣe tó ń pọ̀ sí i

Má fún AI ní ìṣàkóso kíkún lẹ́sẹ̀kẹsẹ̀. Jẹ́ kí àwọn olùmúlò kọ́ ìgbẹ́kẹ̀lé díẹ̀díẹ̀:

| Ìpele Ìgbẹ́kẹ̀lé | Ipá AI | Ipá Olùmúlò |
|------------------|--------|-------------|
| Olùmúlò tuntun | Dábàá | Pinnu + ṣe |
| Olùmúlò déédéé | Ṣe ìgbaniyìn | Fọwọ́ sí |
| Olùmúlò alágbára | Ṣe | Ṣàmójútó + bọ́ |

### 3. Ìrònú tó hàn gbangba

Àwọn olùmúlò nílò láti mọ̀ *ìdí* tí AI fi ṣe ìpinnu kan:

\`\`\`
❌ "A ṣe ìgbaniyìn Ọja A"
✅ "A ṣe ìgbaniyìn Ọja A nítorí pé ó bá ìṣúná rẹ 
   ($50-100) mu, ó sì ní àwọn àtúnyẹ̀wò 4.8★ nínú ẹ̀ka tó fẹ́ràn"
\`\`\`

### 4. Ìbàjẹ́ tó rọrùn

Nígbàtí AI bá kùnà (yóò sì kùnà), ọja náà gbọ́dọ̀ ṣì ṣiṣẹ́:

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

## Àwọn Àwòṣe Ìbáṣepọ̀

### Ìfọ̀rọ̀wánilẹ́nuwò
Ó dára jùlọ fún: Àwọn iṣẹ́ tó ṣí sílẹ̀, ṣíṣàwárí, àwọn ìbéèrè tó díjú.

### Àyíká
Ó dára jùlọ fún: Ìmúdára ní ẹ̀yìn, ṣíṣàmójútó aláìṣe.

### Ìfọwọ́sowọ́pọ̀
Ó dára jùlọ fún: Iṣẹ́ ẹ̀dá, ṣíṣàtúnṣe àkọsílẹ̀, ṣíṣẹ̀dá kóòdù.

## Ìṣòro Àpẹẹrẹ

Apá tó ṣòro jùlọ nínú àpẹẹrẹ ọja AI kìí ṣe ìmọ̀-ẹ̀rọ — ó jẹ́ ṣíṣàmójútó àwọn ìrètí olùmúlò. AI tó ṣiṣẹ́ 90% àkókò ń dá ìbínú sílẹ̀ nínú 10% tó kùnà, pàápàá jùlọ tí àwọn olùmúlò bá retí 100%.

Ṣe àpẹẹrẹ fún ìṣẹ̀lẹ̀ ìkùnà lákọ̀ọ́kọ́. Tí ìrírí tó burú jùlọ bá jẹ́ ìtẹ́wọ́gbà, ọja náà yóò ṣàṣeyọrí.
    `
  },
  "ai-assisted-design-workflows": {
    title: "Ìṣiṣẹ́ àpẹẹrẹ pẹ̀lú ìrànlọ́wọ́ AI",
    excerpt: "Bí AI ṣe lè mú ìwádìí, ìrònú, àti àtúnṣe yára nínú àpẹẹrẹ ọja òde òní.",
    content: `
## AI kò ní rọ́pò àwọn olùṣe àpẹẹrẹ — ṣùgbọ́n yóò rọ́pò àwọn tó lọ́ra

Ilé-iṣẹ́ àpẹẹrẹ pín sí àwọn tí kò gbà AI gbọ́ àti àwọn tó fẹ́ràn AI jù. Èmi kìí ṣe ọ̀kan nínú wọn. Mo jẹ́ ẹni tó ṣe ohun tó wúlò tó ń lo AI níbikíbi tó bá mú iṣẹ́ mi yára gaan.

Ìṣiṣẹ́ mi gangan nìyí.

## Ìgbà 1: Ìmúra Ìwádìí

### Ìtúpalẹ̀ Ìdíje
Dípò kí n lo ọjọ́ 3 láti ṣàyẹ̀wò àwọn ọja oludíje, mo ń lo AI láti:

1. **Ṣe àkópọ̀ àwọn àtúnyẹ̀wò ilé ìtajà ohun èlò** — Yọ àwọn ẹdùn àti ìyìn àkọ́kọ́ 5 jáde
2. **Ṣe ìtúpalẹ̀ àwọn tabílì ẹ̀yà** — Ṣe àfiwé 10+ oludíje ní àwọn iwọ̀n pàtàkì
3. **Ṣe ìdámọ̀ àwọn àpẹẹrẹ** — Mú àwọn àpẹẹrẹ UX tó wọ́pọ̀ jáde nínú ẹ̀ka kan

\`\`\`
Àṣẹ: "Ṣe ìtúpalẹ̀ àwọn ohun èlò fintech 10 tó dára jùlọ ní Nàìjíríà. 
Fún ọ̀kọ̀ọ̀kan, ṣe àkójọ: àwọn ẹ̀yà pàtàkì, àwọn ẹdùn 
àkọ́kọ́ láti àwọn àtúnyẹ̀wò, àti àwọn àpẹẹrẹ UX àrà ọ̀tọ̀."
\`\`\`

Èyí fún mi ní ìpìlẹ̀ ìwádìí ní wákàtí díẹ̀ dípò ọjọ́.

### Àkópọ̀ Ìfọ̀rọ̀wánilẹ́nuwò Olùmúlò
Lẹ́yìn tí mo bá ti ṣe àwọn ìfọ̀rọ̀wánilẹ́nuwò, mo fi àwọn àkọsílẹ̀ sínú AI láti:
- Yọ àwọn kókó tó ń tún padà wá jáde
- Ṣe ìdámọ̀ àwọn ìtakora laarin ohun tí àwọn olùmúlò sọ àti ohun tí wọ́n ṣe
- Ṣẹ̀dá àwọn àkójọpọ̀ àwòṣe ìsopọ̀

## Ìgbà 2: Ìgbéga Ìrònú

AI dára gan-an ní ṣíṣẹ̀dá *iye púpọ̀* — èyí gan-an ni ohun tí ìdánrawò nílò.

### Mẹ́jọ Aṣiwèrè, Tó Pọ̀ Sí i
Dípò kí n ya àwòrán èrò 8 ní ìṣẹ́jú 8 fúnra mi, mo:
1. Ṣẹ̀dá 20+ àpèjúwe èrò pẹ̀lú AI
2. Ya àwòrán àwọn 8 tó ní ìlérí jùlọ
3. Dàpọ̀ kí n sì ṣàtúnṣe àwọn 3 tó dára jùlọ

### Ìkọ̀wé àti Ìkọ̀wé Kékeré
Àwọn àkọ̀wé àkọ́kọ́ ti ọ̀rọ̀ UI dára fún AI:

\`\`\`
Àṣẹ: "Kọ àwọn ẹ̀dà 5 ti ìfiránṣẹ́ ipò òfìfo 
fún ojú ìbojú ìtàn ìsanwó. Ohùn: ọ̀rẹ́, 
alámòjútó. Pẹ̀lú ìpè-sí-iṣẹ́ tó ṣe kedere."
\`\`\`

## Ìgbà 3: Ìtọ́jú Ètò Àpẹẹrẹ

Níbí ni AI fi ń dá àkókò púpọ̀ jùlọ sílẹ̀:

- **Ṣíṣẹ̀dá àkọsílẹ̀ kọ́ǹpónẹ́ǹtì** láti àwọn pàtó Figma
- **Kíkọ àwọn àkọsílẹ̀ ìṣàmúlò fún gbogbo ènìyàn** fún ìfigbàsílẹ̀
- **Ṣíṣẹ̀dá àwọn ìṣẹ̀lẹ̀ ìdánwò** fún àwọn ìṣẹ̀lẹ̀ ètè

## Ohun tí AI kò lè ṣe

AI kùnà ní:
- **Mímọ ìpò** — Kò mọ àwọn ìrora pàtó àwọn olùmúlò rẹ
- **Ṣíṣe ìpinnu ìtọ́wò** — Kò lè sọ fún ọ bóyá nǹkan kan *dára*
- **Ṣíṣàkíyèsí ìṣèlú** — Kò lè ṣàmójútó àwọn agbára olùkópa

Àwọn olùṣe àpẹẹrẹ tó máa gbilẹ̀ yóò jẹ́ àwọn tó ń lo AI fún iṣẹ́ ẹ̀rọ tí wọ́n sì ń fi àkókò tó fara hàn sínú àwọn apá ènìyàn jíjinlẹ̀ ti àpẹẹrẹ.
    `
  },
  "dashboard-design-clarity-over-complexity": {
    title: "Àpẹẹrẹ dashboard: Ìmọ́lẹ̀ ju ìdíjú lọ",
    excerpt: "Àwọn ìlànà fún ṣíṣe àpẹẹrẹ àwọn dashboard tó ní dátà púpọ̀ tó ń ràn àwọn olùmúlò lọ́wọ́ láti mọ àwọn ìfitóníléṣẹ̀ tó díjú ní kíákíá.",
    content: `
## Ìyàlẹ́nu Dashboard

Àwọn dashboard yẹ kó mú ìdíjú rọrùn. Dípò rẹ̀, ọ̀pọ̀lọpọ̀ wọn *ń fi* ìdíjú kún nípa fífi ohun gbogbo hàn lẹ́ẹ̀kan náà.

Àtúnṣe rẹ̀ kìí ṣe yíyọ dátà kúrò — ó jẹ́ ṣíṣètò rẹ̀ nípasẹ̀ ète.

## Ìlànà tó dá lórí Ète

Ẹ̀yà dashboard kọ̀ọ̀kan gbọ́dọ̀ dáhùn ọ̀kan nínú ìbéèrè mẹ́ta:

1. **"Ṣé ohun gbogbo dára?"** → Àwọn àfihàn ipò, ìkìlọ̀
2. **"Kí ló ṣẹlẹ̀?"** → Àwọn àṣà, ìfiwéra, ìtàn
3. **"Kí ni mo gbọ́dọ̀ ṣe?"** → Àwọn ohun tó yẹ kó ṣe, àwọn ìgbaniyìn

### Ìpele 1: Ìlera Ní Ìwò Kan

Òkè dashboard kọ̀ọ̀kan gbọ́dọ̀ jẹ́ ìdáhùn ní ìṣẹ́jú 2:

\`\`\`
✅ Gbogbo ètò ń ṣiṣẹ́ | 📦 142 ìfigbà lónìí | ⚠️ Ohun 3 nílò àfiyèsí
\`\`\`

Kò sí àwòrán, kò sí tábìlì — ipò nìkan.

### Ìpele 2: Ìjinlẹ̀ tó Bá Ìpò mu

Nísàlẹ̀ bàà ìlera, fi dátà hàn tó ṣàlàyé *ìdí* tí àwọn nǹkan fi rí bẹ́ẹ̀:

- **Àwọn ìlà àṣà** pẹ̀lú àwọn àkọsílẹ̀ tó ṣe kedere
- **Àwọn káàdì ìfiwéra** ("12% lókè ọjọ́ Ìṣẹ́gun tó kọjá")
- **Àwọn tábìlì tó yọ** tó ń fi àwọn ohun tó yàtọ̀ hàn nìkan ní ìpìlẹ̀ṣẹ̀

### Ìpele 3: Ilẹ̀ Iṣẹ́

Ìpele ìsàlẹ̀ ń fi ohun tí olùmúlò gbọ́dọ̀ *ṣe* hàn:

- Fọwọ́ sí àwọn ohun tó ń dúró
- Yanjú àwọn ìṣòro tó ti ṣàmì sí
- Ṣàyẹ̀wò àwọn ìgbaniyìn

## Ìdánwò Ìṣẹ́jú 5

Kí o tó fi dashboard kan jáde, mo ṣe ìdánwò ìṣẹ́jú 5:

> Fi dashboard hàn ẹnìkan fún ìṣẹ́jú 5. Lẹ́yìn náà bi: "Kíni èyí ń sọ fún ẹ?"

Tí kò bá lè dáhùn, àtòkùn kò tọ́. Tún àpẹẹrẹ ṣe títí tí ìfitóníléṣẹ̀ pàtàkì jùlọ yóò fi jẹ́ èyí tó hàn jùlọ.
    `
  },
  "designing-trust-fintech-interfaces": {
    title: "Ṣíṣe àpẹẹrẹ ìgbẹ́kẹ̀lé nínú àwọn atọ́ka fintech",
    excerpt: "Àwọn àpẹẹrẹ UX pàtàkì tó ń kọ́ ìgbẹ́kẹ̀lé nígbà tí àwọn olùmúlò ń gbé owó nípasẹ̀ àwọn pèpéle oníṣirò.",
    content: `
## Ìgbẹ́kẹ̀lé ni Ọja

Nínú fintech, atọ́ka *ni* àmì ìgbẹ́kẹ̀lé. Àwọn olùmúlò kò lè rí àwọn olupin, ìpamọ́ data, tàbí àwọn ìwé-ẹ̀rí ìbámu. Ohun tí wọ́n ní nìkan ni ohun tó wà lójú ìbojú.

Lẹ́yìn tí mo ti ṣe àpẹẹrẹ WalPay — pèpéle ìsanwó oníṣirò — mo ti ṣe ìdámọ̀ àwọn àpẹẹrẹ tó ń kọ́ ìgbẹ́kẹ̀lé olùmúlò ní ìgbà gbogbo.

## Àwọn Àmì Ìgbẹ́kẹ̀lé Márùn-ún

### 1. Ìṣípayá Àbò Tó Ń Pọ̀ Sí i

Má da gbogbo àwọn ẹ̀yà àbò sí olùmúlò lẹ́ẹ̀kan náà. Fi wọ́n hàn ní ìbámu pẹ̀lú ìpò:

- **Ṣáájú ìṣòwò**: Fi àmì ìpamọ́ data hàn
- **Nígbà ìjẹ́rìí**: Fi iye gangan àti olùgbà hàn
- **Lẹ́yìn ìparí**: Pèsè ìwé-ẹ̀rí pẹ̀lú àmì àkókò àti ìdámọ̀ ìṣòwò

### 2. Àwọn Lúùpù Ìdáhùn tó Ṣe Àsọtẹ́lẹ̀

Iṣẹ́ kọ̀ọ̀kan gbọ́dọ̀ ní ìdáhùn tó ṣe kedere tó sì yára:

\`\`\`
Tẹ "Firánṣẹ́" → Bọ́tìnì fi yíyí hàn → 
Ojú ìbojú àṣeyọrí pẹ̀lú ayọ̀ → 
Ìwé-ẹ̀rí hàn nínú ìtàn
\`\`\`

Ohun tó burú jùlọ nínú fintech ni àìmọ̀. *"Ṣé ìsanwó mi ti ṣẹ?"* kò gbọ́dọ̀ jẹ́ ìbéèrè rárá.

### 3. Àwọn Ipò Àṣìṣe tó Ṣe Kedere

Nígbàtí nǹkan bá kùnà, jẹ́ pàtó:

| ❌ Búburú | ✅ Dáradára |
|-----------|------------|
| "Ìṣòwò kùnà" | "Bánkì rẹ kọ̀ ìṣòwò yìí. Gbìyànjú káàdì mìíràn tàbí kàn sí bánkì rẹ." |
| "Àṣìṣe ṣẹlẹ̀" | "A kò lè rí i dájú ẹni tí o jẹ́. Jọ̀wọ́ tún ya fọ́tò rẹ ní ìmọ́lẹ̀ tó dára." |

### 4. Èdè Ojú tó Mọ̀ ọ́n

Lo àwọn àṣà tí àwọn olùmúlò gbẹ́kẹ̀lé tẹ́lẹ̀:
- **Àwọ̀ ewé** fún àwọn ìṣòwò tó ṣàṣeyọrí
- **Àwọn àmì tìtì** nítòsí àwọn ìfọwọ́sí tó ní ìkọ̀kọ̀
- **Ètò bánkì** fún àwọn nọ́ḿbà àkáǹtì (•••• 4532)

### 5. Ìdápadà àti Ìgbàpadà

Jẹ́ kí àwọn olùmúlò ní ìmọ̀lára àbò nípa pípèsè àwọn ọ̀nà àbáyọ:
- Fagílé àwọn ìfiránṣẹ́ tó ń dúró
- Ṣàtúnṣe àwọn ìsanwó tó ti ṣètò
- Ṣe àríyànjiyàn àwọn ìṣòwò pẹ̀lú àwọn àtòkùn àkókò tó ṣe kedere

## Ìlànà yìí yí àbò àìfọwọ́kán padà sí ìgbẹ́kẹ̀lé tó wúlò fún olùmúlò.
    `
  },
  "systems-thinking-product-design": {
    title: "Ìdí tí ìrònú ètò fi ṣe pàtàkì nínú àpẹẹrẹ ọja",
    excerpt: "Bí ìrònú tó kọjá ojú ìbojú kọ̀ọ̀kan ṣe ń mú ìrírí ọja tó gbòòrò tó sì ṣọ̀kan ṣeéṣe.",
    content: `
## Ìṣòro Ìrònú ní Ìpele Ojú Ìbojú

Ọ̀pọ̀lọpọ̀ olùṣe àpẹẹrẹ máa ń bẹ̀rẹ̀ pẹ̀lú àwọn ojú ìbojú. Ojú-ewé ìwọlé níhìn-ín, dashboard lọ́hùn-ún, pánẹ́ẹ̀lì ètò ní ibòmíràn. Ọ̀nà yìí ṣiṣẹ́ fún àwọn ọja kékeré, ṣùgbọ́n ó fọ́ nígbà tí ọja rẹ bá gbòòrò.

Nígbà tí o bá ṣe àpẹẹrẹ ojú ìbojú-ní-ojú ìbojú, o pàrí pẹ̀lú:
- **Àwọn àpẹẹrẹ tí kò ṣọ̀kan** — àwọn bọ́tìnì tó ń hùwà yàtọ̀ ní àwọn ojú-ewé ọ̀tọ̀ọ̀tọ̀
- **Àwọn kọ́ǹpónẹ́ǹtì tó tún padà** — ẹ̀dà mẹ́ta ti modal kanna
- **Ìfigbàsílẹ̀ tó fọ́** — àwọn onímọ̀-ẹ̀rọ tún ohun tó wà tẹ́lẹ̀ kọ́

## Bí Ìrònú Ètò Ṣe Rí

Ìrònú ètò túmọ̀ sí ṣíṣe zoom sẹ́yìn kí o tó ṣe zoom síwájú. Dípò kí o bi *"Bí wo ni ojú ìbojú yìí yẹ kó rí?"*, o bi:

> "Àwọn òfin wo ni ó ń darí bí ojú ìbojú kọ̀ọ̀kan ṣe gbọ́dọ̀ hùwà?"

Ìyípadà yìí yí ohun gbogbo padà. O bẹ̀rẹ̀ ṣíṣe àpẹẹrẹ **àwọn ìlànà**, kìí ṣe àwọn ojú-ewé.

\`\`\`
Ipá Olùmúlò → Ètò Ìgbàláàyè → Àwọn Iṣẹ́ Tó Wà → Ilẹ̀ UI
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

## Èrè Rẹ̀

Ìrònú ètò kò kàn jẹ́ kí àpẹẹrẹ ṣọ̀kan — ó jẹ́ kí gbogbo ẹgbẹ́ ọja yára sí i:

- **Àwọn olùṣe àpẹẹrẹ** tún àwọn àpẹẹrẹ lo dípò kí wọ́n tún wọn ṣe
- **Àwọn onímọ̀-ẹ̀rọ** kọ́ lẹ́ẹ̀kan tí wọ́n sì ń ṣàkópọ̀
- **Àwọn alámòjútó ọja** lè ṣe àsọtẹ́lẹ̀ ipa àwọn àyípadà

Bẹ̀rẹ̀ kékeré: *"Ṣé àpẹẹrẹ kan wà níhìn-ín tí mo ń tún ṣe?"* Tí bẹ́ẹ̀ bá rí, yọ ọ́ jáde, fún un ní orúkọ, kí o sì ṣe àkọsílẹ̀ rẹ̀.
    `
  },
  "from-fashion-to-product-design": {
    title: "Láti aṣọ dé àpẹẹrẹ ọja",
    excerpt: "Bí ìpìlẹ̀ mi nínú àpẹẹrẹ aṣọ ti ṣe àpẹẹrẹ ọ̀nà mi sí kíkọ́ àwọn ọja oníṣirò àti àwọn ìrírí olùmúlò.",
    content: `
## Ìtàn Ìpilẹ̀ṣẹ̀ tó Ṣàjèjì

N kò bẹ̀rẹ̀ nínú ìmọ̀-ẹ̀rọ. Èdè àpẹẹrẹ àkọ́kọ́ mi ni aṣọ, kìí ṣe Figma. Mo kọ́ àpẹẹrẹ aṣọ kí n tó yí padà sí àpẹẹrẹ ọja oníṣirò — ìpìlẹ̀ yẹn sì fún mi ní àǹfààní tí ọ̀pọ̀lọpọ̀ olùṣe àpẹẹrẹ kò ní.

## Ohun tí Aṣọ kọ́ Mi

### 1. Ìrònú Ohun Èlò

Nínú aṣọ, o ṣe àpẹẹrẹ *pẹ̀lú* ohun èlò, kìí ṣe lòdì sí rẹ̀. Sílíìkì ṣubú yàtọ̀ sí dẹ́ǹnìmù.

Àpẹẹrẹ oníṣirò ṣiṣẹ́ bẹ́ẹ̀ náà:
- **CSS ní àpẹẹrẹ rẹ̀** — àwọn ètò kan dá ní ìdá, àwọn mìíràn jà pẹ̀lú ọ̀nà náà
- **Àwọn pèpéle ní àṣà** — iOS àti Android ní àwọn ohun-ìní ohun èlò tó yàtọ̀
- **Dátà ní ìwúwo** — tábìlì tó ní ohun 10 yàtọ̀ sí ti 10,000

### 2. Pàtàkì Ìbáramu

Aṣọ ẹlẹ́wà tí kò bá ọ mu jẹ́ aláìlérè. Bẹ́ẹ̀ náà ni ó rí fún àwọn atọ́ka:

> "Àpẹẹrẹ tó dára jùlọ ní àgbáyé kùnà tí kò bá bá àwòṣe ọpọlọ olùmúlò mu."

### 3. Ìrònú Àkójọpọ̀

Àwọn olùṣe àpẹẹrẹ aṣọ kì í ṣe àpẹẹrẹ àwọn nǹkan kọ̀ọ̀kan — wọ́n ṣe àpẹẹrẹ *àwọn àkójọpọ̀*. Ohun kọ̀ọ̀kan gbọ́dọ̀ ṣiṣẹ́ nìkan ÀTI papọ̀. Ètò àpẹẹrẹ gan-an nìyí.

### 4. Ìfihàn Jẹ́ Apá Ọja

Nínú aṣọ, ìfihàn aṣọ *jẹ́* apá àpẹẹrẹ. Bí o ṣe fi hàn ṣe pàtàkì bí ohun tí o fi hàn.

Nínú àpẹẹrẹ ọja:
- **Ìfìdímúlẹ̀** jẹ́ ìfihàn aṣọ rẹ
- **Àwọn ipò òfìfo** jẹ́ ojú fèrèsé ìtajà rẹ
- **Àwọn ipò ìgbéjáde** jẹ́ ìdìpọ̀ rẹ

## Ìdí tí ó fi ṣe pàtàkì

Ilé-iṣẹ́ ìmọ̀-ẹ̀rọ ń san àwọn tó faramọ́ ìṣòkan. Gbogbo ènìyàn ń lo ohun èlò kanna, tẹ̀lé àwọn ìkọ́ni kanna, tí wọ́n sì ń mú àwọn àpẹẹrẹ kanna jáde. Wíwá láti aṣọ fún mi ní ojú tó yàtọ̀.

Èyí kìí ṣe àìlera. Ó jẹ́ agbára àgbàyanu.
    `
  },
  "mobile-banking-onboarding-ux": {
    title: "Ìtúpalẹ̀ UX: Ìfìdí múlẹ̀ bánkì alágbèéká",
    excerpt: "Ṣíṣe àyẹ̀wò bí àwọn ohun èlò fintech tó dára jùlọ ṣe ń dín ìjàkadì kù nínú àwọn ìṣàn olùmúlò àkọ́kọ́.",
    content: `
## Ìṣẹ́jú 60 Àkọ́kọ́

Ìfìdímúlẹ̀ bánkì alágbèéká ní ìhámọ́ líle: àwọn olùmúlò gbọ́dọ̀ pèsè ìfitóníléṣẹ̀ àdáni *ṣáájú* kí wọ́n tó ní ìrírí iye èyíkéyìí. Àwọn ohun èlò tó dára jùlọ yanjú èyí nípasẹ̀ àpẹẹrẹ UX tó ṣọ́ra.

## Àpẹẹrẹ 1: Ìfihàn Iye Ṣáájú Ìforúkọsílẹ̀

Àwọn ohun èlò tó lágbára jùlọ fi ohun tí o máa gba hàn *ṣáájú* kí wọ́n tó béèrè ohunkóhun:

\`\`\`
Kuda:     Ojú ìbojú àǹfààní 3 → Forúkọsílẹ̀
OPay:     Irin-àjò ẹ̀yà pẹ̀lú àwòrán aládàáṣe → Forúkọsílẹ̀
Revolut:  Ìfihàn aládàáṣiṣẹ́pọ̀ → Forúkọsílẹ̀
\`\`\`

### Ìdí tí ó fi ṣiṣẹ́: Ìpadàsí. Fi iye hàn lákọ̀ọ́kọ́, lẹ́yìn náà béèrè ìdókòwò.

## Àpẹẹrẹ 2: KYC Tó Ń Pọ̀ Sí i

Dípò fọ́ọ̀mù aláàyè 12, pín ìrí-i-dájú ìdánimọ̀ sí àwọn ìgbésẹ̀ kékeré:

1. **Ìpele 0**: Ímeèlì + ọ̀rọ̀ aṣínà → Lè ṣàwárí ohun èlò náà
2. **Ìpele 1**: Nọ́mbà fóònù → Lè gba owó
3. **Ìpele 2**: BVN/Ìrí-i-dájú ID → Lè fi owó ránṣẹ́
4. **Ìpele 3**: Ẹ̀rí àdírẹ́ẹ̀sì → Ìwọ̀n kíkún ti ṣí

### Ìpele kọ̀ọ̀kan fún àǹfààní díẹ̀ sí i, ó ṣẹ̀dá lúùpù èrè.

## Àpẹẹrẹ 3: Àlàyé Àbò Tó Bá Ìpò mu

Má kan béèrè fọ́tò — ṣàlàyé ìdí:

| Ìgbésẹ̀ | Ohun tí wọ́n béèrè | Ohun tí wọ́n ṣàlàyé |
|---------|---------------------|---------------------|
| BVN | "Tẹ BVN rẹ sí" | "Èyí rí ẹni tí o jẹ́ dájú pẹ̀lú Bánkì Àárín" |
| Fọ́tò | "Ya fọ́tò" | "A fi wé ID rẹ láti dẹ́kun jibìtì" |
| PIN | "Ṣẹ̀dá PIN" | "Èyí dáàbò bo ìṣòwò rẹ kọ̀ọ̀kan" |

## Àpẹẹrẹ 4: Ìfipamọ́ Ìlọsíwájú

Tí olùmúlò bá dúró ní àárín ìfìdímúlẹ̀, fi ìlọsíwájú rẹ̀ pamọ́. Ìrírí tó burú jùlọ ni kí o tún bẹ̀rẹ̀ láti ìbẹ̀rẹ̀.

## Àkópọ̀

Ìfìdímúlẹ̀ tó dára jùlọ kò dà bí ìfìdímúlẹ̀. Ó dà bí ẹni pé ọja náà ń ṣí fún ọ díẹ̀díẹ̀, ìpàṣípààrọ̀ ìgbẹ́kẹ̀lé kan ní àkókò kan.
    `
  },
  "notion-design-system-teardown": {
    title: "Ìtúpalẹ̀ ọja: Ètò àpẹẹrẹ Notion",
    excerpt: "Bí Notion ṣe ń dọ́gba ìrọ̀rùn àti ìṣọ̀kan nínú ọja tó díjú.",
    content: `
## Ìyàlẹ́nu Ìrọ̀rùn

Notion jẹ́ ọ̀kan nínú àwọn ohun èlò ìṣelọ́pọ̀ tó rọ̀rùn jùlọ tí a ti ṣe rí. Àwọn olùmúlò lè ṣẹ̀dá àwọn ibi ìpamọ́ dátà, wiki, àwọn bọ́ọ̀dù iṣẹ́ àkànṣe, àti àwọn àkọsílẹ̀ — gbogbo rẹ̀ nínú atọ́ka kanna. Síbẹ̀ kò dà bí rúdurùdu rárá.

Báwo ni ètò àpẹẹrẹ Notion ṣe ṣàṣeyọrí èyí?

## Ìpìlẹ̀ Block

Ohun gbogbo nínú Notion jẹ́ **block**. Ọ̀rọ̀, àwòrán, àwọn ibi ìpamọ́ dátà, àwọn ìfisí — gbogbo wọn jẹ́ blocks. Àìdájú kíkọ́ yìí jẹ́ ìpìlẹ̀ gbogbo ètò àpẹẹrẹ wọn.

\`\`\`
Block
├── Block Ọ̀rọ̀ (paragíráàfù, àkọlé, àtòjọ, ìyípadà)
├── Block Ohun Amóhùnmáwòrán (àwòrán, fídíò, fáìlì, àmì ìforúkọsílẹ̀)
├── Block Ibi Ìpamọ́ Dátà (tábìlì, bọ́ọ̀dù, ìlà àkókò, kàlẹ́ǹdà, gálẹ́rì)
├── Block Ìfisí (kóòdù, ìṣirò, tweet, figma)
└── Block Ètò (ọ̀wọ́n, ìyàsọ́tọ̀, ìpè)
\`\`\`

### Ìdí tí ó fi Ṣiṣẹ́

1. **Àwòṣe ìbáṣepọ̀ tó ṣọ̀kan** — Block kọ̀ọ̀kan lè jẹ́ fàfà, tún ṣe, pa, àti ṣe àkọsílẹ̀ sí
2. **Ìṣàkópọ̀** — Block èyíkéyìí lè ní àwọn blocks mìíràn nínú
3. **Ìfàgùn** — Àwọn irú block tuntun kò nílò àwọn àpẹẹrẹ ìbáṣepọ̀ tuntun

## Àwọn Ẹ̀kọ́ fún Àwọn Olùṣe Àpẹẹrẹ

1. **Wá ìpìlẹ̀ rẹ** — Kíni ẹ̀yà tó kéré jùlọ ti ọja rẹ? Ṣe àpẹẹrẹ rẹ̀ lọ́nà pípé.
2. **Ṣe ìhámọ́ àpò** — Bí àkóónú ṣe rọ̀rùn tó, bẹ́ẹ̀ ni ìlànà gbọ́dọ̀ le tó.
3. **Àwọ̀ jẹ́ dátà** — Lo àwọ̀ láti bá ṣe ìfitóníléṣẹ̀, kìí ṣe láti ṣe ọ̀ṣọ́.
4. **Ìrìnnà = àwòṣe ọpọlọ** — Bàà ẹ̀gbẹ́ rẹ gbọ́dọ̀ ṣàfihàn bí àwọn olùmúlò ṣe rò.

## Ohun tí Notion kò ṣe dáradára

- **Ìṣiṣẹ́** — Àwọn ojú-ewé tó díjú lè lọ́ra
- **Ìrírí alágbèéká** — Ìrọ̀rùn tó ṣiṣẹ́ lórí kọ̀ǹpútà aṣálẹ̀ di ìpọ́njú lórí alágbèéká
- **Ìtẹ̀jáde ìkọ́** — Àwọn olùmúlò tuntun kì í mọ ibí tí wọ́n á bẹ̀rẹ̀

Àní àwọn ètò àpẹẹrẹ tó dára jùlọ ní àwọn ìṣòwò. Kọ́kọ́rọ́ ni ṣíṣe àwọn ìṣòwò *lọ́kàn*, kìí ṣe láìmọ̀.
    `
  },
  "ai-beyond-chatbots": {
    title: "AI nínú àpẹẹrẹ ọja: Kọjá àwọn chatbot",
    excerpt: "Bí AI ṣe ń tún àwọn ìṣiṣẹ́ àpẹẹrẹ, ìwádìí, àti ìrírí olùmúlò ṣe.",
    content: `
## Ẹ̀gẹ́ Chatbot

Nígbà tí ọ̀pọ̀lọpọ̀ ènìyàn bá rò "AI nínú àpẹẹrẹ ọja," wọ́n rò àwọn chatbot. Ṣùgbọ́n àwọn chatbot kàn jẹ́ ọ̀kan — lè jẹ́ èyí tó kéré ìfẹ́ jùlọ — nínú àwọn ohun tí AI lè ṣe nínú àpẹẹrẹ.

Ìyípadà gidi ń ṣẹlẹ̀ ní àwọn ibi mẹ́ta.

## 1. Àwọn Iye Àìpé tó Gbọ́n

Ẹ̀yà AI tó lágbára jùlọ ni èyí tí àwọn olùmúlò kì í ṣe àkíyèsí: **àwọn iye àìpé tó gbọ́n**.

Dípò kí o béèrè lọ́wọ́ àwọn olùmúlò láti ṣètò ohun gbogbo, AI lè:
- **Kún àwọn fọ́ọ̀mù ṣáájú** nípasẹ̀ ìpò (ibùdó, àkókò, ìhùwàsí tẹ́lẹ̀)
- **Dábàá àwọn ètò** nípasẹ̀ àwọn olùmúlò tó jọra
- **Sọ àwọn iṣẹ́ tó ń bọ̀ tẹ́lẹ̀** kí ó sì fi wọ́n hàn ní ìsáájú

## 2. Àwọn Atọ́ka tó Ṣe Àtúnṣe

AI jẹ́ kí àwọn atọ́ka tún ara wọn ṣe nípasẹ̀ olùmúlò:
- **Àárọ̀**: Fi àkópọ̀ ọjọ́ àti àtòjọ iṣẹ́ hàn
- **Ìparí ọjọ́**: Fi àkópọ̀ àti ètò ọ̀la hàn
- **Ìsinmi**: Fi àwọn ohun àdáni hàn, fi àwọn ẹ̀yà iṣẹ́ pamọ́

## 3. Àkóónú tó Ṣẹ̀dá

AI lè ṣẹ̀dá àkóónú tó bá olùmúlò mu nínú àwọn ọja:
- **Ìfìdímúlẹ̀ aládàáṣe** — Àwọn ìkọ́ni tó ṣàtúnṣe nípasẹ̀ ipá olùmúlò
- **Ìrànlọ́wọ́ tó bá ìpò mu** — Àkọsílẹ̀ tó dáhùn ìbéèrè pàtó tí olùmúlò lè ní
- **Àwọn àkópọ̀ ọlọ́gbọ́n** — Dídín àwọn ọ̀rọ̀ gígùn kù sí àwọn ohun tó yẹ kó ṣe

## Ìṣòro Àpẹẹrẹ

Àwọn ọja tó máa ṣẹ́gun kì í ṣe àwọn tó ní ẹ̀yà AI jùlọ. Wọ́n jẹ́ àwọn tí AI ṣọ̀kan dáradára nínú tí àwọn olùmúlò gbàgbé pé ó wà. Ìṣòro àpẹẹrẹ ti ẹ̀wádún yìí nìyẹn.
    `
  },
  "systems-thinking-for-designers": {
    title: "Ìrònú ètò fún àwọn olùṣe àpẹẹrẹ",
    excerpt: "Ìdí tí mímọ̀ gbogbo ètò fi ń mú ìpinnu tó dára ní ìpele kọ́ǹpónẹ́ǹtì.",
    content: `
## Àwọn Kọ́ǹpónẹ́ǹtì kò Sí Lọ́tọ̀

Bọ́tìnì, káàdì, àti modal kọ̀ọ̀kan tí o ṣe àpẹẹrẹ rẹ̀ wà nínú ètò kan. Dídára àwọn ìpinnu ìpele kọ́ǹpónẹ́ǹtì rẹ dá lórí bí o ṣe mọ ètò yẹn dáradára tó.

## Àwọn Ìpele Mẹ́ta ti Àpẹẹrẹ

### Ìpele 1: Àpẹẹrẹ Kọ́ǹpónẹ́ǹtì
*"Báwo ni bọ́tìnì yìí yẹ kó rí?"*
Ọ̀pọ̀lọpọ̀ olùṣe àpẹẹrẹ ṣiṣẹ́ níhìn-ín.

### Ìpele 2: Àpẹẹrẹ Àpẹẹrẹ
*"Báwo ni àwọn bọ́tìnì yẹ kó ṣe hùwà ní gbogbo ọja?"*
Níhìn-ín ni àwọn ètò àpẹẹrẹ wà.

### Ìpele 3: Àpẹẹrẹ Ètò
*"Ìdí tí a fi nílò àwọn bọ́tìnì rárá? Àwọn iṣẹ́ wo ni ó ṣeéṣe nínú ọja wa, báwo ni àwọn olùmúlò ṣe rí wọn tí wọ́n sì ṣe wọ́n?"*
Ìrònú ètò nìyí.

## Ìlànà Ṣíṣe

\`\`\`
1. ÌPÒ:    Nínú ètò wo ni èyí wà?
2. ÌṢÀN:   Kíni ó ṣẹlẹ̀ ṣáájú àti lẹ́yìn èyí?
3. IPÒ:    Kíni gbogbo àwọn ipò tó ṣeéṣe?
4. ÈTÈ:    Kíni ó lè bàjẹ́?
5. ÌWỌN:   Kíni ó ṣẹlẹ̀ ní ìwọ̀n 10×?
\`\`\`

## Ìkọ́ Ìmọ̀ Ètò

1. **Ya àwòrán àwọn Mápù, kìí ṣe Àwọn Ojú Ìbojú** — Ṣáájú kí o ṣí Figma, ya àwòrán ètò náà
2. **Bi "Lẹ́yìn náà kíni?"** — Tẹ̀lé àwọn ọ̀nà títí tí o fi rí ìṣẹ̀lẹ̀ ètè
3. **Kẹ́kọ̀ọ́ nípa Àwọn Ìpìlẹ̀** — Ka àwọn àkọsílẹ̀ ẹ̀rọ, mọ àwòṣe dátà
4. **Rò nínú Àwọn Ipò** — Ẹ̀yà kọ̀ọ̀kan ní ó kéré jùlọ ipò 5: òfìfo, ìgbéjáde, àpákan, pípé, àṣìṣe

## Àǹfààní Ìdíje

Àwọn ilé-iṣẹ́ ń gba àwọn aláròwọ́tó ètò kìí ṣe nítorí pé wọ́n ṣe àwọn ojú ìbojú tó dára jù, ṣùgbọ́n nítorí pé wọ́n ṣe *àwọn ojú ìbojú tó kéré*. Nígbà tí o bá mọ ètò náà, o rí àwọn ojútùú tó lẹ́wà tó ń ṣèdá ìṣẹ̀lẹ̀ 10 pẹ̀lú àpẹẹrẹ 1 dípò àpẹẹrẹ 10 ọ̀tọ̀ọ̀tọ̀.
    `
  },
};

export default translations;
