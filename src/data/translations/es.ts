import type { ArticleTranslations } from '../useLocalizedArticle';

const translations: ArticleTranslations = {
  "building-scalable-design-systems": {
    title: "Construyendo sistemas de diseño escalables",
    excerpt: "Cómo los sistemas de diseño ayudan a los equipos a escalar productos eficientemente manteniendo la usabilidad y consistencia visual.",
    content: `
## Por qué los sistemas de diseño importan a escala

Un sistema de diseño es más que una biblioteca de componentes. Es un lenguaje compartido entre diseño e ingeniería que permite a los equipos crear experiencias consistentes con velocidad.

Sin uno, cada nueva funcionalidad se convierte en una oportunidad para la fragmentación. Con uno, cada nueva funcionalidad *potencia* la calidad existente.

## La anatomía de un sistema escalable

### 1. Tokens de diseño

Los tokens son los átomos de tu sistema — colores, espaciado, tipografía, sombras, animaciones:

\`\`\`css
:root {
  --color-primary: hsl(185, 84%, 55%);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-lg: 1rem;
  --font-heading: 'Inter', sans-serif;
}
\`\`\`

### 2. Arquitectura de componentes

Los componentes deben seguir una jerarquía clara:

\`\`\`
Primitivos (Button, Input, Badge)
  → Patrones (SearchBar, FormField, Card)
    → Funcionalidades (UserProfile, PaymentForm, Dashboard)
      → Páginas (Home, Settings, Checkout)
\`\`\`

### 3. Estrategia de variantes

Cada componente necesita un modelo de variantes claro.

> Regla de oro: Si estás creando un nuevo componente 80% similar a uno existente, añade una variante.

## Modelos de gobernanza

### Centralizado
Un equipo de sistemas de diseño posee todo. Funciona para organizaciones grandes (50+ diseñadores).

### Federado
Los equipos de producto contribuyen componentes, el equipo de sistemas revisa y mantiene.

### Comunitario
Cualquiera puede proponer cambios mediante un proceso de contribución.

## El efecto compuesto

Los sistemas de diseño tienen rendimientos exponenciales. Los primeros 6 meses se sienten lentos — estás construyendo infraestructura. Después, cada nueva funcionalidad se entrega más rápido porque los cimientos son sólidos. Los equipos con los que he trabajado típicamente ven una **reducción del 40-60%** en el tiempo de diseño a desarrollo después del primer año.

La clave es paciencia y compromiso. Un sistema de diseño es un producto, no un proyecto.
    `
  },
  "designing-ai-native-products": {
    title: "Diseñando productos nativos de IA",
    excerpt: "Principios para diseñar productos donde la inteligencia artificial es una capacidad central en lugar de una funcionalidad añadida.",
    content: `
## IA-Nativa vs. IA-Mejorada

Hay una distinción crítica que la mayoría de los equipos pasan por alto:

- **IA-Mejorada**: Producto tradicional con funcionalidades de IA añadidas
- **IA-Nativa**: Producto diseñado desde cero alrededor de capacidades de IA

## Principios fundamentales

### 1. Diseñar para la incertidumbre
Las interfaces tradicionales son determinísticas. Las interfaces de IA son probabilísticas.

### 2. Autonomía progresiva
No des el control total a la IA inmediatamente. Deja que los usuarios construyan confianza gradualmente.

### 3. Razonamiento transparente
Los usuarios necesitan entender *por qué* la IA tomó una decisión.

### 4. Degradación elegante
Cuando la IA falla (y fallará), el producto debe seguir funcionando.

## El desafío del diseño

La parte más difícil del diseño de productos IA no es la tecnología — es gestionar las expectativas de los usuarios. Diseña primero para el caso de fallo.
    `
  },
  "ai-assisted-design-workflows": {
    title: "Flujos de trabajo de diseño asistidos por IA",
    excerpt: "Cómo la inteligencia artificial puede acelerar la investigación, ideación e iteración en el diseño de productos moderno.",
    content: `
## La IA no reemplazará a los diseñadores — pero reemplazará a los lentos

La industria del diseño está dividida entre escépticos y evangelistas de la IA. No soy ninguno de los dos. Soy un pragmático que usa la IA donde genuinamente acelera mi trabajo.

## Fase 1: Aceleración de investigación
## Fase 2: Impulso de ideación
## Fase 3: Mantenimiento del sistema de diseño

## Lo que la IA no puede hacer

La IA falla en comprender el contexto, tomar decisiones de gusto y navegar la política organizacional. Los diseñadores que prosperen serán aquellos que usen la IA para el trabajo mecánico e inviertan su tiempo liberado en las partes profundamente humanas del diseño.
    `
  },
  "dashboard-design-clarity-over-complexity": {
    title: "Diseño de dashboards: claridad sobre complejidad",
    excerpt: "Principios para diseñar dashboards con muchos datos que ayudan a los usuarios a entender información compleja rápidamente.",
    content: `
## La paradoja del dashboard

Los dashboards deberían simplificar la complejidad. En cambio, la mayoría *añade* complejidad mostrando todo a la vez.

La solución no es eliminar datos — es organizarlos por intención.

## El framework basado en intención

1. **"¿Está todo bien?"** → Indicadores de estado, alertas
2. **"¿Qué pasó?"** → Tendencias, comparaciones, historial
3. **"¿Qué debo hacer?"** → Elementos de acción, recomendaciones

## La prueba de los 5 segundos

Muestra el dashboard a alguien durante 5 segundos. Luego pregunta: "¿Qué te está diciendo?" Si no puede responder, la jerarquía está mal.
    `
  },
  "designing-trust-fintech-interfaces": {
    title: "Diseñando confianza en interfaces fintech",
    excerpt: "Patrones UX clave que construyen confianza cuando los usuarios mueven dinero a través de plataformas digitales.",
    content: `
## La confianza es el producto

En fintech, la interfaz *es* la señal de confianza. Los usuarios no pueden ver los servidores, el cifrado o las certificaciones de cumplimiento.

## Las cinco señales de confianza

### 1. Divulgación progresiva de seguridad
### 2. Bucles de retroalimentación predecibles
### 3. Estados de error transparentes
### 4. Lenguaje visual familiar
### 5. Deshacer y recuperación

Este framework transformó la seguridad abstracta en confianza tangible para el usuario.
    `
  },
  "systems-thinking-product-design": {
    title: "Por qué el pensamiento sistémico importa en el diseño de productos",
    excerpt: "Cómo pensar más allá de las pantallas individuales permite experiencias de producto escalables y consistentes.",
    content: `
## El problema del pensamiento a nivel de pantalla

La mayoría de los diseñadores empiezan con pantallas. Este enfoque funciona para productos pequeños, pero se rompe cuando tu producto escala.

## A qué se parece el pensamiento sistémico

Significa hacer zoom out antes de hacer zoom in. En vez de preguntar *"¿Cómo debería verse esta pantalla?"*, preguntas:

> "¿Cuáles son las reglas subyacentes que gobiernan cómo cada pantalla debería comportarse?"

## El rendimiento

El pensamiento sistémico no solo hace el diseño más consistente — hace a todo el equipo de producto más rápido. Empieza pequeño.
    `
  },
  "from-fashion-to-product-design": {
    title: "De la moda al diseño de producto",
    excerpt: "Cómo mi formación en diseño de moda moldeó mi enfoque para construir productos digitales y experiencias de usuario.",
    content: `
## Una historia de origen improbable

No empecé en tecnología. Mi primer lenguaje de diseño fue la tela, no Figma.

## Lo que la moda me enseñó

### 1. Pensamiento material
### 2. La importancia del ajuste
### 3. Pensamiento en colección
### 4. La presentación es parte del producto

## Por qué importa

La industria tech recompensa la conformidad. Venir de la moda me da una perspectiva diferente — una que valora la artesanía, la materialidad y el impacto emocional del diseño. Eso no es una debilidad. Es un superpoder.
    `
  },
  "mobile-banking-onboarding-ux": {
    title: "Análisis UX: Onboarding de banca móvil",
    excerpt: "Analizando cómo las mejores apps fintech reducen la fricción en los flujos de nuevos usuarios.",
    content: `
## Los primeros 60 segundos

El onboarding de banca móvil tiene una restricción brutal: los usuarios deben proporcionar información personal sensible *antes* de haber experimentado cualquier valor.

## Patrón 1: Vista previa del valor antes del registro
## Patrón 2: KYC progresivo
## Patrón 3: Explicación contextual de seguridad
## Patrón 4: Persistencia del progreso

El mejor onboarding no se siente como onboarding. Se siente como si el producto se abriera gradualmente a ti, un intercambio de confianza a la vez.
    `
  },
  "notion-design-system-teardown": {
    title: "Análisis de producto: El sistema de diseño de Notion",
    excerpt: "Cómo Notion equilibra flexibilidad y consistencia en un producto complejo.",
    content: `
## La paradoja de la flexibilidad

Notion es una de las herramientas de productividad más flexibles jamás construidas. Sin embargo, nunca se siente caótico.

## La primitiva Block

Todo en Notion es un **block**. Esta única abstracción es el fundamento de todo su sistema de diseño.

## Lecciones para diseñadores

1. **Encuentra tu primitiva**
2. **Restringe el contenedor**
3. **El color es dato**
4. **Navegación = modelo mental**

Incluso los mejores sistemas de diseño tienen compromisos. La clave es hacer compromisos *intencionales*, no accidentales.
    `
  },
  "ai-beyond-chatbots": {
    title: "IA en diseño de producto: más allá de los chatbots",
    excerpt: "Cómo la IA está transformando los flujos de trabajo de diseño, la investigación y la experiencia de usuario.",
    content: `
## La trampa del chatbot

Los chatbots son solo una aplicación de la IA en diseño. La verdadera revolución ocurre en tres áreas.

## 1. Valores predeterminados inteligentes
## 2. Interfaces adaptativas
## 3. Contenido generativo

Los productos que ganen no serán los que tengan más funcionalidades de IA. Serán aquellos donde la IA está tan bien integrada que los usuarios olvidan que está ahí.
    `
  },
  "systems-thinking-for-designers": {
    title: "Pensamiento sistémico para diseñadores",
    excerpt: "Por qué entender el sistema completo lleva a mejores decisiones a nivel de componentes.",
    content: `
## Los componentes no existen aislados

Cada botón, tarjeta y modal que diseñas existe dentro de un sistema.

## Los tres niveles de diseño

### Nivel 1: Diseño de componentes
### Nivel 2: Diseño de patrones
### Nivel 3: Diseño de sistemas

## La ventaja competitiva

Las empresas contratan pensadores sistémicos no porque hagan pantallas más bonitas, sino porque hacen *menos pantallas*.
    `
  },
};

export default translations;
