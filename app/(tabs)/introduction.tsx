import {Button, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BottomTabBarItem from "@react-navigation/bottom-tabs/src/views/BottomTabItem";
import {useState} from "react";
import {StatusBar} from "expo-status-bar";
import {text} from "stream/consumers";
import {black} from "colorette";

export default function Introduction() {

    const handleLogin = () => {
        // Implemente a lógica de login aqui
        alert('Login pressionado!');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#f5f5f5" />
            <Text style={styles.title}>Olá</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>ADOTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>AJUDAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>CADASTRAR ANIMAL</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 1,
        color: '#ffd358',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '50%',
        height: 50,
        backgroundColor: '#ffd358',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
    },
});