import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

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

const FlagScreen = () => {
    const [flags, setFlags] = useState<Flag[]>([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://172.16.0.141:8080/flags');
            const shuffledFlags = response.data.map((flag: Flag) => ({
                ...flag,
                options: shuffle(flag.options),
            }));
            setFlags(shuffledFlags as Flag[]);
        } catch (error) {
            console.error('Veri alırken bir hata oluştu:', error);
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
                <Image source={{ uri: item.imageURL }} style={{ width: 200, height: 150 }} />
                <Text>{item.country}</Text>
                {item.options.map((option, index) => (
                    <TouchableOpacity key={index} option={option} onPress={() => { }} />
                ))}
            </View>
        );
    };

    return (
        <View>
            <FlatList
                data={flags}
                horizontal
                renderItem={renderFlagItem}
                scrollEnabled={false}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

export default FlagScreen;
