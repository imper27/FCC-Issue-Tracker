const React = require('react');
const ReactDOM = require('react-dom');
const Route = require('react-router-dom').Route;
const Router = require('react-router-dom').BrowserRouter;
const browserHistory = require('react-router-dom').browserHistory;

const IssuePage = require('./components/IssuePage');
const Project = require('./components/Project');

ReactDOM.render((<Router history={browserHistory}>
        <div>
                <Route exact="exact" path="/" component={Project}/>
                <Route path="/issuePage/:project" component={IssuePage}/>
        </div>
</Router>), document.getElementById('main'));
