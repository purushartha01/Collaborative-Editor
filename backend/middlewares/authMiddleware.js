const authMiddleware = (req, res, next) => {
    try {

        console.log("Auth middleware executed");
        next();
    } catch (err) {
        next(err);
    }
}

export default authMiddleware;