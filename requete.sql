CREATE TABLE seance (id_seance integer PRIMARY KEY Autoincrement, date_seance Datetime, horaire time (25), id_film int, foreign key (id_film) references film(id_film));
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE film 
(id_film integer primary key autoincrement not null , titre  varchar(50) not null, genre  varchar(50) not null);        
CREATE TABLE client 
(id_client integer primary key autoincrement, nom vachar(70) not null ,prenom varchar(70) not null);
CREATE TABLE reserver
(place int not null, nbr_billet int not null, date_res Date not null, id_client int , id_seance int, foreign key (id_client) references client (id_client), foreign key (id_seance) references seance (id_seance));