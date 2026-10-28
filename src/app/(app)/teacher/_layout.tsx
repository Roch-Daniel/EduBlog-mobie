import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function TeacherLayout() {
  const { user } = useAuth();

  if (user?.role !== "PROFESSOR") {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
