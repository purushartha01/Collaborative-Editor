

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.log("Error Status Code:", res.locals.statusCode);   
    res.status(res.locals.statusCode || 500).json({ message: err.message || "Internal Server Error" });
}


export default errorHandler;