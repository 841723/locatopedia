-- NOT FINISHED

-- fetch on home page

-- select
--     a.auid, -- ¿?
--     a.hash, cv.title, cv.subtitle, a.img_url
-- from
--     article a
-- join
--     (select
--         *
--     from
--         (select 
--             count(*) as count, v.hash
--         from
--             version v
--         group by
--             hash
--         order by
--             count(*) DESC
--         limit 5) as c
--     join
--         (select
--             v.title, v.subtitle, v.hash as vhash, v.date
--         from
--             version v
--         order by
--             v.date DESC
--         limit 5) as v
--     on 
--         c.hash = v.vhash) as cv
-- on 
--     a.hash = cv.hash

WITH version_counts AS (
    -- Contar cuántas versiones tiene cada hash
    SELECT 
        hash, 
        COUNT(*) AS version_count
    FROM "version"
    GROUP BY hash
),
latest_versions AS (
    -- Seleccionar la última versión de cada hash
    SELECT DISTINCT ON (hash) 
        hash, 
        title, 
        subtitle, 
        content, 
        date
    FROM "version"
    ORDER BY hash, date DESC
)

SELECT 
    vc.hash, 
    vc.version_count, 
    lv.title, 
    lv.subtitle, 
    lv.content
FROM version_counts vc
JOIN latest_versions lv
ON vc.hash = lv.hash
ORDER BY vc.version_count DESC;
