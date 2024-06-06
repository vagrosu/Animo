import {FacingMode} from "react-camera-pro/dist/components/Camera/types";
import {CameraProps} from "react-camera-pro";

export declare type CameraType = React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<unknown>> & {
  takePhoto(type?: 'base64url' | 'imgData'): string | ImageData;
  switchCamera(): FacingMode;
  getNumberOfCameras(): number;
  toggleTorch(): boolean;
  torchSupported: boolean;
};