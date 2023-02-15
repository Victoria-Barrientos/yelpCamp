const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundValSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.reviewValSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
});

module.exports.userValSchema = Joi.object({
    user: Joi.object({
        first_name: Joi.string().required().min(3).max(20),
        last_name: Joi.string().required().min(3).max(20),
        username: Joi.string().required().alphanum().min(8).max(25),
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        birth_date: Joi.date().required().greater('1-1-1923').less('12-31-2015'),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
    }).required()
})
