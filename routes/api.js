'use strict';

var MongoClient = require('mongodb');
const mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useFindAndModify: false });

const Schema = mongoose.Schema;
const projectSchema = new Schema({
        name: String,
        display_name: String,
});

const Project = mongoose.model('Project', projectSchema);

const issueSchema = new Schema({
        project_name: {
                type: String,
                required: true
        },
        issue_title: {
                type: String,
                required: true
        },
        issue_text: {
                type: String,
                required: true
        },
        created_on: Date,
        updated_on: Date,
        created_by: {
                type: String,
                required: true
        },
        assigned_to: {
                type: String,
                default: ""
        },
        open: {
                type: Boolean,
                default: true
        },
        status_text: {
                type: String,
                default: ""
        }
});

const Issue = mongoose.model('Issue', issueSchema);

function addIfPresent(object, source, property) {
        if (source[property]) {
                object[property] = source[property];
        }
}

module.exports = function(app) {

        app.route('/api/issues/:project')

                .get(function(request, response) {
                        const project_name = request.params.project;
                        const query = Object.assign({}, request.query, { project_name });
                        Issue.find(query, '-__v', (error, issues) => {
                                if (error) {
                                        console.log(error.message);
                                } else {
                                        response.json(issues);
                                }
                        })
                })

                .post(function(request, response) {
                        const project_name = request.params.project;
                        const body = request.body;
                        const issue_title = body.issue_title;
                        const issue_text = body.issue_text;
                        const created_by = body.created_by;
                        if (!issue_title || !issue_text || !created_by) {
                                return response.send('missing inputs');
                        }

                        const created_on = new Date();
                        const updated_on = created_on;
                        const issue_data = { project_name, issue_title, issue_text, created_by, created_on, updated_on };
                        addIfPresent(issue_data, body, 'assigned_to');
                        addIfPresent(issue_data, body, 'status_text');

                        const issue = new Issue(issue_data);
                        issue.save((error, issue) => {
                                if (error) {
                                        console.log(error.message);
                                } else {
                                        response.json(issue);
                                }
                        });
                })

                .put(function(request, response) {
                        const project_name = request.params.project;
                        const body = request.body;
                        // console.log('body: ' + JSON.stringify(body));
                        if (!body  || Object.keys(body).length == 0) {
                                return response.send('no updated field sent');
                        }

                        const _id = body._id;
                        if (!_id) {
                                return response.send('_id error');
                        }

                        if (Object.keys(body).length == 1) {
                                return response.send('no updated field sent');
                        }

                        const issue_data = { project_name };
                        addIfPresent(issue_data, body, 'issue_title');
                        addIfPresent(issue_data, body, 'issue_text');
                        addIfPresent(issue_data, body, 'created_by');
                        addIfPresent(issue_data, body, 'assigned_to');
                        addIfPresent(issue_data, body, 'status_text');
                        if (body.open) {
                                issue_data.open = false;
                        }

                        if (Object.keys(issue_data).length == 1) {
                                return response.send('no updated field sent');
                        }

                        issue_data.updated_on = new Date();
                        Issue.findByIdAndUpdate(_id, issue_data, (error, issue) => {
                                if (error) {
                                        console.log(error.message);
                                        response.send('could not update ' + _id);
                                } else {
                                        response.send('successfully updated');
                                }
                        });
                })

                .delete(function(request, response) {
                        const project_name = request.params.project;
                        const _id = request.query._id || request.body._id;
                        if (!_id) {
                                return response.send('_id error');
                        }

                        Issue.findByIdAndRemove(_id, (error, issue) => {
                                if (error) {
                                        const message = error.message;
                                        console.log(message);
                                        if (message.includes('Cast to ObjectId failed')) {
                                                return response.send("could not delete " +_id);
                                        }

                                        return response.status(500).send('Please try later');
                                }

                                if (!issue) {
                                        return response.send("could not delete " +_id);
                                }

                                response.send( "deleted " + _id);
                        });
                });

};