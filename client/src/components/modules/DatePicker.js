import React, {Component} from "react";
import "../../utilities.css";
import {PropTypes} from "prop-types";
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './DatePicker.css';




class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      startDateId: "startdateid",
      endDate: null,
      endDateId: "enddateid",
      focusedInput: null,
    };
  }

  componentDidMount() {

  }

  render () {
    return (
      <DateRangePicker
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        startDateId={this.state.startDateId} // PropTypes.string.isRequired,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        endDateId={this.state.endDateId} // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        displayFormat={'MMM DD, YYYY'}
      />
    );
  }
}

export default DatePicker;