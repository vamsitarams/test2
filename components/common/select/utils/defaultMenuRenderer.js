import classNames from 'classnames';
import React from 'react';

export default function menuRenderer ({
  focusedOption,
  instancePrefix,
  labelKey,
  onFocus,
  onSelect,
  onRemove,
  optionClassName,
  optionComponent,
  optionRenderer,
  options,
  valueArray,
  valueKey,
  onOptionRef
}) {
  const Option = optionComponent;

  return options.map((option, i) => {
    const isSelected = valueArray && valueArray.indexOf(option) > -1;
    const isFocused = option === focusedOption;
    const optionClass = classNames(optionClassName, {
      'Select-option': true,
      'is-selected': isSelected,
      'is-focused': isFocused,
      'is-disabled': option.disabled
    });

    return (
      <Option
        className={optionClass}
        instancePrefix={instancePrefix}
        isDisabled={option.disabled}
        isFocused={isFocused}
        isSelected={isSelected}
        key={`option-${i}-${option[valueKey]}`}
        onFocus={onFocus}
        onSelect={!isSelected ? onSelect : onRemove }
        option={option}
        optionIndex={i}
        ref={ref => { onOptionRef(ref, isFocused); }}
      >

        <span><input type='checkbox' readOnly='readOnly' checked={isSelected} />{optionRenderer(option, i)}</span>
      </Option>
    );
  });
}
