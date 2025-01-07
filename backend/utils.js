const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/**
 * Convierte una imagen en base64 a WebP y la guarda en la ruta especificada.
 * @param {string} base64Data - La imagen en base64.
 * @param {string} outputPath - La ruta donde guardar la imagen en formato WebP.
 * @returns {boolean} - True si la imagen se guardó correctamente, false en caso contrario.
 */
const saveBase64asWebP = (url, filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const base64Image = url.split(";base64,").pop();
    const buffer = Buffer.from(base64Image, "base64");  

    return sharp(buffer)
        .webp({ quality: 40 })
        .toFile(filePath, (err, info) => {
            if (err) {
                console.error("Error al guardar la imagen WebP:", err);
                return false;
            } else {
                return true;
            }
        });
};

module.exports = {
    saveBase64asWebP,
};