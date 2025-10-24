const express = require('express');
const app = express();
const cuentas = require('./cuentas');
const PORT = 3130;

app.get('/cuentas', (req, res) => {
    const response = {
        count: cuentas.length,
        data: cuentas
    }
    res.send(response);
});

app.get('/cuenta/:id', (req, res) => {
    const {id} = req.params;
    const cuenta = cuentas.find(c => c._id === id);
    const response = {
        finded: (cuenta)? true : false,
        account: cuenta
    }
    res.send(response);
});

app.get('/cuentasQuery', (req, res) => {
    const {id, isActive, picture, balance, client, gender} = req.query;

    const foundCuentas = cuentas.filter(cuenta => {
        return (
            (!id || cuenta._id === id) &&
            (!isActive || cuenta.isActive.toString() === isActive) &&
            (!picture || cuenta.picture === picture) &&
            (!balance || cuenta.balance === balance)&&
            (!client || cuenta.client === client) &&
            (!gender || cuenta.gender === gender)
        );
    });

    if(foundCuentas.length == 0) {
        const response = {finded: false};
        res.send(response);
    } else
    if(foundCuentas.length == 1) {
        const response = {
            finded: true,
            account: foundCuentas[0]
        }
        res.send(response);
    } else {
        const response = {
            finded: true,
            data: foundCuentas
        }
        res.send(response);
    }
});

app.get('/cuentasBalance', (req, res) => {
    var balanceTotal = 0.0;
    var status = cuentas.some(c => c.isActive);
    for(let i = 0; i < cuentas.length; i++) {
        if(cuentas[i].isActive) {balanceTotal += parseFloat((cuentas[i].balance).slice(1, 8))}
    }

    const response = {
        status: status,
        accountBalance: `$${balanceTotal}`
    }
    res.send(response);
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});