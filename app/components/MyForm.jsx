const React = require('react');
const Redirect = require('react-router-dom').Redirect;
const axios = require('axios');

class MyForm extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        input: '',
                        redirectText: '',
                        redirect: false
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
                this.setState({input: event.target.value});
        }

        handleSubmit(event) {
                event.preventDefault();
                this.setState({redirectText: this.state.input, redirect: true});
        }

        render() {
                if (this.state.redirect) {
                        const newUrl = '/IssuePage/' + this.state.redirectText;
                        this.props.history.push('/');
                        return <Redirect to={newUrl}/>
                }

                return (<div>
                        <form onSubmit={this.handleSubmit}>
                                <input value={this.state.input} onChange={this.handleChange} style={{marginRight: 20}}/>
                                <button type='submit'>Submit!</button>
                        </form>
                </div>);
        }
};

module.exports = MyForm;