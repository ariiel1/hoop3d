import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import JSZip from 'jszip';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
import Header from './Header';
import UploadSection from './UploadSection';
import VideoPlayer from './VideoPlayer';
import LoadingPopup from './LoadingPopup';
import DetectedPlayers from './DetectedPlayers';

const API_URL = "https://anteater-electric-truly.ngrok-free.app";

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const threeJsSceneRef = useRef(null);
  const rendererRef = useRef(null);

  const onVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
      setIsPaused(false);
    }
  };

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onVideoDrop,
    accept: 'video/*',
  });

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoURL('');
    setImages([]);
    clearThreeJsScene();
  };


  const handlePlayerDetect = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "frame.png", { type: "image/png" });

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post(API_URL + "/detect", formData, {
        responseType: 'blob',
      });

      const zip = new JSZip();
      const content = await zip.loadAsync(response.data);
      const extractedImages = [];

      for (let filename in content.files) {
        if (!content.files[filename].dir) {
          const fileData = await content.files[filename].async('blob');
          const fileURL = URL.createObjectURL(fileData);
          extractedImages.push(fileURL);
        }
      }

      setImages(extractedImages);
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handleImageClick = async (imageUrl) => {
    setLoading(true);
  
    try {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const formData = new FormData();
      formData.append('file', imageBlob, 'player.png');
  
      const generateResponse = await axios.post(API_URL + "/generate", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
  
      const objBlob = generateResponse.data;
      const objFileURL = URL.createObjectURL(objBlob);
  
      loadObjFile(objFileURL);
    } catch (error) {
      console.error("Error generating .obj file: ", error);
      if (error.response) {
        console.error("Response data: ", error.response.data);
        console.error("Response status: ", error.response.status);
        console.error("Response headers: ", error.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearThreeJsScene = () => {
    if (rendererRef.current) {
      // Remove the canvas element
      if (sceneRef.current) {
        sceneRef.current.removeChild(rendererRef.current.domElement);
      }
      // Dispose of the renderer
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    // Clear the scene
    if (threeJsSceneRef.current) {
      while (threeJsSceneRef.current.children.length > 0) {
        threeJsSceneRef.current.remove(threeJsSceneRef.current.children[0]);
      }
    }
  };

  const loadObjFile = (objFileURL) => {
    clearThreeJsScene();

    const scene = new THREE.Scene();
    threeJsSceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, sceneRef.current.clientWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sceneRef.current.clientWidth, window.innerHeight);  // Set renderer size to container width
    rendererRef.current = renderer;
    if (sceneRef.current) {
      sceneRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2.position.set(-1, -1, -1).normalize();
    scene.add(directionalLight2);

    const loader = new OBJLoader();
    loader.load(objFileURL, (object) => {
      scene.add(object);
      camera.position.z = 5;

      const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    });

    const handleResize = () => {
      camera.aspect = sceneRef.current.clientWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(sceneRef.current.clientWidth, window.innerHeight);  // Update renderer size on window resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  };


  return (
    <div className="App">
      <Header />
      <main>
        <UploadSection
          videoURL={videoURL}
          getVideoRootProps={getVideoRootProps}
          getVideoInputProps={getVideoInputProps}
          isVideoDragActive={isVideoDragActive}
        />
        {videoURL && (
          <VideoPlayer
            videoRef={videoRef}
            videoURL={videoURL}
            videoFile={videoFile}
            isPaused={isPaused}
            handlePause={handlePause}
            handlePlay={handlePlay}
            handlePlayerDetect={handlePlayerDetect}
            handleRemoveVideo={handleRemoveVideo}
          />
        )}
        {loading && <LoadingPopup />}
        {images.length > 0 && (
          <DetectedPlayers images={images} handleImageClick={handleImageClick} />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        <div className="threejs-container" ref={sceneRef}>
        </div>
      </main>
    </div>
  );
}

export default App;
