# Patatines Moda Infantil — Web demo

## Estado

- [x] Carpeta del proyecto creada.
- [x] Documento de progreso creado.
- [x] Investigación de marca y fuentes públicas.
- [x] Sistema visual y arquitectura de conversión.
- [x] Selección y optimización de recursos visuales.
- [x] Implementación interactiva y responsive.
- [x] Verificación técnica y funcional.
- [x] Publicación y URL pública.

## Objetivo

Crear una demostración de tienda online con identidad propia para Patatines Moda Infantil, con catálogo, variantes, cesta y una caja de prueba. La preview no admite pedidos ni cobros reales.

## Criterios

- Utilizar únicamente información verificable o marcar con claridad los elementos de demostración.
- No presentar precios, promociones, stock ni condiciones ficticias como reales. Los ejemplos necesarios para probar el comercio se etiquetan expresamente como simulación.
- Priorizar experiencia móvil, accesibilidad, rendimiento y conversión.

## Registro

- 2026-09-25: nueva petición: convertir la preview en tienda online con catálogo, variantes, carrito y checkout simulado; comparar Shopify/POS, GHL y desarrollo propio y preparar presupuesto orientativo. Se conservan identidad colorida y personajes animados. No se contratan plataformas ni se activan cobros.
- 2026-09-25: Instagram revisado directamente; marcas, prendas y tallas de publicaciones identificadas. Web oficial redirige a un acceso sin catálogo accesible. Precios/stock de preview serán explícitamente ficticios. Investigación comercial y presupuesto se guardan fuera del repositorio público.
- 2026-09-24: proyecto iniciado a partir del perfil público de Instagram facilitado por el usuario.
- 2026-09-24: identidad planteada como boutique infantil editorial, cálida y juguetona; se incorporan selector por edades, recomendador de regalos, contacto por WhatsApp y visita a tienda.
- 2026-09-24: fotografías públicas recientes del perfil oficial descargadas como recursos locales para evitar dependencias temporales de Instagram.
- 2026-09-24: validación responsive en 390 px y 1440 px; pruebas automatizadas de selectores, recomendador, acordeones y enlaces; Lighthouse 100 en accesibilidad, buenas prácticas y SEO.
- 2026-09-24: publicada en https://jmcabeo-ai.github.io/patatines-moda-infantil-demo/
- 2026-09-24: fondos rediseñados con bloques pastel más vivos — amarillo sol, rosa, lavanda, menta y azul cielo — para reforzar el carácter infantil sin perder la estética boutique ni la legibilidad; revisión responsive superada y Lighthouse 99/100/100/100.
- 2026-09-24: añadidos personajes vectoriales originales con saludo, parpadeo y movimiento suave, asistente flotante de tallas enlazado a WhatsApp y stickers animados en el cierre; todo respeta la preferencia de movimiento reducido y mantiene Lighthouse 99/100/100/100.
- 2026-09-24: segunda capa de motion design: gradientes vivos, parallax reactivo en personajes y cierre, profundidad en tarjetas, entradas escalonadas, confeti contextual y estela de interacción para puntero fino; validada sin regresiones y con Lighthouse 99/100/100/100.
- 2026-09-25: motion móvil reforzado tras detectar que los efectos de puntero no eran perceptibles en táctil: saludo visible en portada, fotografías flotantes, fondos más dinámicos, entradas elásticas, marcas en movimiento y asistente animado sobre la barra de contacto; validación a 390 px superada y Lighthouse 99/100/100/100.

## Fuentes consultadas

- Instagram oficial: https://www.instagram.com/patatines.moda.infantil/
- Threads oficial: https://www.threads.com/@patatines.moda.infantil
- Web oficial consultada durante la investigación: https://patatinesmodainfantil.com/
- Perfil y acciones de comercio local del Ayuntamiento de El Ejido.

## Datos verificados incorporados

- Moda infantil, accesorios y regalos; talla 00 a 13/14 años.
- Primera puesta y artículos de puericultura.
- Marcas mostradas recientemente: Mayoral, Abel & Lula, Little Dutch y Mac Ilusión.
- Avenida Príncipes de España, 92, 04700 El Ejido, Almería.
- Teléfono: +34 623 99 24 13.
- Envíos 48/72 h y gratuitos desde 60 €: dato de investigación inicial, no revalidado para la tienda actual. No se mantiene como promesa comercial de la preview; las tarifas de compra de prueba se indican como ejemplos.
- 2026-09-25: implementado catálogo con ocho productos fotografiados en su Instagram, seis categorías, filtro por marca, búsqueda y ordenación; fichas con tallas, favoritos persistentes, cesta editable, envío/recogida y compra simulada.
- 2026-09-25: incorporada caja de demostración en tpv.html. Cestas separadas y existencias compartidas mediante almacenamiento local del mismo navegador/origen; no hay backend, datáfono ni sincronización entre dispositivos.
- 2026-09-25: superadas 12 pruebas unitarias de variantes, límites, stock compartido, envío, duplicados y saneamiento. QA en navegador: compra online y caja, agotamiento de talla entre pestañas, favoritos tras recarga, búsqueda, ordenación, menú táctil y reinicio de datos. Revisados móvil de 390 px y caja a 1440 px, sin desbordamiento horizontal ni errores JS registrados.
- 2026-09-25: verificación de datos distingue producto publicado de disponibilidad actual. Se retiran promesas de envío no revalidadas; la demo muestra precios/stock ficticios y no se indexa. Propuesta comercial y fuentes ampliadas se mantienen fuera del repositorio público.
- 2026-09-25: README actualizado y grafo local de código regenerado. Versión ecommerce preparada para publicar en la misma URL de GitHub Pages; comprobación pública pendiente de despliegue.
