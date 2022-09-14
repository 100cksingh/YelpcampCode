const express=require('express');
const router=express.Router();
const passport=require('passport');
const catchAsync=require('../utils/catchAsync');
const User=require('../models/user');
const users=require('../controllers/users');
// const {checkReturnTo}=require('../middleware');

router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router.route('/login')
   .get(users.renderLogin)
   .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),users.login);

router.get('/logout',users.logout);

module.exports=router;
//Below updated code
// router.get('/login',(req,res)=>{
//     if(req.query.returnTo){
//         req.session.returnTo=req.query.returnTo;
//     }
//     res.render('users/login');
//     })
// passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true })


//below uppdated code
// router.post('/login', checkReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
//     req.flash('success','welcome back!');
//     const redirectUrl=res.session.returnTo||'/campgrounds';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
//     })

// router.get('/logout',(req,res)=>{
//     req.logout();
//     req.flash("success","You are logged out!");
//     res.redirect("/campgrounds");
// })
// router.get('/logout',function(req,res,next){
//     req.logout(function(err){
//        if(err){
//         return next(err);
//        }
//        req.flash("success","You are logged out!");
//        res.redirect("/campgrounds");
//     });
// });



