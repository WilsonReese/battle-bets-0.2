import { useContext } from "react";
import { useMessage } from "../components/contexts/MessageContext";


export const useToastMessage = () => {
  const { showMessage, message, clearMessage } = useMessage();

  const showSuccess = (text, duration = 2000) => {
    showMessage(text, "#0C9449", duration);
  };

  const showError = (text, duration = 2000) => {
    showMessage(text, "#AB1126", duration);
  };

  const showInfo = (text, duration = 2000) => {
    showMessage(text, "#184EAD", duration);
  };

  return {
    showMessage,
    showSuccess,
    showError,
    showInfo,
    message,
    clearMessage,
  };
};

