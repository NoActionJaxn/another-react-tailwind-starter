import { tw } from '@noactionjaxn/another-react-tailwind-component-library';
import Button, { type ButtonProps } from './Button';

export interface ButtonGroupProps {
  buttons: Array<ButtonProps>;
  className?: string;
}

/**
 * A row of Directus buttons. Uses a plain flex row rather than the library ButtonGroup,
 * which visually joins buttons into one segmented control.
 */
const ButtonGroup = ({ buttons, className }: ButtonGroupProps) => {
  if (!buttons || !buttons.length) return null;

  return (
    <div className={tw('flex flex-wrap gap-4', className)}>
      {buttons.map((button, index) => (
        <Button key={button.id ?? index} {...button} />
      ))}
    </div>
  );
};

export default ButtonGroup;
