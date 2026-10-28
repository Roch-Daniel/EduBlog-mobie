import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import FeaturedCarousel from "../components/FeaturedCarousel";
import PostCard from "../components/PostCard";
import PostFilterChips from "../components/PostFilterChips";
import PostsFeedback from "../components/PostsFeedback";
import {
  formatSemester,
  getFilterOptions,
  type PostFilters,
} from "../postUtils";
import { usePostDiscovery } from "../usePostDiscovery";

export default function HomeScreen() {
  const { logout } = useAuth();
  const discovery = usePostDiscovery();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { posts, filters, results } = discovery;

  // Options come from the full catalog, so changing a filter never hides others.
  const options = useMemo(
    () => ({
      series: getFilterOptions(posts.map((post) => post.series)),
      semester: getFilterOptions(posts.map((post) => post.semester)),
      author: getFilterOptions(posts.map((post) => post.author?.name)),
    }),
    [posts],
  );

  function changeFilter(field: keyof PostFilters, value: string) {
    discovery.setFilters((current) => ({ ...current, [field]: value }));
  }

  async function handleLogout() {
    await logout();
  }

  const busy = discovery.loading || discovery.searching;
  const failed = discovery.error || discovery.searchError;
  const visiblePosts = busy || failed ? [] : results;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>EduBlog</Text>
          <View style={styles.headerActions}>
            <Link href="/profile" asChild>
              <Pressable accessibilityRole="link" style={styles.headerButton}>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#183153"
                />
                <Text style={styles.headerButtonText}>Perfil</Text>
              </Pressable>
            </Link>
            <Pressable
              accessibilityRole="button"
              onPress={handleLogout}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={visiblePosts}
        keyExtractor={(post) => post._id}
        renderItem={({ item }) => <PostCard post={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.introduction}>
              <Text style={styles.eyebrow}>CONHECIMENTO PARA COMPARTILHAR</Text>
              <Text style={styles.title} accessibilityRole="header">
                O que vamos aprender hoje?
              </Text>
              <Text style={styles.subtitle}>
                Explore conteúdos, encontre sua disciplina e continue
                aprendendo.
              </Text>
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={22} color="#0F766E" />
              <TextInput
                style={styles.searchInput}
                accessibilityLabel="Pesquisar conteúdo"
                placeholder="Busque por conteúdo ou autor"
                placeholderTextColor="#64748B"
                value={discovery.query}
                onChangeText={discovery.setQuery}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={200}
              />
              {discovery.query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                  onPress={() => discovery.setQuery("")}
                  style={styles.iconButton}
                >
                  <Ionicons name="close-circle" size={22} color="#64748B" />
                </Pressable>
              ) : null}
            </View>

            {!discovery.loading && !discovery.error ? (
              <>
                <PostFilterChips
                  label="Navegue por disciplinas"
                  allLabel="Todas"
                  options={discovery.disciplines.map(
                    (discipline) => discipline.label,
                  )}
                  value={filters.discipline}
                  onChange={(value) => changeFilter("discipline", value)}
                />

                <View style={styles.filterBar}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: filtersOpen }}
                    onPress={() => setFiltersOpen((current) => !current)}
                    style={styles.filterButton}
                  >
                    <Ionicons
                      name="options-outline"
                      size={19}
                      color="#0F766E"
                    />
                    <Text style={styles.filterButtonText}>
                      Filtros
                      {discovery.activeFilterCount
                        ? ` (${discovery.activeFilterCount})`
                        : ""}
                    </Text>
                    <Ionicons
                      name={filtersOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#0F766E"
                    />
                  </Pressable>
                  {discovery.hasCriteria ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={discovery.clearFilters}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearText}>Limpar tudo</Text>
                    </Pressable>
                  ) : null}
                </View>

                {filtersOpen ? (
                  <View style={styles.filterPanel}>
                    {options.series.length ? (
                      <PostFilterChips
                        label="Série/ano"
                        options={options.series}
                        value={filters.series}
                        onChange={(value) => changeFilter("series", value)}
                      />
                    ) : null}
                    {options.semester.length ? (
                      <PostFilterChips
                        label="Semestre"
                        options={options.semester}
                        value={filters.semester}
                        formatLabel={(value) => formatSemester(value)}
                        onChange={(value) => changeFilter("semester", value)}
                      />
                    ) : null}
                    {options.author.length ? (
                      <PostFilterChips
                        label="Autor"
                        options={options.author}
                        value={filters.author}
                        onChange={(value) => changeFilter("author", value)}
                      />
                    ) : null}
                  </View>
                ) : null}

                {!discovery.hasCriteria ? (
                  <FeaturedCarousel posts={discovery.featured} />
                ) : null}

                <View style={styles.resultsHeading}>
                  <Text style={styles.sectionTitle} accessibilityRole="header">
                    {filters.discipline ||
                      (discovery.hasCriteria
                        ? "Resultados da pesquisa"
                        : "Todos os conteúdos")}
                  </Text>
                  {!busy && !failed ? (
                    <Text
                      style={styles.resultCount}
                      accessibilityLiveRegion="polite"
                    >
                      {results.length}{" "}
                      {results.length === 1
                        ? "conteúdo encontrado"
                        : "conteúdos encontrados"}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          busy ? (
            <PostsFeedback
              loading
              title={
                discovery.loading ? "Carregando conteúdos..." : "Pesquisando..."
              }
            />
          ) : failed ? (
            <PostsFeedback
              title="Não foi possível carregar os conteúdos"
              message="Verifique sua conexão e tente novamente."
              actionLabel="Tentar novamente"
              onAction={
                discovery.error ? discovery.reload : discovery.retrySearch
              }
            />
          ) : (
            <PostsFeedback
              title={
                discovery.hasCriteria
                  ? "Nenhum resultado encontrado"
                  : "Ainda não há conteúdos publicados"
              }
              message={
                discovery.hasCriteria
                  ? "Tente outro termo ou ajuste os filtros selecionados."
                  : "Novos conteúdos aparecerão aqui assim que forem publicados."
              }
              actionLabel={
                discovery.hasCriteria
                  ? "Limpar pesquisa e filtros"
                  : "Atualizar"
              }
              onAction={
                discovery.hasCriteria
                  ? discovery.clearFilters
                  : discovery.reload
              }
            />
          )
        }
        ListFooterComponent={
          <Text style={styles.footer}>EduBlog · Aprender e compartilhar</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F7FA" },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#DCE5F0",
  },
  headerContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 20,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  logo: { color: "#008577", fontSize: 24, fontWeight: "800" },
  headerActions: { flexDirection: "row", gap: 8, alignItems: "center" },
  headerButton: {
    minHeight: 44,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerButtonText: { color: "#183153", fontSize: 14, fontWeight: "600" },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 32,
  },
  listHeader: { gap: 18, paddingBottom: 16 },
  introduction: { gap: 10, paddingTop: 12 },
  eyebrow: {
    color: "#0F766E",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: { color: "#0F172A", fontSize: 30, lineHeight: 38, fontWeight: "800" },
  subtitle: { color: "#64748B", fontSize: 15, lineHeight: 23 },
  searchBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 14,
    paddingRight: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFD0E5",
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    fontSize: 15,
    color: "#0F172A",
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  filterButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterButtonText: { color: "#0F766E", fontWeight: "700", fontSize: 14 },
  clearButton: { minHeight: 44, justifyContent: "center" },
  clearText: {
    color: "#475569",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  filterPanel: {
    backgroundColor: "#EAF2F5",
    borderRadius: 12,
    padding: 14,
    gap: 16,
  },
  resultsHeading: { gap: 6, marginTop: 8 },
  sectionTitle: { color: "#0F172A", fontSize: 21, fontWeight: "700" },
  resultCount: { color: "#64748B", fontSize: 13 },
  separator: { height: 16 },
  footer: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    paddingTop: 28,
  },
});
