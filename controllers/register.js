const { createSession } = require("../lib/redis");

const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({ 
                name: name,
                email: loginEmail[0],
                joined: new Date()  
            })
            .then(user => user[0].id && user[0].email ? createSession(user[0]) : Promise.reject(user[0]))
            .then(session => res.json(session))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })   
    .catch(err => {
        console.error(err);
        return res.status(404).json('unable to register')
    })
}

module.exports = {
    handleRegister: handleRegister
};