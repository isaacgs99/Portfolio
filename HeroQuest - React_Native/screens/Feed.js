import React, { useState, useRef } from "react";
import { FlatList, View, Text, StyleSheet, ScrollView } from "react-native";

import firebase from '../database/firebase';

import { Post } from '../components/Feed/Post'
import { UserPost } from '../components/Feed/UserPost'
import { useEffect } from "react";
import Loading from "../screens/Loading"


export default function Feed({ route }) {

    const [feed, updateFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const flatlistRef = useRef();
    /**
    * Use Effect method for the posts in FB.
    * @return {(Object|Array)} returns an array of objects in the feed state 
    */
    useEffect(() => {
        const OnLoadingListener = firebase.database().ref(`/posts`).on('value', snapshot => {
            const postsFire = snapshot.val();
            if (postsFire) {
                updateFeed([]);
                var ids = Object.keys(snapshot.val());
                var objects = [];
                let idx = 0;
                snapshot.forEach(function (childSnapshot) {
                    const object = childSnapshot.val();
                    object.id = ids[idx];
                    objects.push(object);
                    updateFeed(posts => [...posts, object]);
                    idx++;
                });
            } else {
                updateFeed([]);
            }

            setIsLoading(false);

        });

        return () => {
            firebase.database().ref(`/posts`).off('value', OnLoadingListener)
        };
    }, []);
    return (
        <>
            { isLoading ? <Loading color={'white'} /> :
                <View>
                    <UserPost onFocus={() => onFocus()} />
                    <View style={styles.list}>
                        {
                            feed.length ?
                                <FlatList
                                    data={feed}
                                    style={styles.list}
                                    contentContainerStyle={{ flexDirection: 'column-reverse' }}
                                    renderItem={({ item }) => (
                                        <Post key={item.id} data={item} />
                                    )}
                                />
                            : <Text> No Feed... </Text>
                        }
                    </View>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        marginBottom: 160
    }
})