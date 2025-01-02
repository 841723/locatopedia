-- fetch when a different version is requested

select 
    v.id_version, v.hash, v.title, v.subtitle, v.content, v.email_user, v.date
from 
    version v
where
    v.id_version == '1' and v.hash == 'P1VUnlbg5OJw1h74dL8gbyZD9Gk='
