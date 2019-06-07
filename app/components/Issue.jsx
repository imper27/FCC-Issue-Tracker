const React = require('react');
const axios = require('axios');

class Issue extends React.Component {
        constructor(props) {
                super(props);
                this.handleClose = this.handleClose.bind(this);
                this.handleDelete = this.handleDelete.bind(this);
                this.handleEdit = this.handleEdit.bind(this);
        }

        componentDidMount() {}

        handleClose(event) {
                event.preventDefault();
                const data = { _id: this.props.issue._id, open: true};
                axios.put('/api/issues/' + this.props.project,  data )
                .then(result => {
                  alert("success");
                  this.props.afterUpdate();
                })
                .catch(error => {
                  console.log(error.message);
                })
        }

        handleDelete(event) {
                event.preventDefault();
                const params = { params: { _id: this.props.issue._id } };
                axios.delete('/api/issues/' + this.props.project,  params)
                .then(result => {
                  alert("success");
                  this.props.afterUpdate();
                })
                .catch(error => {
                  console.log(error.message);
                })
        }

        handleEdit() {
                event.preventDefault();
                this.props.toggle();
        }

        render() {
                const openState = this.props.issue.open
                        ? 'open'
                        : 'closed';
                return (<div class={"issue " + openState}>
                        <h3>{this.props.issue.issue_title} - ({openState})</h3>
                        <br/>
                        <p>{this.props.issue.issue_text}</p>
                        <p>{this.props.issue.status_text}</p>
                        <br/>
                        <p class="id">
                                <b>Created by: </b>
                                {this.props.issue.created_by + ' '}
                                <b>Assigned to: </b>
                                {this.props.issue.assigned_to}</p>
                        <p class="id">
                                <b>Created on: </b>
                                {this.props.issue.created_on + ' '}
                                <b>Last updated: </b>
                                {this.props.issue.updated_on}
                                <br/>
                                {
                                        openState == 'open'?
                                        (
                                                <a href="#" class="closeIssue" id={this.props.issue._id} style={{marginRight: 20}} onClick={this.handleClose}>close</a>
                                        )
                                        : null
                                }
                                <a href="#" class="deleteIssue" id={this.props.issue._id} style={{marginRight: 20}} onClick={this.handleDelete}>delete</a>
                                {
                                        openState == 'open'?
                                        (
                                                <a href="#" class="editIssue" id={this.props.issue._id} onClick={this.handleEdit}>edit</a>
                                        )
                                        : null
                                }
                        </p>
                </div>
                );
        }
}

module.exports = Issue;