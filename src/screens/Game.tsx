import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

interface Flag {
    _id: string;
    imageURL: string;
    country: string;
    options: string[];
    correctAnswer: string;
}

const ButtonOption = ({ option, onPress }: { option: string; onPress: () => void }) => {
    return (
        <TouchableOpacity style={{ marginVertical: 10 }} onPress={onPress}>
            <Text>{option}</Text>
        </TouchableOpacity>
    );
};

const Game = () => {
    const [flags, setFlags] = useState<Flag[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://172.16.0.235:8080/flags');
            const shuffledFlags = response.data.map((flag: Flag) => ({
                ...flag,
                options: shuffle(flag.options),
            }));
            setFlags(shuffledFlags as Flag[]);
        } catch (error) {
            console.error(error);
        }
    };

    const shuffle = (array: any[]) => {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    const renderFlagItem = ({ item }: { item: Flag }) => {
        return (
            <View>
                <Image source={{ uri: item.imageURL }} style={styles.flagImage} />
                <Text>{item.country}</Text>
                {item.options.map((option, index) => (
                    <ButtonOption key={index} option={option} onPress={() => { }} />
                ))}
            </View>
        );
    };

    const handleNext = () => {
        if (currentIndex < flags.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {

        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            <ImageBackground
                source={require('../assets/BQ_background.jpg')}
                style={styles.backgroundImage}
                resizeMode='cover'
            >
                <View style={styles.containerOverlay}>
                    <View style={styles.quizCont}>
                        <FlatList
                            data={flags}
                            horizontal
                            renderItem={renderFlagItem}
                            scrollEnabled={true}
                            keyExtractor={(item) => item._id}
                            initialScrollIndex={currentIndex}
                            pagingEnabled
                        />
                    </View>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    quizCont: {
        flex: 1,
        borderRadius: 22,
        width: '95%',
        height: '77%',
        backgroundColor: 'rgba(255, 255, 255, 0.32)',
        marginBottom: '10%',
        marginTop: '25%',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    nextButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
    },
    flagImage:{
        width: 250,
        height:300,
    }
});

export default Game;
