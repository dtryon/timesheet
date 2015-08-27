'use strict';

var React = require('react/addons'),
    moment = require('moment'),
    _ = require('lodash');

function intersectDates(days, dates) {
    if (!days.length && !dates.length) {
        return false;
    }

    var flattenedDays = days.map(d1 => {
        return d1.m.format('YYYY-MM-DD');
    });
    var flattenedDates = dates.map(d2 => {
        return d2.m.format('YYYY-MM-DD');
    });

    return _.intersection(flattenedDates, flattenedDays);
}

function differenceDates(days, dates) {
    var flattenedDays = days.map(d1 => {
        return d1.m.format('YYYY-MM-DD');
    });
    var flattenedDates = dates.map(d2 => {
        return d2.m.format('YYYY-MM-DD');
    });

    const diff = _.difference(days, dates);

    if (diff && diff.length) {
        return diff.map(d => {
            return {selectable:true, m:moment(d)};
        }); 
    }
    return [];
}

function daysInDates(days, dates) {
    const intersection = intersectDates(days, dates);
    return !!intersection.length;
}

var Day = React.createClass({

	daySelected: function(date) {

		this.props.onSelected(date);
	},
	render: function() {
        var cx = React.addons.classSet;
        var dayClasses = cx({
            'day': true,
            'selected': !!this.props.selected,
            'selectable': this.props.date.selectable
        });

        if (this.props.date.selectable) {
            return (
                <div className={dayClasses} onClick={this.daySelected.bind(this, this.props.date)}>
                    <span className="date">{this.props.date.m.date()}</span>
                </div>
            );
        } else {
            return (
                <div className={dayClasses}>
                    <span className="date">{this.props.date.m.date()}</span>
                </div>
            );
        }
	}
});

var WeekPanel = React.createClass({

    weekSelected: function(weekdaysOnly) {
        this.props.onWeekSelected(weekdaysOnly);
    },
    render: function() {
        return (
                <div style={{display:'inline-block'}}>
                    <button onClick={this.weekSelected.bind(this, true)}>All Weekdays</button>
                    <button onClick={this.weekSelected.bind(this, false)}>All Week</button>
                </div>
            );  
    }
});

var Week = React.createClass({
	
    weekSelected: function(weekdaysOnly) {

        let weekDays = this.props.days;
        if (weekdaysOnly) {
            weekDays = weekDays.filter(d => {
                return (d.m.day() > 0 && d.m.day() < 6);
            });
        }

        this.props.daysSelected(weekDays);
    },
    daySelected: function(date) {
        this.props.daysSelected([date]);
    },
    render: function() {
		var days = this.props.days.map(function(dayDate) {
            var selected = daysInDates([dayDate], this.props.selectedDays);
            return (<Day key={dayDate.m.toISOString()} date={dayDate} selected={selected} onSelected={this.daySelected}/>);
        }.bind(this));

		return (
            <div className="week">
                <div style={{display:'inline-block'}}>
                    {days}
                </div>
                <WeekPanel onWeekSelected={this.weekSelected} />
		    </div>);
	}
});

var Month = React.createClass({
    getMonthDays: function(start, end) {
        var result = [];

        //month days Monday -> Sunday

        //make dates inclusive
        start.m.add(-1, 'days');

        for (var i = 1; i <= start.m.daysInMonth(); i++) {
            var m = moment({y:start.m.year(),M:start.m.month(),d:i});
            var selectable = m.isBetween(start.m, end.m);
            result.push({selectable: selectable, m: moment({y:start.m.year(),M:start.m.month(),d:i})});
        };

        //fill out the front so we can position into weeks
        var firstDay = result[0].m || start.m;
        for (var j = firstDay.day(), n = 1; j > 1; j--, n++) {  
            result.unshift({selectable: false, m: moment(firstDay).add(-n, 'days')});
        };
        

        //fill out the back so we can position into weeks
        var lastDay = result[result.length-1].m || start.m;        
        for (var k = lastDay.day(), m = 1; k <= 6; k++, m++) {
            result.push({selectable: false, m: moment(lastDay).add(m, 'days')});
        };

        return result;
    },
    render: function() {
        var monthDays = this.getMonthDays(this.props.start, this.props.end);

        var numberOfWeeks = monthDays.length / 7;
        var props = this.props;
        var weeks = [];
        for(var i = 0; i < numberOfWeeks; i++) {
            var startIndex = i * 7;
            weeks.push(<Week key={i} days={monthDays.slice(startIndex, startIndex+7)} {...props} />);
        }
   
        return (<div>
                    <div>
                        {weeks}
                    </div>
                </div>);
    }
});

var DaySelector = React.createClass({


	render: function() {

        var { start, end, ...other } = this.props;

		return (
				<div className="day-selector">
                    <Month start={start} end={end} {...other} />
				</div>
			);
	}
});



var Timesheet = React.createClass({

	getInitialState: function() {
		return {selectedDays:[]};
	},
    daysSelected: function(dates) {
        let selectedDays = this.state.selectedDays;

        if (daysInDates(dates, selectedDays)) {
            const diff = differenceDates(selectedDays, dates);
            this.setState({selectedDays: diff});
        } else {
            dates.forEach(d => { selectedDays.push(d) });
            this.setState({selectedDays: selectedDays});
        }

    },
	render: function() {
        var startOfCurrentWeek = moment().startOf('week').add(1,'d');
        var endOfCurrentWeek = moment().endOf('week').add(1, 'd');
		return (
			<div className="timesheet">
				<DaySelector mode={this.state.mode} start={{m:startOfCurrentWeek}} end={{m:endOfCurrentWeek}} selectedDays={this.state.selectedDays} daysSelected={this.daysSelected} />
			</div>
			);
	}
});

module.exports = Timesheet;
