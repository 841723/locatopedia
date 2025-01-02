const { Pool } = require("pg");

const { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT } = process.env;

const pool = new Pool({
    host: PG_HOST,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
    port: PG_PORT,
});

async function checkExistingHash(hash) {
    try {
        const res = await pool.query(
            `
            select 
                *
            from 
                tfg.article 
            where
                hash = $1
            `,
            [hash]
        );
        return res.rows.length > 0;
    } catch (err) {
        console.log("Error in checkValidHash");
        console.log(err);
        return false;
    }
}

async function getDataFromHash(hash) {
    const res = await pool.query(
        `
        select 
            a.hash, a.auid, v.title, v.subtitle, v.content, v.email_user, v.date 
        from 
            tfg.version v join tfg.article a on a.hash = v.hash
        where
            a.hash = $1
        order by v.date DESC 
        limit 1
        `,
        [hash]
    );
    if (res.rows.length > 0) {
        return res.rows[0];
    } else {
        return null;
    }
}

async function getNextVersionFromHash(hash) {
    try {
        const res = await pool.query(
            `
            select 
                max(id_version)
            from
                tfg.version 
            where
                hash = $1
            `,
            [hash]
        );
        return res.rows[0].max + 1;
    } catch (err) {
        console.log("Error in getNextVersionFromHash");
        console.log(err);
        return [];
    }
}

async function createNewVersionFromHash(hash, data) {
    try {
        const newVersionNumber = await getNextVersionFromHash(hash);
        const newDate = new Date();

        const res = await pool.query(
            `
            insert into 
                tfg."version" 
                (id_version, title, subtitle, "content", "date", email_user, hash)
                values
                ($1, $2, $3, $4, $5, $6, $7);
            `,
            [
                newVersionNumber,
                data.title,
                data.subtitle,
                data.content,
                newDate,
                data.email_user,
                hash,
            ]
        );
        data.date = newDate;

        if (res.rowCount === 1) {
            return data;
        }
        throw "Error in createNewVersionFromHash";
    } catch (err) {
        console.log("Error in createNewVersionFromHash");
        console.log(err);
        return [];
    }
}

// async function setDataFromHashWithImgData(hash, data) {
//     try {
//         const res = await pool.query(
//             "UPDATE article SET title = $1, subtitle = $2, content = $3, img = $4 WHERE hash = $5",
//             [data.title, data.subtitle, data.content, data.imgData, hash]
//         );
//         return res;
//     } catch (err) {
//         console.log("Error in setDataFromHashWithImgData");
//         console.log(err);
//         return [];
//     }
// }

async function createNewArticleFromHash(hash, data) {
    try {
        const res = await pool.query(
            `
            insert into
                tfg.article
                (hash, auid, date, email_user, is_deprecated, new_hash, img_url)
                values
                ($1, $2, $3, $4, $5, $6, $7);
            `,
            [
                hash,
                data.auid,
                new Date(),
                data.email_user,
                false,
                null,
                data.img_url,
            ]
        );
        const res2 = await pool.query(
            `
            insert into
                tfg."version"
                (id_version, title, subtitle, "content", "date", email_user, hash)
                values
                ($1, $2, $3, $4, $5, $6, $7);
            `,
            [
                1,
                data.title,
                data.subtitle,
                data.content,
                new Date(),
                data.email_user,
                hash,
            ]
        );

        if (res.rowCount === 1 && res2.rowCount === 1) {
            return data;
        }
        throw "Error in createNewArticleFromHash";
    } catch (err) {
        console.log("Error in createNewArticleFromHash");
        console.log(err);
        return [];
    }
}

async function getPopular(num) {
    try {
        const res = await pool.query(
            `
            select distinct on (a.hash)
                a.hash, v.title, v.subtitle, a.img_url
            from
                tfg.article a
            join
                tfg.version v
            on a.hash = v.hash
            order by a.hash, random()
            limit $1
            `,
            [num]
        );
        return res.rows;
    } catch (err) {
        console.log("Error in getPopular");
        console.log(err);
        return [];
    }
}

async function getAll() {
    try {
        const res = await pool.query("SELECT * FROM article ORDER BY RANDOM()");
        return res.rows;
    } catch (err) {
        console.log("Error in getAll");
        console.log(err);
        return [];
    }
}

module.exports = {
    checkExistingHash,
    getDataFromHash,
    getPopular,
    createNewVersionFromHash,

    createNewArticleFromHash,

    getAll,
};
