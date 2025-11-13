import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifyNewMessage = (senderName, messageText) => {
  toast.info(`${senderName}: ${messageText}`, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const NotificationToast = () => <ToastContainer />;
export default NotificationToast;
