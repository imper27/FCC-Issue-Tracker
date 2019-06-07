const React = require('react');
const axios = require('axios');

class UpdateIssue extends React.Component {
        constructor(props) {
                super(props);
                this.state =
                {
                        _id: this.props.issue._id,
                        issue_title: this.props.issue.issue_title,
                        issue_text: this.props.issue.issue_text,
                        created_by: this.props.issue.created_by,
                        assigned_to: this.props.issue.assigned_to,
                        status_text: this.props.issue.status_text,
                        closed: !this.props.issue.open
                }

                this.handleSubmit = this.handleSubmit.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.handleCheck = this.handleCheck.bind(this);
        }

        handleChange(event) {
                /*
                  Thanks to Steve Milburn, https://blog.stvmlbrn.com/2017/04/07/submitting-form-data-with-react.html
                */
                /*
                  Because we named the inputs to match their
                  corresponding values in state, it's
                  super easy to update the state
                */
                this.setState({
                        [event.target.name]: event.target.value
                });
        }

        handleCheck(event) {
                let checked = event.target.checked;
                this.setState({ closed: checked });
        }

        handleSubmit(event) {
                event.preventDefault();
                const data = {...this.state};
                if (this.props.issue.open && data.closed) {
                        data.open = true;
                }

                delete data.closed;

                axios.put('/api/issues/' + this.props.project,  data )
                .then(result => {
                  alert("success");
                  this.props.toggle();
                  this.props.afterUpdate();
                })
                .catch(error => {
                  console.log(error.message);
                })
        }

        render() {
                return (
                //        method="post" action="/api/"
                <div id="submitUpdateIssue">
                        <br/>
                        <h3>Update Issue:</h3>
                        <form id="updateIssue" onSubmit={this.handleSubmit}>
                                <input type="text" name="issue_title" value={this.state.issue_title} placeholder="*Title" style={{width: 320, marginBottom: 3}} required onChange={this.handleChange}/><br/>
                                <textarea type="text" name="issue_text" value={this.state.issue_text} placeholder="*Text" style={{width: 320, height: 100}} required onChange={this.handleChange}></textarea><br/>
                                <input type="text" name="created_by" value={this.state.created_by} placeholder="*Created by" style={{width: 200}} required onChange={this.handleChange}/><br/>
                                <input type="text" name="assigned_to" value={this.state.assigned_to} placeholder="(opt)Assigned to" style={{width: 200}} onChange={this.handleChange}/><br/>
                                <input type="text" name="status_text" value={this.state.status_text} placeholder="(opt)Status text" style={{width: 200}} onChange={this.handleChange}/><br/>
                                        {
                                                this.props.issue.open?
                                                <span>
                                                        <label><input type="checkbox" name="closed" checked={this.state.closed} onChange={this.handleCheck}/> Check to close issue</label>
                                                  <br/>
                                                    </span>

                                                : null
                                        }
                                <button type="submit">Update Issue</button>
                                <button style={{marginLeft: 20}} onClick={this.props.toggle}>Cancel</button>
                        </form>
                </div>);
        }
}

module.exports = UpdateIssue;

