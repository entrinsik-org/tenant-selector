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
        (() => register(server, { strategy: 'header' }, () => {})).should.not.throw();
        const req = _({}).set('headers', { 'x-inf-tenant': 'testing'}).value();
        server.df(req).should.equal('testing');
    });
    it('should validate context strategy', () => {
        (() => register(server, { strategy: 'context' }, () => {})).should.not.throw();
        const url = Url.parse('https://reporting.entrinsik.com/testing/api/datasets');
        const req = _({}).set('url', url).value();
        server.df(req).should.equal('testing');
    });
    it('should validate incorrect strategy', () => {
        (() => register(server, { strategy: 'foo'}, () => {})).should.throw('child "strategy" fails because ["strategy" must be one of [subdomain, header, context]]');
    });
    it('should validate tenantMap', () => {
        (() => register(server, { tenantMap: ['tenant1']}, () => {})).should.throw('child "tenantMap" fails because ["tenantMap" must be an object]');
    });
    it('should correctly reference a mapped tenant', () => {
        (() => register(server, { strategy: 'context', tenantMap: { testing: 'success'} }, () => {})).should.not.throw();
        const url = Url.parse('https://reporting.entrinsik.com/testing/api/datasets');
        const req = _({}).set('url', url).value();
        server.df(req).should.equal('success');
    });
    it('should correctly reference an unmapped tenant', () => {
        (() => register(server, { strategy: 'context', tenantMap: { somekey: 'success'} }, () => {})).should.not.throw();
        const url = Url.parse('https://reporting.entrinsik.com/testing/api/datasets');
        const req = _({}).set('url', url).value();
        server.df(req).should.equal('testing');
    })

});