const {body}=require('express-validator')

const validationScehema=()=>{
    return [
    body('title')
    .notEmpty()
    .withMessage("required").
    isLength({min:2}),
    body('price')
    .notEmpty()
    .withMessage("price is required ")
]
}
module.exports={validationScehema}