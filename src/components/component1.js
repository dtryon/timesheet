'use strict';

var React = require('react'),
  store = require('../store/store');

var Component1 = React.createClass({displayName: 'Component1',
  getInitialState: function() {
    return {firstName:'',lastName:''};
  },
  componentWillMount: function() {
    store.register('person', function(person) {
      this.setState({firstName:person.firstName, lastName:person.lastName});
    }.bind(this));

    store.onAction('personChanged');
  },
  nameChanged: function() {
    
    var firstName = React.findDOMNode(this.refs.firstName).value;
    var lastName = React.findDOMNode(this.refs.lastName).value;
    store.onAction('personChanged', {firstName: firstName, lastName: lastName});
  },
  render: function() {
    return (
      <div className="main">
        <div>
          {this.state.firstName + ' ' + this.state.lastName}
        </div>
        <div>
          <input id="firstName" name="firstName" type="text" ref="firstName" defaultValue={this.state.firstName} />
          <input id="lastName" name="lastName" type="text" ref="lastName" defaultValue={this.state.lastName} />
        </div>
        <div>
          <button onClick={this.nameChanged}>Change Name!</button>
        </div>
      </div>
    );
  }
});

module.exports = Component1;