import PropTypes from 'prop-types';
import React from 'react';

export class ContactsInfo extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    contacts: PropTypes.array.isRequired,
    companyName: PropTypes.string.isRequired
  };

  get contactsList () {
    const contactsList = this.props.contacts.map((contact, index) => {
      return (
        <div key={index}>
          {contact.type}: {contact.information}
        </div>
      );
    });

    return contactsList;
  }

  render () {
    const { l } = this.context.i18n;

    return (
      <div className='product-footer'>
        <h4>{l('Contact')} {this.props.companyName}</h4>
        <ul className='contacts-list'>
          {this.contactsList}
        </ul>
      </div>
    );
  }
}

export default ContactsInfo;

/* Temp for contacts
get contactsList () {
 const phonesList = {};
 const contactsList = this.props.contacts.map((contact, index) => {
 if (contact.type === 'Phone Number') {
 phonesList[contact.name].phoneNumber = contact.information;
 }
 });

 if (!isEmpty(phonesList.length)) {
 phonesList.map((item, index) => {
 return (
 <div key={index}>
 <div>item</div>
 {contact.type}: {contact.information}
 </div>
 );
 });
 }
 return contactsList;
 }
 */
