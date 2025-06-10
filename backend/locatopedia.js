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
            a.hash, a.auid, v.title, v.subtitle, v.content, a.email_user, v.date 
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

async function getDataFromHashAndVersion(hash, version) {
    const res = await pool.query(
        `
        select 
            a.hash, a.auid, v.title, v.subtitle, v.content, v.email_user, v.date 
        from 
            tfg.version v join tfg.article a on a.hash = v.hash
        where
            a.hash = $1 and v.id_version = $2
        `,
        [hash, version]
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

async function getPopular(limit) {
    try {
        const res = await getDataOrderedByQuery(
            `
            SELECT 
                l.hash
            FROM 
                tfg.likes l
            GROUP BY 
                l.hash
            ORDER BY 
                COUNT(*) DESC
            LIMIT $1
            `,
            [limit]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getPopular");
        console.log(err);
        return [];
    }
}

async function getRandom(limit) {
    try {
        const res = await getDataOrderedByQuery(
            `
            select 
                a.hash
            from 
                tfg.article a 
            order by random()
            limit $1
            `,
            [limit]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getRandom");
        console.log(err);
        return [];
    }
}

async function getLiked(limit, email) {
    try {
        const res = await getDataOrderedByQuery(
            `
            select 
                l.hash
            from 
                tfg.likes l 
            where 
                l.email = $2
            limit $1
            `,
            [limit, email]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getPopular");
        console.log(err);
        return [];
    }
}

async function getCreated(limit, email) {
    try {
        const res = await getDataOrderedByQuery(
            `
            select 
                a.hash
            from 
                tfg.article a 
            where 
                a.email_user = $2
            order by a.date DESC
            limit $1
            `,
            [limit, email]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getCreated");
        console.log(err);
        return [];
    }
}

async function getEdited(limit, email) {
    try {
        const res = await getDataOrderedByQuery(
            `   
            select
                v.hash
            from
                (
                    select 
                        v1.hash, max(v1.date) as date
                    from 
                        tfg.version v1 
                    group by
                        v1.hash, v1.email_user
                    having
                        v1.email_user = $2
                    order by v1.hash
                ) v
            order by v.date DESC
            limit $1
            `,
            [limit, email]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getEdited");
        console.log(err);
        return [];
    }
}

async function getNewestVersions(limit) {
    try {
        const res = await getDataOrderedByQuery(
            `
            select
                v.hash
            from
                (
                    select 
                        v1.hash, max(v1.date) as date
                    from 
                        tfg.version v1 
                    group by
                        v1.hash
                    order by v1.hash
                ) v
            order by v.date DESC
            limit $1
            `,
            [limit]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getNewestVersions");
        console.log(err);
        return [];
    }
}

async function getNewestArticles(limit) {
    try {
        const res = await getDataOrderedByQuery(
            `
            select
                a.hash
            from
                tfg.article a
            order by a.date DESC
            limit $1
            `,
            [limit]
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getNewestArticles");
        console.log(err);
        return [];
    }
}

async function getAll() {
    try {
        const res = await getDataOrderedByQuery(
            `
            select 
                a.hash
            from 
                tfg.article a 
            order by random()
            `
        );
        const returnedData = res.map((item) => {
            return {
                hash: item.hash,
                title: item.title,
                subtitle: item.subtitle,
                img_url: item.img_url,
                auid: item.auid,
            };
        });
        return returnedData;
    } catch (err) {
        console.log("Error in getAll");
        console.log(err);
        return [];
    }
}

async function getAllVersionsFromHash(hash) {
    try {
        const res = await pool.query(
            `
            select 
                v.hash, v.id_version,
                v.title, v.subtitle, v.email_user, v.date
            from 
                tfg.version v
            where
                hash = $1
            order by v.date DESC

            `,
            [hash]
        );
        return res.rows;
    } catch (err) {
        console.log("Error in getVersions");
        console.log(err);
        return [];
    }
}

async function getLikesFromHashandEmail(hash, email) {
    try {
        const res = await pool.query(
            `
            select 
                count(*) as likes
            from 
                tfg.likes
            where
                hash = $1
            `,
            [hash]
        );
        const like_count = res.rows[0].likes;

        const res2 = await pool.query(
            `
            select 
                count(*) as likes
            from 
                tfg.likes
            where
                hash = $1 and email = $2
            `,
            [hash, email]
        );
        const user_liked = res2.rows[0].likes > 0;
        return { like_count, user_liked };
    } catch (err) {
        console.log("Error in getLikesFromHashandEmail");
        console.log(err);
        return 0;
    }
}

async function toggleLike(hash, email) {
    try {
        const res = await pool.query(
            `
            select 
                count(*) as likes
            from 
                tfg.likes
            where
                hash = $1 and email = $2
            `,
            [hash, email]
        );

        if (res.rows[0].likes > 0) {
            await pool.query(
                `
                delete from 
                    tfg.likes
                where
                    hash = $1 and email = $2
                `,
                [hash, email]
            );
        } else {
            await pool.query(
                `
                insert into 
                    tfg.likes
                    (hash, email)
                values
                    ($1, $2)
                `,
                [hash, email]
            );
        }
    } catch (err) {
        console.log("Error in toggleLike");
        console.log(err);
    }
}

async function getDataOrderedByQuery(query, params = []) {
    const res = await pool.query(
        `
        WITH ordered_hashes AS (
            SELECT 
                l.hash,
                ROW_NUMBER() OVER () AS row_order -- Mantiene el orden original
            FROM (
                ${query}
            ) l
        ),
        latest_versions AS (
            SELECT DISTINCT ON (v.hash)
            v.hash, v.id_version, v.title, v.subtitle, v."content", v."date" AS edition_date, v.email_user AS editor_mail
            FROM 
                tfg.version v
            JOIN 
                ordered_hashes o 
            ON 
                v.hash = o.hash
            ORDER BY 
                v.hash, v."date" DESC
        )
        SELECT 
            a.hash, a.auid, a."date" AS creation_date, a.email_user AS creator_mail,a.is_deprecated, a.new_hash, a.img_url, lv.id_version, lv.title, lv.subtitle, lv."content", lv.edition_date, lv.editor_mail
        FROM 
            latest_versions lv
        JOIN 
            tfg.article a 
        ON 
            a.hash = lv.hash
        JOIN 
            ordered_hashes o
        ON 
            a.hash = o.hash
        ORDER BY 
            o.row_order; -- Respeta el orden original de la consulta del IN
        `,
        params
    );
    return res.rows;
}

async function canDeleteArticle(hash, email) {
    try {
        const res = await pool.query(
            `
            select 
                a.email_user
            from 
                tfg.article a
            where
                a.hash = $1
            `,
            [hash]
        );
        if (res.rows.length === 0) {
            return false;
        }
        return res.rows[0].email_user === email || email === "841723@unizar.es";
    } catch (err) {
        console.log("Error in canDeleteArticle");
        console.log(err);
        return false;
    }
}

async function deleteArticle(hash) {
    try {
        const res = await pool.query(
            `
            delete from 
                tfg.article
            where
                hash = $1
            `,
            [hash]
        );
        return res.rowCount === 1;
    } catch (err) {
        console.log("Error in deleteArticle");
        console.log(err);
    }
}

module.exports = {
    checkExistingHash,
    getDataFromHash,
    getDataFromHashAndVersion,

    createNewVersionFromHash,
    createNewArticleFromHash,

    getAll,
    getAllVersionsFromHash,

    getLikesFromHashandEmail,
    toggleLike,

    getPopular,
    getRandom,
    getLiked,
    getCreated,
    getEdited,
    getNewestVersions,
    getNewestArticles,

    canDeleteArticle,
    deleteArticle,
};
