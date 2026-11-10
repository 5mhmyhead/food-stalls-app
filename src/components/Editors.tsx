import {
    deleteCategory,
    deleteProduct,
    goBack,
    itemCount,
    openScreen,
    saveCategory,
    saveProduct,
    useCatalog,
} from "@/catalogStore";
import {
    COLORS,
    Card,
    F,
    Heading,
    IconBtn,
    Page,
    PillButton,
    Thumb,
    u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const bubbles = [
  { size: 130, top: -65, left: 100 },
  { size: 55, top: 30, left: 215 },
];

function Input({
  placeholder,
  value,
  onChangeText,
  multiline,
  numeric,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  numeric?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.navy}
      multiline={multiline}
      keyboardType={numeric ? "numeric" : "default"}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 8 * u,
        height: (multiline ? 76 : 30) * u,
        paddingHorizontal: 10 * u,
        paddingTop: multiline ? 8 * u : 0,
        textAlignVertical: multiline ? "top" : "center",
        fontFamily: F.reg,
        fontSize: 10.5 * u,
        color: COLORS.navy,
      }}
    />
  );
}

export function EditProducts() {
  const { products } = useCatalog();

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card style={{ padding: 16 * u }}>
        <Heading size={30}>Edit Products</Heading>
        <View style={{ flexDirection: "row", marginTop: 12 * u }}>
          <PillButton
            title="Create New Product"
            onPress={() => openScreen("item", null)}
          />
        </View>
      </Card>

      <View style={{ gap: 12 * u, marginTop: 16 * u }}>
        {products.map((p) => (
          <Card key={p.id} style={{ padding: 8 * u }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10 * u,
              }}
            >
              <Thumb width={120 * u} height={70} color={p.color} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 13 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 9 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.category} · {peso(p.price)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8 * u,
                    marginTop: 10 * u,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => deleteProduct(p.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20 * u}
                      color={COLORS.pink}
                    />
                  </TouchableOpacity>
                  <View style={{ width: 110 * u }}>
                    <PillButton
                      title="Edit Product"
                      onPress={() => openScreen("item", p.id)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}

export function EditCategories() {
  const { products, categories } = useCatalog();

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card style={{ padding: 16 * u }}>
        <Heading size={30}>Edit Categories</Heading>
        <View style={{ flexDirection: "row", marginTop: 12 * u }}>
          <PillButton
            title="Create New Category"
            onPress={() => openScreen("category", null)}
          />
        </View>
      </Card>

      <View style={{ gap: 12 * u, marginTop: 16 * u }}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            activeOpacity={0.85}
            onPress={() => openScreen("category", c.id)}
          >
            <Card style={{ padding: 12 * u }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12 * u,
                }}
              >
                <View
                  style={{
                    width: 40 * u,
                    height: 40 * u,
                    borderRadius: 20 * u,
                    backgroundColor: c.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={c.icon as any}
                    size={20 * u}
                    color={COLORS.navy}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: F.semi,
                      fontSize: 13 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {c.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: F.reg,
                      fontSize: 9 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {itemCount(products, c)} items
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </Page>
  );
}

export function EditItem() {
  const { products, categories, editingId } = useCatalog();
  const existing = products.find((p) => p.id === editingId);
  const choices = categories.filter((c) => c.id !== "all");

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState(
    existing?.category ?? choices[0]?.name ?? "",
  );
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [stock, setStock] = useState(existing ? String(existing.stock) : "");

  const priceNum = parseFloat(price);
  const stockNum = parseInt(stock || "0", 10);
  const valid =
    name.trim().length > 0 &&
    !isNaN(priceNum) &&
    priceNum >= 0 &&
    !isNaN(stockNum);

  const onSave = () => {
    if (!valid) return;
    saveProduct({
      id: existing ? existing.id : null,
      name: name.trim(),
      description: description.trim(),
      category,
      price: priceNum,
      stock: stockNum,
    });
    goBack();
  };

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 130 * u,
        }}
      >
        <Ionicons name="image-outline" size={30 * u} color={COLORS.navy} />
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: 11 * u,
            color: COLORS.navy,
            marginTop: 6 * u,
          }}
        >
          Upload Files
        </Text>
        <Text
          style={{ fontFamily: F.reg, fontSize: 8 * u, color: COLORS.navy }}
        >
          (maximum file upload size of 2MB)
        </Text>
      </Card>

      <View style={{ marginTop: 14 * u, marginBottom: 10 * u }}>
        <Heading size={30}>Product Details</Heading>
      </View>

      <View style={{ gap: 8 * u }}>
        <Input placeholder="Product Name" value={name} onChangeText={setName} />
        <Input
          placeholder="Product Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <Text
        style={{
          fontFamily: F.bold,
          fontSize: 11 * u,
          color: COLORS.navy,
          marginTop: 14 * u,
          marginBottom: 8 * u,
        }}
      >
        Category
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -22 * u }}
        contentContainerStyle={{ paddingHorizontal: 22 * u, gap: 10 * u }}
      >
        {choices.map((c) => {
          const active = c.name === category;
          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.85}
              onPress={() => setCategory(c.name)}
              style={{
                width: 110 * u,
                height: 78 * u,
                borderRadius: 14 * u,
                backgroundColor: c.color,
                borderWidth: active ? 1.5 : 1,
                borderColor: active ? COLORS.pink : COLORS.border,
                padding: 10 * u,
                justifyContent: "space-between",
              }}
            >
              <Ionicons
                name={c.icon as any}
                size={16 * u}
                color={COLORS.navy}
              />
              <Heading size={18}>{c.name}</Heading>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ gap: 8 * u, marginTop: 12 * u }}>
        <Input
          placeholder="Product Price"
          value={price}
          onChangeText={setPrice}
          numeric
        />
        <Input
          placeholder="Product Stock"
          value={stock}
          onChangeText={setStock}
          numeric
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 16 * u,
          opacity: valid ? 1 : 0.5,
        }}
      >
        <PillButton
          title={existing ? "Save Changes" : "Create Product"}
          onPress={onSave}
        />
      </View>
    </Page>
  );
}

export function CategoryForm() {
  const { products, categories, editingId } = useCatalog();
  const existing = categories.find((c) => c.id === editingId);
  const [name, setName] = useState(existing?.name ?? "");
  const builtIn = existing?.id === "all";
  const count = existing ? itemCount(products, existing) : 0;

  const onSave = () => {
    if (!name.trim()) return;
    saveCategory(existing ? existing.id : null, name.trim());
    goBack();
  };

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card style={{ padding: 16 * u }}>
        <Heading size={28}>
          {existing ? "Edit Category" : "New Category"}
        </Heading>
        <View style={{ marginTop: 12 * u }}>
          {builtIn ? (
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 11 * u,
                color: COLORS.navy,
              }}
            >
              All Meals is built in and always shows every product.
            </Text>
          ) : (
            <Input
              placeholder="Category Name"
              value={name}
              onChangeText={setName}
            />
          )}
        </View>

        {!builtIn && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 14 * u,
              opacity: name.trim() ? 1 : 0.5,
            }}
          >
            <PillButton title="Save Category" onPress={onSave} />
          </View>
        )}

        {existing && !builtIn && count === 0 && (
          <View style={{ flexDirection: "row", marginTop: 10 * u }}>
            <PillButton
              title="Delete Category"
              variant="navy"
              onPress={() => {
                deleteCategory(existing.id);
                goBack();
              }}
            />
          </View>
        )}

        {existing && !builtIn && count > 0 && (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10 * u,
              color: COLORS.navy,
              marginTop: 10 * u,
            }}
          >
            This category has {count} items. Move or delete them to remove it.
          </Text>
        )}
      </Card>
    </Page>
  );
}
