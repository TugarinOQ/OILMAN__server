const express = require('express'),
    router = express.Router(),
    User = require('../../models/user'),
    jwt = require('jsonwebtoken'),
    token__module = require('../token');

router.post('/register', (req, res) => {

    const email = req.body.email || "";
    const username = req.body.username || "";
    const pass = req.body.password || "";
    const confirm = req.body.confirmPassword || "";

    if (!checkRegExEmail(email)) return res.json({ error: "Incorrect email" });
    if (!checkRegExLogin(username)) return res.json({ error: "Incorrect login" });
    if (pass.length < 8 || (pass !== confirm)) return res.json({ error: "Incorrect password" });

    const user = new User.Schema({
        email: email,
        username: username,
        password: pass,
        regDate: Date.now()
    });

    user.save(function(err) {
        if (err)
            return res.json({ error: "Duplicate username or email" });

        res.json({ success: "ok" });
    });
});

router.post('/login', (req, res) => {

    const emailOrLogin = req.body.email || "";
    const pass = req.body.password || "";

    if (!checkRegExEmail(emailOrLogin)) return res.json({ error: "Incorrect email" });
    if (pass.length < 8) return res.json({ error: "Incorrect password" });

    User.Schema.findOne({
        email: emailOrLogin
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ error: 'Authentication failed. User not found.' });
        } else if (user) {

            User.verifyPassword(pass, (err, success) => {
                if (err || !success) return res.json({ error: 'Authentication failed. Wrong password.' });

                const token = jwt.sign({ email: user.email }, 'yqawv8nqi5', {
                    expiresIn: '1 day' // expires in 24 hours
                });

                res.json({
                    success: true,
                    token: token
                });
            }, user.password);
        }

    });
});

router.post('/forgot', (req, res) => {

    //
});

router.get('/info', token__module.isValid, (req, res) => {

    console.log('info');
});

// CUSTOM FUNCTIONS
function checkRegExLogin(login)
{

    return /^[a-zA-Z1-9]+$/.test(login) && login.length > 3 && login.length < 15;
}
function checkRegExEmail(email)
{

    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
//

module.exports = router;