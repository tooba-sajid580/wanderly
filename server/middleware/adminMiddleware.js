function adminMiddleware(req, res, next) {
    const adminRole=req.user.role;
    if(adminRole != "admin"){
        return res.status(403).json({ message: "Admins only" });
    }
    next();
}

module.exports = adminMiddleware;