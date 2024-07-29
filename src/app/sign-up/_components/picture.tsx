
import * as rdd from 'react-device-detect';
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from 'react';


export default function PictureComponent() {
    const isMobile = rdd.isMobile;
    const width = isMobile ? 400: 300;
    const height = isMobile ? 300: 400;

    const videoConstraints = {
        width: width,
        height: height,
        facingMode: 'user',
    }

    const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const [url, setUrl] = useState<string | null>(null);


    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot({width: isMobile ? height : width, height: isMobile ? width : height});
        if (imageSrc) {
            setUrl(imageSrc);
            console.log(imageSrc);
            setCaptureEnable(false);
        }
    }, [webcamRef, setUrl])


}
