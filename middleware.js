module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in first!');
       return res.redirect('/login');
    }
    next();
}
module.exports.checkReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.sessions.returnTo;
    }
    next();
}