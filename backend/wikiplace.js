const textContent = require("./data.js").textContent;

let DB_INFO = {
    "HYXEGM7k7y5RX13g0uD1_eFnL4I=": {
        title: "Hexágono de la ciudad de Zaragoza",
        subtitle: "Este es mi hexágono favorito de mi cuidad natal",
        content: textContent,
        auid: "eJyLs7AwtjQ3MDQyTUoDARV7OLBIMTJEFTMzh_ABhoQO3A==",
        hash: "HYXEGM7k7y5RX13g0uD1_eFnL4I=",
    },
    // d22r082: {
    //     id: "d22r082",
    //     title: "Pentágono de la ciudad de Zaragoza",
    //     subtitle: "Este es mi pentágono favorito de mi cuidad natal",
    //     content: textContent,
    //     auid: "eJyLs7AwtjQ3MDQyTUoDARV7VJBoamGZbGlhYm4KlgUAK2UMpg==",
    // },
    // d22r083: {
    //     id: "d22r083",
    //     title: "Cuadrado de la ciudad de Zaragoza",
    //     subtitle: "Este es mi cuadrado favorito de mi cuidad natal",
    //     content: textContent,
    //     auid: "eJyLs7AwtjQ3MDQyTUoDARV7VJBoamGZbGlhYm4KlgUAK2UMpg==",
    // },
    // d22r084: {
    //     id: "d22r084",
    //     title: "Triángulo de la ciudad de Zaragoza",
    //     subtitle: "Este es mi triángulo favorito de mi cuidad natal",
    //     content: textContent,
    //     auid: "eJyLs7AwtjQ3MDQyTUoDARV7VJBoamGZbGlhYm4KlgUAK2UMpg==",
    // },
};

function checkValidHash(hash) {
    return DB_INFO.hasOwnProperty(hash);
}

function getDataFromHash(hash) {
    if (checkValidHash(hash)) {
        return DB_INFO[hash];
    }

    return {};
}

function setDataFromHash(hash, data) {
    DB_INFO[hash].title = data.title;
    DB_INFO[hash].subtitle = data.subtitle;
    DB_INFO[hash].content = data.content;

    console.log(DB_INFO[hash].title, DB_INFO[hash].subtitle);
}

function getPopular(num) {
    const list = Object.keys(DB_INFO)
        .slice(0, num)
        .map((hash) => DB_INFO[hash]);

    if (true) {
        const popular = list[0];
        const list2send = [
            popular,
            popular,
            popular,
        ];
        return JSON.stringify(list2send);
    }

    return JSON.stringify(list);
}

module.exports = {
    checkValidHash,
    getDataFromHash,
    getPopular,
    setDataFromHash,
};
