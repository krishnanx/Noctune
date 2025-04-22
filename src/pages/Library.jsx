import React from 'react'
import { ScrollView, View,StyleSheet,Text, ViewBase } from 'react-native'
import { Download } from 'react-native-feather';
import ThreeDots from '../Components/ThreeDots';
import SearchIcon from '../Components/Search';
import AddIcon from '../Components/AddIcon';

const Library = () => {
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
                   
               
            });
  return (
   <ScrollView
        style={styles.Main}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100,paddingHorizontal:20,paddingTop:30,height:2000}} 
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
        <AddIcon width={30} height={30}/>
       </View>
    </View>
   </ScrollView>

  )
}

export default Library