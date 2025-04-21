  import React from 'react';
  import { View, StyleSheet, Image, Text, TouchableOpacity,ScrollView,FlatList} from "react-native";
  import BackArrow from '../Components/BackArrow';
  import Download from '../Components/Download';
  import AddFriend from '../Components/addFriend';
  import ThreeDots from '../Components/ThreeDots';
  import { useSelector } from 'react-redux';


  const Playlist = () => {
      const {data} = useSelector((state)=>state.data)
     
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
          top:{
              width:"100%",
              marginBottom:20
          },
          // search:{
          //     width:"100%",
          //     height:35,
          //     //backgroundColor:"pink",
          //     marginBottom:20,
              
          // },
          albumArt: {
              //position: "absolute",
              
              width: 240,
              height: 240,
              borderRadius: 20,
              marginBottom: 20,
              backgroundColor: "gray",
            },
          imageContainer:{
              width:"100%",
              height:250,
              //backgroundColor:"pink",
              position:"relative",
              justifyContent:"center",
              alignItems:"center"
          },
          metadata:{
              
              //backgroundColor:"white",
              paddingTop:15,
              width:"100%"
          },
          Name:{
              width:"100%",
              height:80,
              //backgroundColor:"white"
          },
          function:{
              width:"100%",
              height:80,
              //backgroundColor:"white",
              marginTop:20
          },
          topFunc:{
              //backgroundColor:"red",
              width:"100%",
              height:"50%",
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between"
          },
          bottomFunc:{
              //backgroundColor:"pink",
              width:"100%",
              height:"50%",
              flexDirection:"row"
          },
          topFuncLeft:{
              width:"50%",
              height:"100%",
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"flex-start"

          },
          topFuncRight:{
              width:"50%",
              height:"100%",
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"flex-end"

          },
          miniTriangle: {
              width: 0,
              height: 0,
        
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderLeftWidth: 10,
              borderRightWidth: 0,
              borderBottomWidth: 7,
              borderTopWidth: 7,
              borderLeftColor: "black",
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderRightColor: "transparent",
              marginLeft: 2,
            },
            miniPlayPauseButton: {
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 8,
            },
            miniPauseLine: {
              width: 3,
              height: 12,
              backgroundColor: "black",
              marginHorizontal: 2,
              borderRadius: 1,
            },
            pauseLinesContainer: {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
            funcbutton: {
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems:"center" , // centers content horizontally
              borderRadius: 25,
              borderColor:"white",
              borderWidth:1,
              
            },
            card: {
              width: "100%", //95
              alignSelf: "center",
              borderRadius: 20,
              paddingVertical: 10,
             
              marginVertical:5,
              flexDirection: "row",
              alignItems: "center",
             
              // backgroundColor: "rgba(50,50,50,0.5)",
            },
            cardImage: {
              width: 50,
              height: 50,
              borderRadius: 8,
              marginRight: 15,
            },
            artistName: {
              color: "white",
              fontSize: 12,
              fontWeight:"300",
              marginTop:2
            },
            songName: {
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            },
            textContainer: {
              flex: 1,
              paddingRight: 10,
            },
            dotsContainer: {
              marginLeft: "auto",
            },

      })
      const Pname = "Taylor Swift"
      const Uname = "Krishnan E"
      const Time = 11 
    return (
      <ScrollView
          style={styles.Main}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 100,paddingHorizontal:20,paddingTop:20,height:2000}} 
        
      >
         
      <Information styles={styles} Pname={Pname} Uname={Uname} Time={Time} />
      <Flatlist data={data} styles={styles} />
      
  
      </ScrollView>
    )
  }

  export default Playlist
  const Information = ({styles,Pname,Uname,Time}) => {
      return (
        <View style={{ width: "100%" }} >
          <View
              style={styles.top}
              >
              <BackArrow/>
          </View>
          {/* <View
              style={styles.search}
          >

          </View> */}
          <View
              style={styles.metadata}
              
          >
              <View
                  style={styles.imageContainer}
                 
              >
                  <Image  style={styles.albumArt}/>
              </View>
              <View
                  style={styles.Name}
                 
              >
                  <Text
                      style={{fontSize:27,fontWeight:"600",color:"white",marginBottom:8}}
                  >
                      {Pname}
                  </Text>
                  <Text
                  style={{fontSize:15,fontWeight:"600",color:"white",marginBottom:4}}
                  >
                      {Uname}
                  </Text>
                  <Text
                  style={{fontSize:10,fontWeight:"600",color:"white"}}
                  >
                      {Time} min
                  </Text>
              </View>
              <View
                  style={styles.function}
              >
                  <View
                  style={styles.topFunc}
                  >
                      <View
                      style={styles.topFuncLeft}
                      >
                          <TouchableOpacity
                              style={[styles.funcbutton,{marginRight:15}]}

                          >
                          <View >
                              <Download />
                          </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                              style={[styles.funcbutton,{marginRight:15}]}
                          >
                          <AddFriend/>
                          </TouchableOpacity>
                          <TouchableOpacity
                              style={[styles.funcbutton,{marginRight:15}]}
                          >
                          <ThreeDots/>
                          </TouchableOpacity>
                      </View>
                      <View
                      style={styles.topFuncRight}
                      >
                        <TouchableOpacity
                                          //onPress={togglePlayPause}
                                          style={styles.miniPlayPauseButton}
                                        >
                                          {false ? (
                                            <View style={styles.pauseLinesContainer}>
                                              <View style={styles.miniPauseLine} />
                                              <View style={styles.miniPauseLine} />
                                            </View>
                                          ) : (
                                            <View style={styles.miniTriangle} />
                                          )}
                                        </TouchableOpacity>
                      </View>
                  </View>
                  <View
                      style={styles.bottomFunc}
                  >

                  </View>
              </View>
          
          </View>
        </View>
      )
  }
  const DataList = ({ styles, item }) => {
    console.log("item",item)
      return (
       
         
            <View
              
              style={styles.card}
              // onTouchEnd={() => handleCardPress(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
              />
              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.songName}
                >
                  {item.title}
                </Text>
                <Text style={styles.artistName}>{item.uploader}</Text>
              </View>
              <View style={styles.dotsContainer}>
                <ThreeDots />
              </View>
            </View>
          
        
      );
    };
const Flatlist = ({data,styles}) => {
  return(
    <FlatList
    data={data}
    keyExtractor={(item) => item.id.toString()}
    scrollEnabled={false}
    renderItem={(item ) => <DataList styles={styles} item={item.item} />}
  />
  

  )
}