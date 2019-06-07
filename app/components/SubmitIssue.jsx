const React = require('react');
const axios = require('axios');

class SubmitIssue extends React.Component {
        constructor(props) {
                super(props);
                this.initialState =
                {
                        issue_title: '',
                        issue_text: '',
                        created_by: '',
                        assigned_to: '',
                        status_text: ''
                }

                this.state = this.initialState;

                this.handleSubmit = this.handleSubmit.bind(this);
                this.handleChange = this.handleChange.bind(this);
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

        handleSubmit(event) {
                event.preventDefault();
                const data = {...this.state};
                axios.post('/api/issues/' + this.props.project,  data )
                .then(result => {
                  alert("success");
                  this.setState(this.initialState);
                  this.props.afterUpdate();
                })
                .catch(error => {
                  console.log(error.message);
                })
        }

        render() {
                return (
                //        method="post" action="/api/"
                <div id="submitNewIssue">
                        <br/>
                        <h3>Submit a new issue:</h3>
                        <form id="newIssue" onSubmit={this.handleSubmit}>
                                <input type="text" name="issue_title" value={this.state.issue_title} placeholder="*Title" style={{width: 320, marginBottom: 3}} required onChange={this.handleChange}/><br/>
                                <textarea type="text" name="issue_text" value={this.state.issue_text} placeholder="*Text" style={{width: 320, height: 100}} required onChange={this.handleChange}></textarea><br/>
                                <input type="text" name="created_by" value={this.state.created_by} placeholder="*Created by" style={{width: 200}} required onChange={this.handleChange}/><br/>
                                <input type="text" name="assigned_to" value={this.state.assigned_to} placeholder="(opt)Assigned to" style={{width: 200}} onChange={this.handleChange}/><br/>
                                <input type="text" name="status_text" value={this.state.status_text} placeholder="(opt)Status text" style={{width: 200}} onChange={this.handleChange}/><br/>
                                <button type="submit">Submit Issue</button>
                        </form>
                </div>);
        }
}

module.exports = SubmitIssue;