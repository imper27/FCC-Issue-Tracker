const React = require('react');
const Link = require('react-router-dom').Link
const MyForm = require('./MyForm');

class Project extends React.Component {
        constructor(props) {
                super(props)
        }

        componentDidMount() {
                document.title = "Home";
        }

        render() {
                return (
                        <div>
                                <div style={{marginBottom: 20}}>Please enter a project name:</div>
                                <MyForm history={this.props.history}/>
                        </div>);
        }
}

module.exports = Project;