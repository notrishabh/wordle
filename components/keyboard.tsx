import React, { FunctionComponent } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./keyboard.css";

interface IProps {
  onChange: (input: string) => void;
  keyboardRef: React.RefObject<typeof Keyboard | null>;
  buttonTheme: Array<{ class: string; buttons: string }>;
}

const KeyboardWrapper: FunctionComponent<IProps> = ({
  onChange,
  keyboardRef,
  buttonTheme,
}) => {
  return (
    <Keyboard
      keyboardRef={(r) => (keyboardRef.current = r)}
      mergeDisplay={true}
      display={{
        "{bksp}": "⌫",
        "{enter}": "enter",
      }}
      layoutName="default"
      onChange={onChange}
      layout={{
        default: [
          "q w e r t y u i o p {bksp}",
          "a s d f g h j k l",
          "z x c v b n m {enter}",
        ],
      }}
      buttonTheme={buttonTheme}
    />
  );
};

export default KeyboardWrapper;
