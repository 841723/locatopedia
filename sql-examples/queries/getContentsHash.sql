-- fetch to display the latest content of the article

select
    v.id_version, a.hash, -- ¿?
    a.auid, -- ¿?
    v.title, v.subtitle, v."content", v.email_user, v."date"
from
    version v
join
    article a
on a.hash = 'P1VUnlbg5OJw1h74dL8gbyZD9Gk='
order by v.date DESC
limit 1
