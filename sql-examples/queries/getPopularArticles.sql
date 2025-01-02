-- fetch on home page

select
    a.auid, -- ¿?
    a.hash, v.title, v.subtitle, a.img_url
from
    article a
join
    version v
on a.hash = v.hash
order by random()

-- select
--     *
-- from
--     article
-- order by views DESC
