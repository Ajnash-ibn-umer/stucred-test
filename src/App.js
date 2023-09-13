import logo from "./logo.svg";
import "./App.css";
import Camera, { IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
function App() {
  const [dataUri, setDataUri] = useState("");
  const [medias, setMedias] = useState([]);
  const webcamRef = useRef(null);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [vUrl,setVurl]=useState()
  const [openCam, setOpenCam] = useState(false);

  const videoConstraints = {
    width: 300,
    height: 200,
    facingMode: "user",
  };
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(async() => {
   await  mediaRecorderRef.current.stop();
    setCapturing(false);
    console.log("stopping ...");
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });


      var videoUrl=window.URL.createObjectURL(blob);// blob.data gives actual data
      console.log({vUrl});
      var video = document.querySelector('video');
     
      video.src = videoUrl;
    //  setVurl(videoUrl)
    }
  }, [mediaRecorderRef, webcamRef, setCapturing]);
 


  return (
    <div className="App">
      <div className="main">
        <div className="top-bar">
        <button
            onClick={() => {
              setOpenVideo(false);

              setOpenPhoto(!openPhoto);
            

            }}
          >
            photo
          </button>
          <button  onClick={() => {
              setOpenPhoto(false);
              setOpenVideo(!openVideo);

              // setOpenCam(openCam ? true : false);

            }}>video</button>
         
          <button
            onClick={() => {
             
              setOpenVideo(false);

              setOpenPhoto(false);

            }}
          >
            close Camera
          </button>
        </div>
        <div className="bottom-bar">
          <div>
            {/* {openPhoto?
        <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone} imageType = {IMAGE_TYPES.JPG}
        isFullscreen={false}
      />
     :<></> } */}
            {( openPhoto || openVideo) &&
              <>
                <Webcam
                ref={webcamRef}
                  audio={true}
                  height={720}
                  screenshotFormat="image/jpeg"
                  width={1280}
                  videoConstraints={videoConstraints}
                >
                
                  
                  
                   
                  
                  {
                   
                  
                  ({ getScreenshot }) =>
                    openPhoto ? (
                      <button
                        onClick={() => {
                          const imageSrc = getScreenshot();
                          console.log({ imageSrc });
                          // let d=medias
                          // d.push(imageSrc)
                          // console.log({d});
                          setMedias((p) => [...p, imageSrc]);
                        }}
                      >
                        Click Photo
                      </button>
                    ) : (
                      <></>
                    )
                  }
                </Webcam>
                { openVideo ?( capturing ? (
                      <button onClick={handleStopCaptureClick}>Stop Capture</button>
                    ) : (
                      <button onClick={handleStartCaptureClick}>Start Capture</button>
                    )):<></>}
              </>
            }
          </div>
          <div className="list">
            {medias.map((media, i) => {
              return (
                <img
                  key={Date.now() + i}
                  width={200}
                  height={200}
                  src={media.toString()}
                />
              );
            })}
            <video width={300} height={400} src={vUrl}></video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
