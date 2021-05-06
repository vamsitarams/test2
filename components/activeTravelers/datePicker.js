// import React, { Component } from 'react';
// import moment from 'moment';
// import { DateRange } from 'react-date-range';
// // import './style.css';

// export default class Main extends Component {
//   constructor (props) {
//     super(props);

//     this.state = {
//       rangePicker: {
//         startDate: moment(),
//         endDate: moment().add(7, 'days')
//       },
//       isShowCalendar: false
//     };
//   }

//   handleChange (e) {
//     this.setState({
//       rangePicker: e.target.value
//     });
//   }

//   handleClickOpenCalendar = () => {
//     this.setState({
//       isShowCalendar: true
//     });
//   };

//   handleClickCloseCalendar = () => {
//     this.setState({
//       isShowCalendar: false
//     });
//   };

//   render () {
//     const { rangePicker, isShowCalendar } = this.state;

//     const format = 'DD/MMMM/YYYY';
//     console.log('rangePicker', rangePicker);

//     return (
//       <main>
//         <h1>Date-range</h1>
//         {isShowCalendar && (
//           <div className="box-calendar">
//             <div className="close" onClick={this.handleClickCloseCalendar}>
//               Close
//             </div>
//             <DateRange
//               format="DD/MM/YYYY"
//               startDate={rangePicker.startDate}
//               endDate={rangePicker.endDate}
//               linkedCalendars={true}
//               disableDaysBeforeToday={true}
//               date={now => now}
//               onInit={this.handleChange.bind}
//               onChange={this.handleChange.bind}
//               theme={{
//                 DateRange: {
//                   background: '#ffffff'
//                 },
//                 Calendar: {
//                   background: 'transparent',
//                   color: '#95a5a6',
//                   boxShadow: '0 0 1px #eee',
//                   width: '100px',
//                   padding: '0px'
//                 },
//                 MonthAndYear: {
//                   background: '#55B1E3',
//                   color: '#fff',
//                   padding: '20px 10px',
//                   height: 'auto'
//                 },
//                 MonthButton: {
//                   background: '#fff'
//                 },
//                 MonthArrowPrev: {
//                   borderRightColor: '#55B1E3'
//                 },
//                 MonthArrowNext: {
//                   borderLeftColor: '#55B1E3'
//                 },
//                 Weekday: {
//                   background: '#3AA6DF',
//                   color: '#fff',
//                   padding: '10px',
//                   height: 'auto',
//                   fontWeight: 'normal'
//                 },
//                 Day: {
//                   // borderRadius: "100%",
//                   transition:
//                     'transform .1s ease, box-shadow .1s ease, background .1s ease'
//                 },
//                 DaySelected: {
//                   background: '#55B1E3'
//                 },
//                 DayActive: {
//                   background: '#55B1E3',
//                   boxShadow: 'none'
//                 },
//                 DayInRange: {
//                   background: '#eee',
//                   color: '#55B1E3'
//                 },
//                 DayHover: {
//                   background: '#4f4f4f',
//                   color: '#fff'
//                 }
//               }}
//             />
//           </div>
//         )}
//         <div>
//           <input
//             type="text"
//             readOnly
//             onClick={this.handleClickOpenCalendar}
//             onChange={this.handleChange}
//             value={
//               rangePicker.startDate &&
//               rangePicker.startDate.format(format).toString()
//             }
//           />
//           <input
//             type="text"
//             readOnly
//             onClick={this.handleClickOpenCalendar}
//             value={
//               rangePicker.endDate &&
//               rangePicker.endDate.format(format).toString()
//             }
//           />
//         </div>
//       </main>
//     );
//   }
// }
// import React from 'react';
// import TextField from '@material-ui/core/TextField';
// import {
//   DateRangePicker,
//   DateRangeDelimiter,
//   LocalizationProvider
// } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns'; // choose your lib

// export default function Main () {
//   const [selectedDate, handleDateChange] = React.useState([null, null]);

//   return (
//     <LocalizationProvider dateAdapter={DateFnsUtils}>
//       <DateRangePicker
//         startText="Check-in"
//         endText="Check-out"
//         value={selectedDate}
//         onChange={date => handleDateChange(date)}
//         renderInput={(startProps, endProps) => (
//           <>
//             <TextField {...startProps} />
//             <DateRangeDelimiter> to </DateRangeDelimiter>
//             <TextField {...endProps} />
//           </>
//         )}
//       />
//     </LocalizationProvider>
//   );
// }
import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

export default function Main () {
  const [value, onChange] = useState(new Date());
  const [val, setVal] = useState(new Date());

  return (
    <div style={{ display: 'flex', paddingLeft: '10px' }}>
      <DatePicker
        onChange={onChange}
        value={value}
      />
      <p>to</p>
      <DatePicker
      onChange={setVal}
      value={val}/>
    </div>
  );
}
