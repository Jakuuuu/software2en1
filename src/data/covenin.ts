// Base de datos de códigos COVENIN para construcción venezolana
// Estructura jerárquica: Categoría > Subcategoría > Partida

export interface CovenInCode {
    codigo: string;
    descripcion: string;
    categoria: string;
    subcategoria?: string;
    unidad: string;
    keywords: string[]; // Para búsqueda
}

export const COVENIN_DATABASE: CovenInCode[] = [
    // ============================================
    // EDIFICACIONES - PRELIMINARES
    // ============================================
    {
        codigo: "E-001-001-001",
        descripcion: "Limpieza y desmalezamiento",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m²",
        keywords: ["limpieza", "desmalezar", "preliminar", "terreno"]
    },
    {
        codigo: "E-001-001-002",
        descripcion: "Demolición de estructuras existentes",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m³",
        keywords: ["demolicion", "derribo", "preliminar"]
    },
    {
        codigo: "E-001-001-003",
        descripcion: "Excavación manual",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m³",
        keywords: ["excavacion", "manual", "movimiento", "tierra"]
    },
    {
        codigo: "E-001-001-004",
        descripcion: "Excavación mecánica",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m³",
        keywords: ["excavacion", "mecanica", "retroexcavadora", "movimiento", "tierra"]
    },
    {
        codigo: "E-001-001-005",
        descripcion: "Relleno y compactación",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m³",
        keywords: ["relleno", "compactacion", "tierra"]
    },
    {
        codigo: "E-001-001-006",
        descripcion: "Bote de material",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m³",
        keywords: ["bote", "desalojo", "escombros"]
    },
    {
        codigo: "E-001-001-007",
        descripcion: "Replanteo y nivelación",
        categoria: "Edificaciones",
        subcategoria: "Preliminares",
        unidad: "m²",
        keywords: ["replanteo", "nivelacion", "topografia"]
    },

    // ============================================
    // EDIFICACIONES - FUNDACIONES
    // ============================================
    {
        codigo: "E-002-001-001",
        descripcion: "Concreto para fundaciones f'c=210 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Fundaciones",
        unidad: "m³",
        keywords: ["concreto", "fundacion", "zapata", "210"]
    },
    {
        codigo: "E-002-001-002",
        descripcion: "Acero de refuerzo fy=4200 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Fundaciones",
        unidad: "kg",
        keywords: ["acero", "cabilla", "refuerzo", "4200"]
    },
    {
        codigo: "E-002-001-003",
        descripcion: "Encofrado y desencofrado de fundaciones",
        categoria: "Edificaciones",
        subcategoria: "Fundaciones",
        unidad: "m²",
        keywords: ["encofrado", "formaleta", "fundacion"]
    },
    {
        codigo: "E-002-001-004",
        descripcion: "Concreto ciclópeo 60% piedra",
        categoria: "Edificaciones",
        subcategoria: "Fundaciones",
        unidad: "m³",
        keywords: ["concreto", "ciclopeo", "piedra"]
    },
    {
        codigo: "E-002-002-001",
        descripcion: "Pilotes de concreto armado",
        categoria: "Edificaciones",
        subcategoria: "Fundaciones",
        unidad: "ml",
        keywords: ["pilote", "concreto", "armado"]
    },

    // ============================================
    // EDIFICACIONES - ESTRUCTURA
    // ============================================
    {
        codigo: "E-003-001-001",
        descripcion: "Concreto en columnas f'c=250 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m³",
        keywords: ["concreto", "columna", "250"]
    },
    {
        codigo: "E-003-001-002",
        descripcion: "Concreto en vigas f'c=250 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m³",
        keywords: ["concreto", "viga", "250"]
    },
    {
        codigo: "E-003-001-003",
        descripcion: "Concreto en losas f'c=250 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m³",
        keywords: ["concreto", "losa", "placa", "250"]
    },
    {
        codigo: "E-003-001-004",
        descripcion: "Concreto en escaleras f'c=250 kg/cm²",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m³",
        keywords: ["concreto", "escalera", "250"]
    },
    {
        codigo: "E-003-002-001",
        descripcion: "Acero de refuerzo en columnas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "kg",
        keywords: ["acero", "cabilla", "columna"]
    },
    {
        codigo: "E-003-002-002",
        descripcion: "Acero de refuerzo en vigas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "kg",
        keywords: ["acero", "cabilla", "viga"]
    },
    {
        codigo: "E-003-002-003",
        descripcion: "Acero de refuerzo en losas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "kg",
        keywords: ["acero", "cabilla", "losa", "placa"]
    },
    {
        codigo: "E-003-003-001",
        descripcion: "Encofrado y desencofrado de columnas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m²",
        keywords: ["encofrado", "formaleta", "columna"]
    },
    {
        codigo: "E-003-003-002",
        descripcion: "Encofrado y desencofrado de vigas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m²",
        keywords: ["encofrado", "formaleta", "viga"]
    },
    {
        codigo: "E-003-003-003",
        descripcion: "Encofrado y desencofrado de losas",
        categoria: "Edificaciones",
        subcategoria: "Estructura",
        unidad: "m²",
        keywords: ["encofrado", "formaleta", "losa"]
    },

    // ============================================
    // EDIFICACIONES - MAMPOSTERÍA
    // ============================================
    {
        codigo: "E-004-001-001",
        descripcion: "Pared de bloques de arcilla 10x20x40 cm",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "m²",
        keywords: ["pared", "bloque", "arcilla", "10", "20", "40"]
    },
    {
        codigo: "E-004-001-002",
        descripcion: "Pared de bloques de arcilla 15x20x40 cm",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "m²",
        keywords: ["pared", "bloque", "arcilla", "15", "20", "40"]
    },
    {
        codigo: "E-004-001-003",
        descripcion: "Pared de bloques de concreto 10x20x40 cm",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "m²",
        keywords: ["pared", "bloque", "concreto", "10", "20", "40"]
    },
    {
        codigo: "E-004-001-004",
        descripcion: "Pared de bloques de concreto 15x20x40 cm",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "m²",
        keywords: ["pared", "bloque", "concreto", "15", "20", "40"]
    },
    {
        codigo: "E-004-002-001",
        descripcion: "Tabique de bloques calados",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "m²",
        keywords: ["tabique", "bloque", "calado", "decorativo"]
    },
    {
        codigo: "E-004-003-001",
        descripcion: "Machón de concreto armado",
        categoria: "Edificaciones",
        subcategoria: "Mampostería",
        unidad: "ml",
        keywords: ["machon", "concreto", "armado"]
    },

    // ============================================
    // EDIFICACIONES - ACABADOS
    // ============================================
    {
        codigo: "E-005-001-001",
        descripcion: "Friso liso en paredes interiores",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["friso", "liso", "pared", "interior"]
    },
    {
        codigo: "E-005-001-002",
        descripcion: "Friso liso en paredes exteriores",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["friso", "liso", "pared", "exterior", "fachada"]
    },
    {
        codigo: "E-005-001-003",
        descripcion: "Friso rústico en paredes",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["friso", "rustico", "pared", "textura"]
    },
    {
        codigo: "E-005-002-001",
        descripcion: "Pintura látex en paredes interiores",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["pintura", "latex", "pared", "interior"]
    },
    {
        codigo: "E-005-002-002",
        descripcion: "Pintura látex en paredes exteriores",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["pintura", "latex", "pared", "exterior", "fachada"]
    },
    {
        codigo: "E-005-002-003",
        descripcion: "Pintura de aceite en puertas y ventanas",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["pintura", "aceite", "puerta", "ventana"]
    },
    {
        codigo: "E-005-003-001",
        descripcion: "Piso de cerámica 40x40 cm",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["piso", "ceramica", "40"]
    },
    {
        codigo: "E-005-003-002",
        descripcion: "Piso de porcelanato 60x60 cm",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["piso", "porcelanato", "60"]
    },
    {
        codigo: "E-005-003-003",
        descripcion: "Piso de granito pulido",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["piso", "granito", "pulido"]
    },
    {
        codigo: "E-005-003-004",
        descripcion: "Piso de mármol",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["piso", "marmol"]
    },
    {
        codigo: "E-005-004-001",
        descripcion: "Revestimiento cerámico en paredes",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["revestimiento", "ceramica", "pared"]
    },
    {
        codigo: "E-005-005-001",
        descripcion: "Cielo raso de yeso",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["cielo", "raso", "yeso", "techo"]
    },
    {
        codigo: "E-005-005-002",
        descripcion: "Cielo raso de platabanda",
        categoria: "Edificaciones",
        subcategoria: "Acabados",
        unidad: "m²",
        keywords: ["cielo", "raso", "platabanda", "techo"]
    },

    // ============================================
    // EDIFICACIONES - CARPINTERÍA
    // ============================================
    {
        codigo: "E-006-001-001",
        descripcion: "Puerta de madera maciza",
        categoria: "Edificaciones",
        subcategoria: "Carpintería",
        unidad: "pto",
        keywords: ["puerta", "madera", "maciza"]
    },
    {
        codigo: "E-006-001-002",
        descripcion: "Puerta de madera tambor",
        categoria: "Edificaciones",
        subcategoria: "Carpintería",
        unidad: "pto",
        keywords: ["puerta", "madera", "tambor"]
    },
    {
        codigo: "E-006-002-001",
        descripcion: "Ventana de madera con vidrio",
        categoria: "Edificaciones",
        subcategoria: "Carpintería",
        unidad: "m²",
        keywords: ["ventana", "madera", "vidrio"]
    },
    {
        codigo: "E-006-003-001",
        descripcion: "Marco de madera para puerta",
        categoria: "Edificaciones",
        subcategoria: "Carpintería",
        unidad: "pto",
        keywords: ["marco", "madera", "puerta"]
    },
    {
        codigo: "E-006-004-001",
        descripcion: "Closet de madera",
        categoria: "Edificaciones",
        subcategoria: "Carpintería",
        unidad: "ml",
        keywords: ["closet", "armario", "madera"]
    },

    // ============================================
    // EDIFICACIONES - HERRERÍA
    // ============================================
    {
        codigo: "E-007-001-001",
        descripcion: "Puerta metálica de hierro",
        categoria: "Edificaciones",
        subcategoria: "Herrería",
        unidad: "pto",
        keywords: ["puerta", "metalica", "hierro"]
    },
    {
        codigo: "E-007-002-001",
        descripcion: "Ventana metálica de aluminio",
        categoria: "Edificaciones",
        subcategoria: "Herrería",
        unidad: "m²",
        keywords: ["ventana", "metalica", "aluminio"]
    },
    {
        codigo: "E-007-003-001",
        descripcion: "Reja de protección",
        categoria: "Edificaciones",
        subcategoria: "Herrería",
        unidad: "m²",
        keywords: ["reja", "proteccion", "seguridad"]
    },
    {
        codigo: "E-007-004-001",
        descripcion: "Portón metálico corredizo",
        categoria: "Edificaciones",
        subcategoria: "Herrería",
        unidad: "m²",
        keywords: ["porton", "metalico", "corredizo"]
    },
    {
        codigo: "E-007-005-001",
        descripcion: "Barandas metálicas",
        categoria: "Edificaciones",
        subcategoria: "Herrería",
        unidad: "ml",
        keywords: ["baranda", "metalica", "pasamanos"]
    },

    // ============================================
    // EDIFICACIONES - IMPERMEABILIZACIÓN
    // ============================================
    {
        codigo: "E-008-001-001",
        descripcion: "Impermeabilización de techos con manto asfáltico",
        categoria: "Edificaciones",
        subcategoria: "Impermeabilización",
        unidad: "m²",
        keywords: ["impermeabilizacion", "techo", "manto", "asfaltico"]
    },
    {
        codigo: "E-008-001-002",
        descripcion: "Impermeabilización con membrana asfáltica",
        categoria: "Edificaciones",
        subcategoria: "Impermeabilización",
        unidad: "m²",
        keywords: ["impermeabilizacion", "membrana", "asfaltica"]
    },
    {
        codigo: "E-008-002-001",
        descripcion: "Impermeabilización de baños",
        categoria: "Edificaciones",
        subcategoria: "Impermeabilización",
        unidad: "m²",
        keywords: ["impermeabilizacion", "baño", "sanitario"]
    },

    // ============================================
    // INSTALACIONES SANITARIAS
    // ============================================
    {
        codigo: "S-001-001-001",
        descripcion: "Tubería PVC 2\" aguas blancas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "2", "agua", "blanca", "potable"]
    },
    {
        codigo: "S-001-001-002",
        descripcion: "Tubería PVC 3\" aguas blancas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "3", "agua", "blanca", "potable"]
    },
    {
        codigo: "S-001-001-003",
        descripcion: "Tubería PVC 4\" aguas blancas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "4", "agua", "blanca", "potable"]
    },
    {
        codigo: "S-001-002-001",
        descripcion: "Tubería PVC 2\" aguas servidas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "2", "agua", "servida", "cloacas"]
    },
    {
        codigo: "S-001-002-002",
        descripcion: "Tubería PVC 4\" aguas servidas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "4", "agua", "servida", "cloacas"]
    },
    {
        codigo: "S-001-002-003",
        descripcion: "Tubería PVC 6\" aguas servidas",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "6", "agua", "servida", "cloacas"]
    },
    {
        codigo: "S-001-003-001",
        descripcion: "Tubería PVC 2\" aguas de lluvia",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "2", "agua", "lluvia", "pluvial"]
    },
    {
        codigo: "S-001-003-002",
        descripcion: "Tubería PVC 4\" aguas de lluvia",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "pvc", "4", "agua", "lluvia", "pluvial"]
    },
    {
        codigo: "S-002-001-001",
        descripcion: "Poceta de porcelana blanca",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Piezas Sanitarias",
        unidad: "pto",
        keywords: ["poceta", "inodoro", "porcelana", "sanitario"]
    },
    {
        codigo: "S-002-001-002",
        descripcion: "Lavamanos de porcelana",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Piezas Sanitarias",
        unidad: "pto",
        keywords: ["lavamanos", "porcelana", "sanitario"]
    },
    {
        codigo: "S-002-001-003",
        descripcion: "Fregadero de acero inoxidable",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Piezas Sanitarias",
        unidad: "pto",
        keywords: ["fregadero", "acero", "inoxidable", "cocina"]
    },
    {
        codigo: "S-002-001-004",
        descripcion: "Ducha cromada",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Piezas Sanitarias",
        unidad: "pto",
        keywords: ["ducha", "regadera", "cromada"]
    },
    {
        codigo: "S-002-002-001",
        descripcion: "Grifería cromada para lavamanos",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Piezas Sanitarias",
        unidad: "pto",
        keywords: ["griferia", "llave", "cromada", "lavamanos"]
    },
    {
        codigo: "S-003-001-001",
        descripcion: "Tanque séptico de concreto",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Tratamiento",
        unidad: "pto",
        keywords: ["tanque", "septico", "concreto"]
    },
    {
        codigo: "S-003-002-001",
        descripcion: "Sumidero de piso",
        categoria: "Instalaciones Sanitarias",
        subcategoria: "Drenaje",
        unidad: "pto",
        keywords: ["sumidero", "piso", "drenaje"]
    },

    // ============================================
    // INSTALACIONES ELÉCTRICAS
    // ============================================
    {
        codigo: "L-001-001-001",
        descripcion: "Cableado eléctrico calibre 12 AWG",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["cable", "electrico", "12", "awg"]
    },
    {
        codigo: "L-001-001-002",
        descripcion: "Cableado eléctrico calibre 10 AWG",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["cable", "electrico", "10", "awg"]
    },
    {
        codigo: "L-001-001-003",
        descripcion: "Cableado eléctrico calibre 8 AWG",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["cable", "electrico", "8", "awg"]
    },
    {
        codigo: "L-001-002-001",
        descripcion: "Tubería conduit EMT 1/2\"",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Canalizaciones",
        unidad: "ml",
        keywords: ["tuberia", "conduit", "emt", "1/2"]
    },
    {
        codigo: "L-001-002-002",
        descripcion: "Tubería conduit EMT 3/4\"",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Canalizaciones",
        unidad: "ml",
        keywords: ["tuberia", "conduit", "emt", "3/4"]
    },
    {
        codigo: "L-002-001-001",
        descripcion: "Tomacorriente doble 110V",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["tomacorriente", "toma", "110", "enchufe"]
    },
    {
        codigo: "L-002-001-002",
        descripcion: "Tomacorriente doble 220V",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["tomacorriente", "toma", "220", "enchufe"]
    },
    {
        codigo: "L-002-002-001",
        descripcion: "Interruptor sencillo",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["interruptor", "switch", "sencillo"]
    },
    {
        codigo: "L-002-002-002",
        descripcion: "Interruptor doble",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["interruptor", "switch", "doble"]
    },
    {
        codigo: "L-002-002-003",
        descripcion: "Interruptor de tres vías",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["interruptor", "switch", "tres", "vias"]
    },
    {
        codigo: "L-003-001-001",
        descripcion: "Luminaria fluorescente 2x40W",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["luminaria", "fluorescente", "40w"]
    },
    {
        codigo: "L-003-001-002",
        descripcion: "Luminaria LED 20W",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["luminaria", "led", "20w"]
    },
    {
        codigo: "L-003-002-001",
        descripcion: "Reflector LED 50W",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["reflector", "led", "50w", "exterior"]
    },
    {
        codigo: "L-004-001-001",
        descripcion: "Tablero eléctrico 12 circuitos",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Tableros",
        unidad: "pto",
        keywords: ["tablero", "electrico", "12", "circuitos"]
    },
    {
        codigo: "L-004-001-002",
        descripcion: "Tablero eléctrico 24 circuitos",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Tableros",
        unidad: "pto",
        keywords: ["tablero", "electrico", "24", "circuitos"]
    },
    {
        codigo: "L-004-002-001",
        descripcion: "Breaker monopolar 20A",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Protecciones",
        unidad: "pto",
        keywords: ["breaker", "interruptor", "monopolar", "20a"]
    },
    {
        codigo: "L-004-002-002",
        descripcion: "Breaker bipolar 30A",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Protecciones",
        unidad: "pto",
        keywords: ["breaker", "interruptor", "bipolar", "30a"]
    },
    {
        codigo: "L-005-001-001",
        descripcion: "Sistema de puesta a tierra",
        categoria: "Instalaciones Eléctricas",
        subcategoria: "Puesta a Tierra",
        unidad: "pto",
        keywords: ["tierra", "puesta", "sistema", "proteccion"]
    },

    // ============================================
    // VIALIDAD - MOVIMIENTO DE TIERRA
    // ============================================
    {
        codigo: "V-001-001-001",
        descripcion: "Excavación no clasificada",
        categoria: "Vialidad",
        subcategoria: "Movimiento de Tierra",
        unidad: "m³",
        keywords: ["excavacion", "tierra", "vialidad"]
    },
    {
        codigo: "V-001-001-002",
        descripcion: "Relleno con material de préstamo",
        categoria: "Vialidad",
        subcategoria: "Movimiento de Tierra",
        unidad: "m³",
        keywords: ["relleno", "prestamo", "tierra"]
    },
    {
        codigo: "V-001-001-003",
        descripcion: "Compactación de subrasante",
        categoria: "Vialidad",
        subcategoria: "Movimiento de Tierra",
        unidad: "m²",
        keywords: ["compactacion", "subrasante"]
    },
    {
        codigo: "V-001-002-001",
        descripcion: "Conformación de taludes",
        categoria: "Vialidad",
        subcategoria: "Movimiento de Tierra",
        unidad: "m²",
        keywords: ["conformacion", "talud"]
    },

    // ============================================
    // VIALIDAD - PAVIMENTO
    // ============================================
    {
        codigo: "V-002-001-001",
        descripcion: "Sub-base granular e=20 cm",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["subbase", "granular", "20"]
    },
    {
        codigo: "V-002-001-002",
        descripcion: "Base granular e=20 cm",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["base", "granular", "20"]
    },
    {
        codigo: "V-002-002-001",
        descripcion: "Carpeta asfáltica e=5 cm",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["asfalto", "carpeta", "5"]
    },
    {
        codigo: "V-002-002-002",
        descripcion: "Carpeta asfáltica e=7 cm",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["asfalto", "carpeta", "7"]
    },
    {
        codigo: "V-002-003-001",
        descripcion: "Pavimento de concreto e=20 cm",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["pavimento", "concreto", "rigido", "20"]
    },
    {
        codigo: "V-002-004-001",
        descripcion: "Imprimación asfáltica",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["imprimacion", "asfaltica"]
    },
    {
        codigo: "V-002-004-002",
        descripcion: "Riego de liga",
        categoria: "Vialidad",
        subcategoria: "Pavimento",
        unidad: "m²",
        keywords: ["riego", "liga", "asfalto"]
    },

    // ============================================
    // VIALIDAD - DRENAJE
    // ============================================
    {
        codigo: "V-003-001-001",
        descripcion: "Cuneta de concreto",
        categoria: "Vialidad",
        subcategoria: "Drenaje",
        unidad: "ml",
        keywords: ["cuneta", "concreto", "drenaje"]
    },
    {
        codigo: "V-003-001-002",
        descripcion: "Brocal de concreto",
        categoria: "Vialidad",
        subcategoria: "Drenaje",
        unidad: "ml",
        keywords: ["brocal", "concreto"]
    },
    {
        codigo: "V-003-002-001",
        descripcion: "Sumidero de calzada",
        categoria: "Vialidad",
        subcategoria: "Drenaje",
        unidad: "pto",
        keywords: ["sumidero", "calzada", "drenaje"]
    },
    {
        codigo: "V-003-003-001",
        descripcion: "Tubería de drenaje 12\"",
        categoria: "Vialidad",
        subcategoria: "Drenaje",
        unidad: "ml",
        keywords: ["tuberia", "drenaje", "12"]
    },
    {
        codigo: "V-003-004-001",
        descripcion: "Alcantarilla de concreto",
        categoria: "Vialidad",
        subcategoria: "Drenaje",
        unidad: "ml",
        keywords: ["alcantarilla", "concreto"]
    },

    // ============================================
    // VIALIDAD - SEÑALIZACIÓN
    // ============================================
    {
        codigo: "V-004-001-001",
        descripcion: "Demarcación de pavimento línea continua",
        categoria: "Vialidad",
        subcategoria: "Señalización",
        unidad: "ml",
        keywords: ["demarcacion", "linea", "continua", "pintura"]
    },
    {
        codigo: "V-004-001-002",
        descripcion: "Demarcación de pavimento línea discontinua",
        categoria: "Vialidad",
        subcategoria: "Señalización",
        unidad: "ml",
        keywords: ["demarcacion", "linea", "discontinua", "pintura"]
    },
    {
        codigo: "V-004-002-001",
        descripcion: "Señal vertical reglamentaria",
        categoria: "Vialidad",
        subcategoria: "Señalización",
        unidad: "pto",
        keywords: ["señal", "vertical", "reglamentaria", "transito"]
    },
    {
        codigo: "V-004-002-002",
        descripcion: "Señal vertical preventiva",
        categoria: "Vialidad",
        subcategoria: "Señalización",
        unidad: "pto",
        keywords: ["señal", "vertical", "preventiva", "transito"]
    },
    {
        codigo: "V-004-003-001",
        descripcion: "Tachas reflectivas",
        categoria: "Vialidad",
        subcategoria: "Señalización",
        unidad: "pto",
        keywords: ["tacha", "reflectiva", "vial"]
    },

    // ============================================
    // VIALIDAD - OBRAS DE ARTE
    // ============================================
    {
        codigo: "V-005-001-001",
        descripcion: "Puente de concreto armado",
        categoria: "Vialidad",
        subcategoria: "Obras de Arte",
        unidad: "m²",
        keywords: ["puente", "concreto", "armado"]
    },
    {
        codigo: "V-005-002-001",
        descripcion: "Muro de contención de concreto",
        categoria: "Vialidad",
        subcategoria: "Obras de Arte",
        unidad: "m³",
        keywords: ["muro", "contencion", "concreto"]
    },
    {
        codigo: "V-005-003-001",
        descripcion: "Paso peatonal elevado",
        categoria: "Vialidad",
        subcategoria: "Obras de Arte",
        unidad: "ml",
        keywords: ["paso", "peatonal", "elevado"]
    },

    // ============================================
    // AIRE ACONDICIONADO Y VENTILACIÓN
    // ============================================
    {
        codigo: "A-001-001-001",
        descripcion: "Aire acondicionado tipo Split 12000 BTU",
        categoria: "Aire Acondicionado",
        subcategoria: "Equipos Split",
        unidad: "pto",
        keywords: ["aire", "acondicionado", "split", "12000", "btu"]
    },
    {
        codigo: "A-001-001-002",
        descripcion: "Aire acondicionado tipo Split 18000 BTU",
        categoria: "Aire Acondicionado",
        subcategoria: "Equipos Split",
        unidad: "pto",
        keywords: ["aire", "acondicionado", "split", "18000", "btu"]
    },
    {
        codigo: "A-001-001-003",
        descripcion: "Aire acondicionado tipo Split 24000 BTU",
        categoria: "Aire Acondicionado",
        subcategoria: "Equipos Split",
        unidad: "pto",
        keywords: ["aire", "acondicionado", "split", "24000", "btu"]
    },
    {
        codigo: "A-001-002-001",
        descripcion: "Aire acondicionado tipo Ventana 12000 BTU",
        categoria: "Aire Acondicionado",
        subcategoria: "Equipos Ventana",
        unidad: "pto",
        keywords: ["aire", "acondicionado", "ventana", "12000", "btu"]
    },
    {
        codigo: "A-001-002-002",
        descripcion: "Aire acondicionado tipo Ventana 18000 BTU",
        categoria: "Aire Acondicionado",
        subcategoria: "Equipos Ventana",
        unidad: "pto",
        keywords: ["aire", "acondicionado", "ventana", "18000", "btu"]
    },
    {
        codigo: "A-002-001-001",
        descripcion: "Sistema VRV/VRF",
        categoria: "Aire Acondicionado",
        subcategoria: "Sistemas Centrales",
        unidad: "pto",
        keywords: ["vrv", "vrf", "central", "variable"]
    },
    {
        codigo: "A-002-001-002",
        descripcion: "Chiller enfriado por agua",
        categoria: "Aire Acondicionado",
        subcategoria: "Sistemas Centrales",
        unidad: "pto",
        keywords: ["chiller", "agua", "central"]
    },
    {
        codigo: "A-002-001-003",
        descripcion: "Manejadora de aire (UMA)",
        categoria: "Aire Acondicionado",
        subcategoria: "Sistemas Centrales",
        unidad: "pto",
        keywords: ["manejadora", "uma", "aire", "central"]
    },
    {
        codigo: "A-003-001-001",
        descripcion: "Ducto rectangular galvanizado",
        categoria: "Aire Acondicionado",
        subcategoria: "Ductos",
        unidad: "m²",
        keywords: ["ducto", "rectangular", "galvanizado"]
    },
    {
        codigo: "A-003-001-002",
        descripcion: "Ducto flexible aislado",
        categoria: "Aire Acondicionado",
        subcategoria: "Ductos",
        unidad: "ml",
        keywords: ["ducto", "flexible", "aislado"]
    },
    {
        codigo: "A-003-002-001",
        descripcion: "Rejilla de suministro",
        categoria: "Aire Acondicionado",
        subcategoria: "Difusores",
        unidad: "pto",
        keywords: ["rejilla", "suministro", "difusor"]
    },
    {
        codigo: "A-003-002-002",
        descripcion: "Rejilla de retorno",
        categoria: "Aire Acondicionado",
        subcategoria: "Difusores",
        unidad: "pto",
        keywords: ["rejilla", "retorno", "difusor"]
    },
    {
        codigo: "A-004-001-001",
        descripcion: "Tubería de cobre para refrigeración 1/4\"",
        categoria: "Aire Acondicionado",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "cobre", "refrigeracion", "1/4"]
    },
    {
        codigo: "A-004-001-002",
        descripcion: "Tubería de cobre para refrigeración 3/8\"",
        categoria: "Aire Acondicionado",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "cobre", "refrigeracion", "3/8"]
    },
    {
        codigo: "A-005-001-001",
        descripcion: "Extractor de aire tipo axial",
        categoria: "Aire Acondicionado",
        subcategoria: "Ventilación",
        unidad: "pto",
        keywords: ["extractor", "axial", "ventilacion"]
    },

    // ============================================
    // ASCENSORES Y MONTACARGAS
    // ============================================
    {
        codigo: "C-001-001-001",
        descripcion: "Ascensor eléctrico 6 personas",
        categoria: "Ascensores",
        subcategoria: "Ascensores Eléctricos",
        unidad: "pto",
        keywords: ["ascensor", "electrico", "6", "personas"]
    },
    {
        codigo: "C-001-001-002",
        descripcion: "Ascensor eléctrico 8 personas",
        categoria: "Ascensores",
        subcategoria: "Ascensores Eléctricos",
        unidad: "pto",
        keywords: ["ascensor", "electrico", "8", "personas"]
    },
    {
        codigo: "C-001-001-003",
        descripcion: "Ascensor eléctrico 10 personas",
        categoria: "Ascensores",
        subcategoria: "Ascensores Eléctricos",
        unidad: "pto",
        keywords: ["ascensor", "electrico", "10", "personas"]
    },
    {
        codigo: "C-001-002-001",
        descripcion: "Ascensor hidráulico 6 personas",
        categoria: "Ascensores",
        subcategoria: "Ascensores Hidráulicos",
        unidad: "pto",
        keywords: ["ascensor", "hidraulico", "6", "personas"]
    },
    {
        codigo: "C-002-001-001",
        descripcion: "Montacargas 500 kg",
        categoria: "Ascensores",
        subcategoria: "Montacargas",
        unidad: "pto",
        keywords: ["montacargas", "500", "kg", "carga"]
    },
    {
        codigo: "C-002-001-002",
        descripcion: "Montacargas 1000 kg",
        categoria: "Ascensores",
        subcategoria: "Montacargas",
        unidad: "pto",
        keywords: ["montacargas", "1000", "kg", "carga"]
    },
    {
        codigo: "C-003-001-001",
        descripcion: "Escalera mecánica",
        categoria: "Ascensores",
        subcategoria: "Escaleras Mecánicas",
        unidad: "pto",
        keywords: ["escalera", "mecanica", "automatica"]
    },
    {
        codigo: "C-003-002-001",
        descripcion: "Rampa móvil",
        categoria: "Ascensores",
        subcategoria: "Rampas Móviles",
        unidad: "ml",
        keywords: ["rampa", "movil", "automatica"]
    },
    {
        codigo: "C-004-001-001",
        descripcion: "Foso de ascensor",
        categoria: "Ascensores",
        subcategoria: "Obra Civil",
        unidad: "pto",
        keywords: ["foso", "ascensor", "excavacion"]
    },
    {
        codigo: "C-004-002-001",
        descripcion: "Cuarto de máquinas",
        categoria: "Ascensores",
        subcategoria: "Obra Civil",
        unidad: "m²",
        keywords: ["cuarto", "maquinas", "ascensor"]
    },

    // ============================================
    // JARDINERÍA Y ÁREAS VERDES
    // ============================================
    {
        codigo: "J-001-001-001",
        descripcion: "Grama en alfombra",
        categoria: "Jardinería",
        subcategoria: "Siembra",
        unidad: "m²",
        keywords: ["grama", "alfombra", "cesped", "grass"]
    },
    {
        codigo: "J-001-001-002",
        descripcion: "Grama por semilla",
        categoria: "Jardinería",
        subcategoria: "Siembra",
        unidad: "m²",
        keywords: ["grama", "semilla", "cesped"]
    },
    {
        codigo: "J-001-002-001",
        descripcion: "Árbol ornamental",
        categoria: "Jardinería",
        subcategoria: "Siembra",
        unidad: "pto",
        keywords: ["arbol", "ornamental", "siembra"]
    },
    {
        codigo: "J-001-002-002",
        descripcion: "Arbusto ornamental",
        categoria: "Jardinería",
        subcategoria: "Siembra",
        unidad: "pto",
        keywords: ["arbusto", "ornamental", "siembra"]
    },
    {
        codigo: "J-001-002-003",
        descripcion: "Planta de jardín",
        categoria: "Jardinería",
        subcategoria: "Siembra",
        unidad: "pto",
        keywords: ["planta", "jardin", "ornamental"]
    },
    {
        codigo: "J-002-001-001",
        descripcion: "Sistema de riego por aspersión",
        categoria: "Jardinería",
        subcategoria: "Riego",
        unidad: "m²",
        keywords: ["riego", "aspersion", "automatico"]
    },
    {
        codigo: "J-002-001-002",
        descripcion: "Sistema de riego por goteo",
        categoria: "Jardinería",
        subcategoria: "Riego",
        unidad: "ml",
        keywords: ["riego", "goteo", "automatico"]
    },
    {
        codigo: "J-002-002-001",
        descripcion: "Aspersor de riego",
        categoria: "Jardinería",
        subcategoria: "Riego",
        unidad: "pto",
        keywords: ["aspersor", "riego", "sprinkler"]
    },
    {
        codigo: "J-003-001-001",
        descripcion: "Tierra vegetal",
        categoria: "Jardinería",
        subcategoria: "Suelos",
        unidad: "m³",
        keywords: ["tierra", "vegetal", "suelo"]
    },
    {
        codigo: "J-003-001-002",
        descripcion: "Abono orgánico",
        categoria: "Jardinería",
        subcategoria: "Suelos",
        unidad: "kg",
        keywords: ["abono", "organico", "fertilizante"]
    },
    {
        codigo: "J-004-001-001",
        descripcion: "Bordillo de jardín",
        categoria: "Jardinería",
        subcategoria: "Elementos",
        unidad: "ml",
        keywords: ["bordillo", "jardin", "borde"]
    },
    {
        codigo: "J-004-002-001",
        descripcion: "Banco de jardín",
        categoria: "Jardinería",
        subcategoria: "Mobiliario",
        unidad: "pto",
        keywords: ["banco", "jardin", "mobiliario"]
    },
    {
        codigo: "J-004-002-002",
        descripcion: "Papelera de jardín",
        categoria: "Jardinería",
        subcategoria: "Mobiliario",
        unidad: "pto",
        keywords: ["papelera", "basura", "jardin"]
    },
    {
        codigo: "J-005-001-001",
        descripcion: "Mantenimiento de áreas verdes",
        categoria: "Jardinería",
        subcategoria: "Mantenimiento",
        unidad: "m²",
        keywords: ["mantenimiento", "jardin", "poda"]
    },

    // ============================================
    // TELECOMUNICACIONES
    // ============================================
    {
        codigo: "T-001-001-001",
        descripcion: "Cableado estructurado Cat 6",
        categoria: "Telecomunicaciones",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["cable", "cat6", "red", "datos"]
    },
    {
        codigo: "T-001-001-002",
        descripcion: "Cableado estructurado Cat 6A",
        categoria: "Telecomunicaciones",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["cable", "cat6a", "red", "datos"]
    },
    {
        codigo: "T-001-001-003",
        descripcion: "Fibra óptica monomodo",
        categoria: "Telecomunicaciones",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["fibra", "optica", "monomodo"]
    },
    {
        codigo: "T-001-001-004",
        descripcion: "Fibra óptica multimodo",
        categoria: "Telecomunicaciones",
        subcategoria: "Cableado",
        unidad: "ml",
        keywords: ["fibra", "optica", "multimodo"]
    },
    {
        codigo: "T-002-001-001",
        descripcion: "Rack de telecomunicaciones 19\" 42U",
        categoria: "Telecomunicaciones",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["rack", "19", "42u", "gabinete"]
    },
    {
        codigo: "T-002-001-002",
        descripcion: "Patch panel 24 puertos",
        categoria: "Telecomunicaciones",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["patch", "panel", "24", "puertos"]
    },
    {
        codigo: "T-002-001-003",
        descripcion: "Patch panel 48 puertos",
        categoria: "Telecomunicaciones",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["patch", "panel", "48", "puertos"]
    },
    {
        codigo: "T-002-002-001",
        descripcion: "Switch de red 24 puertos",
        categoria: "Telecomunicaciones",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["switch", "red", "24", "puertos"]
    },
    {
        codigo: "T-002-002-002",
        descripcion: "Switch de red 48 puertos",
        categoria: "Telecomunicaciones",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["switch", "red", "48", "puertos"]
    },
    {
        codigo: "T-003-001-001",
        descripcion: "Punto de red RJ45",
        categoria: "Telecomunicaciones",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["punto", "red", "rj45", "datos"]
    },
    {
        codigo: "T-003-001-002",
        descripcion: "Punto de voz RJ11",
        categoria: "Telecomunicaciones",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["punto", "voz", "rj11", "telefono"]
    },
    {
        codigo: "T-003-002-001",
        descripcion: "Punto de fibra óptica",
        categoria: "Telecomunicaciones",
        subcategoria: "Salidas",
        unidad: "pto",
        keywords: ["punto", "fibra", "optica"]
    },
    {
        codigo: "T-004-001-001",
        descripcion: "Cámara de seguridad IP",
        categoria: "Telecomunicaciones",
        subcategoria: "CCTV",
        unidad: "pto",
        keywords: ["camara", "seguridad", "ip", "cctv"]
    },
    {
        codigo: "T-004-001-002",
        descripcion: "DVR/NVR para CCTV",
        categoria: "Telecomunicaciones",
        subcategoria: "CCTV",
        unidad: "pto",
        keywords: ["dvr", "nvr", "grabador", "cctv"]
    },
    {
        codigo: "T-005-001-001",
        descripcion: "Access Point WiFi",
        categoria: "Telecomunicaciones",
        subcategoria: "WiFi",
        unidad: "pto",
        keywords: ["access", "point", "wifi", "inalambrico"]
    },
    {
        codigo: "T-005-002-001",
        descripcion: "Antena parabólica",
        categoria: "Telecomunicaciones",
        subcategoria: "Antenas",
        unidad: "pto",
        keywords: ["antena", "parabolica", "satelite"]
    },

    // ============================================
    // INSTALACIONES DE GAS
    // ============================================
    {
        codigo: "G-001-001-001",
        descripcion: "Tubería de cobre para gas 1/2\"",
        categoria: "Gas",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "cobre", "gas", "1/2"]
    },
    {
        codigo: "G-001-001-002",
        descripcion: "Tubería de cobre para gas 3/4\"",
        categoria: "Gas",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "cobre", "gas", "3/4"]
    },
    {
        codigo: "G-001-001-003",
        descripcion: "Tubería de acero negro para gas 1\"",
        categoria: "Gas",
        subcategoria: "Tuberías",
        unidad: "ml",
        keywords: ["tuberia", "acero", "negro", "gas", "1"]
    },
    {
        codigo: "G-002-001-001",
        descripcion: "Calentador de agua a gas 10 litros",
        categoria: "Gas",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["calentador", "agua", "gas", "10", "litros"]
    },
    {
        codigo: "G-002-001-002",
        descripcion: "Calentador de agua a gas 15 litros",
        categoria: "Gas",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["calentador", "agua", "gas", "15", "litros"]
    },
    {
        codigo: "G-002-002-001",
        descripcion: "Cocina a gas 4 hornillas",
        categoria: "Gas",
        subcategoria: "Equipos",
        unidad: "pto",
        keywords: ["cocina", "gas", "4", "hornillas"]
    },
    {
        codigo: "G-003-001-001",
        descripcion: "Regulador de presión de gas",
        categoria: "Gas",
        subcategoria: "Accesorios",
        unidad: "pto",
        keywords: ["regulador", "presion", "gas"]
    },
    {
        codigo: "G-003-001-002",
        descripcion: "Válvula de corte de gas",
        categoria: "Gas",
        subcategoria: "Accesorios",
        unidad: "pto",
        keywords: ["valvula", "corte", "gas"]
    },
    {
        codigo: "G-004-001-001",
        descripcion: "Tanque de gas doméstico",
        categoria: "Gas",
        subcategoria: "Almacenamiento",
        unidad: "pto",
        keywords: ["tanque", "gas", "domestico", "cilindro"]
    },

    // ============================================
    // PROTECCIÓN CONTRA INCENDIOS
    // ============================================
    {
        codigo: "F-001-001-001",
        descripcion: "Detector de humo fotoeléctrico",
        categoria: "Protección contra Incendios",
        subcategoria: "Detección",
        unidad: "pto",
        keywords: ["detector", "humo", "fotoelectrico", "alarma"]
    },
    {
        codigo: "F-001-001-002",
        descripcion: "Detector de humo iónico",
        categoria: "Protección contra Incendios",
        subcategoria: "Detección",
        unidad: "pto",
        keywords: ["detector", "humo", "ionico", "alarma"]
    },
    {
        codigo: "F-001-002-001",
        descripcion: "Detector de temperatura",
        categoria: "Protección contra Incendios",
        subcategoria: "Detección",
        unidad: "pto",
        keywords: ["detector", "temperatura", "calor", "termico"]
    },
    {
        codigo: "F-001-003-001",
        descripcion: "Pulsador manual de alarma",
        categoria: "Protección contra Incendios",
        subcategoria: "Detección",
        unidad: "pto",
        keywords: ["pulsador", "manual", "alarma", "emergencia"]
    },
    {
        codigo: "F-002-001-001",
        descripcion: "Rociador automático tipo sprinkler",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "pto",
        keywords: ["rociador", "sprinkler", "automatico"]
    },
    {
        codigo: "F-002-001-002",
        descripcion: "Tubería para sistema de rociadores",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "ml",
        keywords: ["tuberia", "rociador", "sprinkler"]
    },
    {
        codigo: "F-002-002-001",
        descripcion: "Extintor portátil PQS 10 lb",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "pto",
        keywords: ["extintor", "pqs", "10", "libras", "portatil"]
    },
    {
        codigo: "F-002-002-002",
        descripcion: "Extintor portátil CO2 10 lb",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "pto",
        keywords: ["extintor", "co2", "10", "libras", "portatil"]
    },
    {
        codigo: "F-002-003-001",
        descripcion: "Gabinete para manguera contra incendios",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "pto",
        keywords: ["gabinete", "manguera", "boca", "incendio"]
    },
    {
        codigo: "F-002-003-002",
        descripcion: "Manguera contra incendios 1.5\"",
        categoria: "Protección contra Incendios",
        subcategoria: "Extinción",
        unidad: "ml",
        keywords: ["manguera", "incendio", "1.5"]
    },
    {
        codigo: "F-003-001-001",
        descripcion: "Central de alarma contra incendios",
        categoria: "Protección contra Incendios",
        subcategoria: "Control",
        unidad: "pto",
        keywords: ["central", "alarma", "incendio", "panel"]
    },
    {
        codigo: "F-003-002-001",
        descripcion: "Sirena de alarma",
        categoria: "Protección contra Incendios",
        subcategoria: "Control",
        unidad: "pto",
        keywords: ["sirena", "alarma", "sonora"]
    },
    {
        codigo: "F-003-002-002",
        descripcion: "Baliza luminosa de alarma",
        categoria: "Protección contra Incendios",
        subcategoria: "Control",
        unidad: "pto",
        keywords: ["baliza", "luminosa", "alarma", "visual"]
    },
    {
        codigo: "F-004-001-001",
        descripcion: "Puerta cortafuego RF-120",
        categoria: "Protección contra Incendios",
        subcategoria: "Protección Pasiva",
        unidad: "pto",
        keywords: ["puerta", "cortafuego", "rf120", "resistente"]
    },
    {
        codigo: "F-004-002-001",
        descripcion: "Sellado cortafuego",
        categoria: "Protección contra Incendios",
        subcategoria: "Protección Pasiva",
        unidad: "ml",
        keywords: ["sellado", "cortafuego", "pasivo"]
    },

    // ============================================
    // ENERGÍA SOLAR
    // ============================================
    {
        codigo: "P-001-001-001",
        descripcion: "Panel solar fotovoltaico 250W",
        categoria: "Energía Solar",
        subcategoria: "Paneles",
        unidad: "pto",
        keywords: ["panel", "solar", "fotovoltaico", "250w"]
    },
    {
        codigo: "P-001-001-002",
        descripcion: "Panel solar fotovoltaico 330W",
        categoria: "Energía Solar",
        subcategoria: "Paneles",
        unidad: "pto",
        keywords: ["panel", "solar", "fotovoltaico", "330w"]
    },
    {
        codigo: "P-001-001-003",
        descripcion: "Panel solar fotovoltaico 450W",
        categoria: "Energía Solar",
        subcategoria: "Paneles",
        unidad: "pto",
        keywords: ["panel", "solar", "fotovoltaico", "450w"]
    },
    {
        codigo: "P-002-001-001",
        descripcion: "Inversor solar 3 kW",
        categoria: "Energía Solar",
        subcategoria: "Inversores",
        unidad: "pto",
        keywords: ["inversor", "solar", "3", "kw"]
    },
    {
        codigo: "P-002-001-002",
        descripcion: "Inversor solar 5 kW",
        categoria: "Energía Solar",
        subcategoria: "Inversores",
        unidad: "pto",
        keywords: ["inversor", "solar", "5", "kw"]
    },
    {
        codigo: "P-002-001-003",
        descripcion: "Inversor solar 10 kW",
        categoria: "Energía Solar",
        subcategoria: "Inversores",
        unidad: "pto",
        keywords: ["inversor", "solar", "10", "kw"]
    },
    {
        codigo: "P-003-001-001",
        descripcion: "Batería solar 12V 200Ah",
        categoria: "Energía Solar",
        subcategoria: "Almacenamiento",
        unidad: "pto",
        keywords: ["bateria", "solar", "12v", "200ah"]
    },
    {
        codigo: "P-003-001-002",
        descripcion: "Batería de litio 48V 100Ah",
        categoria: "Energía Solar",
        subcategoria: "Almacenamiento",
        unidad: "pto",
        keywords: ["bateria", "litio", "48v", "100ah"]
    },
    {
        codigo: "P-004-001-001",
        descripcion: "Estructura de montaje para paneles",
        categoria: "Energía Solar",
        subcategoria: "Montaje",
        unidad: "pto",
        keywords: ["estructura", "montaje", "panel", "soporte"]
    },
    {
        codigo: "P-004-002-001",
        descripcion: "Regulador de carga solar MPPT",
        categoria: "Energía Solar",
        subcategoria: "Control",
        unidad: "pto",
        keywords: ["regulador", "carga", "mppt", "controlador"]
    },
    {
        codigo: "P-005-001-001",
        descripcion: "Calentador solar de agua 150 litros",
        categoria: "Energía Solar",
        subcategoria: "Térmico",
        unidad: "pto",
        keywords: ["calentador", "solar", "termico", "150", "litros"]
    },
    {
        codigo: "P-005-001-002",
        descripcion: "Calentador solar de agua 300 litros",
        categoria: "Energía Solar",
        subcategoria: "Térmico",
        unidad: "pto",
        keywords: ["calentador", "solar", "termico", "300", "litros"]
    },
    {
        codigo: "P-006-001-001",
        descripcion: "Sistema de monitoreo solar",
        categoria: "Energía Solar",
        subcategoria: "Monitoreo",
        unidad: "pto",
        keywords: ["sistema", "monitoreo", "solar", "medicion"]
    },

    // ============================================
    // AUTOMATIZACIÓN Y DOMÓTICA
    // ============================================
    {
        codigo: "D-001-001-001",
        descripcion: "Central de automatización",
        categoria: "Automatización",
        subcategoria: "Control Central",
        unidad: "pto",
        keywords: ["central", "automatizacion", "domotica", "hub"]
    },
    {
        codigo: "D-001-001-002",
        descripcion: "Gateway de comunicación",
        categoria: "Automatización",
        subcategoria: "Control Central",
        unidad: "pto",
        keywords: ["gateway", "comunicacion", "protocolo"]
    },
    {
        codigo: "D-002-001-001",
        descripcion: "Interruptor inteligente",
        categoria: "Automatización",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["interruptor", "inteligente", "smart", "switch"]
    },
    {
        codigo: "D-002-001-002",
        descripcion: "Dimmer inteligente",
        categoria: "Automatización",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["dimmer", "inteligente", "regulador", "intensidad"]
    },
    {
        codigo: "D-002-002-001",
        descripcion: "Bombillo LED inteligente",
        categoria: "Automatización",
        subcategoria: "Iluminación",
        unidad: "pto",
        keywords: ["bombillo", "led", "inteligente", "smart"]
    },
    {
        codigo: "D-003-001-001",
        descripcion: "Termostato inteligente",
        categoria: "Automatización",
        subcategoria: "Climatización",
        unidad: "pto",
        keywords: ["termostato", "inteligente", "smart", "clima"]
    },
    {
        codigo: "D-004-001-001",
        descripcion: "Cerradura inteligente",
        categoria: "Automatización",
        subcategoria: "Seguridad",
        unidad: "pto",
        keywords: ["cerradura", "inteligente", "smart", "lock"]
    },
    {
        codigo: "D-004-001-002",
        descripcion: "Sensor de movimiento",
        categoria: "Automatización",
        subcategoria: "Seguridad",
        unidad: "pto",
        keywords: ["sensor", "movimiento", "pir", "presencia"]
    },
    {
        codigo: "D-004-001-003",
        descripcion: "Sensor de apertura puerta/ventana",
        categoria: "Automatización",
        subcategoria: "Seguridad",
        unidad: "pto",
        keywords: ["sensor", "apertura", "puerta", "ventana", "magnetico"]
    },
    {
        codigo: "D-004-002-001",
        descripcion: "Timbre inteligente con cámara",
        categoria: "Automatización",
        subcategoria: "Seguridad",
        unidad: "pto",
        keywords: ["timbre", "inteligente", "camara", "video", "doorbell"]
    },
    {
        codigo: "D-005-001-001",
        descripcion: "Cortina motorizada",
        categoria: "Automatización",
        subcategoria: "Persianas",
        unidad: "pto",
        keywords: ["cortina", "motorizada", "automatica", "persiana"]
    },
    {
        codigo: "D-006-001-001",
        descripcion: "Enchufe inteligente",
        categoria: "Automatización",
        subcategoria: "Energía",
        unidad: "pto",
        keywords: ["enchufe", "inteligente", "smart", "plug"]
    },
    {
        codigo: "D-006-002-001",
        descripcion: "Medidor de energía inteligente",
        categoria: "Automatización",
        subcategoria: "Energía",
        unidad: "pto",
        keywords: ["medidor", "energia", "inteligente", "consumo"]
    },
    {
        codigo: "D-007-001-001",
        descripcion: "Asistente de voz",
        categoria: "Automatización",
        subcategoria: "Interfaces",
        unidad: "pto",
        keywords: ["asistente", "voz", "alexa", "google", "smart", "speaker"]
    },
    {
        codigo: "D-007-002-001",
        descripcion: "Panel táctil de control",
        categoria: "Automatización",
        subcategoria: "Interfaces",
        unidad: "pto",
        keywords: ["panel", "tactil", "control", "touchscreen"]
    },
    {
        codigo: "D-008-001-001",
        descripcion: "Sensor de calidad del aire",
        categoria: "Automatización",
        subcategoria: "Sensores Ambientales",
        unidad: "pto",
        keywords: ["sensor", "calidad", "aire", "co2"]
    },
    {
        codigo: "D-008-001-002",
        descripcion: "Sensor de humedad y temperatura",
        categoria: "Automatización",
        subcategoria: "Sensores Ambientales",
        unidad: "pto",
        keywords: ["sensor", "humedad", "temperatura", "ambiental"]
    },
    {
        codigo: "D-008-002-001",
        descripcion: "Sensor de fuga de agua",
        categoria: "Automatización",
        subcategoria: "Sensores Ambientales",
        unidad: "pto",
        keywords: ["sensor", "fuga", "agua", "inundacion"]
    }
];

// Función de validación de formato COVENIN
export function validateCovenInFormat(codigo: string): boolean {
    // Formato: X-XXX-XXX-XXX (letra-3dígitos-3dígitos-3dígitos)
    const regex = /^[A-Z]-\d{3}-\d{3}-\d{3}$/;
    return regex.test(codigo);
}

// Búsqueda de códigos COVENIN
export function searchCovenInCodes(query: string, categoria?: string): CovenInCode[] {
    const lowerQuery = query.toLowerCase();

    return COVENIN_DATABASE.filter(item => {
        const matchesCategoria = !categoria || item.categoria === categoria;
        const matchesQuery =
            item.codigo.toLowerCase().includes(lowerQuery) ||
            item.descripcion.toLowerCase().includes(lowerQuery) ||
            item.keywords.some(kw => kw.includes(lowerQuery));

        return matchesCategoria && matchesQuery;
    });
}

// Sugerencias basadas en descripción
export function suggestCovenInCode(descripcion: string): CovenInCode[] {
    const words = descripcion.toLowerCase().split(' ');
    const results = COVENIN_DATABASE.filter(item => {
        return words.some(word =>
            item.keywords.some(kw => kw.includes(word)) ||
            item.descripcion.toLowerCase().includes(word)
        );
    });

    // Ordenar por relevancia (más keywords coincidentes primero)
    return results.sort((a, b) => {
        const scoreA = words.filter(word =>
            a.keywords.some(kw => kw.includes(word))
        ).length;
        const scoreB = words.filter(word =>
            b.keywords.some(kw => kw.includes(word))
        ).length;
        return scoreB - scoreA;
    }).slice(0, 10); // Top 10 sugerencias
}

// Obtener categorías únicas
export function getCovenInCategories(): string[] {
    return Array.from(new Set(COVENIN_DATABASE.map(item => item.categoria)));
}

// Obtener subcategorías por categoría
export function getCovenInSubcategories(categoria: string): string[] {
    return Array.from(new Set(
        COVENIN_DATABASE
            .filter(item => item.categoria === categoria && item.subcategoria)
            .map(item => item.subcategoria!)
    ));
}
