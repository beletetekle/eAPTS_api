'use strict';

var senderAddress = "orbital.addis@gmail.com"; // replace this with the real one
var WEB_CLIENT_URL = "http://localhost:3000"

module.exports = function(InternalUser) {
    InternalUser.myReferrals = function(req, res, cb) {
        const userId = req.accessToken.userId;
        const filter = {
            where: {
                referrerId: userId
            }
        };

        InternalUser.find(filter, function (err, users){
            cb(null, users);
        })

    }

    InternalUser.afterRemote('login', (context, remoteMethodOutput, next) =>{        
        InternalUser.findOne( { where : {id : remoteMethodOutput.userId}, include: {relation: 'roles', scope: { include: 'role' }}}, function(err, user) {
            console.log(user, err);
            remoteMethodOutput.internalUser = user;
            next();
        });
    });

    InternalUser.afterRemote('create', function(context, user, next) {
        let referrerId = context.args.options.accessToken.userId;
        InternalUser.findById(referrerId, function(err, loggedInUser) {
            if(err) next(err);
            user.referrerId = loggedInUser.id;
            user.save();
            user.createAccessToken({scopes: ["reset-password"]}, {}, function(err, token) {
                var url = WEB_CLIENT_URL  + '#/resetPassword';
                var html = '<h2>Account has been created with your email address</h2><hr/>'+
                        '<b>Username : </b>' + user.username + '<br/>' +
                        '<b>Email : </b>' + user.email + '<br/>' +
                        '<br/>' +
                        'Click <a href="' + url + '?access_token=' + token.id + '">here</a> to verify your account and reset password <br/>' +
                        '<br/> Invitation sent from ' + loggedInUser.email + '<br/>' +
                        '<small>*** Use the above username/email to login into your account.<small/>';


                InternalUser.app.models.Email.send({
                    to: user.email,
                    from: senderAddress,
                    subject: 'Account Verification',
                    html: html,
                }, function(err) {
                    if (err) return console.log(err, '> error sending password reset email');
                    console.log('> sending password reset email to:', user.email);
                });

                next();
            });
        });
    });

    InternalUser.remoteMethod(
        'myReferrals',
        {
        description: 'Get all User the logged in user referred',
        http: { path: '/myReferrals', verb: 'get' },
        accepts: [
            {arg: 'req', type: 'object', 'http': {source: 'req'}},
            {arg: 'res', type: 'object', 'http': {source: 'res'}},
        ],
        returns:{ arg: 'users', type: 'Array'}
        }
    );
};
