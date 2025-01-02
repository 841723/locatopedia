-- fetch to display links for old versions 

select 
    v.hash, v.id_version, -- ¿?
    v.title, v.subtitle, v.email_user, v.date
from 
    version v
where
    hash = 'P1VUnlbg5OJw1h74dL8gbyZD9Gk='
order by v.date DESC
