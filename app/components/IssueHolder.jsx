const React = require('react');
const Issue = require('./Issue');
const UpdateIssue = require('./UpdateIssue');

class IssueHolder extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        view: true
                }

                this.toggle = this.toggle.bind(this);
        }

        toggle() {
                this.setState({ view: !this.state.view });
        }

        render() {
                if (this.state.view) {
                        return <Issue issue={this.props.issue} project={this.props.project} afterUpdate={this.props.afterUpdate} toggle={this.toggle}/>
                }

                return <UpdateIssue issue={this.props.issue} project={this.props.project} afterUpdate={this.props.afterUpdate} toggle={this.toggle}/>
        
        }
}

module.exports = IssueHolder;