const React = require('react');
const axios = require('axios');
const Issues = require('./Issues');
const SubmitIssue = require('./SubmitIssue');

class IssuePage extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        issues: []
                }

                this.project = this.props.match.params.project;
                this.afterUpdate = this.afterUpdate.bind(this);
        }

        componentDidMount() {
                document.title = "Issue Page: " + this.project;
                this.getIssues();
        }

        getIssues() {
                axios.get('/api/issues/' + this.project + this.props.location.search)
                .then(result => {
                  // console.log(issues);
                  this.setState({ issues: result.data });
                })
                .catch(error => {
                  console.log(error.message);
                })
        }

        afterUpdate() {
                this.getIssues();
        }

        render() {
                return (<div >
                        <center>
                                <SubmitIssue project={this.project} afterUpdate={this.afterUpdate} />
                                <Issues project={this.project} issues={this.state.issues} afterUpdate={this.afterUpdate}/>
                        </center>
                </div>);
        }
}

module.exports = IssuePage;