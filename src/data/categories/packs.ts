import type { IconName } from '../../components/Icon';

/**
 * Paquetes de categorías escritos a mano. Cada paquete se puede activar o
 * desactivar en la pantalla "Categorías". Para agregar categorías basta con
 * añadir texto a la lista (separado por "|").
 */
export type CategoryPack = {
  id: string;
  name: string;
  icon: IconName;
  /** Breve descripción para la pantalla de paquetes. */
  description: string;
  categories: string[];
};

const l = (s: string) =>
  s
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean);

export const HANDWRITTEN_PACKS: CategoryPack[] = [
  {
    id: 'clasicas',
    name: 'Clásicas',
    icon: 'star',
    description: 'Las de toda la vida en el Basta de papel.',
    categories: l(`Nombres de mujer|Nombres de hombre|Apellidos|Animales|Frutas|Verduras|Países|Ciudades|Colores|Cosas|Marcas|Flores|Profesiones|Comidas|Postres|Bebidas|Deportes|Películas|Canciones|Cantantes|Actores y actrices|Ríos|Capitales|Personajes de caricatura|Objetos de la casa|Partes del cuerpo|Instrumentos musicales|Medios de transporte|Insectos|Árboles|Mamíferos|Aves|Peces|Ropa|Juguetes|Útiles escolares|Herramientas|Dulces|Series de TV|Superhéroes|Villanos|Programas de TV|Libros|Escritores|Pintores|Inventos|Enfermedades|Medicinas|Idiomas|Monedas`),
  },
  {
    id: 'comida',
    name: 'Comida y bebida',
    icon: 'utensils',
    description: 'Para jugar con hambre.',
    categories: l(`Comida rápida|Ingredientes de un pastel|Especias y condimentos|Quesos|Panes|Pan dulce|Cereales|Botanas|Salsas|Sopas|Ensaladas|Pastas|Mariscos|Cortes de carne|Comida italiana|Comida china|Comida japonesa|Comida argentina|Comida española|Comida que se come con cuchara|Comida que se come con las manos|Comida picante|Comida dulce|Comida para el desayuno|Cosas para la cena|Cosas en un refrigerador|Cosas en una alacena|Ingredientes de una pizza|Sabores de helado|Sabores de agua fresca|Bebidas calientes|Bebidas sin alcohol|Jugos|Licuados y malteadas|Cosas que se fríen|Cosas que se hornean|Cosas que se asan|Frutos secos|Semillas|Hierbas aromáticas|Comida enlatada|Cosas en un buffet|Cosas en una lonchera|Platillos de fiesta|Comida de cumpleaños|Cosas que se untan|Comida congelada|Cosas de la panadería|Cosas de la carnicería|Cosas de la frutería|Recetas de la abuela|Restaurantes|Utensilios de cocina|Electrodomésticos de cocina|Cosas que se licúan|Toppings|Golosinas de cine|Frutas tropicales|Frutas rojas|Verduras verdes|Legumbres|Tipos de arroz|Tipos de café|Tipos de té|Cosas agrias|Cosas saladas|Cosas amargas|Cosas crujientes|Comida de la calle|Comida de hospital|Comida de avión`),
  },
  {
    id: 'mexico',
    name: 'Hecho en México',
    icon: 'landmark',
    description: 'Lo más mexicano: comida, lugares, cultura y dichos.',
    categories: l(`Estados de México|Capitales de estados de México|Ciudades de México|Pueblos mágicos|Playas de México|Zonas arqueológicas|Comida mexicana|Antojitos|Tipos de tacos|Rellenos de quesadilla|Tamales|Salsas mexicanas|Chiles|Dulces mexicanos|Bebidas mexicanas|Aguas frescas|Panes mexicanos|Cosas de un mercado mexicano|Cosas de una fonda|Cosas de una taquería|Cosas de una kermés|Cosas de una posada|Cosas del Día de Muertos|Cosas de una ofrenda|Cosas de las fiestas patrias|Cosas de una boda mexicana|Cosas de XV años|Cosas de un bautizo|Juegos tradicionales mexicanos|Cosas de una feria|Personajes de la Lotería|Artesanías mexicanas|Música mexicana|Cantantes mexicanos|Grupos mexicanos|Actores mexicanos|Telenovelas|Comediantes mexicanos|Futbolistas mexicanos|Equipos de la Liga MX|Luchadores|Personajes históricos de México|Héroes de la Independencia|Personajes de la Revolución|Volcanes de México|Ríos de México|Animales de México|Palabras en náhuatl|Mexicanismos|Apodos cariñosos|Groserías permitidas en la mesa|Dichos y refranes|Cosas de la CDMX|Estaciones del metro|Colonias de tu ciudad|Calles famosas|Cosas de una vecindad|Marcas mexicanas|Tiendas mexicanas|Cosas de un tianguis|Cosas que vende un ambulante|Cosas de una lucha libre|Cosas de un mariachi|Prendas típicas mexicanas|Leyendas mexicanas|Cosas del Chavo del 8|Programas de TV mexicanos|Películas mexicanas`),
  },
  {
    id: 'geografia',
    name: 'Geografía y viajes',
    icon: 'earth',
    description: 'El mundo en una ronda.',
    categories: l(`Países de América|Países de Europa|Países de Asia|Países de África|Capitales del mundo|Ciudades de Estados Unidos|Ciudades de Europa|Islas|Montañas|Volcanes|Desiertos|Lagos|Mares y océanos|Ríos del mundo|Continentes y regiones|Gentilicios|Monumentos famosos|Maravillas del mundo|Destinos de playa|Destinos de nieve|Aeropuertos|Aerolíneas|Hoteles|Cosas en una maleta|Cosas de un aeropuerto|Cosas de un hotel|Cosas de un crucero|Cosas para acampar|Souvenirs|Idiomas del mundo|Banderas con rojo|Accidentes geográficos|Climas|Fenómenos naturales|Puntos cardinales y direcciones|Lugares turísticos|Parques nacionales|Selvas y bosques|Ciudades con playa|Lugares fríos|Lugares calurosos|Calles y avenidas|Barrios famosos|Estadios famosos|Museos famosos`),
  },
  {
    id: 'naturaleza',
    name: 'Animales y naturaleza',
    icon: 'leaf',
    description: 'Flora, fauna y todo lo que crece.',
    categories: l(`Animales de granja|Animales de la selva|Animales del mar|Animales del desierto|Animales del bosque|Animales polares|Animales nocturnos|Animales venenosos|Animales en peligro de extinción|Mascotas|Razas de perro|Razas de gato|Reptiles|Anfibios|Roedores|Felinos|Dinosaurios|Animales con cuernos|Animales con plumas|Animales con rayas|Animales con manchas|Animales que vuelan|Animales que nadan|Animales que saltan|Animales pequeños|Animales gigantes|Crías de animales|Sonidos de animales|Plantas de interior|Cactus y suculentas|Hongos|Flores de jardín|Árboles frutales|Hierbas medicinales|Piedras y minerales|Piedras preciosas|Cosas de un jardín|Cosas de un río|Cosas de una cueva|Cosas de la playa|Cosas del cielo|Cosas del espacio|Planetas y astros|Constelaciones|Estaciones del año|Fenómenos del clima|Cosas que hay en la montaña|Cosas que flotan|Cosas que crecen|Partes de una planta`),
  },
  {
    id: 'entretenimiento',
    name: 'Cine, TV y series',
    icon: 'film',
    description: 'Pantalla grande, chica y de streaming.',
    categories: l(`Películas de terror|Películas de comedia|Películas de acción|Películas animadas|Películas de Disney|Películas de Pixar|Películas de superhéroes|Películas de amor|Películas de los 80|Películas de los 90|Sagas de películas|Personajes de Disney|Princesas y príncipes|Personajes de Pixar|Personajes de anime|Animes|Caricaturas de los 90|Caricaturas actuales|Series de Netflix|Series de comedia|Series de misterio|Reality shows|Concursos de TV|Personajes de series|Actores de Hollywood|Actrices de Hollywood|Directores de cine|Personajes de Star Wars|Personajes de Harry Potter|Personajes de los Simpson|Personajes de Marvel|Personajes de DC|Monstruos|Robots famosos|Perros famosos|Gatos famosos|Personajes de cuentos|Personajes de videojuegos|Magos y brujas|Piratas famosos|Cosas de un cine|Géneros de película|Premios y galardones|Youtubers|Influencers|Streamers|Programas infantiles|Personajes de plastilina|Muñecos famosos|Villanos de película`),
  },
  {
    id: 'musica',
    name: 'Música',
    icon: 'music',
    description: 'Cantantes, bandas, géneros e instrumentos.',
    categories: l(`Cantantes de pop|Cantantes de reggaetón|Bandas de rock|Grupos de cumbia|Cantantes de banda|Cantantes de regional mexicano|Cantantes de los 80|Bandas de K-pop|Raperos|DJs|Géneros musicales|Bailes|Canciones de cumpleaños y fiestas|Canciones infantiles|Canciones de amor|Canciones para bailar|Canciones de karaoke|Instrumentos de cuerda|Instrumentos de viento|Instrumentos de percusión|Partes de una guitarra|Cosas de un concierto|Cosas de un estudio de grabación|Festivales de música|Compositores clásicos|Notas y términos musicales|Álbumes famosos|Cantantes que usan un solo nombre|Duetos famosos|Himnos y canciones patrias`),
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: 'futbol',
    description: 'Para los que no se pierden un partido.',
    categories: l(`Deportes olímpicos|Deportes de pelota|Deportes acuáticos|Deportes extremos|Deportes de invierno|Deportes de combate|Futbolistas|Basquetbolistas|Beisbolistas|Tenistas|Boxeadores|Pilotos de carreras|Equipos de futbol|Selecciones nacionales|Equipos de la NBA|Equipos de la NFL|Equipos de béisbol|Estadios|Posiciones en el futbol|Cosas de un gimnasio|Ejercicios|Cosas de un partido de futbol|Cosas de una alberca|Equipo deportivo|Marcas deportivas|Términos de futbol|Trofeos y torneos|Mascotas de mundiales|Juegos de mesa|Juegos de cartas|Juegos de patio|Juegos de fiesta|Artes marciales|Cosas de una carrera|Cosas de un ring`),
  },
  {
    id: 'casa',
    name: 'En casa',
    icon: 'home',
    description: 'Todo lo que hay de la puerta para adentro.',
    categories: l(`Cosas de la cocina|Cosas del baño|Cosas de la recámara|Cosas de la sala|Cosas del comedor|Cosas del cuarto de lavado|Cosas del patio|Cosas del garage|Cosas de un clóset|Cosas de un cajón|Cosas de un botiquín|Cosas de limpieza|Muebles|Electrodomésticos|Aparatos electrónicos|Cosas que se conectan|Cosas que usan pilas|Cosas que se rompen|Cosas que se pierden en casa|Cosas debajo de la cama|Cosas en una bolsa de mujer|Cosas en una mochila|Cosas en una cartera|Cosas en un escritorio|Cosas en una caja de herramientas|Quehaceres de la casa|Cosas de bebé|Cosas de la abuela|Cosas de una mascota|Decoraciones|Cosas de vidrio|Cosas de madera|Cosas de metal|Cosas de plástico|Cosas de papel|Cosas de tela|Cosas que tienen botones|Cosas que tienen cables|Cosas que tienen ruedas|Cosas que tienen llave|Cosas que se doblan|Cosas que se cuelgan|Cosas que se lavan|Cosas que huelen bien|Cosas que huelen mal`),
  },
  {
    id: 'escuela',
    name: 'Escuela',
    icon: 'school',
    description: 'Del kínder a la universidad.',
    categories: l(`Materias escolares|Útiles escolares|Cosas de un salón de clases|Cosas del recreo|Cosas de una biblioteca|Cosas de un laboratorio|Carreras universitarias|Universidades|Excusas para no hacer la tarea|Cosas que dice un maestro|Cosas en un pizarrón|Figuras geométricas|Números|Operaciones matemáticas|Unidades de medida|Elementos químicos|Partes de la célula|Huesos del cuerpo|Órganos del cuerpo|Palabras en inglés|Palabras en francés|Verbos en inglés|Signos de puntuación|Tipos de libros|Personajes de libros|Poetas|Filósofos|Científicos famosos|Inventores|Cosas de una graduación|Deportes escolares|Cosas de un examen|Cosas del uniforme|Cosas de la mochila|Cosas de una excursión`),
  },
  {
    id: 'trabajo',
    name: 'Trabajo y oficios',
    icon: 'briefcase',
    description: 'Profesiones, oficinas y negocios.',
    categories: l(`Profesiones|Oficios|Trabajos raros|Trabajos al aire libre|Trabajos de hospital|Trabajos de restaurante|Cosas de una oficina|Útiles de oficina|Cosas de una junta|Cosas de un banco|Cosas de una fábrica|Cosas de una tienda|Cosas de un supermercado|Cosas de una farmacia|Cosas de una ferretería|Cosas de una papelería|Cosas de un hospital|Cosas de un consultorio|Cosas de un taller mecánico|Cosas de una construcción|Uniformes|Herramientas de trabajo|Empresas famosas|Marcas de autos|Marcas de ropa|Marcas de tecnología|Marcas de comida|Logotipos famosos|Cosas que se venden por internet|Cosas que se rentan|Negocios de tu colonia|Puestos de una empresa|Cosas de un currículum|Cosas de un día de pago|Cosas de una entrevista de trabajo`),
  },
  {
    id: 'ciencia',
    name: 'Ciencia y tecnología',
    icon: 'flask',
    description: 'Para nerds orgullosos.',
    categories: l(`Elementos de la tabla periódica|Planetas|Lunas|Astronautas|Cosas del espacio|Cosas de un laboratorio|Inventos que cambiaron el mundo|Científicos|Partes de una computadora|Apps|Redes sociales|Páginas web|Lenguajes de programación|Marcas de celulares|Videojuegos|Consolas|Personajes de videojuegos|Cosas que tienen pantalla|Cosas inteligentes|Robots|Unidades de medida|Fuentes de energía|Partes de un auto|Partes de un avión|Máquinas|Enfermedades|Vitaminas y nutrientes|Partes del cerebro|Sentidos|Huesos|Músculos|Virus y bacterias|Fenómenos físicos|Ramas de la ciencia|Cosas que tienen motor|Cosas que funcionan con electricidad|Cosas de la inteligencia artificial|Emojis|Atajos y palabras de internet|Cosas de un hospital`),
  },
  {
    id: 'historia',
    name: 'Historia y cultura',
    icon: 'scroll',
    description: 'Imperios, reyes, mitos y leyendas.',
    categories: l(`Personajes históricos|Reyes y reinas|Presidentes|Emperadores|Civilizaciones antiguas|Dioses griegos|Dioses romanos|Dioses aztecas y mayas|Criaturas mitológicas|Leyendas urbanas|Guerras y batallas|Exploradores|Inventores antiguos|Cosas de la Edad Media|Cosas de un castillo|Cosas de los vikingos|Cosas de los egipcios|Cosas de los piratas|Cosas de los vaqueros|Cosas de los dinosaurios|Religiones y creencias|Santos|Festividades del mundo|Obras de arte|Pintores|Escultores|Arquitectos|Estilos de arte|Museos|Monumentos|Libros clásicos|Personajes bíblicos|Personajes de la mitología|Cosas de la prehistoria|Armas antiguas`),
  },
  {
    id: 'moda',
    name: 'Moda y belleza',
    icon: 'shirt',
    description: 'Ropa, accesorios y estilo.',
    categories: l(`Prendas de ropa|Ropa de invierno|Ropa de verano|Ropa interior|Calzado|Accesorios|Joyas|Bolsas y mochilas|Peinados|Cortes de pelo|Maquillaje|Productos de belleza|Cosas de un salón de belleza|Cosas de una barbería|Telas|Estampados|Diseñadores de moda|Marcas de lujo|Tiendas de ropa|Cosas para el pelo|Perfumes|Colores de uñas|Disfraces|Disfraces de Halloween|Uniformes deportivos|Sombreros y gorras|Lentes|Cosas que se ponen en la cabeza|Cosas que se ponen en los pies|Cosas que se ponen en las manos`),
  },
  {
    id: 'cuerpo',
    name: 'Cuerpo y salud',
    icon: 'heartPulse',
    description: 'De la cabeza a los pies.',
    categories: l(`Partes de la cara|Partes del cuerpo|Órganos|Huesos|Enfermedades comunes|Síntomas|Remedios caseros|Medicinas|Especialidades médicas|Cosas de un hospital|Cosas de un dentista|Ejercicios|Alimentos saludables|Comida chatarra|Vitaminas|Emociones|Sentimientos|Cosas que dan miedo|Cosas que dan risa|Cosas que dan sueño|Cosas que dan asco|Cosas que relajan|Cosas que estresan|Hábitos saludables|Fobias|Gestos|Cosas que haces al despertar|Cosas que haces antes de dormir|Posturas de yoga|Deportes de relajación`),
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: 'car',
    description: 'Todo lo que se mueve.',
    categories: l(`Medios de transporte|Marcas de autos|Modelos de autos|Marcas de motos|Partes de un auto|Partes de una bicicleta|Cosas de una gasolinera|Cosas de un estacionamiento|Cosas en la carretera|Señales de tránsito|Cosas en un autobús|Cosas en un avión|Cosas en un barco|Cosas en un tren|Cosas en el metro|Vehículos de emergencia|Vehículos de construcción|Vehículos que vuelan|Vehículos acuáticos|Cosas que tienen alas|Cosas que tienen motor|Cosas que tienen ruedas|Aeropuertos|Autos famosos de película|Cosas de un viaje en carretera`),
  },
  {
    id: 'fiestas',
    name: 'Fiestas y celebraciones',
    icon: 'cake',
    description: 'Cumpleaños, Navidad y todo pretexto para festejar.',
    categories: l(`Cosas de un cumpleaños|Cosas de una piñata|Dulces de piñata|Cosas de Navidad|Regalos de Navidad|Cosas de Año Nuevo|Propósitos de Año Nuevo|Cosas de Halloween|Cosas de San Valentín|Cosas de Pascua|Cosas del Día del Niño|Cosas del Día de las Madres|Cosas de una boda|Cosas de un baby shower|Cosas de una graduación|Cosas de una carne asada|Cosas de un picnic|Cosas de una pijamada|Cosas de un carnaval|Cosas de un circo|Juegos de fiesta|Canciones de fiesta|Comida de fiesta|Bebidas de fiesta|Cosas de un antro|Cosas de unas vacaciones|Regalos para mamá|Regalos para papá|Regalos baratos|Regalos caros|Cosas que se celebran|Disfraces|Decoraciones de fiesta|Cosas de un parque de diversiones|Juegos mecánicos`),
  },
  {
    id: 'ninos',
    name: 'Para niños',
    icon: 'smile',
    description: 'Categorías fáciles para los más pequeños.',
    categories: l(`Animales|Colores|Frutas|Juguetes|Caricaturas|Dulces|Cosas redondas|Cosas rojas|Cosas amarillas|Cosas que vuelan|Cosas de la escuela|Cosas del parque|Cosas de la playa|Cosas del zoológico|Cosas de la granja|Cosas que hacen ruido|Cosas suaves|Cosas que brillan|Cosas que se comen|Nombres de mascotas|Personajes de cuentos|Princesas|Superhéroes|Dinosaurios|Insectos|Cosas del baño|Ropa|Partes del cuerpo|Números|Formas|Cosas de un cumpleaños|Juegos del recreo|Canciones infantiles|Cosas del cielo|Cosas del mar|Cosas mágicas|Monstruos amigables|Cosas que dan cosquillas|Cosas pegajosas|Cosas mojadas`),
  },
  {
    id: 'expertos',
    name: 'Para expertos',
    icon: 'brain',
    description: 'Solo para valientes: muy difíciles.',
    categories: l(`Palabras esdrújulas|Palabras de más de 10 letras|Palabras de 3 letras|Palabras con doble R|Palabras con doble L|Palabras con tilde|Palabras que terminan en -ción|Palabras que terminan en -mente|Palabras que terminan en -dad|Palabras que terminan en -ito|Palabras que terminan en -oso|Palabras que empiezan y terminan con la misma letra|Palabras con todas las vocales|Palabras sin la letra A|Palabras compuestas|Palabras agudas|Palabras graves|Anglicismos|Palabras en latín|Palabras en portugués|Palabras en italiano|Palabras en alemán|Palabras en japonés|Verbos irregulares|Adjetivos|Adverbios|Sustantivos abstractos|Sinónimos de feliz|Sinónimos de bonito|Sinónimos de rápido|Antónimos de grande|Palabras que riman con amor|Palabras que riman con corazón|Palabras que riman con casa|Palabras con Ñ|Capitales de África|Elementos químicos|Huesos del cuerpo|Fobias|Constelaciones|Premios Nobel|Ríos de Europa|Dioses de cualquier mitología|Instrumentos de una orquesta|Términos médicos|Términos legales|Términos de economía|Teorías científicas|Obras de teatro|Óperas`),
  },
  {
    id: 'locas',
    name: 'Locas y divertidas',
    icon: 'magic',
    description: 'Para reírse a carcajadas.',
    categories: l(`Excusas para llegar tarde|Cosas que no dirías en una primera cita|Cosas que harías con un millón de pesos|Cosas que llevarías a una isla desierta|Cosas que no quieres encontrar en tu sopa|Cosas que gritas en una montaña rusa|Cosas que hace un perro|Cosas que hace un gato|Cosas que hacen los abuelos|Cosas que dicen las mamás|Cosas que dicen los papás|Cosas que te dan vergüenza|Cosas que haces cuando nadie te ve|Cosas que se dicen en un velorio|Cosas que pide un niño en el súper|Cosas que se roban en un hotel|Cosas que nunca prestarías|Cosas que harías en un apocalipsis zombie|Cosas que llevarías a Marte|Superpoderes|Nombres para un perro|Nombres para un gato|Nombres para un pez|Nombres para un robot|Nombres para una banda|Nombres para un restaurante|Apodos|Insultos de caricatura|Palabras que suenan chistoso|Cosas que hacen ruido de noche|Cosas que asustan a un fantasma|Cosas que encuentras en la bolsa de tu mamá|Cosas que hay en el bolsillo de un niño|Cosas que se dicen al teléfono|Cosas que se dicen en el chat familiar|Cosas que traes en el celular|Cosas que se hacen en el baño|Cosas que se hacen en el tráfico|Cosas que hacen los villanos|Cosas que harías si fueras invisible|Cosas que dirías a un extraterrestre|Inventos que deberían existir|Cosas que se ven en un sueño|Cosas que pasan en una pijamada|Cosas de memes|Cosas que te hacen enojar|Cosas que te hacen feliz|Cosas que son mejores frías|Cosas que son mejores calientes|Cosas que te llevarías de un museo`),
  },
  {
    id: 'personajes',
    name: 'Personas y personajes',
    icon: 'users',
    description: 'Famosos reales y de ficción.',
    categories: l(`Personajes famosos|Celebridades|Famosos con una sola palabra|Familias famosas|Parejas famosas|Hermanos famosos|Personajes con sombrero|Personajes con capa|Personajes con barba|Personajes rubios|Personajes pelirrojos|Personajes malvados|Personajes bondadosos|Animales de caricatura|Detectives|Espías|Científicos locos|Reyes de cuentos|Brujas|Hadas|Gigantes|Robots|Extraterrestres|Payasos|Magos|Chefs famosos|Deportistas famosos|Presentadores de TV|Personajes de comerciales|Mascotas de marcas|Personas de tu familia|Personas de tu escuela|Personas de tu trabajo|Vecinos famosos|Abuelitos famosos`),
  },
  {
    id: 'arte',
    name: 'Arte y creatividad',
    icon: 'brush',
    description: 'Pinceles, palabras y escenarios.',
    categories: l(`Colores|Tonos de azul|Tonos de rojo|Materiales de arte|Técnicas de dibujo|Manualidades|Cosas para pintar|Cosas que se pueden dibujar fácil|Obras de arte famosas|Pintores famosos|Escultores|Fotógrafos|Cosas de un teatro|Obras de teatro|Musicales|Cosas de un museo|Cosas de un circo|Estilos de baile|Cosas de un estudio de TV|Palabras poéticas|Personajes de obras|Instrumentos de un artista|Tipos de letra|Cosas que se tejen|Cosas que se cosen|Cosas que se moldean|Cosas que se construyen con bloques|Cosas que se doblan con papel|Cosas que se recortan|Cosas que tienen colores`),
  },
  {
    id: 'juegos',
    name: 'Juegos y pasatiempos',
    icon: 'gamepad',
    description: 'Videojuegos, juegos de mesa y hobbies.',
    categories: l(`Videojuegos|Personajes de videojuegos|Consolas|Juegos de mesa|Juegos de cartas|Juegos de celular|Juegos de feria|Juegos de patio|Juegos de palabras|Pasatiempos|Colecciones|Cosas de un parque|Cosas de un boliche|Cosas de un casino|Cosas de un cine|Cosas para un día lluvioso|Cosas para un día de sol|Actividades al aire libre|Actividades en casa|Deportes de mesa|Piezas de ajedrez y juegos|Cartas de la baraja|Juguetes antiguos|Juguetes de moda|Muñecos y figuras|Peluches|Cosas de Minecraft|Cosas de Mario Bros|Pokémon|Juegos de video retro`),
  },
  {
    id: 'emociones',
    name: 'Sentimientos y vida',
    icon: 'heart',
    description: 'Lo que sentimos y vivimos.',
    categories: l(`Emociones|Cosas que dan alegría|Cosas que dan tristeza|Cosas que dan nervios|Cosas que dan orgullo|Cosas románticas|Cosas que extrañas de niño|Recuerdos de la infancia|Sueños por cumplir|Cosas que agradeces|Valores|Defectos|Cualidades de una persona|Cosas que admiras|Cosas que odias|Cosas que te dan paz|Cosas que te dan energía|Cosas que harías en tu día libre|Lugares favoritos|Palabras bonitas|Palabras de cariño|Cosas que se regalan con amor|Cosas que se dicen al despedirse|Cosas que se dicen al saludar|Cosas que se aprenden con los años`),
  },
];
