module.export = (user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here');
    console.log('user in serializeUser', user);
    console.log('user.id', user.id);
    done(null, user.id);
};
