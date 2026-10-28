import { useEffect } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useApiClient } from "@/hooks/useApiClient";
import { getAllPosts } from "@/services/postsService";
import { useAuth } from "../../context/AuthContext";

import { Href, Link } from "expo-router";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { request } = useApiClient();

  useEffect(() => {
    let cancelled = false;

    async function testGetAllPosts() {
      if (user?.role !== "PROFESSOR") {
        console.warn("O endpoint /posts/all exige um usuário professor.");
        return;
      }

      try {
        const posts = await getAllPosts(request);

        if (cancelled) {
          return;
        }

        console.log("Publicações recebidas:", posts);
        console.log("Quantidade de publicações:", posts.length);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Erro ao consultar as publicações:", error);
      }
    }

    void testGetAllPosts();

    return () => {
      cancelled = true;
    };
  }, [request, user?.role]);

  async function handleLogout() {
    await logout();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EduBlog</Text>

      <Text style={styles.text}>Usuário autenticado: {user?.name}</Text>

      <Text style={styles.text}>Perfil: {user?.role}</Text>

      <Link href="/profile" asChild>
        <Pressable style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Perfil</Text>
        </Pressable>
      </Link>

      {user?.role === "PROFESSOR" ? (
        <Link href={"/teacher" as Href} asChild>
          <Pressable style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Painel do professor</Text>
          </Pressable>
        </Link>
      ) : null}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },

  text: {
    marginTop: 8,
    fontSize: 16,
    color: "#64748b",
  },

  button: {
    marginTop: 24,
    minWidth: 140,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 24,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },

  profileButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFD0E5",
    backgroundColor: "#FFFFFF",
  },

  profileButtonText: {
    color: "#183153",
    fontSize: 14,
    fontWeight: "600",
  },
});
