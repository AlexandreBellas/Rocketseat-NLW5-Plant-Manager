import React, { useEffect } from "react";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';

import Routes from "./src/routes";

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";
import { Alert } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    // const subscription = Notifications.addNotificationReceivedListener(
    //   async notification => {
    //     const data = notification.request.content.data.plant as PlantProps;
    //     console.log(data);
    //   })

    //   return () => subscription.remove();

    async function notifications() {
      const data = await Notifications.getAllScheduledNotificationsAsync();
      console.log("NOTIFICAÇÕES AGENDADAS #######")
      console.log(data);

      // await Notifications.cancelAllScheduledNotificationsAsync();
    }

    notifications();
  }, []);

  useEffect(() => {
    // Função para requisitar as permissões diretamente na splash screen
    async function requestPermissionsAsync() {
      // Esconde a splash screen; sem isso o app fica travado na tela de splash
      await SplashScreen.hideAsync();

      // Função para ser reusada no Alert de pedido de permissão
      async function defaultRequestNotifications(){
        return await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      }

      // Obter as permissões garantidas
      const settings = await defaultRequestNotifications();
      // Se não permitido, pede novamente
      if(!(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)){
        Alert.alert('Acesso às notificações', 'Para a melhor experiência in-app, dê acesso às notificações.', [
          {
            text: "Não 😤",
            style: "cancel",
          },
          {
            text: "Sim 😎",
            onPress: defaultRequestNotifications,
          },
        ])
      }
    }

    requestPermissionsAsync();
  }, [])

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Routes />;
}
