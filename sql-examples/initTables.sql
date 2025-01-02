CREATE TABLE article (
	hash varchar NOT NULL,
	auid varchar NOT NULL,
	"date" timestamp NOT NULL,
	email_user varchar NOT NULL,
	is_deprecated bool NOT NULL,
	new_hash varchar NULL,
	img_url varchar NULL,
	CONSTRAINT article_pk PRIMARY KEY (hash)
);

CREATE TABLE "version" (
	id_version int4 NOT NULL,
	title varchar NOT NULL,
	subtitle varchar NOT NULL,
	"content" varchar NOT NULL,
	"date" timestamp NOT NULL,
	email_user varchar NOT NULL,
	hash varchar NOT NULL,
	CONSTRAINT version_pk PRIMARY KEY (id_version, hash),
	CONSTRAINT version_article_fk FOREIGN KEY (hash) REFERENCES article(hash)
);
