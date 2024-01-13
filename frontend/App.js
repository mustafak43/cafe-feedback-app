import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigation from "./navigation/appNavigation";
import { GlobalProvider, UserInfoProvider } from "./constants/globalContext";

const Stack = createNativeStackNavigator();
export default function App() {

  return (
    <GlobalProvider>
      <UserInfoProvider>
        <AppNavigation/>
      </UserInfoProvider>
    </GlobalProvider>
  );
}
