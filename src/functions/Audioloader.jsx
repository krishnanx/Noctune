import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadAudio } from './music';

const Audioloader = () => {
  const { data, pos, seek } = useSelector((state) => state.data);
  const seekRef = useRef(seek);
  const prevPosRef = useRef(null);
  const hasLoadedOnce = useRef(false);
  const dispatch = useDispatch();

  // Keep seek ref updated
  useEffect(() => {
    seekRef.current = seek;
  }, [seek]);

  useEffect(() => {
    console.log("pos:",pos);
    console.log("prev pos:",prevPosRef.current )
    if (prevPosRef.current !== pos) {
      console.log("Loading audio");
      loadAudio(data, pos, dispatch, () => seekRef.current);
      prevPosRef.current = pos;
      
    }
  }, [pos, data, dispatch]);

  return null;
};

export default Audioloader;
