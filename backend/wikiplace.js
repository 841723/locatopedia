const textContent = require("./data.js").textContent;

const data = {
    d22r081: {
        id: "d22r081",
        title: "Hexágono de la ciudad de Zaragoza",
        subtitle: "Este es tu hexágono favorito de mi cuidad natal",
        content: textContent,
    },
    d22r082: {
        id: "d22r082",
        title: "Pentágono de la ciudad de Zaragoza",
        subtitle: "Este es tu hexágono favorito de mi cuidad natal",
        content: textContent,
    },
    d22r083: {
        id: "d22r083",
        title: "Triángulo de la ciudad de Zaragoza",
        subtitle: "Este es tu hexágono favorito de mi cuidad natal",
        content: textContent,
    },
    d22r084: {
        id: "d22r084",
        title: "Cuadrado de la ciudad de Zaragoza",
        subtitle: "Este es tu hexágono favorito de mi cuidad natal",
        content: textContent,
    },
};

function checkValidId(id) {
    return data.hasOwnProperty(id);
}

function getDataFromId(id) {
    if (checkValidId(id)) {
        return data[id];
    }

    return {};
}

function getPopular(num) {
    const list = Object.keys(data)
        .slice(0, num)
        .map((id) => data[id]);
    
    return JSON.stringify(list);
}

module.exports = {
    checkValidId,
    getDataFromId,
    getPopular,
};
