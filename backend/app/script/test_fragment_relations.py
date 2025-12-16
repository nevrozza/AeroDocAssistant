from app.core.fragment_relations import get_related_fragments

TEST_FRAG_ID = "5c372cbb-4ddc-4017-936d-604935601f6e"  # usa uno real del graph_index.json

related = get_related_fragments(TEST_FRAG_ID)

print("Fragment:", TEST_FRAG_ID)
print("Related fragments:")
for r in related:
    print(" -", r)
