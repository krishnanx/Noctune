import React,{useState} from 'react'
import { ScrollView, View,StyleSheet,Text, ViewBase, TouchableOpacity,Modal,Image } from 'react-native'
import { Download } from 'react-native-feather';
import ThreeDots from '../Components/ThreeDots';
import SearchIcon from '../Components/Search';
import AddIcon from '../Components/AddIcon';
import { useSelector } from 'react-redux';
import { useTheme } from "@react-navigation/native";
import MusicNote from "../Components/MusicNote"
import Collab from "../Components/Collab"
const Library = () => {
     const [isModalVisible, setIsModalVisible] = useState(false);
     const { colors } = useTheme();
     const toggleModal = () => {
        setIsModalVisible((prev) => !prev);
      };
     const styles = StyleSheet.create({
              Main:{
                  flex:1,
                  width:"100%"
    
              },
              insideMain: {
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  flexDirection: "column",
                  flex:1,
                  flexGrow:1
                
                },
                Header:{
                    width:"100%",
                    flexDirection:"row",
                    justifyContent:"space-between"
                },
                HeaderInside:
                    {
                    flexDirection:"row",
                    justifyContent:"space-between",
                    alignItems:"center"
                    }
                ,
                body:{
                    width:"100%",
                    height:"auto"
                },
                modalOverlay: {
                    flex: 1,
                    justifyContent: "flex-end",
                    //backgroundColor: "rgba(98, 92, 92, 0.5)", // backdrop blur
                  },
                  modalContent: {
                    height: "20%", 
                    backgroundColor: colors.text,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 25,
                    backgroundColor: "rgba(0,0,0,1)",
                    gap: 15,
                  },
                  option: {
                    fontSize: 18,
                    marginVertical: 10,
                    color: colors.text,
                  },
                modal1:{
                    width:"100%",
                    height:"50%",
                    flexDirection:"row",

                },
                modal1R:{
                    width:"80%",
                    height:"auto",
                    //backgroundColor:"white",
                    justifyContent:"center",
                    alignItems:"center",
                    
                },
                modal1L:{
                    width:"20%",
                    height:"auto",
                    //backgroundColor:"red",
                    justifyContent:"center",
                    alignItems:"center"
                }
               
            });
        const handlePress = () =>{
           toggleModal();
        }
  return (
   <ScrollView
        style={styles.Main}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100,paddingHorizontal:20,paddingTop:30,height:2000}} 
         keyboardShouldPersistTaps="handled"
   >
    <View
        style={styles.Header}
    >
       <View
        style={styles.HeaderInside}
       >
            <Text
                    style={{fontSize:30,color:"white"}}
                >
                    Your Library
            </Text>
       </View>
       <View
       style={[styles.HeaderInside,{width:"25%"}]}
       >
        <SearchIcon width={30} height={30}/>
        <TouchableOpacity
        onPress={()=>toggleModal()} 
        >
        <AddIcon width={30} height={30}/>
        </TouchableOpacity>
       </View>
    </View>
    <View
        style={styles.body}
    >
        <Custom_modal
        isModalVisible={isModalVisible}
        styles={styles}
        toggleModal={toggleModal}
      />
    </View>
   </ScrollView>

  )
}

export default Library
const Custom_modal = ({ isModalVisible,styles, toggleModal }) => {
    const { data, pos} = useSelector((state) => state.data);
    
  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => toggleModal()}
      
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={() => toggleModal()}
      >
        <View style={styles.modalContent}>
            <View
                style={styles.modal1}
            >
                <View
                    style={styles.modal1L}
                >
                   <MusicNote width={40} height={40}/>
                </View>
                <View
                    style={styles.modal1R}
                >
                    <View
                        style={{width:"100%",height:"70%",alignItems:"center",flexDirection:"row"}}
                    >
                       <Text
                            style={{fontSize:20,color:"white"}} 
                       >
                       Playlist
                       </Text>
                    </View>
                    <View
                        style={{width:"100%",height:"30%",}}
                    >
                        <Text
                            style={{fontSize:10,color:"white"}} 
                       >
                      Build a playlist with songs or episodes
                       </Text>
                    </View>
                </View>
            </View>
            <View
                style={styles.modal1}
            >
                <View
                    style={styles.modal1L}
                >
                     <Collab width={40} height={40}/>
                    
                </View>
                <View
                    style={styles.modal1R}
                >
                    <View
                        style={{width:"100%",height:"70%",alignItems:"center",flexDirection:"row"}}
                    >
                       <Text
                            style={{fontSize:20,color:"white"}} 
                       >
                       Collab
                       </Text>
                    </View>
                    <View
                        style={{width:"100%",height:"30%",}}
                    >
                        <Text
                            style={{fontSize:10,color:"white"}} 
                       >
                      Join forces to make the ultimate playlist
                       </Text>
                    </View>
                </View>
            </View>

         
        </View>
       
        

         
        

      </TouchableOpacity>
    </Modal>
  )};