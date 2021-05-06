import PropTypes from 'prop-types';
import React from 'react';

export class VendorContacts extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
      language: PropTypes.arrayOf(PropTypes.shape({
        contacts: PropTypes.array
      })),
      code: PropTypes.string
    }))
  };

  render () {
    const { l } = this.context.i18n;
    const contactsArray = this.props.contacts;
    if (!contactsArray || !contactsArray.length) return null;

    return (
      <div className='contacts'>
        {contactsArray.map((contact, index) => {
          const name = contact.language[0].name;
          const contacts = contact.language[0].contacts;
          if (contacts && contacts.length) {
            const key = contact.code ? contact.code : index;
            return (
              <div key={key} className='contact'>
                <h4>Contact {name}</h4>
                {contact.language[0].contacts.map((details) => {
                  const type = details.type.toLowerCase();
                  if (type === 'phone' || type === 'phone number') {
                    const phoneName = details.name.replace(name, '');
                    return (
                      <dl key={details.information}>
                        <dt>{phoneName || l('Phone')}</dt>
                        <dd>{details.information}</dd>
                      </dl>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}
export default VendorContacts;
