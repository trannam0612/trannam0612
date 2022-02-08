const Joi = require('@hapi/joi')


//======================validate body=======================
const validateBody = (schemas) => {

    return (req, res, next) => {
        const validatorResult = schemas.validate(req.body)

        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error);
        } else {
            //!req.value: nếu req không có giá trị value
            if (!req.value) req.value = {}

            if (!req.value['params']) req.value.params = {}
            req.value.body = validatorResult.value;

            next();

        }
    }
}


// schema: ĐIều kiện
// name: tên validator
// validateParam middleware chạy trước controller
const validateParam = (schema, name) => {
    return (req, res, next) => {
        console.log('params ', req.params[name]);
        const validatorResult = schema.validate({
            param: req.params[name]
        })
        console.log('validatorResult ', validatorResult);
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error);
        } else {

            //!req.value: nếu req không có giá trị value
            if (!req.value) req.value = {}

            if (!req.value['params']) req.value.params = {}

            req.value.params[name] = validatorResult.value.param;
            next();
        }

    }
}


const schemas = {
    authSignUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),

    }),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),

    }),
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
    })
}

module.exports = {
    validateBody,
    validateParam,
    schemas
}