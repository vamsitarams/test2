import React from 'react';
import i18nTools from './i18nTools';
import Validator from './validator';
import filter from 'lodash/filter';
import lodashFind from 'lodash/find';

// Create initial array of phone numbers for using in repeated fields
export function initPhoneNumbersCollection (collection) {
  const fieldName = 'phone';
  const originalFieldName = 'number';
  let count = 1;
  if (!collection || (collection && !collection.length)) {
    return [{
      // type: 'primary',
      ref: `${fieldName}${count}`
    }];
  }
  const newCollection = [];
  const primaryPhone = collection ? lodashFind(collection, { type: 'primary' }) : null;
  if (primaryPhone) {
    newCollection.push({ ...primaryPhone, [fieldName]: primaryPhone[originalFieldName], ref: fieldName + '0' });
  }
  const numbers = collection ? filter(collection, (t) => t.type !== 'primary') : [];
  numbers.forEach((item) => {
    if (item.type === 'emergency') {
      return;
    }
    const ref = fieldName + (count + 1);
    count++;
    newCollection.push({ ...item, [fieldName]: item[originalFieldName], ref: ref });
  });
  return newCollection;
}

// Get array of sort level ids for selected companies
export function getCompanySortLevelIdList (sortLevelIdsArr, id) {
  if (!sortLevelIdsArr.length) {
    return [];
  }

  // Filter sort level ids which belongs to selected company
  let newSortLevelIdList = filter(sortLevelIdsArr, (sortLevelId) => {
    return sortLevelId.organizationId.$oid === id;
  });

  // Format sort level ids which belongs to selected company for custom select options
  newSortLevelIdList = newSortLevelIdList.map((sortLevelId) => {
    return { value: sortLevelId._id.$oid, label: sortLevelId.name };
  });
  return newSortLevelIdList;
}

// Generate repeated fields
export function repeatFields (options) {
  const { l } = i18nTools;
  const {
    collection, field, validationErrors, text: { label, placeholder, addBtnText }, maxFieldsNumber,
    onChange, addFieldHandler, removeFieldHandler, emailDisabled
  } = options;
  const fieldsList = collection.map((fieldObj, index) => {
    const ref = fieldObj.ref;
    const fieldType = field === 'phone' ? 'tel' : 'text';
    let containerClasses = '';
    let primaryMark, closeBtn, primaryLabel;
    let fieldDisabled = false;
    let placeholderText = `${placeholder} (${l('optional')})`;
    if (index === 0) {
      containerClasses = 'primary';
      // primaryMark = (<span className='note text-muted'>{l('Primary')}</span>);
      primaryMark = (<span className='note text-muted'></span>);
      primaryLabel = (<label htmlFor={`${field}-primary`} className='control-label col-sm-3'>{label}</label>);
      // Disable primary email for Edit view
      if (emailDisabled && field === 'email') {
        fieldDisabled = true;
      }
      placeholderText = placeholder;
    } else {
      containerClasses = 'col-sm-offset-3 has-feedback field-removable';
      closeBtn = (
        <a href='#'
          className='glyphicon remove form-control-feedback'
          onClick={removeFieldHandler(ref)}>
          {l('Remove')}
        </a>);
    }

    let errorClass = '';
    let errorTextMessage;
    const messageText = validationErrors[ref] ? validationErrors[ref][0] : '';
    if (messageText) {
      errorClass = 'has-error';
      errorTextMessage = (
        <span className='text-danger error-message'>{messageText}</span>
      );
    }

    return (
      <div className={errorClass} key={ref}>
        {primaryLabel}
        <div className={'input-hold ' + containerClasses}>
          {errorTextMessage}
          <input type={fieldType}
            id={ref}
            className='form-control'
            name={ref}
            ref={ref}
            defaultValue={collection[index][field]}
            placeholder={placeholderText}
            onChange={onChange}
            disabled={fieldDisabled}
            readOnly={fieldDisabled}
          />
          {closeBtn}
          {primaryMark}
        </div>
      </div>
    );
  });

  const maxNumber = maxFieldsNumber || 4;
  let addBtn;
  if (collection.length < maxNumber) {
    addBtn = (
      <a href='#' onClick={addFieldHandler}>+ {addBtnText}</a>
    );
  }

  return (
    <div>
      {fieldsList}
      {addBtn}
    </div>
  );
}

export function validateField (fieldName, fieldNode, validationErrors, type, maxLength = 254) {
  if (!fieldNode) {
    return validationErrors;
  }
  let errorMessage;
  let isValid;
  switch (type) {
    case ('maxLength'):
      errorMessage = i18nTools.l(`Please enter no more than ${maxLength} characters.`);
      isValid = Validator.isValidMaxLength(fieldNode.value, maxLength);
      break;
    case ('email'):
      errorMessage = i18nTools.l('Email format is invalid');
      isValid = Validator.isValidEmail(fieldNode.value);
      break;
    case ('phone'):
      errorMessage = i18nTools.l('Phone number is invalid');
      isValid = Validator.isValidPhone(fieldNode.value);
      break;
    case ('notEmpty'):
      errorMessage = i18nTools.l('Please fill this field');
      isValid = Validator.isNotEmpty(fieldNode.value);
      break;
  }
  const currentErrors = validationErrors[fieldName] ? validationErrors[fieldName] : [];
  const newMessage = !isValid ? errorMessage : '';

  if (newMessage && currentErrors.indexOf(newMessage) === -1) {
    const newErrors = [].concat(currentErrors, [newMessage]);
    validationErrors = {
      ...validationErrors,
      [fieldName]: newErrors
    };
  } else if (!newMessage && currentErrors.indexOf(errorMessage) !== -1) {
    const newErrors = filter(currentErrors, (item) => item !== errorMessage);
    validationErrors = {
      ...validationErrors,
      [fieldName]: newErrors
    };
  }
  return { validationErrors, isValid };
}
