//connexion Base de donnée
const sqlite = require('sqlite3');
let db = new sqlite.Database('reservation.db');

//installation body-parser
let bodyParser = require("body-parser");

//creation serveur
const express = require("express");
const HTTP_PORT = 5500;
var app = express();
app.listen(HTTP_PORT, () => {
    console.log(("serveur en marche" + HTTP_PORT));
});
app.set('view engine', 'hbs');
app.set('views', __dirname + '/pages');


// connexion serveur - fichier css
app.use("/css", express.static(__dirname + "/css"));

//connexion serveur -fichier js
app.use("/js", express.static(__dirname + "/js"));

//installation bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    let selectfilm = "select * from film";
    db.serialize(() => {
        db.all(selectfilm, [], (err, rows) => {
            res.render(__dirname + "/pages/client.hbs", { film: rows });
        })
    })
})

//connexion seveur-film(page html ou hbs)
app.get("/film", (req, res) => {
    res.render(__dirname + "/pages/film.hbs");

});

//Insertion des données sur la table film 
app.post("/film", (req, res) => {
    let insert = "INSERT INTO film(titre, genre) values (?,?)";
    db.serialize(() => {
        db.run(insert, [req.body.titre, req.body.genre], (err) => {
            if (err) {
                throw err;
            } else {
                res.redirect("/listefilm");
            }
        })
    })

})

//afficher les données de la table film
app.get("/listefilm", (req, res) => {
    let selectfilm = "select * from film";
    db.serialize(() => {
        db.all(selectfilm, [], (err, rows) => {
            res.render(__dirname + "/pages/liste_films.hbs", { film: rows });
        })
    })
})


// suppression et réinitialisation du Id après suppression avec la table film
app.get("/listefilm/:idfilm", (req, res) => {
    let query = "DELETE FROM film WHERE id_film=?";
    db.serialize(() => {
        db.run(query, [req.params.idfilm], (err) => {
            if (err) {
                throw err;
            } else {
                db.run('UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME=\'film\'', (err) => {
                    if (err) {
                        throw err
                    } else {
                        db.run('DELETE FROM sqlite_sequence WHERE NAME=\'film\'', (err) => {
                            if (err) {
                                throw err;
                            } else {
                                res.send("reinitialisation reussi!!")
                            }
                        });
                    }
                });
            }
        });
    });
})


//connexion server-seance
app.get("/ajouter-seance", (req, res) => {
    db.serialize(() => {
        db.all("Select * from film ", [], (err, rows) => {
            if (err) {
                throw err
            }
            else {
                res.render(__dirname + "/pages/seance.hbs", { film: rows })
            }
        })
    })
})

// Insertion des données dans la table seance
app.post("/ajouter-seance", (req, res) => {
    let insertSeance = "insert into seance (date_seance, horaire, id_film) values (?,?,?)"
    db.serialize(() => {
        db.run(insertSeance, [req.body.dateSeance, req.body.horaire, req.body.film], (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                res.redirect("/admin");
            }
        });

    })
})

//modifier des données de la table seance

app.get("/admin", (req, res) => {
    let selectseance = "select * from seance join film where seance.id_film=film.id_film";
    db.serialize(() => {
        db.all(selectseance, [], (err, rows) => {
            if (err) throw err;
            res.render(__dirname + "/pages/admin.hbs", { seance: rows });
        })
    })
})
app.post("/admin/:idseance/:dateSeance/:horaire/:film", (req, res) => {
    let query = "UPDATE seance SET date_seance=?, horaire=?, id_film=? WHERE id_seance=?";
    db.serialize(() => {
        db.run(query, [req.params.dateSeance, req.params.horaire, req.params.film, req.params.idseance], (err) => {
            if (err) {
                throw err;
            } else {
                res.send("modification reussie");
            }
        })
    })
})



//suppression des données de la table seance
app.get("/admin/:idseance", (req, res) => {
    let query = "DELETE FROM seance WHERE id_seance=?";
    db.serialize(() => {
        db.run(query, [req.params.idseance], (err) => {
            if (err) {
                throw err;
            } else {
                db.run('UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME=\'seance\'', (err) => {
                    if (err) {
                        throw err
                    } else {
                        db.run('DELETE FROM sqlite_sequence WHERE NAME=\'seance\'', (err) => {
                            if (err) {
                                throw err;
                            } else {
                                res.redirect("/admin");
                            }
                        });
                    }
                });
            }
        });
    });
})




//connexion server-inscription


//Insertion sur la table client
app.get("/client", (req, res) => {
    res.render(__dirname + "/pages/client.hbs");
});

// Route pour traiter la demande d'insertion de client
app.post("/client", (req, res) => {
    const insertClientQuery = "INSERT INTO client (nom, prenom) VALUES (?, ?)";
    const { nom, prenom } = req.body;

    db.run(insertClientQuery, [nom, prenom], function (err) {
        if (err) {
            throw err;
        } else {
            const clientId = this.lastID;
            // Rediriger l'utilisateur vers la page de réservation pour ce client
            res.redirect(`/client/${clientId}/reservation`);
        }
    });
});


// Route pour afficher la liste des clients
app.get("/listeclient", (req, res) => {
    const selectClientQuery = "SELECT * FROM client";

    db.all(selectClientQuery, [], (err, rows) => {
        if (err) throw err;
        res.render(__dirname + "/pages/liste_client.hbs", { client: rows });
    });
});

app.get("/listeclient/:idclient", (req, res) => {
    let query = "DELETE FROM client WHERE id_client=?";
    db.serialize(() => {
        db.run(query, [req.params.idclient], (err) => {
            if (err) {
                throw err;
            } else {
                db.run('UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME=\'client\'', (err) => {
                    if (err) {
                        throw err
                    } else {
                        db.run('DELETE FROM sqlite_sequence WHERE NAME=\'client\'', (err) => {
                            if (err) {
                                throw err;
                            } else {
                                res.send("reinitialisation reussi!!")
                            }
                        });
                    }
                });
            }
        });
    });
})

// Route pour afficher le formulaire de réservation pour un client spécifique
app.get("/client/:clientId/reservation", (req, res) => {
    const clientId = req.params.clientId;
    let selectseance = "SELECT * FROM seance JOIN film ON seance.id_film = film.id_film";
    db.serialize(() => {
        db.all(selectseance, [], (err, rows) => {
            if (err) throw err;
            res.render("accueil", { clientId, seance: rows });
        });
    });
});


// Confirmer la reservation
app.post("/client/:clientId/reservation", (req, res) => {
    const insertReservationQuery = 'INSERT INTO reserver (place, nbr_billet, date_res, id_client, id_seance) VALUES (?, ?, ?, ?, ?)';
    const { value, nbrBillet, dateRes, clientId, idSeance } = req.body;

    // Utilisez clientId, pas client
    db.run(insertReservationQuery, [value, nbrBillet, dateRes, clientId, idSeance], (err) => {
        if (err) {
            throw err;
        } else {
            res.send("Réservation réussie");
        }
    });
});

// afficher l'historique des réservations pour un client spécifique avec son nom et les informations sur la séance
app.get("/client/:clientId/historique", (req, res) => {
    const clientId = req.params.clientId;
    const selectReservation = `SELECT * FROM reserver r JOIN client c ON r.id_client = c.id_client JOIN seance s ON r.id_seance = s.id_seance JOIN film f ON s.id_film = f.id_film WHERE r.id_client = ?;`;
    db.all(selectReservation, [clientId], (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render(__dirname + "/pages/historique.hbs", { clientId, reserver: rows });
        }
    });
});

app.get("/listereservation", (req, res) => {
    const selectReservation = `SELECT * FROM reserver  JOIN client  ON reserver.id_client = client.id_client JOIN seance ON reserver.id_seance = seance.id_seance JOIN film ON seance.id_film = film.id_film `;
    db.all(selectReservation, [], (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render(__dirname + "/pages/liste_reservation.hbs", { reserver: rows });
        }
    });
});
