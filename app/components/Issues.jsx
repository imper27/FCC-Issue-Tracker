const React = require('react');
const IssueHolder = require('./IssueHolder');

class Issues extends React.Component {
        constructor(props) {
                super(props);
        }

        render() {
                return this.props.issues.map(issue => (
                        <div>
                                <IssueHolder issue={issue} project={this.props.project} afterUpdate={this.props.afterUpdate}/>
                        </div>
                        )
                );
        }
}

module.exports = Issues;