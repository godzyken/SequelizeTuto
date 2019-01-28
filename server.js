const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const _USERS = require('./users.json');

const app = express();

const port = 8001;

const connection = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    storage: 'test.mysql',
    operatorsAlias: false,
    define: {
        freezeTableName: true
    }
});

const User = connection.define('User', {
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        last_name: Sequelize.STRING,
        first_name: Sequelize.TEXT,
        full_name: Sequelize.STRING,
        password: {
            type: Sequelize.STRING,
            validate: {
                isAlphanumeric: true
            }

        }
    }, {
        hooks: {
            beforeValidate: () => {
                console.log('avant validation');
            },
            afterValidate: () => {
                console.log('apres validation');
            },
            beforeCreate: (user) => {
                user.full_name = `${user.first_name} ${user.last_name}`
                console.log('avant Creation');
            },
            afterCreate: () => {
                console.log('aprés création');
            }
        }
    }
);

app.get('/findAll', (req, res) => {
    User.findAll({
        where: {
            first_name: {
                [Op.like]: 'Dav%'
            }
        }
    })
    .then(user => {
        res.json(user);
    })
    .catch(error => {
        console.log(error);
        res.status(404).send(error);
    })
});


app.get('/findOne', (req, res) => {
    User.findById('5')
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});


app.put('/update', (req, res) => {
    User.update({
        first_name: 'Mékhouille mickey',
        password: 'passxord'
    }, { where:{ id: 5 }})
        .then(rows => {
            res.json(rows);
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});


app.delete('/remove', (req, res) => {
    User.destroy({
        where: {id: 5 }
    })
        .then(() => {
            res.send('utilisateur effacé avec succes');
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});


app.post('/post', (req, res) => {
    const newUser = req.body.user;
    User.create(newUser)
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});


connection
    .sync({
        // logging: console.log,
        // force: true
    })
    // .then(() => {
    //     User.bulkCreate(_USERS)
    //         .then(users => {
    //             console.log('ajout utilisateur great succès');
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // })
    .then(() => {
        console.log('Connection a la bdd etablie avec succès.');
    })
    .catch(err => {
        console.error('impossible de se connecter a la bdd: ', err);
    });

app.listen(port, () => {
    console.log('Démarre sur serveur: ' + port);
});

