'use strict';

const _ = require('lodash');
const Url = require('url');
const chai = require('chai');
chai.should();
const register = require('../index.js').register;
const server = {
    df : null,
    defaultTenant: fn => server.df = fn
};


describe('Tenant Selector', () => {
   before(() => {
      server.df = null;
   });
   it('should default to subdomain strategy', function() {
       register(server,{},()=>{});
       (_.isFunction(server.df)).should.be.true;
       const req = _({}).set('info.hostname', 'testing.entrinsik.com').value();
       server.df(req).should.equal('testing');
   });
   it('should accept subdomain strategy', () => {
       (() => register(server, { strategy: 'subdomain' }, () => {})).should.not.throw();
       const req = _({}).set('info.hostname', 'testing.entrinsik.com').value();
       server.df(req).should.equal('testing');
   });
    it('should validate header strategy', () => {
        (() => register(server, { strategy: 'header', defaultsTo:'foo' }, () => {})).should.not.throw();
        const req = _({}).set('headers', { 'x-inf-tenant': 'testing'}).value();
        server.df(req).should.equal('testing');
        const defReq = _({}).set('headers', {}).value();
        server.df(defReq).should.equal('foo');
    });
    it('should validate incorrect strategy', () => {
        (() => register(server, { strategy: 'foo'}, () => {})).should.throw('child "strategy" fails because ["strategy" must be one of [subdomain, header]]');
    });
    it('should validate tenantMap', () => {
        (() => register(server, { tenantMap: ['tenant1']}, () => {})).should.throw('child "tenantMap" fails because ["tenantMap" must be an object]');
    });
    it('should correctly reference a mapped tenant', () => {
        (() => register(server, { strategy: 'subdomain', tenantMap: { testing: 'success'} }, () => {})).should.not.throw();
        const req = _({}).set('info.hostname', 'testing.entrinsik.com').value();
        server.df(req).should.equal('success');
    });
    it('should correctly reference an unmapped tenant', () => {
        (() => register(server, { strategy: 'subdomain', tenantMap: { somekey: 'success'} }, () => {})).should.not.throw();
        const req = _({}).set('info.hostname', 'testing.entrinsik.com').value();
        server.df(req).should.equal('testing');
    })

});