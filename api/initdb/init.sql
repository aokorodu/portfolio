CREATE TABLE public."testTable" (
	id bigserial NOT NULL,
	name text NOT NULL,
	CONSTRAINT "testTable_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."testTable"
    OWNER to root;

insert into public."testTable" values (1, 'abraham');
insert into public."testTable" values (2, 'kai');

--insert into public."testTable" values (1, 'abraham'); See seed-data.sql