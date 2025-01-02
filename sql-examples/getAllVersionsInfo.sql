select 
    v.id_version, aav.hash, v.email_user, v."date" 
from 
    (
        select
            av.hash, av.id_version 
        from
            article_version av
        join 
            article a
        on a.hash = av.hash 
        where a.hash = 'P1VUnlbg5OJw1h74dL8gbyZD9Gk='
    ) as aav
    join 
        "version" v 
    on aav.id_version = v.id_version
order by v.date DESC
