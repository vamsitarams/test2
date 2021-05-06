import PropTypes from 'prop-types';
import React from 'react';
import InputText from '../../components/forms/inputText';

export class CompanyCostCenterBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    contact: PropTypes.object,
    index: PropTypes.number,
    onRemoveContact: PropTypes.func,
    onUpdateContact: PropTypes.func,
    costCentersValidationErrors: PropTypes.array
  };

  onChange = () => {
    const contact = {
      ...this.props.contact,
      name: null, // this.refs['name-' + this.props.contact.ref].value,
      sort1Id: null // this.refs['sort1Id-' + this.props.contact.ref].value
    };
    if (Object.prototype.hasOwnProperty.call(this.props, 'onUpdateContact')) {
      this.props.onUpdateContact(contact);
    }
  };

  onDelete = () => {
    if (Object.prototype.hasOwnProperty.call(this.props, 'onRemoveContact')) {
      this.props.onRemoveContact();
    }
  };

  render () {
    const { l } = this.context.i18n;
    const { contact, costCentersValidationErrors, index } = this.props;

    const isExisted = Object.prototype.hasOwnProperty.call(contact, 'existed');
    const errors = [];
    if (
      costCentersValidationErrors &&
      costCentersValidationErrors instanceof Array &&
      costCentersValidationErrors.length > 0
    ) {
      costCentersValidationErrors.forEach((elem) => {
        if (elem.ref === index) {
          if (!errors[elem.field]) {
            errors[elem.field] = [];
          }
          errors[elem.field].push(elem.message);
        }
      });
    }

    return (
      <div className='agency-contact' style={{ minHeight: '300px', paddingLeft: '12px' }}>
        <div className='agency-input-block'>
          <InputText
          ref={'name-' + contact.ref}
          name='name'
          placeholder={l('Enter Sort Level Name')}
          errorText={errors && errors.name ? errors.name[0] : ''}
          defaultValue={contact.name}
          onChangeHandler={this.onChange}
          required={isExisted}
          maxLength={32}
        />
        <InputText
          ref={'sort1Id-' + contact.ref}
          name='sort1Id'
          placeholder={l('Enter Sort Level ID')}
          errorText={errors && errors.sort1Id ? errors.sort1Id[0] : ''}
          defaultValue={contact.sort1Id}
          onChangeHandler={this.onChange}
          required={isExisted}
          maxLength={32}
        />
        </div>
        {isExisted && !contact._id
          ? <button className='accounts-contact-delete' type='button' onClick={this.onDelete}>Х</button>
          : ''
        }
      </div>
    );
  }
}
export default CompanyCostCenterBlock;
