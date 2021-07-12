import React, { memo, forwardRef } from 'react';
import { isValidElementType } from "react-is";
import InputBase from './InputBase';
import Box from '../Box';
import type { IInputProps } from './types';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { extractInObject, stylingProps } from '../../../theme/tools/utils';
import { useHover } from '@react-native-aria/interactions';
import { mergeRefs } from '../../../utils';


const renderSideElement = (ElementType, props) => {
   if (!ElementType) {
      return null; 
   }
   // Detect if elementType, passing props to align same state of child content from Input.
   if (isValidElementType(ElementType)){
      return <ElementType {...props} />; 
   }
   return ElementType;
};

const InputAdvance = (
  {
    InputLeftElement,
    InputRightElement,
    onFocus,
    onBlur,
    inputProps,
    wrapperRef,
    ...props
  }: IInputProps & {
    inputProps: any;
  },
  ref: any
) => {
  const inputThemeProps = {
    isDisabled: inputProps.disabled,
    isInvalid: inputProps.accessibilityInvalid,
    isReadOnly: inputProps.accessibilityReadOnly,
    isRequired: inputProps.required,
  };

  const {
    isInvalid,
    isDisabled,
    _hover,
    _disabled,
    _invalid,
    _focus,
    ...themedProps
  } = usePropsResolution('Input', {
    ...inputThemeProps,
    ...props,
  });

  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = (focusState: boolean, callback: any) => {
    setIsFocused(focusState);
    callback();
  };

  const [layoutProps, nonLayoutProps] = extractInObject(themedProps, [
    ...stylingProps.margin,
    ...stylingProps.border,
    ...stylingProps.layout,
    ...stylingProps.flexbox,
    ...stylingProps.position,
    ...stylingProps.background,
  ]);

  // Extracting baseInputProps from remaining props
  const [, baseInputProps] = extractInObject(nonLayoutProps, ['variant']);

  const _ref = React.useRef(null);
  const { isHovered } = useHover({}, _ref);
  
  const sideElementProps = {
    isHovered,
    isFocused,
    isDisabled,
    isInvalid,
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      overflow="hidden"
      {...layoutProps}
      {...(isHovered && _hover)}
      {...(isFocused && _focus)}
      {...(isDisabled && _disabled)}
      {...(isInvalid && _invalid)}
      ref={mergeRefs([_ref, wrapperRef])}
    >
      {renderSideElement(InputLeftElement, sideElementProps)}
      <InputBase
        inputProps={inputProps}
        {...baseInputProps}
        flex={1}
        disableFocusHandling
        ref={ref}
        variant="unstyled"
        onFocus={(e) => {
          handleFocus(true, onFocus ? () => onFocus(e) : () => {});
        }}
        onBlur={(e) => {
          handleFocus(false, onBlur ? () => onBlur(e) : () => {});
        }}
      />
      {renderSideElement(InputRightElement, sideElementProps)}
    </Box>
  );
};

export default memo(forwardRef(InputAdvance));
