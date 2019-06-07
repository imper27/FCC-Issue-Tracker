/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.project_name, 'test');
          assert.isDefined(res.body._id);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
          assert.isDefined(res.body.created_on);
          assert.isDefined(res.body.updated_on);
          const _id = res.body._id;
          chai.request(server)
           .delete('/api/issues/test')
           .send({_id})
           .end((error, response) => {
                  done();
           });
        });
      });

      test('Required fields filled in', function(done) {
              chai.request(server)
               .post('/api/issues/test')
               .send({
                 issue_title: 'Title',
                 issue_text: 'text',
                 created_by: 'Functional Test - Required fields filled in'
               })
               .end(function(err, res){
                 assert.equal(res.status, 200);
                 assert.equal(res.body.project_name, 'test');
                 assert.isDefined(res.body._id);
                 assert.equal(res.body.issue_title, 'Title');
                 assert.equal(res.body.issue_text, 'text');
                 assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
                 assert.equal(res.body.assigned_to, '');
                 assert.equal(res.body.status_text, '');
                 assert.equal(res.body.open, true);
                 assert.isDefined(res.body.created_on);
                 assert.isDefined(res.body.updated_on);
                 const _id = res.body._id;
                 chai.request(server)
                  .delete('/api/issues/test')
                  .send({_id})
                  .end((error, response) => {
                          done();
                  });
               });
      });

      test('Missing required fields', function(done) {
              chai.request(server)
               .post('/api/issues/test')
               .send({
                 issue_title: 'Title',
                 created_by: 'Functional Test - Missing required fields'
               })
               .end(function(err, res){
                 // console.log(res);
                 assert.equal(res.status, 200);
                 assert.equal(res.text, 'missing inputs');
                 done();
               });
       });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
              chai.request(server)
               .put('/api/issues/test')
               .end(function(err, res){
                 assert.equal(res.status, 200);
                 assert.equal(res.text, 'no updated field sent');
                 done();
               });
       });

       test('No field to update', function(done) {
               chai.request(server)
                .post('/api/issues/test')
                .send({
                  issue_title: 'Title',
                  issue_text: 'text',
                  created_by: 'Functional Test - No field to update',
                  assigned_to: '',
                  status_text: ''
                })
                .end((error, response) => {
                        const _id = response.body._id;
                        chai.request(server)
                         .put('/api/issues/test')
                         .send({
                           _id,
                           issue_title: '',
                           issue_text: '',
                           created_by: '',
                           assigned_to: '',
                           status_text: ''
                         })
                         .end(function(error, response){
                           assert.equal(response.status, 200);
                           assert.equal(response.text, "no updated field sent");
                           chai.request(server)
                            .delete('/api/issues/test')
                            .send({_id})
                            .end((error, response) => {
                                    done();
                            });
                         });
                })
       });

      test('One field to update', function(done) {
              chai.request(server)
               .post('/api/issues/test')
               .send({
                 issue_title: 'Title',
                 issue_text: 'text',
                 created_by: 'Functional Test - One field to update'
               })
               .end((error, response) => {
                       const _id = response.body._id;
                       chai.request(server)
                        .put('/api/issues/test')
                        .send({
                                _id,
                                issue_text: 'text 2',
                                issue_title: '',
                                created_by: '',
                                assigned_to: '',
                                status_text: ''
                        })
                        .end(function(error, response) {
                          assert.equal(response.status, 200);
                          assert.equal(response.text, "successfully updated");
                          chai.request(server)
                           .delete('/api/issues/test')
                           .send({_id})
                           .end((error, response) => {
                                   done();
                           });
                        });
               })
       });

      test('Multiple fields to update', function(done) {
              chai.request(server)
               .post('/api/issues/test')
               .send({
                 issue_title: 'Title',
                 issue_text: 'text',
                 created_by: 'Functional Test - Multiple fields to update'
               })
               .end((error, response) => {
                       const _id = response.body._id;
                       chai.request(server)
                        .put('/api/issues/test')
                        .send({
                                _id,
                                issue_text: 'text 2',
                                assigned_to: 'Dev 54',
                                issue_title: '',
                                created_by: '',
                                status_text: ''
                        })
                        .end(function(error, response){
                          assert.equal(response.status, 200);
                          assert.equal(response.text, "successfully updated");
                          chai.request(server)
                           .delete('/api/issues/test')
                           .send({_id})
                           .end((error, response) => {
                                   done();
                           });
                        });
               })
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
              chai.request(server)
              .get('/api/issues/apitest')
              .query({ created_by: 'Dev45'})
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.equal(res.body.length, 2);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text');
                assert.property(res.body[0], 'created_on');
                assert.property(res.body[0], 'updated_on');
                assert.property(res.body[0], 'created_by');
                assert.property(res.body[0], 'assigned_to');
                assert.property(res.body[0], 'open');
                assert.property(res.body[0], 'status_text');
                assert.property(res.body[0], '_id');
                done();
              });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
              chai.request(server)
              .get('/api/issues/apitest')
              .query({ created_by: 'Dev45', open: true})
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.equal(res.body.length, 2);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text');
                assert.property(res.body[0], 'created_on');
                assert.property(res.body[0], 'updated_on');
                assert.property(res.body[0], 'created_by');
                assert.property(res.body[0], 'assigned_to');
                assert.property(res.body[0], 'open');
                assert.property(res.body[0], 'status_text');
                assert.property(res.body[0], '_id');
                done();
              });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
              chai.request(server)
               .delete('/api/issues/test')
                .query({})
               .end(function(err, res){
                 assert.equal(res.status, 200);
                 assert.equal(res.text, '_id error');
                 done();
               });
      });

// TODO change .send({ _id }) to .query({ _id }) ? 
      test('Valid _id', function(done) {
              chai.request(server)
               .post('/api/issues/test')
               .send({
                 issue_title: 'Title',
                 issue_text: 'text',
                 created_by: 'Functional Test - Delete valid id'
               })
               .end(function(error, response){
                 const _id = response.body._id;
                 chai.request(server)
                  .delete('/api/issues/test')
                  .query({ _id })
                  .end((error, response) => {
                    assert.equal(response.status, 200);
                    assert.equal(response.text, "deleted " + _id);
                    done();
                  });
               });
      });

      test('Invalid _id', function(done) {
              chai.request(server)
               .delete('/api/issues/test')
               .query({_id: '5cf29b4271531f00b644c1cc'})
               .end(function(err, res){
                 assert.equal(res.status, 200);
                 assert.equal(res.text, "could not delete 5cf29b4271531f00b644c1cc");
                 done();
               });
      });

    });

});
