var React = require('react'),
	Component1 = require('./components/component1'), 
	Timesheet = require('./components/timesheet');

// React.render(
//   <Component1 />,
//   document.getElementById('content')
// );

React.render(
  <Timesheet />,
  document.getElementById('timesheet')
);