import React, {Component} from "react";
import "../../utilities.css";
import {PropTypes} from "prop-types";
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './DatePicker.css';
import * as moment from "moment";

class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDateId: "startdateid",
      endDateId: "enddateid",
      focusedInput: null,
    };
  }

  componentDidMount() {

  }

  render () {
    return (
      <DateRangePicker
        startDate={moment(this.props.startDate)} // momentPropTypes.momentObj or null,
        startDateId={this.state.startDateId} // PropTypes.string.isRequired,
        endDate={moment(this.props.endDate)} // momentPropTypes.momentObj or null,
        endDateId={this.state.endDateId} // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => {
          this.props.handleDateChange(startDate._d, endDate._d);
        }}
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        displayFormat={'MMM DD, YYYY'}
      />
    );
  }
}

DatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

export default DatePicker;