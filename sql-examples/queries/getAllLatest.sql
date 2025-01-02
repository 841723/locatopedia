SELECT 
DISTINCT ON 
	(v.hash) 
	*
FROM 
	version v
ORDER BY 
	v.hash, v.date DESC;