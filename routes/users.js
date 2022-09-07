const express=require('express');
const router=express.Router();
const passport=require('passport');
const catchAsync=require('../utils/catchAsync');
const User=require('../models/user');
const {checkReturnTo}=require('../middleware');

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const{email,username,password}=req.body;
        const user=new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err)return next(err);
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }

}));

// router.get('/login',(req,res)=>{
// res.render('users/login');
// })

//Below updated code
router.get('/login',(req,res)=>{
    if(req.query.returnTo){
        req.session.returnTo=req.query.returnTo;
    }
    res.render('users/login');
    })

// router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
// const redirectUrl=req.session.returnTo||'/campgrounds';
// delete req.session.returnTo;
// res.redirect(redirectUrl);
// })

//below uppdated code
router.post('/login', checkReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl=res.session.returnTo||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    })

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
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
    });
  });

module.exports=router;


