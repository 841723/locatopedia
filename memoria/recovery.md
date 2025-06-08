Hola Diego:

Como te dije ayer, te mando alguna idea concreta y alguna menos
concreta.

Javier Nogueras tiene esta oferta, que igual te podría interesar:

-   Título: Asistente para la ingestión de conjuntos de datos en catálogos
    de datos abiertos
-   Descripción: El software CKAN permite poner en marcha un
    portal/catálogo de datos abiertos, pero la ingestión de nuevos conjuntos
    de datos requiere la inserción manual de los metadatos (título, resumen,
    tema, extensión temporal, extensión espacial, ...). Sin embargo, cuando
    se va a dar de alta un conjunto de datos nuevo en el catálogo y está
    disponible en un formato procesable como CSV o RDF, es posible que se
    pueda inferir esta información a partir del nombre de
    columnas/propiedades, valores de estas columnas/propiedades, ... El
    objetivo del TFG sería proporcionar una aplicación web que permita a un
    usuario seleccionar conjuntos de datos, integrar algunas utilidades de
    IA para inferir metadatos y conectarse con un catálogo CKAN para crear
    nuevas entradas. Dentro del contexto del TFG, se podría hacer algún
    experimento de integración de datos abiertos disponibles en plataformas
    que dan soporte a proyectos de ciencia ciudadana como Epicollect
    (https://five.epicollect.net/projects), o portales de datos enlazados.

Yo no tengo nada muy concreto pensado ahora mismo, pero te puedo dar
alguna idea para que explores y, si ves algo que te interese, podemos
hablar para concretarlo mejor. Basándome en lo que me dijiste ayer, esto
son todo cosas muy de front-end, donde el back-end sería algo ya
existente o como mucho algo que requeriría un trabajo pequeño.

-   Un cliente de mastodon o de otras redes del fediverso. Sería bastante
    fácil hacer pruebas porque puedes montar un servidor de desarrollo con
    Docker en tu equipo bastante fácilmente. Y tendrías la opción de hacer
    un "Twitter/X" (Mastodon), un "Instagram" (Pixelfed), un "Youtoube"
    (Peertube) etc. pero con un cliente ajustado a tu gusto.

-   Puedes buscar alguna API de libre uso que tenga acceso a datos
    interesantes y montar un front-end que le saque partido. Hay bastantes
    cosas, aunque hay que leerse la letra pequeña para ver si tienen
    limitaciones de acceso etc.: <https://free-apis.github.io/#/categories>,
    <https://publicapis.io>,
    <https://mixedanalytics.com/blog/list-actually-free-open-no-auth-needed-apis/>.
    P.ej. algunas de estas API como la MovieDB
    <https://publicapis.io/movie-db-api/> tienen un front-end por defecto
    <https://www.themoviedb.org> y se integran en otros sitios, p.ej. esa se
    usa en Kodi <https://kodi.tv> como fuente de información de películas.
    Tú podrías diseñar un front-end a tu medida, de la API que tuviera datos
    de tu interés. También se pueden combinar varias y montar algún tipo de
    dashboard con actualizaciones en tiempo real etc. O combinarlas con
    algún modelo de lenguaje para darles una interfaz de usuario más
    conversacional (podría ser un modelo que se ejecute en local; siempre
    que tu máquina de desarrollo tenga una GPU con suficiente RAM hay cosas
    decentillas).

-   Y de nuevo focalizándote fundamentalmente en el front-end, algo que
    podría tener interés e ir un poco más allá de una YAWA (Yet Another Web
    Application) sería algo basado en la idea de
    <https://localfirstweb.dev>. Los CRDT (conflict-free replicated data
    types) parecen un tema interesante, y se han hecho cosas bastante
    curiosas en el terreno de las apps colaborativas con ellos sin necesidad
    de montar back-ends, o con back-ends muy de mínimos (ver, lectura larga,
    <https://www.inkandswitch.com/local-first/> para explicaciones y
    ejemplos de aplicaciones que han hecho). Esto va a requerir que
    investigues en el tema un poco más, pero a cambio también creo que
    podría salirte una cosa más "distinta" a otras cosas que hayas hecho
    para poner en el CV/portafolio.

Si alguna de estas cosas pica tu curiosidad, me lo dices y hablamos.

---

Te explico brevemente una propuesta más que tengo por ahí pendiente hace
tiempo y no termino de encontrar la ocasión de ponerla en marcha.

-   La idea sería montar un equivalente a la Wikipedia, pero en lugar de
    que las entradas de esta wikipedia fueran palabras, serían lugares.
    Estos lugares podrían ser automáticamente generados a partir de datos
    oficiales (p.ej. un municipio) pero también podrían ser cosas con
    límites más borrosos (una "zona de tapas", un "casco histórico", un "mis
    zonas favoritas del parque no sé cuál"... todo eso puede variar entre
    distintas personas). Este último caso sería el que abordaríamos en el
    TFG.
-   Estos lugares se delimitarían sobre una malla global discreta
    (DGG/DGGS por sus siglas habituales en inglés). Por ejemplo Uber creó la
    H3 <https://www.uber.com/en-DE/blog/h3/> y esa entrada de blog es un
    introducción razonable al tema de los DGGS usando H3 como ejemplo. La
    malla facilita dibujar zonas, porque es una simple cuestión de "marcar
    celdas" y no hace falta dibujar. H3 está basado en hexágonos, pero hay
    DGGS basados en triángulos y en rectángulos también con sus pros y sus
    contras.
-   Una vez delimitada una zona, se le puede asignar fácilmente un
    identificador único basado en los identificadores únicos de las celdas
    marcadas (otra ventaja de usar un DGGS). Para esto tengo algo de
    software propio (en Python).
-   Y a eso le añadiríamos luego la información que quisiéramos (nombre,
    descripción, fotos...).

Habría que concretar objetivos y limitar el alcance del trabajo, pero
más o menos las palabras clave serían:

-   Aplicación web colaborativa (con cambios posiblemente basados en
    control de versiones).
-   Backend con API REST (o similar) + BD (las celdas de los DGGS tienen
    ids únicos; eso facilita mucho su almacenamiento en cualquier tipo de BD
    comparándolo con almacenear p.ej. geometrías vectoriales).

Es un tema que ya se acerca a la investigación. De hecho si saliera una
cosa maja, yo creo que hasta podríamos plantearnos una publicación
científica con ella. Pero esto implica una mayor complejidad también.
Tendrías que mirarte algunas cosas que no has tenido que aprender
durante la carrera, al menos para tener una idea general de cómo
funcionan. Y tendrías que utilizar algo de software existente que quizás
está poco probado y poco documentado porque son temas novedosos y es lo
que hay.

Para que lo añadas a tus opciones.

Si ves algo que te interesa, me lo dices. O si quieres más
detalles/explicaciones, hablamos algún rato.

---

-   Cada página de la Wikipedia (que tiene su propia URL) corresponde con un término desambiguado (una palabra que corresponde con un significado). Por ejemplo <https://es.wikipedia.org/wiki/Arag%C3%B3n> es la URL del término Aragón con el sentido "la CCAA de Aragón en España", y <https://es.wikipedia.org/wiki/Arag%C3%B3n_(M%C3%A9xico)> es la URL del término Aragón con el sentido "zona de México".

-   Los contenidos de las páginas apuntadas por esas URL describen los conceptos correspondientes y proporcionan acceso vía enlaces a cosas relacionadas. A menudo esas cosas son otros términos de la Wikipedia, pero en ocasiones son páginas web externas.

En mi propuesta, las diferencias serían:

-   Cada página (con su propia URL) corresponde a un lugar; estos lugares tienen un identificador único que se construye a partir del conjunto de celdas de la malla global descrita que lo delimitan (su geometría) y esos identificadores únicos los usamos para construir URL únicas. No hay ambigüedad posible. Si dos conjuntos de celdas de la malla global discreta son iguales, es que nos referimos al mismo lugar. Construir la URL es relativamente fácil porque podemos asignar identificadores únicos a estos conjuntos de mallas fácilmente y producir un hash con esos ids únicos (que son muy largos en general). Si te aburres mucho le puedes dar un vistazo a este breve artículo que escribimos hace unos años sobre cómo hacer esto: <https://agile-gi.eu/images/conferences/2019/documents/short_papers/58_Upload_your_PDF_file.pdf>.

-   Los contenidos de las páginas describirían esos lugares y proporcionarían acceso a cosas relacionadas. Cuando esas cosas tengan una entrada en esta "Wikipedia de lugares" pues funcionaría exactamente igual. Por ejemplo, yo puedo crear una página para un parque de Zaragoza (pero identificándolo a partir de su geometría en la malla y no por su nombre) y en la descripción del mismo la palabra Zaragoza sería un enlace clickable a la entrada que corresponde a Zaragoza en esta misma "Wikipedia de lugares" (la persona que crea el enlace tendría que saber a qué pagina quiere enlazar, pero esto no es muy distinto a lo que se hace en la Wikipedia).

Así que en realidad las diferencias hasta aquí son bastante pequeñas realmente. En lugar de usar términos desambiguados para denotar conceptos y construir URLs con ellas que nos lleven a páginas que describen esos conceptos, usamos conjuntos de celdas con identificadores únicos para denotar lugares, y construimos URL a partir de esos ids únicos que nos llevan a páginas que describen esos lugares.

La parte que sería más diferente sería la creación de esas entradas, las búsquedas (que incluirían criterios espaciales), y el cómo reconciliar/relacionar entradas que estén cercanas, o que tengan partes comunes etc. etc. (explorar todas las posibilidades daría para varios TFG/TFM o, posiblemente, para alguna tesis doctoral). En este otro pequeño artículo <https://www.thinkmind.org/index.php?view=article&articleid=geoprocessing_2020_1_140_30091> propusimos/probamos algunas cosas sobre el tipo de GUI que tendría algo parecido (aunque aquello tenía distintos objetivos). Lógicamente, para el TFG buscaríamos un conjunto de funcionalidades de base que se pudiera construir en un tiempo razonable y que encaje con lo que te pueda interesar más.

Si quieres que te lo explique/concrete más (aunque yo tampoco tengo todas las respuestas pensadas, esto es un trabajo que tiene una parte inicial de exploración de ideas) podemos hacer un meet en algún momento.

---

Sí, crea un repo en GitHub y ve subiendo cosas. Si quieres hacerlo
privado, invítame (usuario de GitHub rbejar).

Una de las cosas a decidir es qué DGGS (discrete global grid system, AKA
malla geodésica) vamos a usar. Cuando tengamos eso claro, podremos crear
y superponer las mallas correctamente usando leaflet (u openlayers que
sería la otra alternativa).

De las mallas que hay, están bien documentadas y tienen código
disponible puedes darle un vistazo a:

-   H3 <https://h3geo.org>. Creada para Uber. Basada en hexágonos.
    Pensada para las necesidades de Uber, que en líneas generales consisten
    en tener indexados un montón de puntos (vehículos) que se van moviendo.
-   S2 <http://s2geometry.io>. Creada por Google. Basada en cuadrados. No
    tengo muy claro el uso que le están dando (o si le están dando uso
    realmente), pero apuntaban más a ser una biblioteca robusta para
    cálculos sobre geometría esférica que a un DGGS propiamente dicho.
-   rHEALPix <https://pypi.org/project/rHEALPixDGGS/>
    <https://raichev.net/files/rhealpix_dggs_preprint.pdf>. Basada en
    cuadrados también. Origen académico, pero se usa bastante en Australia y
    Canadá. Esta la he usado más porque por su estructura me encaja bien
    para otros proyectos, pero para este caso en particular quizás no
    tendría grandes ventajas/desventajas frente a otras alternativas.
-   Luego también está la ISEA3H
    <https://github.com/mocnik-science/geogrid>, basada en la proyección
    ISEA (Icosahedral Snyder Equal Area) y con celdas hexagonales, y para la
    que incluso hay un plugin para leaflet
    <https://github.com/GIScience/geogrid.js>. Lo malo es que estos
    repositorios parecen "poco mantenidos" (siendo generoso).

H3 y S2 son más "industry-friendly". Son proyectos de empresas
tecnológicas grandes con las ventajas (recursos, documentación, más
usuarios...) y desventajas (orientadas a cubrir sus necesidades, que
generalmente no son las tuyas) que eso supone. De esas dos, H3
claramente tiene más uso que S2. rHEALPix lo tengo más controlado, pero
hay menos de código disponible y no tiene el respaldo económico que las
otras dos tienen.

En realidad podríamos plantear como proyecto (o parte del proyecto) el
probar con distintos DGGS. En general la parte de almacenamiento de
datos no tiene por qué cambiar (al final cada celda de cualquier DGGS,
tenga la forma que tenga, tiene un identificador único, que es lo que
podemos usar para almacenar en la BD). Pero la GUI tendría que cambiar
algo (aunque quizás no mucho). Si nos ponemos a probar DGGS, yo
probablemente apostaría por H3, rHEALPix y ya buscaríamos algo con
celdas triangulares por completar. Si queremos usar uno solo, yo estaría
entre H3 (mejor soportado a nivel de software y documentación
disponible) y rHEALPix (lo conozco mejor).

---

El 18/7/24 a las 12:30, Diego Roldan escribió:
No entiendo del todo bien porque hay que utilizar una malla como H3 o S2. ¿Cual es el problema de utilizar la malla que tengo en el repositorio de github?
Porque tu malla no es un DGGS y sin eso el proyecto pasa de tener ciertas posibilidades de expansión y crecimiento, e incluso potencial para publicación, a ser una aplicación web para dibujar polígonos en mapas y poco más.

Un DGGS consiste a grandes rasgos en:

-   Un sistema para subdividir la Tierra en celdas que tengan todas la misma forma y ocupen todas la misma área, y que una vez proyectadas a un plano tengan una forma regular (hexágono, cuadrado, triángulo...). Esto se hace envolviendo la Tierra en un poliedro regular y subdividiendo a partir de ahí. Además tiene que ser posible tener distintos niveles de resolución, para permitir trabajar con el mismo DGGS a escalas distintas. Y las celdas en distintos niveles de resolución tienen que estar bien anidadas entre sí (idealmente N celdas de un nivel de resolución caben exactamente dentro de 1 celda del nivel superior).

-   Una o varias proyecciones cartográficas. Las proyecciones cartográficas son transformaciones matemáticas que llevan puntos en un elipsoide a puntos en un plano. En el caso de un DGGS ese plano es cada una de las caras del poliedro regular mencionado antes.

-   Un sistema para asignar identificadores únicos (direcciones, índices...) a cada una de las celdas. Que siempre asigne el mismo identificador único a la misma celda de manera que simplemente por ese identificador único podamos saber exactamente a qué área concreta de la Tierra nos estamos refiriendo. Aparte de esto este sistema de indexado de celdas suele tener algunas propiedades interesantes, como facilidad para deducir el identificador de una celda sabiendo el de alguna otra celda vecina etc.

Gracias a esto con un simple identificador de celda (una cadena alfanumérica) y sabiendo qué DGGS estamos usando (H3, S2, rHEALPix etc.) podemos saber _exactamente_ a qué área de la Tierra nos estamos refiriendo, sin que nos tengan que dar más información, ni coordenadas ni nada más. También podemos estar seguros de que las celdas de un mismo nivel de resolución tienen la misma área en la realidad (las celdas sobre el elipsoide son curvas y no son iguales en todas partes, solo son iguales en forma al proyectar sobre el plano) y que su forma (una vez proyectadas) es regular (siempre son hexágonos, cuadrados etc. iguales). Podremos estar seguros de cuánta distorsión de áreas/ángulos/distancias tenemos, porque sabremos qué proyección cartográfica se usa. Etc. Etc.

Superponer una malla arbitraria en un mapa y usarla para delimitar áreas solo sirve como un pequeño "truco" de usabilidad para facilitar el pintado de polígonos. Pero eso por sí solo tiene poco interés. Lo interesante de los DGGS es que tienen una serie de buenas cualidades geográficas. Si la malla es algo arbitrario, solo sirve para facilitar un poco el pintado de polígonos en un mapa, a costa de imponer limitaciones arbitrarias (las celdas definidas por una malla arbitraria son eso, arbitrarias). Si la malla es un DGGS tiene una serie de propiedades interesantes, _y además_ la podemos aprovechar para facilitar el pintado de polígonos en un mapa. Las limitaciones que impone un DGGS tienen una razón de ser, no son arbitrarias, están ahí para garantizar ciertas propiedades geométricas/geográficas.

Tampoco entiendo muy bien la idea de hacer una "pizarra" compartida en esta Wikipedia. Es decir, veo que es un concepto interesante en el que hay que gestionar la comunicación entre distintos clientes, el tema de los conflictos también puede ser interesante, pero no veo que aporta a la creación de una entrada de la Wiki.
Una wiki es una aplicación colaborativa. Lo que pasa es que la colaboración es asíncrona y hay que reconciliar cambios (p.ej. en los textos que añadimos a sus páginas) de alguna manera (que puede ser tan burda como bloquear una página mientras otra persona la está editando). Así que buscar otras alternativas para hacer [parte de] esa colaboración también tiene sentido. Que no necesariamente los CRDT son la única/mejor solución, pero son relativamente novedosos y creo que dignos al menos de explorar sus posibilidades. Pero solo es otra vía posible de trabajo. Si tú no ves interés en explorarla, no hay problema, yo genero ideas potenciales, pero el proyecto puede ir en otras direcciones sin problema.

---

https://github.com/uber/h3-js

https://afi.io/blog/uber-h3-js-tutorial-how-to-draw-hexagons-on-a-map/

https://codesandbox.io/s/hex-bin-map-1hlyx

---

Esto parece prometedor: https://deck.gl/docs/api-reference/geo-layers/h3-hexagon-layer. También está para S2 https://deck.gl/docs/api-reference/geo-layers/s2-layer. Voy a probar esta tarde a hacer algún ejemplito para ver si realmente podría servir. Pero si quieres ir mirando algo tú, la documentación parece bastante decente. No es necesario pintar en 3D y se pueden seleccionar celdas como se ve en este pequeño ejemplo que la usa (aunque funciona un poco a medias): https://codesandbox.io/s/hex-bin-map-1hlyx?file=/src/Map/index.js:108-124

---

upongo que porque H3, que está diseñado para ciertas necesidades de Uber, no lo necesita. Los DGGS digamos de "primera generación" tienen celdas de la misma área (a la misma resolución), pero el borrador que se maneja ahora mismo como estándar "2.0" para DGGS contempla que esto no sea obligatorio. A mí me parece que quitar esto quitar interés a los DGGS porque esta característica viene muy bien (p.ej, calcular áreas se convierte en una simple operación de contar celdas) pero por otra parte, que los DGGS se usen para cosas distintas y que no tengan que ver con medir áreas, pues hará que se usen más y que sean más comunes y eso también es bueno para los que trabajamos en ello.

Sí que H3 tiene al menos unos límites. En una misma resolución la diferencia de área entre el hexágoono más grande y el más pequeño es como mucho de 2 a 1. https://observablehq.com/@nrabinowitz/h3-area-stats
De cara al TFG no me parece preocupante. Sería genial usar un DGGS con celdas de la misma área, pero lo que hemos hablado antes: cualquier DGGS "conocido" que hagamos funcionar sin problema, nos vale.
Si con esto puedes avanzar, trabaja con esto.

Ya que estamos, este artículo es interesante para conocer el origen de los DGGS y sus posibles ventajas con respecto a otros sistemas de georreferenciación: https://dusk.geo.orst.edu/Pickup/reimagining-Goodchild.pdf. Michael Goodchild es uno de los "gurús" del mundillo de los sistemas de información geográfica y se explica muy bien generalmente.
rubejar — 19/07/2024 15:47

Y este es una buena introducción a aspectos más técnicos sin entrar en la geodesia matemática dura (que es infumable): https://webpages.sou.edu/~sahrk/sqspc/pubs/gdggs03.pdf. El primer autor (Kevin Sahr) creo recordar que es el que diseñó H3 a petición de Uber.
