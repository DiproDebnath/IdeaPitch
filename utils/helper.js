
 const captureError = func => (req, res, next ) => Promise.resolve(func(req, res, next)).catch(next)



 module.exports = {
    captureError
 }