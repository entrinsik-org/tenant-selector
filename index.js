'use strict';

const _ = require('lodash');
const Joi = require('joi');

const contextRegex = /(?<=\/).+?(?=\/|$)/;

const strategies = {
    subdomain: req => {
        let [tenant] = req.info.hostname.split('.');
        return tenant;
    },
    header: req => req.headers['x-inf-tenant'],
    context: req => {
        const contextResult = contextRegex.exec(req.url.path);
        return contextResult ? contextResult[0] : null;
    }
};

const schema = {
    strategy: Joi.string().valid(Object.keys(strategies)),
    tenantMap: Joi.object().optional()
};

exports.register = function(server, opts, next) {
    opts = opts || {};
    opts.strategy = opts.strategy || 'subdomain';
    Joi.validate(opts, schema, (err, valid) => {
        if(err) {
            throw err;
        }
        opts = valid;
    });
    server.defaultTenant(req => {
        let tenant = strategies[opts.strategy](req);
        if(_.get(opts,['tenantMap',tenant]))
            tenant = _.get(opts,['tenantMap',tenant]);
        return tenant;
    });
    next();
};

exports.register.attributes = { name: 'tenant-selector'};