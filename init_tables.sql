SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA tfg;
ALTER SCHEMA tfg OWNER TO postgres;

SET default_tablespace = '';
SET default_table_access_method = heap;


CREATE TABLE tfg.article (
    hash character varying NOT NULL,
    auid character varying NOT NULL,
    date timestamp without time zone NOT NULL,
    email_user character varying NOT NULL,
    is_deprecated boolean NOT NULL,
    new_hash character varying,
    img_url character varying
);
ALTER TABLE tfg.article OWNER TO postgres;


CREATE TABLE tfg.version (
    id_version integer NOT NULL,
    title character varying NOT NULL,
    subtitle character varying NOT NULL,
    content character varying NOT NULL,
    date timestamp without time zone NOT NULL,
    email_user character varying NOT NULL,
    hash character varying NOT NULL
);
ALTER TABLE tfg.version OWNER TO postgres;


CREATE SEQUENCE tfg.version_id_version_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tfg.version_id_version_seq OWNER TO postgres;


ALTER SEQUENCE tfg.version_id_version_seq OWNED BY tfg.version.id_version;



SELECT pg_catalog.setval('tfg.version_id_version_seq', 1, false);



ALTER TABLE ONLY tfg.article
    ADD CONSTRAINT article_pk PRIMARY KEY (hash);



ALTER TABLE ONLY tfg.version
    ADD CONSTRAINT version_pk PRIMARY KEY (id_version, hash);



ALTER TABLE ONLY tfg.version
    ADD CONSTRAINT version_article_fk FOREIGN KEY (hash) REFERENCES tfg.article(hash);



CREATE TABLE tfg.likes (
	email varchar NOT NULL,
	hash varchar NOT NULL,
	CONSTRAINT likes_pk PRIMARY KEY (email, hash),
	CONSTRAINT likes_article_fk FOREIGN KEY (hash) REFERENCES tfg.article(hash)
);
ALTER TABLE tfg.likes OWNER TO postgres;



INSERT INTO tfg.article (hash,auid,"date",email_user,is_deprecated,new_hash,img_url) VALUES
	 ('TlDy5lMOz4sRH-Ulfvj28eveDFs=','eJyVkMkRgDAIRZuxgIQskBOdOCPJ2H8JjsZD8j2onHjAZ1uFQ2Hnye2XLXqbBw7AETgBZ2BVkQKxDdhQU1DxqKiEkfZ2CSr-X9J3O_8mlWIYsjz4NvhTh_RFoWzz1OaN5z2p8wHYhIKW','2025-01-07 00:02:31.24','841723@unizar.es',false,NULL,'/api/images/TlDy5lMOz4sRH-Ulfvj28eveDFs=.webp'),
	 ('4W2pF8ErT0Utxp5HLU4rikyKgVA=','eJyLs0g0tjQ3sEgxSbYwT0tLU7EHgTQ4yz4Rq2gSQtQ-BYmdhsS2T7EE6wAAgbMcbA==','2025-01-07 00:08:07.272','841723@unizar.es',false,NULL,'/api/images/4W2pF8ErT0Utxp5HLU4rikyKgVA=.webp'),
	 ('MHq90v59SVFBkHknOaRaq3XokeU=','eJyLszAxtDCxNE6DAhV7OEjCIgYCxpYmJpZEqzczMsQijs0-Uyxi5ljEiLU7BZt7jLG5hlibsZpoRqxuoKgpsWFBuh8BnS-I3Q==','2025-01-07 17:32:24.331','diegoraulroldan@gmail.com',false,NULL,'/api/images/MHq90v59SVFBkHknOaRaq3XokeU=.webp');


INSERT INTO tfg."version" (id_version,title,subtitle,"content","date",email_user,hash) VALUES
	 (1,'Zaragoza','Capital de Aragón','# Zaragoza: Una Ciudad con Historia y Modernidad

Zaragoza, capital de la comunidad autónoma de Aragón, es una ciudad española conocida por su rica historia, su impresionante arquitectura y su ubicación estratégica entre Madrid y Barcelona.

---

## Información General

| **Característica**     | **Detalle**                        |
|-------------------------|------------------------------------|
| **País**               | España                            |
| **Comunidad Autónoma** | Aragón                            |
| **Población**          | ~700,000 habitantes (2021)        |
| **Río Principal**      | Ebro                              |
| **Gentilicio**         | Zaragozano/a                      |
| **Altitud**            | 199 metros sobre el nivel del mar |

---

## Lugares de Interés

### 1. **Basílica del Pilar**
Uno de los monumentos más emblemáticos de España, situado junto al río Ebro. Este templo barroco es un importante lugar de peregrinación cristiana.

### 2. **La Aljafería**
Un palacio islámico del siglo XI que actualmente es sede de las Cortes de Aragón.

### 3. **Puente de Piedra**
Un puente histórico que cruza el río Ebro y ofrece unas vistas magníficas de la Basílica del Pilar.

---

## Gastronomía

Zaragoza es famosa por su gastronomía tradicional, que combina ingredientes locales y sabores únicos.

| **Plato Típico**         | **Descripción**                                          |
|---------------------------|----------------------------------------------------------|
| **Ternasco de Aragón**    | Cordero asado o guisado, considerado un manjar local.    |
| **Bacalao al Ajoarriero** | Bacalao cocinado con ajo, aceite, y pimientos.           |
| **Migas Aragonesas**      | Trozos de pan frito con chorizo, huevo y uvas.           |
| **Melocotón con Vino**    | Postre típico de melocotones marinados en vino tinto.    |

---

## Eventos y Fiestas

### Fiestas del Pilar
Se celebran en octubre en honor a la Virgen del Pilar, la patrona de Zaragoza. Incluyen procesiones, conciertos, y espectáculos de fuegos artificiales.

| **Evento**                 | **Fecha**           | **Descripción**                                  |
|----------------------------|---------------------|-------------------------------------------------|
| **Ofrenda de Flores**      | 12 de octubre       | Miles de personas ofrecen flores a la Virgen.   |
| **Romería de la Virgen**   | 13 de octubre       | Peregrinación por la ciudad.                    |
| **Gigantes y Cabezudos**   | Durante las fiestas | Desfile de figuras gigantes y cabezudas.        |

---

## Clima

Zaragoza tiene un clima semiárido, caracterizado por inviernos fríos y veranos calurosos.

| **Estación** | **Temperatura Media (°C)** | **Precipitaciones (mm)** |
|--------------|-----------------------------|--------------------------|
| **Invierno** | 5-10                        | ~30                     |
| **Verano**   | 25-35                       | ~15                     |

---

## Curiosidades

- Zaragoza es conocida como la "Ciudad del Viento" debido al fuerte cierzo, un viento característico de la región.
- Es el punto medio entre Madrid y Barcelona, a unas 1:30 horas en tren de alta velocidad (AVE).
- La Expo 2008 se celebró en Zaragoza, destacando el tema del agua y el desarrollo sostenible.

---

## Imágenes Destacadas

![Basílica del Pilar](https://upload.wikimedia.org/wikipedia/commons/0/0e/Bas%C3%ADlica_del_Pilar_en_Zaragoza%2C_Espa%C3%B1a%2C_2015-12-16%2C_DD_56.JPG)  
*Fuente: Wikimedia Commons*

---

## Cómo Llegar

| **Modo de Transporte** | **Duración**            | **Comentario**                               |
|-------------------------|-------------------------|---------------------------------------------|
| **Tren (AVE)**          | 1:30 desde Madrid/Barcelona | Alta velocidad, rápido y cómodo.          |
| **Avión**               | Aeropuerto de Zaragoza | Conexiones nacionales e internacionales.    |
| **Coche**               | 3 horas desde Madrid    | Buena red de carreteras.                   |

---

¡Zaragoza es un destino ideal para quienes buscan historia, cultura, y gastronomía en un entorno acogedor!

','2025-01-07 00:02:31.278','841723@unizar.es','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 (2,'Zaragoza','Capital de Aragón','# Zaragoza: Una Ciudad con Historia y Modernidad

Zaragoza, capital de la comunidad autónoma de Aragón, es una ciudad española conocida por su rica historia, su impresionante arquitectura y su ubicación estratégica entre Madrid y Barcelona.

---

## Información General

| **Característica**     | **Detalle**                        |
|-------------------------|------------------------------------|
| **País**               | España                            |
| **Comunidad Autónoma** | Aragón                            |
| **Población**          | ~700,000 habitantes (2021)        |
| **Río Principal**      | Ebro                              |
| **Gentilicio**         | Zaragozano/a                      |
| **Altitud**            | 199 metros sobre el nivel del mar |

---

## Lugares de Interés

### 1. **Basílica del Pilar**
Uno de los monumentos más emblemáticos de España, situado junto al río Ebro. Este templo barroco es un importante lugar de peregrinación cristiana.

### 2. **La Aljafería**
Un palacio islámico del siglo XI que actualmente es sede de las Cortes de Aragón.

### 3. **Puente de Piedra**
Un puente histórico que cruza el río Ebro y ofrece unas vistas magníficas de la Basílica del Pilar.

---

## Gastronomía

Zaragoza es famosa por su gastronomía tradicional, que combina ingredientes locales y sabores únicos.

| **Plato Típico**         | **Descripción**                                          |
|---------------------------|----------------------------------------------------------|
| **Ternasco de Aragón**    | Cordero asado o guisado, considerado un manjar local.    |
| **Bacalao al Ajoarriero** | Bacalao cocinado con ajo, aceite, y pimientos.           |
| **Migas Aragonesas**      | Trozos de pan frito con chorizo, huevo y uvas.           |
| **Melocotón con Vino**    | Postre típico de melocotones marinados en vino tinto.    |

---

## Eventos y Fiestas

### Fiestas del Pilar
Se celebran en octubre en honor a la Virgen del Pilar, la patrona de Zaragoza. Incluyen procesiones, conciertos, y espectáculos de fuegos artificiales.

| **Evento**                 | **Fecha**           | **Descripción**                                  |
|----------------------------|---------------------|-------------------------------------------------|
| **Ofrenda de Flores**      | 12 de octubre       | Miles de personas ofrecen flores a la Virgen.   |
| **Romería de la Virgen**   | 13 de octubre       | Peregrinación por la ciudad.                    |
| **Gigantes y Cabezudos**   | Durante las fiestas | Desfile de figuras gigantes y cabezudas.        |

---

## Clima

Zaragoza tiene un clima semiárido, caracterizado por inviernos fríos y veranos calurosos.

| **Estación** | **Temperatura Media (°C)** | **Precipitaciones (mm)** |
|--------------|-----------------------------|--------------------------|
| **Invierno** | 5-10                        | ~30                     |
| **Verano**   | 25-35                       | ~15                     |

---

## Curiosidades

- Zaragoza es conocida como la "Ciudad del Viento" debido al fuerte cierzo, un viento característico de la región.
- Es el punto medio entre Madrid y Barcelona, a unas 1:30 horas en tren de alta velocidad (AVE).
- La Expo 2008 se celebró en Zaragoza, destacando el tema del agua y el desarrollo sostenible.

---

## Imágenes Destacadas

![Basílica del Pilar](https://upload.wikimedia.org/wikipedia/commons/0/0f/Zaragoza_-_Bas%C3%ADlica_del_Pilar_y_r%C3%ADo_Ebro.jpg)  
*Fuente: Wikimedia Commons*

---

## Cómo Llegar

| **Modo de Transporte** | **Duración**            | **Comentario**                               |
|-------------------------|-------------------------|---------------------------------------------|
| **Tren (AVE)**          | 1:30 desde Madrid/Barcelona | Alta velocidad, rápido y cómodo.          |
| **Avión**               | Aeropuerto de Zaragoza | Conexiones nacionales e internacionales.    |
| **Coche**               | 3 horas desde Madrid    | Buena red de carreteras.                   |

---

¡Zaragoza es un destino ideal para quienes buscan historia, cultura, y gastronomía en un entorno acogedor!

','2025-01-07 00:03:40.964','841723@unizar.es','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 (1,'CPS','Centro Politecnico Superior de Zaragoza','# CPS, UNIZAR y EINA: Ingeniería y Arquitectura en Zaragoza

El **Centro Politécnico Superior (CPS)**, actualmente integrado como la **Escuela de Ingeniería y Arquitectura (EINA)**, es una de las instituciones académicas más destacadas de la Universidad de Zaragoza (UNIZAR). Se especializa en la formación de ingenieros, arquitectos y profesionales altamente cualificados en diversas ramas técnicas.

---

## Información General

| **Característica**             | **Detalle**                                  |
|--------------------------------|----------------------------------------------|
| **Nombre actual**              | Escuela de Ingeniería y Arquitectura (EINA) |
| **Fundación del CPS**          | 1973                                        |
| **Ubicación**                  | Campus Río Ebro, Zaragoza, España           |
| **Universidad**                | Universidad de Zaragoza (UNIZAR)            |
| **Áreas de estudio principales** | Ingeniería, Arquitectura, Tecnologías      |

---

## Grados y Másteres Ofrecidos

El EINA ofrece una amplia gama de programas académicos que abarcan desde titulaciones de grado hasta másteres especializados.

| **Grados**                                       | **Másteres**                                   |
|-------------------------------------------------|-----------------------------------------------|
| Ingeniería Mecánica                             | Ingeniería Industrial                         |
| Ingeniería Electrónica y Automática            | Ingeniería de Telecomunicación               |
| Ingeniería Informática                         | Ingeniería Informática                        |
| Ingeniería Eléctrica                           | Energías Renovables y Eficiencia Energética  |
| Ingeniería de Tecnologías Industriales         | Arquitectura                                  |
| Arquitectura                                   | Robótica, Gráficos Computacionales y CAD     |

---

## Instalaciones y Recursos

El EINA cuenta con modernas instalaciones para garantizar la calidad de la enseñanza y la investigación.

| **Instalación/Recurso**       | **Descripción**                                        |
|-------------------------------|-------------------------------------------------------|
| **Aulas de docencia**         | Espacios equipados con tecnología audiovisual avanzada.|
| **Laboratorios especializados** | Laboratorios de robótica, electrónica y más.         |
| **Biblioteca Hypatia**        | Acceso a miles de libros, revistas y bases de datos.  |
| **Salas de estudio**          | Espacios para trabajo en grupo y estudio individual.  |
| **FabLab**                    | Laboratorio de fabricación para proyectos innovadores.|

---

## Investigación

El EINA es reconocido por su contribución a la investigación técnica y científica en diversas áreas.

| **Área de Investigación**      | **Descripción**                                      |
|--------------------------------|-----------------------------------------------------|
| **Inteligencia Artificial**    | Desarrollo de algoritmos avanzados y aprendizaje automático. |
| **Energías Renovables**        | Estudios sobre sostenibilidad y eficiencia energética. |
| **Ingeniería Biomédica**       | Soluciones tecnológicas para la salud.              |
| **Robótica y Automatización**  | Innovaciones en robótica industrial y colaborativa. |
| **Tecnologías de la Información** | Avances en telecomunicaciones y redes.           |

---

## Eventos y Actividades

El EINA organiza y participa en eventos que fomentan la formación integral de sus estudiantes.

| **Evento/Actividad**         | **Descripción**                                      |
|-------------------------------|-----------------------------------------------------|
| **Feria de empresas (EmpleaEINA)** | Encuentro entre estudiantes y empresas.          |
| **Jornadas de puertas abiertas** | Orientación para futuros estudiantes.             |
| **Concursos de robótica**    | Promoción de proyectos innovadores en robótica.      |
| **Charlas y seminarios**     | Conferencias con expertos nacionales e internacionales. |
| **Talleres de habilidades**  | Formación en comunicación, liderazgo y trabajo en equipo.|

---

## Localización

El EINA está situado en el **Campus Río Ebro**, al norte de Zaragoza. Este campus es conocido por su ambiente tecnológico y moderno.

| **Detalle**                | **Información**                                     |
|----------------------------|----------------------------------------------------|
| **Dirección**              | Calle María de Luna, 3, 50018 Zaragoza, España     |
| **Transporte público cercano** | Líneas de autobús urbano y tranvía.              |
| **Otros servicios del campus** | Comedores, áreas deportivas y zonas verdes.     |

---

## Curiosidades

- **Origen del CPS**: El CPS fue creado en 1973 para cubrir la demanda de ingenieros en Aragón.
- **Integración como EINA**: En 2010, el CPS se convirtió en la EINA tras la incorporación de Arquitectura y otros programas.
- **Proyección internacional**: El EINA participa en programas de movilidad como **Erasmus** y convenios con universidades de todo el mundo.
- **Premios y distinciones**: Sus estudiantes han sido galardonados en múltiples competiciones nacionales e internacionales.

---

## Enlaces de Interés

| **Recurso**                 | **Enlace**                                           |
|-----------------------------|-----------------------------------------------------|
| **Sitio web oficial de la EINA** | [eina.unizar.es](https://eina.unizar.es)          |
| **Universidad de Zaragoza** | [unizar.es](https://www.unizar.es)                  |
| **Campus Virtual de Unizar** | [moodle.unizar.es](https://moodle.unizar.es)        |

---

La Escuela de Ingeniería y Arquitectura de la Universidad de Zaragoza es un referente en formación técnica y un motor de innovación en la región de Aragón. ¡Una excelente elección para quienes desean formarse en el ámbito tecnológico y científico!

','2025-01-07 00:08:07.306','841723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 (2,'CPS','Centro Politecnico Superior de Zaragoza','# CPS, UNIZAR y EINA: Ingeniería y Arquitectura en Zaragoza

El **Centro Politécnico Superior también llamado (CPS)**, actualmente integrado como la **Escuela de Ingeniería y Arquitectura también llamada (EINA)**, es una de las instituciones académicas más destacadas de la Universidad de Zaragoza (UNIZAR). Se especializa en la formación de ingenieros, arquitectos y profesionales altamente cualificados en diversas ramas técnicas.

---

## Información General

| **Característica**             | **Detalle**                                  |
|--------------------------------|----------------------------------------------|
| **Nombre actual**              | Escuela de Ingeniería y Arquitectura (EINA) |
| **Fundación del CPS**          | 1973                                        |
| **Ubicación**                  | Campus Río Ebro, Zaragoza, España           |
| **Universidad**                | Universidad de Zaragoza (UNIZAR)            |
| **Áreas de estudio principales** | Ingeniería, Arquitectura, Tecnologías      |

---

## Grados y Másteres Ofrecidos

El EINA ofrece una amplia gama de programas académicos que abarcan desde titulaciones de grado hasta másteres especializados.

| **Grados**                                       | **Másteres**                                   |
|-------------------------------------------------|-----------------------------------------------|
| Ingeniería Mecánica                             | Ingeniería Industrial                         |
| Ingeniería Electrónica y Automática            | Ingeniería de Telecomunicación               |
| Ingeniería Informática                         | Ingeniería Informática                        |
| Ingeniería Eléctrica                           | Energías Renovables y Eficiencia Energética  |
| Ingeniería de Tecnologías Industriales         | Arquitectura                                  |
| Arquitectura                                   | Robótica, Gráficos Computacionales y CAD     |

---

## Instalaciones y Recursos

El EINA cuenta con modernas instalaciones para garantizar la calidad de la enseñanza y la investigación.

| **Instalación/Recurso**       | **Descripción**                                        |
|-------------------------------|-------------------------------------------------------|
| **Aulas de docencia**         | Espacios equipados con tecnología audiovisual avanzada.|
| **Laboratorios especializados** | Laboratorios de robótica, electrónica y más.         |
| **Biblioteca Hypatia**        | Acceso a miles de libros, revistas y bases de datos.  |
| **Salas de estudio**          | Espacios para trabajo en grupo y estudio individual.  |
| **FabLab**                    | Laboratorio de fabricación para proyectos innovadores.|

---

## Investigación

El EINA es reconocido por su contribución a la investigación técnica y científica en diversas áreas.

| **Área de Investigación**      | **Descripción**                                      |
|--------------------------------|-----------------------------------------------------|
| **Inteligencia Artificial**    | Desarrollo de algoritmos avanzados y aprendizaje automático. |
| **Energías Renovables**        | Estudios sobre sostenibilidad y eficiencia energética. |
| **Ingeniería Biomédica**       | Soluciones tecnológicas para la salud.              |
| **Robótica y Automatización**  | Innovaciones en robótica industrial y colaborativa. |
| **Tecnologías de la Información** | Avances en telecomunicaciones y redes.           |

---

## Eventos y Actividades

El EINA organiza y participa en eventos que fomentan la formación integral de sus estudiantes.

| **Evento/Actividad**         | **Descripción**                                      |
|-------------------------------|-----------------------------------------------------|
| **Feria de empresas (EmpleaEINA)** | Encuentro entre estudiantes y empresas.          |
| **Jornadas de puertas abiertas** | Orientación para futuros estudiantes.             |
| **Concursos de robótica**    | Promoción de proyectos innovadores en robótica.      |
| **Charlas y seminarios**     | Conferencias con expertos nacionales e internacionales. |
| **Talleres de habilidades**  | Formación en comunicación, liderazgo y trabajo en equipo.|

---

## Localización

El EINA está situado en el **Campus Río Ebro**, al norte de Zaragoza. Este campus es conocido por su ambiente tecnológico y moderno.

| **Detalle**                | **Información**                                     |
|----------------------------|----------------------------------------------------|
| **Dirección**              | Calle María de Luna, 3, 50018 Zaragoza, España     |
| **Transporte público cercano** | Líneas de autobús urbano y tranvía.              |
| **Otros servicios del campus** | Comedores, áreas deportivas y zonas verdes.     |

---

## Curiosidades

- **Origen del CPS**: El CPS fue creado en 1973 para cubrir la demanda de ingenieros en Aragón.
- **Integración como EINA**: En 2010, el CPS se convirtió en la EINA tras la incorporación de Arquitectura y otros programas.
- **Proyección internacional**: El EINA participa en programas de movilidad como **Erasmus** y convenios con universidades de todo el mundo.
- **Premios y distinciones**: Sus estudiantes han sido galardonados en múltiples competiciones nacionales e internacionales.

---

## Enlaces de Interés

| **Recurso**                 | **Enlace**                                           |
|-----------------------------|-----------------------------------------------------|
| **Sitio web oficial de la EINA** | [eina.unizar.es](https://eina.unizar.es)          |
| **Universidad de Zaragoza** | [unizar.es](https://www.unizar.es)                  |
| **Campus Virtual de Unizar** | [moodle.unizar.es](https://moodle.unizar.es)        |

---

La Escuela de Ingeniería y Arquitectura de la Universidad de Zaragoza es un referente en formación técnica y un motor de innovación en la región de Aragón. ¡Una excelente elección para quienes desean formarse en el ámbito tecnológico y científico!

','2025-01-07 17:02:06.01','841723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 (3,'Zaragoza','Capital de Aragón','# Zaragoza: Una Ciudad con Historia y Modernidad

Zaragoza, capital de la comunidad autónoma aragonesa, es una ciudad española conocida por su rica historia, su impresionante arquitectura y su ubicación estratégica entre Madrid y Barcelona.

---

## Información General

| **Característica**     | **Detalle**                        |
|-------------------------|------------------------------------|
| **País**               | España                            |
| **Comunidad Autónoma** | Aragón                            |
| **Población**          | ~700,000 habitantes (2021)        |
| **Río Principal**      | Ebro                              |
| **Gentilicio**         | Zaragozano/a                      |
| **Altitud**            | 199 metros sobre el nivel del mar |

---

## Lugares de Interés

### 1. **Basílica del Pilar**
Uno de los monumentos más emblemáticos de España, situado junto al río Ebro. Este templo barroco es un importante lugar de peregrinación cristiana.

### 2. **La Aljafería**
Un palacio islámico del siglo XI que actualmente es sede de las Cortes de Aragón.

### 3. **Puente de Piedra**
Un puente histórico que cruza el río Ebro y ofrece unas vistas magníficas de la Basílica del Pilar.

---

## Gastronomía

Zaragoza es famosa por su gastronomía tradicional, que combina ingredientes locales y sabores únicos.

| **Plato Típico**         | **Descripción**                                          |
|---------------------------|----------------------------------------------------------|
| **Ternasco de Aragón**    | Cordero asado o guisado, considerado un manjar local.    |
| **Bacalao al Ajoarriero** | Bacalao cocinado con ajo, aceite, y pimientos.           |
| **Migas Aragonesas**      | Trozos de pan frito con chorizo, huevo y uvas.           |
| **Melocotón con Vino**    | Postre típico de melocotones marinados en vino tinto.    |

---

## Eventos y Fiestas

### Fiestas del Pilar
Se celebran en octubre en honor a la Virgen del Pilar, la patrona de Zaragoza. Incluyen procesiones, conciertos, y espectáculos de fuegos artificiales.

| **Evento**                 | **Fecha**           | **Descripción**                                  |
|----------------------------|---------------------|-------------------------------------------------|
| **Ofrenda de Flores**      | 12 de octubre       | Miles de personas ofrecen flores a la Virgen.   |
| **Romería de la Virgen**   | 13 de octubre       | Peregrinación por la ciudad.                    |
| **Gigantes y Cabezudos**   | Durante las fiestas | Desfile de figuras gigantes y cabezudas.        |

---

## Clima

Zaragoza tiene un clima semiárido, caracterizado por inviernos fríos y veranos calurosos.

| **Estación** | **Temperatura Media (°C)** | **Precipitaciones (mm)** |
|--------------|-----------------------------|--------------------------|
| **Invierno** | 5-10                        | ~30                     |
| **Verano**   | 25-35                       | ~15                     |

---

## Curiosidades

- Zaragoza es conocida como la "Ciudad del Viento" debido al fuerte cierzo, un viento característico de la región.
- Es el punto medio entre Madrid y Barcelona, a unas 1:30 horas en tren de alta velocidad (AVE).
- La Expo 2008 se celebró en Zaragoza, destacando el tema del agua y el desarrollo sostenible.

---

## Imágenes Destacadas

![Basílica del Pilar](https://upload.wikimedia.org/wikipedia/commons/0/0f/Zaragoza_-_Bas%C3%ADlica_del_Pilar_y_r%C3%ADo_Ebro.jpg)  
*Fuente: Wikimedia Commons*

---

## Cómo Llegar

| **Modo de Transporte** | **Duración**            | **Comentario**                               |
|-------------------------|-------------------------|---------------------------------------------|
| **Tren (AVE)**          | 1:30 desde Madrid/Barcelona | Alta velocidad, rápido y cómodo.          |
| **Avión**               | Aeropuerto de Zaragoza | Conexiones nacionales e internacionales.    |
| **Coche**               | 3 horas desde Madrid    | Buena red de carreteras.                   |

---

¡Zaragoza es un destino ideal para quienes buscan historia, cultura, y gastronomía en un entorno acogedor!

','2025-01-07 17:14:08.351','841723@unizar.es','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 (3,'CPS','Centro Politecnico Superior de Zaragoza','# CPS, UNIZAR y EINA: Ingeniería y Arquitectura de Zaragoza

El **Centro Politécnico Superior también llamado (CPS)**, actualmente integrado como la **Escuela de Ingeniería y Arquitectura también llamada (EINA)**, es una de las instituciones académicas más destacadas de la Universidad de Zaragoza (UNIZAR). Se especializa en la formación de ingenieros, arquitectos y profesionales altamente cualificados en diversas ramas técnicas.

---

## Información General

| **Característica**             | **Detalle**                                  |
|--------------------------------|----------------------------------------------|
| **Nombre actual**              | Escuela de Ingeniería y Arquitectura (EINA) |
| **Fundación del CPS**          | 1973                                        |
| **Ubicación**                  | Campus Río Ebro, Zaragoza, España           |
| **Universidad**                | Universidad de Zaragoza (UNIZAR)            |
| **Áreas de estudio principales** | Ingeniería, Arquitectura, Tecnologías      |

---

## Grados y Másteres Ofrecidos

El EINA ofrece una amplia gama de programas académicos que abarcan desde titulaciones de grado hasta másteres especializados.

| **Grados**                                       | **Másteres**                                   |
|-------------------------------------------------|-----------------------------------------------|
| Ingeniería Mecánica                             | Ingeniería Industrial                         |
| Ingeniería Electrónica y Automática            | Ingeniería de Telecomunicación               |
| Ingeniería Informática                         | Ingeniería Informática                        |
| Ingeniería Eléctrica                           | Energías Renovables y Eficiencia Energética  |
| Ingeniería de Tecnologías Industriales         | Arquitectura                                  |
| Arquitectura                                   | Robótica, Gráficos Computacionales y CAD     |

---

## Instalaciones y Recursos

El EINA cuenta con modernas instalaciones para garantizar la calidad de la enseñanza y la investigación.

| **Instalación/Recurso**       | **Descripción**                                        |
|-------------------------------|-------------------------------------------------------|
| **Aulas de docencia**         | Espacios equipados con tecnología audiovisual avanzada.|
| **Laboratorios especializados** | Laboratorios de robótica, electrónica y más.         |
| **Biblioteca Hypatia**        | Acceso a miles de libros, revistas y bases de datos.  |
| **Salas de estudio**          | Espacios para trabajo en grupo y estudio individual.  |
| **FabLab**                    | Laboratorio de fabricación para proyectos innovadores.|

---

## Investigación

El EINA es reconocido por su contribución a la investigación técnica y científica en diversas áreas.

| **Área de Investigación**      | **Descripción**                                      |
|--------------------------------|-----------------------------------------------------|
| **Inteligencia Artificial**    | Desarrollo de algoritmos avanzados y aprendizaje automático. |
| **Energías Renovables**        | Estudios sobre sostenibilidad y eficiencia energética. |
| **Ingeniería Biomédica**       | Soluciones tecnológicas para la salud.              |
| **Robótica y Automatización**  | Innovaciones en robótica industrial y colaborativa. |
| **Tecnologías de la Información** | Avances en telecomunicaciones y redes.           |

---

## Eventos y Actividades

El EINA organiza y participa en eventos que fomentan la formación integral de sus estudiantes.

| **Evento/Actividad**         | **Descripción**                                      |
|-------------------------------|-----------------------------------------------------|
| **Feria de empresas (EmpleaEINA)** | Encuentro entre estudiantes y empresas.          |
| **Jornadas de puertas abiertas** | Orientación para futuros estudiantes.             |
| **Concursos de robótica**    | Promoción de proyectos innovadores en robótica.      |
| **Charlas y seminarios**     | Conferencias con expertos nacionales e internacionales. |
| **Talleres de habilidades**  | Formación en comunicación, liderazgo y trabajo en equipo.|

---

## Localización

El EINA está situado en el **Campus Río Ebro**, al norte de Zaragoza. Este campus es conocido por su ambiente tecnológico y moderno.

| **Detalle**                | **Información**                                     |
|----------------------------|----------------------------------------------------|
| **Dirección**              | Calle María de Luna, 3, 50018 Zaragoza, España     |
| **Transporte público cercano** | Líneas de autobús urbano y tranvía.              |
| **Otros servicios del campus** | Comedores, áreas deportivas y zonas verdes.     |

---

## Curiosidades

- **Origen del CPS**: El CPS fue creado en 1973 para cubrir la demanda de ingenieros en Aragón.
- **Integración como EINA**: En 2010, el CPS se convirtió en la EINA tras la incorporación de Arquitectura y otros programas.
- **Proyección internacional**: El EINA participa en programas de movilidad como **Erasmus** y convenios con universidades de todo el mundo.
- **Premios y distinciones**: Sus estudiantes han sido galardonados en múltiples competiciones nacionales e internacionales.

---

## Enlaces de Interés

| **Recurso**                 | **Enlace**                                           |
|-----------------------------|-----------------------------------------------------|
| **Sitio web oficial de la EINA** | [eina.unizar.es](https://eina.unizar.es)          |
| **Universidad de Zaragoza** | [unizar.es](https://www.unizar.es)                  |
| **Campus Virtual de Unizar** | [moodle.unizar.es](https://moodle.unizar.es)        |

---

La Escuela de Ingeniería y Arquitectura de la Universidad de Zaragoza es un referente en formación técnica y un motor de innovación en la región de Aragón. ¡Una excelente elección para quienes desean formarse en el ámbito tecnológico y científico!

','2025-01-07 17:16:16.404','841723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 (4,'Zaragoza','Capital de Aragón','# Zaragoza: Una Ciudad con Historia y Modernidad

Zaragoza, capital de la comunidad autónoma de Aragón, es una ciudad española conocida por su rica historia, su impresionante arquitectura y su ubicación estratégica entre Madrid y Barcelona.

---

## Información General

| **Característica**     | **Detalle**                        |
|-------------------------|------------------------------------|
| **País**               | España                            |
| **Comunidad Autónoma** | Aragón                            |
| **Población**          | ~700,000 habitantes (2021)        |
| **Río Principal**      | Ebro                              |
| **Gentilicio**         | Zaragozano/a                      |
| **Altitud**            | 199 metros sobre el nivel del mar |

---

## Lugares de Interés

### 1. **Basílica del Pilar**
Uno de los monumentos más emblemáticos de España, situado junto al río Ebro. Este templo barroco es un importante lugar de peregrinación cristiana.

### 2. **La Aljafería**
Un palacio islámico del siglo XI que actualmente es sede de las Cortes de Aragón.

### 3. **Puente de Piedra**
Un puente histórico que cruza el río Ebro y ofrece unas vistas magníficas de la Basílica del Pilar.

---

## Gastronomía

Zaragoza es famosa por su gastronomía tradicional, que combina ingredientes locales y sabores únicos.

| **Plato Típico**         | **Descripción**                                          |
|---------------------------|----------------------------------------------------------|
| **Ternasco de Aragón**    | Cordero asado o guisado, considerado un manjar local.    |
| **Bacalao al Ajoarriero** | Bacalao cocinado con ajo, aceite, y pimientos.           |
| **Migas Aragonesas**      | Trozos de pan frito con chorizo, huevo y uvas.           |
| **Melocotón con Vino**    | Postre típico de melocotones marinados en vino tinto.    |

---

## Eventos y Fiestas

### Fiestas del Pilar
Se celebran en octubre en honor a la Virgen del Pilar, la patrona de Zaragoza. Incluyen procesiones, conciertos, y espectáculos de fuegos artificiales.

| **Evento**                 | **Fecha**           | **Descripción**                                  |
|----------------------------|---------------------|-------------------------------------------------|
| **Ofrenda de Flores**      | 12 de octubre       | Miles de personas ofrecen flores a la Virgen.   |
| **Romería de la Virgen**   | 13 de octubre       | Peregrinación por la ciudad.                    |
| **Gigantes y Cabezudos**   | Durante las fiestas | Desfile de figuras gigantes y cabezudas.        |

---

## Clima

Zaragoza tiene un clima semiárido, caracterizado por inviernos fríos y veranos calurosos.

| **Estación** | **Temperatura Media (°C)** | **Precipitaciones (mm)** |
|--------------|-----------------------------|--------------------------|
| **Invierno** | 5-10                        | ~30                     |
| **Verano**   | 25-35                       | ~15                     |

---

## Curiosidades

- Zaragoza es conocida como la "Ciudad del Viento" debido al fuerte cierzo, un viento característico de la región.
- Es el punto medio entre Madrid y Barcelona, a unas 1:30 horas en tren de alta velocidad (AVE).
- La Expo 2008 se celebró en Zaragoza, destacando el tema del agua y el desarrollo sostenible.

---

## Imágenes Destacadas

![Basílica del Pilar](https://upload.wikimedia.org/wikipedia/commons/0/0f/Zaragoza_-_Bas%C3%ADlica_del_Pilar_y_r%C3%ADo_Ebro.jpg)  
*Fuente: Wikimedia Commons*

---

## Cómo Llegar

| **Modo de Transporte** | **Duración**            | **Comentario**                               |
|-------------------------|-------------------------|---------------------------------------------|
| **Tren (AVE)**          | 1:30 desde Madrid/Barcelona | Alta velocidad, rápido y cómodo.          |
| **Avión**               | Aeropuerto de Zaragoza | Conexiones nacionales e internacionales.    |
| **Coche**               | 3 horas desde Madrid    | Buena red de carreteras.                   |

---

¡Zaragoza es un destino ideal para quienes buscan historia, cultura, y gastronomía en un entorno acogedor!

','2025-01-07 17:22:47.12','841723@unizar.es','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 (5,'Zaragoza','Capital de Aragón','# Zaragoza: Una Ciudad con mucha Historia y Modernidad

Zaragoza, capital de la comunidad autónoma de Aragón, es una ciudad española conocida por su rica historia, su impresionante arquitectura y su ubicación estratégica entre Madrid y Barcelona.

---

## Información General

| **Característica**     | **Detalle**                        |
|-------------------------|------------------------------------|
| **País**               | España                            |
| **Comunidad Autónoma** | Aragón                            |
| **Población**          | ~700,000 habitantes (2021)        |
| **Río Principal**      | Ebro                              |
| **Gentilicio**         | Zaragozano/a                      |
| **Altitud**            | 199 metros sobre el nivel del mar |

---

## Lugares de Interés

### 1. **Basílica del Pilar**
Uno de los monumentos más emblemáticos de España, situado junto al río Ebro. Este templo barroco es un importante lugar de peregrinación cristiana.

### 2. **La Aljafería**
Un palacio islámico del siglo XI que actualmente es sede de las Cortes de Aragón.

### 3. **Puente de Piedra**
Un puente histórico que cruza el río Ebro y ofrece unas vistas magníficas de la Basílica del Pilar.

---

## Gastronomía

Zaragoza es famosa por su gastronomía tradicional, que combina ingredientes locales y sabores únicos.

| **Plato Típico**         | **Descripción**                                          |
|---------------------------|----------------------------------------------------------|
| **Ternasco de Aragón**    | Cordero asado o guisado, considerado un manjar local.    |
| **Bacalao al Ajoarriero** | Bacalao cocinado con ajo, aceite, y pimientos.           |
| **Migas Aragonesas**      | Trozos de pan frito con chorizo, huevo y uvas.           |
| **Melocotón con Vino**    | Postre típico de melocotones marinados en vino tinto.    |

---

## Eventos y Fiestas

### Fiestas del Pilar
Se celebran en octubre en honor a la Virgen del Pilar, la patrona de Zaragoza. Incluyen procesiones, conciertos, y espectáculos de fuegos artificiales.

| **Evento**                 | **Fecha**           | **Descripción**                                  |
|----------------------------|---------------------|-------------------------------------------------|
| **Ofrenda de Flores**      | 12 de octubre       | Miles de personas ofrecen flores a la Virgen.   |
| **Romería de la Virgen**   | 13 de octubre       | Peregrinación por la ciudad.                    |
| **Gigantes y Cabezudos**   | Durante las fiestas | Desfile de figuras gigantes y cabezudas.        |

---

## Clima

Zaragoza tiene un clima semiárido, caracterizado por inviernos fríos y veranos calurosos.

| **Estación** | **Temperatura Media (°C)** | **Precipitaciones (mm)** |
|--------------|-----------------------------|--------------------------|
| **Invierno** | 5-10                        | ~30                     |
| **Verano**   | 25-35                       | ~15                     |

---

## Curiosidades

- Zaragoza es conocida como la "Ciudad del Viento" debido al fuerte cierzo, un viento característico de la región.
- Es el punto medio entre Madrid y Barcelona, a unas 1:30 horas en tren de alta velocidad (AVE).
- La Expo 2008 se celebró en Zaragoza, destacando el tema del agua y el desarrollo sostenible.

---

## Imágenes Destacadas

![Basílica del Pilar](https://upload.wikimedia.org/wikipedia/commons/0/0f/Zaragoza_-_Bas%C3%ADlica_del_Pilar_y_r%C3%ADo_Ebro.jpg)  
*Fuente: Wikimedia Commons*

---

## Cómo Llegar

| **Modo de Transporte** | **Duración**            | **Comentario**                               |
|-------------------------|-------------------------|---------------------------------------------|
| **Tren (AVE)**          | 1:30 desde Madrid/Barcelona | Alta velocidad, rápido y cómodo.          |
| **Avión**               | Aeropuerto de Zaragoza | Conexiones nacionales e internacionales.    |
| **Coche**               | 3 horas desde Madrid    | Buena red de carreteras.                   |

---

¡Zaragoza es un destino ideal para quienes buscan historia, cultura, y gastronomía en un entorno acogedor!

','2025-01-07 17:29:19.91','diegoraulroldan@gmail.com','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 (1,'Pirineos','Los Pirineos: Naturaleza en su Máxima Expresión','# Los Pirineos: Naturaleza en su Máxima Expresión

Los Pirineos son una majestuosa cadena montañosa que se extiende a lo largo de aproximadamente 430 kilómetros entre España, Francia y Andorra. Son el hogar de paisajes espectaculares, una rica biodiversidad y tradiciones culturales únicas.

---

## Información General

| **Característica**       | **Detalle**                            |
|---------------------------|----------------------------------------|
| **Ubicación**            | Entre España, Francia y Andorra        |
| **Pico más alto**        | Aneto (3,404 metros)                   |
| **Extensión**            | ~430 km                                |
| **Formación Geológica**  | Era Paleozoica (~300 millones de años) |
| **Ecosistema principal** | Alpino y subalpino                     |

---

## Principales Picos de los Pirineos

| **Pico**              | **Altura (m)** | **Ubicación**            |
|------------------------|----------------|--------------------------|
| **Aneto**             | 3,404          | España                   |
| **Posets**            | 3,375          | España                   |
| **Monte Perdido**     | 3,355          | España                   |
| **Vignemale**         | 3,298          | Francia/España           |
| **La Maladeta**       | 3,312          | España                   |

---

## Parques Naturales y Nacionales

Los Pirineos albergan numerosos espacios protegidos que conservan su biodiversidad y su belleza natural.

| **Parque**                        | **Ubicación**          | **Descripción**                            |
|-----------------------------------|------------------------|--------------------------------------------|
| **Parque Nacional de Ordesa y Monte Perdido** | Aragón (España)       | Patrimonio de la Humanidad por la UNESCO. |
| **Parque Nacional de los Pirineos**          | Francia               | Amplias áreas de glaciares y lagos.       |
| **Parque Natural de Aigüestortes i Estany de Sant Maurici** | Cataluña (España) | Lagos de alta montaña y picos escarpados. |
| **Parque Natural de Alt Pirineu**           | Cataluña (España)     | El parque más grande de Cataluña.         |

---

## Actividades al Aire Libre

Los Pirineos son un destino perfecto para los amantes de la naturaleza y los deportes al aire libre.

| **Actividad**           | **Descripción**                                    |
|--------------------------|--------------------------------------------------|
| **Senderismo**          | Rutas como el GR-11 o el Camino de Santiago.      |
| **Esquí**               | Estaciones como Baqueira-Beret y Formigal.        |
| **Escalada**            | Paredes y picos desafiantes como los Mallos de Riglos. |
| **Rafting**             | Descenso de ríos como el Gállego o el Noguera Pallaresa. |
| **Observación de fauna**| Ver osos pardos, buitres y quebrantahuesos.       |

---

## Gastronomía

La región pirenaica ofrece platos típicos basados en ingredientes locales como quesos, carnes y setas.

| **Plato Típico**            | **Descripción**                                      |
|------------------------------|----------------------------------------------------|
| **Civet de Jabalí**          | Guiso de carne de jabalí con vino tinto.           |
| **Trucha Pirenaica**         | Pescado fresco de los ríos de la región.           |
| **Quesos Artesanales**       | Como el queso de Roncal o el Mató de Cataluña.     |
| **Garbure**                  | Sopa tradicional del lado francés con col y jamón. |
| **Chuletón de Ternera**      | Carne de vacuno cocinada a la parrilla.            |

---

## Clima

El clima de los Pirineos varía dependiendo de la altitud y la ubicación.

| **Zona**                  | **Clima**                 | **Características**                         |
|---------------------------|---------------------------|---------------------------------------------|
| **Zona baja (valles)**    | Mediterráneo/Atlántico    | Veranos cálidos e inviernos suaves.         |
| **Zona media**            | Continental              | Nieve en invierno, temperaturas frescas.    |
| **Zona alta**             | Alpino                   | Frío extremo, nevadas frecuentes.           |

---

## Cultura y Tradiciones

Los Pirineos son una región rica en folclore, con tradiciones que han perdurado durante siglos.

| **Evento/Tradición**         | **Ubicación**        | **Descripción**                            |
|-------------------------------|----------------------|--------------------------------------------|
| **Fallas del Pirineo**        | Aragón y Cataluña    | Descenso nocturno con antorchas en verano. |
| **Carnaval de Bielsa**        | Aragón              | Fiesta con personajes tradicionales.       |
| **Danza de San Juan**         | País Vasco          | Celebración del solsticio de verano.       |

---

## Curiosidades

- **Lagos glaciares**: Los Pirineos tienen más de 2,500 lagos de origen glaciar, como el Lago de San Mauricio.
- **Franja cultural**: Separan dos culturas principales, la española y la francesa, pero también tienen tradiciones únicas como el idioma aragonés o el gascón.
- **Osos pardos**: Aunque estuvieron casi extintos, hoy vuelven a habitar los Pirineos gracias a programas de reintroducción.

---

## Cómo Llegar

| **Modo de Transporte**      | **Comentario**                                         |
|-----------------------------|-------------------------------------------------------|
| **Coche**                   | Carreteras como la N-260 conectan los principales valles. |
| **Tren**                    | Líneas como la de Zaragoza-Canfranc.                  |
| **Avión**                   | Aeropuertos cercanos en Zaragoza, Barcelona y Toulouse. |

---

Los Pirineos ofrecen una experiencia única donde se combinan la majestuosidad de sus paisajes y la riqueza cultural. ¡Un lugar perfecto para explorar y disfrutar de la naturaleza en su máxima expresión!

','2025-01-07 17:32:24.381','diegoraulroldan@gmail.com','MHq90v59SVFBkHknOaRaq3XokeU='),
	 (2,'Pirineos','Los Pirineos: Naturaleza en su Máxima Expresión y tanto que si maximmo son chulisimosssss','# Los Pirineos: Naturaleza en su Máxima Expresión

Los Pirineos son una majestuosa cadena montañosa que se extiende a lo largo de aproximadamente 430 kilómetros entre España, Francia y Andorra. Son el hogar de paisajes espectaculares, una rica biodiversidad y tradiciones culturales únicas.

---

## Información General

| **Característica**       | **Detalle**                            |
|---------------------------|----------------------------------------|
| **Ubicación**            | Entre España, Francia y Andorra        |
| **Pico más alto**        | Aneto (3,404 metros)                   |
| **Extensión**            | ~430 km                                |
| **Formación Geológica**  | Era Paleozoica (~300 millones de años) |
| **Ecosistema principal** | Alpino y subalpino                     |

---

## Principales Picos de los Pirineos

| **Pico**              | **Altura (m)** | **Ubicación**            |
|------------------------|----------------|--------------------------|
| **Aneto**             | 3,404          | España                   |
| **Posets**            | 3,375          | España                   |
| **Monte Perdido**     | 3,355          | España                   |
| **Vignemale**         | 3,298          | Francia/España           |
| **La Maladeta**       | 3,312          | España                   |

---

## Parques Naturales y Nacionales

Los Pirineos albergan numerosos espacios protegidos que conservan su biodiversidad y su belleza natural.

| **Parque**                        | **Ubicación**          | **Descripción**                            |
|-----------------------------------|------------------------|--------------------------------------------|
| **Parque Nacional de Ordesa y Monte Perdido** | Aragón (España)       | Patrimonio de la Humanidad por la UNESCO. |
| **Parque Nacional de los Pirineos**          | Francia               | Amplias áreas de glaciares y lagos.       |
| **Parque Natural de Aigüestortes i Estany de Sant Maurici** | Cataluña (España) | Lagos de alta montaña y picos escarpados. |
| **Parque Natural de Alt Pirineu**           | Cataluña (España)     | El parque más grande de Cataluña.         |

---

## Actividades al Aire Libre

Los Pirineos son un destino perfecto para los amantes de la naturaleza y los deportes al aire libre.

| **Actividad**           | **Descripción**                                    |
|--------------------------|--------------------------------------------------|
| **Senderismo**          | Rutas como el GR-11 o el Camino de Santiago.      |
| **Esquí**               | Estaciones como Baqueira-Beret y Formigal.        |
| **Escalada**            | Paredes y picos desafiantes como los Mallos de Riglos. |
| **Rafting**             | Descenso de ríos como el Gállego o el Noguera Pallaresa. |
| **Observación de fauna**| Ver osos pardos, buitres y quebrantahuesos.       |

---

## Gastronomía

La región pirenaica ofrece platos típicos basados en ingredientes locales como quesos, carnes y setas.

| **Plato Típico**            | **Descripción**                                      |
|------------------------------|----------------------------------------------------|
| **Civet de Jabalí**          | Guiso de carne de jabalí con vino tinto.           |
| **Trucha Pirenaica**         | Pescado fresco de los ríos de la región.           |
| **Quesos Artesanales**       | Como el queso de Roncal o el Mató de Cataluña.     |
| **Garbure**                  | Sopa tradicional del lado francés con col y jamón. |
| **Chuletón de Ternera**      | Carne de vacuno cocinada a la parrilla.            |

---

## Clima

El clima de los Pirineos varía dependiendo de la altitud y la ubicación.

| **Zona**                  | **Clima**                 | **Características**                         |
|---------------------------|---------------------------|---------------------------------------------|
| **Zona baja (valles)**    | Mediterráneo/Atlántico    | Veranos cálidos e inviernos suaves.         |
| **Zona media**            | Continental              | Nieve en invierno, temperaturas frescas.    |
| **Zona alta**             | Alpino                   | Frío extremo, nevadas frecuentes.           |

---

## Cultura y Tradiciones

Los Pirineos son una región rica en folclore, con tradiciones que han perdurado durante siglos.

| **Evento/Tradición**         | **Ubicación**        | **Descripción**                            |
|-------------------------------|----------------------|--------------------------------------------|
| **Fallas del Pirineo**        | Aragón y Cataluña    | Descenso nocturno con antorchas en verano. |
| **Carnaval de Bielsa**        | Aragón              | Fiesta con personajes tradicionales.       |
| **Danza de San Juan**         | País Vasco          | Celebración del solsticio de verano.       |

---

## Curiosidades

- **Lagos glaciares**: Los Pirineos tienen más de 2,500 lagos de origen glaciar, como el Lago de San Mauricio.
- **Franja cultural**: Separan dos culturas principales, la española y la francesa, pero también tienen tradiciones únicas como el idioma aragonés o el gascón.
- **Osos pardos**: Aunque estuvieron casi extintos, hoy vuelven a habitar los Pirineos gracias a programas de reintroducción.

---

## Cómo Llegar

| **Modo de Transporte**      | **Comentario**                                         |
|-----------------------------|-------------------------------------------------------|
| **Coche**                   | Carreteras como la N-260 conectan los principales valles. |
| **Tren**                    | Líneas como la de Zaragoza-Canfranc.                  |
| **Avión**                   | Aeropuertos cercanos en Zaragoza, Barcelona y Toulouse. |

---

Los Pirineos ofrecen una experiencia única donde se combinan la majestuosidad de sus paisajes y la riqueza cultural. ¡Un lugar perfecto para explorar y disfrutar de la naturaleza en su máxima expresión!

','2025-01-07 18:58:58.626','841723@unizar.es','MHq90v59SVFBkHknOaRaq3XokeU=');


INSERT INTO tfg.likes (email,hash) VALUES
	 ('841723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 ('741723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 ('641723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 ('541723@unizar.es','4W2pF8ErT0Utxp5HLU4rikyKgVA='),
	 ('841723@unizar.es','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 ('diegoraulroldan@gmail.com','TlDy5lMOz4sRH-Ulfvj28eveDFs='),
	 ('diegoraulroldan@gmail.com','MHq90v59SVFBkHknOaRaq3XokeU=');
