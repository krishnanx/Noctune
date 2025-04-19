import React,{useEffect,useRef} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { loadAudio } from './music';
const Audioloader = () => {
    
const {data,pos,seek,isPlaying} = useSelector((state) => state.data);
const seekRef = useRef(seek);
const dispatch = useDispatch();
useEffect(() => {
  seekRef.current = seek; 
}, [seek]);


useEffect(() => {
  loadAudio(data, pos, dispatch, () => seekRef.current);
}, []);

  return (
    <></>
  )
}

export default Audioloader