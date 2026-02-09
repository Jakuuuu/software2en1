# 2 en 1 APU - Sistema de Gestión de Obras

Sistema profesional para crear presupuestos (APU) y gestionar valuaciones de obra. Controla costos, avances y pagos en un solo lugar.

## 🚀 Características Principales

### 📋 Módulo de Presupuestos y APU
- Crear partidas de obra con códigos COVENIN
- Análisis de Precio Unitario (APU) detallado
- Desglose de materiales, equipos y mano de obra
- Generación de reportes PDF profesionales
- Cálculo automático de costos directos

### 💰 Módulo de Valuaciones
- Registro de avances de obra periódicos
- Control de acumulados vs contratado
- Validación automática de sobreejecución
- Cálculo de IVA, amortizaciones y retenciones
- Generación de carátulas de pago
- Dashboard financiero con gráficos

### 🎓 Sistema de Onboarding
- Modal de bienvenida para usuarios nuevos
- Tour guiado interactivo de 4 pasos
- Tooltips contextuales en toda la aplicación
- Glosario completo de términos de construcción
- Banners informativos en cada módulo

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Tooltips**: Radix UI
- **Tour**: React Joyride
- **PDF**: jsPDF + jspdf-autotable

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

## 🌐 Uso

1. **Primera vez**: Verás un modal de bienvenida con opción de tour guiado
2. **Crear presupuesto**: Ve a "Presupuesto y APU" → Agrega partidas → Analiza costos
3. **Registrar valuaciones**: Ve a "Valuaciones" → Ingresa avances → Genera carátula

## 📚 Documentación

- **Walkthrough completo**: Ver `brain/walkthrough.md`
- **Plan de implementación**: Ver `brain/implementation_plan.md`
- **Glosario de términos**: `src/data/glossary.ts`

## 🎯 Flujo de Trabajo

```
Paso 1: Presupuestos → Paso 2: Valuaciones
```

1. Primero crea el presupuesto inicial del proyecto
2. Luego registra valuaciones periódicas durante la ejecución

## 🔧 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page con onboarding
│   ├── budget/page.tsx       # Módulo de presupuestos
│   └── valuations/page.tsx   # Módulo de valuaciones
├── components/
│   ├── Onboarding.tsx        # Sistema de onboarding
│   ├── Tooltip.tsx           # Tooltips contextuales
│   ├── Breadcrumb.tsx        # Navegación jerárquica
│   ├── APUEditor.tsx         # Editor de APU
│   ├── ValuationTable.tsx    # Tabla de valuaciones
│   └── ValuationCover.tsx    # Carátula de pago
├── data/
│   ├── glossary.ts           # Glosario de términos
│   └── onboarding-steps.tsx  # Pasos del tour
└── utils/
    ├── pdfGenerator.ts       # Generación de PDFs
    └── calculations.ts       # Cálculos de costos
```

## 🎨 Características UX/UI

- ✅ Onboarding interactivo para nuevos usuarios
- ✅ Tooltips explicativos en términos técnicos
- ✅ Breadcrumbs en todas las páginas
- ✅ Banners informativos por módulo
- ✅ Indicadores visuales de secuencia (① → ②)
- ✅ Diseño responsive
- ✅ Animaciones suaves

## 📖 Glosario Rápido

- **APU**: Análisis de Precio Unitario
- **Partida**: Unidad de trabajo específica
- **Valuación**: Certificación de avance de obra
- **Amortización**: Descuento del anticipo
- **Retención**: Garantía de fiel cumplimiento

## 🤝 Contribuir

Este proyecto sigue el principio de Pareto 80/20: implementa el 20% de funcionalidades que resuelven el 80% de las necesidades.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**Desarrollado con ❤️ para profesionales de la construcción**
