const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var data = {
    id: 10
};

/*var token = jwt.sign(data, '123abc');
console.log('token: ' + token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

var message = "I'm user number 3";
var hash = SHA256(message).toString();*/

var password = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$10nA3x0hDlLxmQii/TwzAeCqFRpFGeOzK2QCA2wZwtqHXMsdrc44.';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
