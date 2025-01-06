const sharp = require("sharp");

/**
 * Convierte una imagen en base64 a WebP y la guarda en la ruta especificada.
 * @param {string} base64Data - La imagen en base64.
 * @param {string} outputPath - La ruta donde guardar la imagen en formato WebP.
 * @returns {boolean} - True si la imagen se guardó correctamente, false en caso contrario.
 */
const saveBase64asWebP = (url, filePath) => {
    const base64Image = url.split(";base64,").pop();
    const buffer = Buffer.from(base64Image, "base64");

    console.log("Guardando imagen WebP en:", filePath);
        
    return sharp(buffer)
        .webp({ quality: 40 })
        .toFile(filePath, (err, info) => {
            if (err) {
                console.error("Error al guardar la imagen WebP:", err);
                return false;
            } else {
                console.log("Imagen WebP guardada en:", filePath);
                console.log(info);
                return true;
            }
        });
};

module.exports = {
    saveBase64asWebP,
};