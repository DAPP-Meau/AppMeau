import {Animated, Button, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BottomTabBarItem from "@react-navigation/bottom-tabs/src/views/BottomTabItem";
import {useState} from "react";
import {StatusBar} from "expo-status-bar";
import ScrollView = Animated.ScrollView;

export default function CreateLogin() {
// Supondo que você irá implementar a lógica para esses estados
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegistration = () => {
        // Implemente a lógica de registro aqui
        alert('Registro pressionado!');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Idade" value={age} onChangeText={setAge} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Estado" value={state} onChangeText={setState} />
            <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="Endereço" value={address} onChangeText={setAddress} />
            <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <Text style={styles.sectionTitle}>Informações de Perfil</Text>
            <TextInput style={styles.input} placeholder="Nome de usuário" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirmação de senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <Text style={styles.sectionTitle}>Foto de Perfil</Text>
            {/* Este é um espaço reservado para a lógica de adicionar foto */}
            <TouchableOpacity style={styles.photoPlaceholder}>
                <Text style={styles.photoText}>Adicionar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                <Text style={styles.buttonText}>FAZER CADASTRO</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    sectionTitle: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    photoPlaceholder: {
        width: 150,
        height: 150,
        backgroundColor: '#ddd',
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    photoText: {
        textAlign: 'center',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});