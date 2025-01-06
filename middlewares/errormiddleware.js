const errorMiddlewre = (err, req, resp, next) => {
    console.error(err.stack);
    resp.status(500).send({
        success: false,
        message: err.message || "Something went wrong",
        error: err.message || err
    });
}

module.exports = {
    errorMiddlewre
}


