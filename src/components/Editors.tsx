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
import CategoryIcon from "@/components/CategoryIcon";
import {
  COLORS,
  Card,
  F,
  FW,
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const bubbles = [
  { size: 130, top: -65, left: 100 },
  { size: 55, top: 30, left: 215 },
];

const ICONS = [
  "croissant",
  "utensils",
  "knife",
  "cups",
  "burgers",
  "bbq",
  "coffee",
  "bowl",
  "fish",
  "crescent",
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
        {categories.map((c) => {
          const row = (
            <Card selected={c.id === "all"} style={{ padding: 12 * u }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12 * u,
                }}
              >
                <View
                  style={{
                    width: 46 * u,
                    height: 46 * u,
                    borderRadius: 23 * u,
                    backgroundColor: c.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon
                    name={c.icon}
                    size={26 * u}
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
          );

          if (c.id === "all") return <View key={c.id}>{row}</View>;

          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.85}
              onPress={() => openScreen("category", c.id)}
            >
              {row}
            </TouchableOpacity>
          );
        })}
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
                height: 84 * u,
                borderRadius: 14 * u,
                backgroundColor: c.color,
                borderWidth: active ? 1.5 : 1,
                borderColor: active ? COLORS.pink : COLORS.border,
                padding: 10 * u,
                justifyContent: "space-between",
              }}
            >
              <CategoryIcon name={c.icon} size={22 * u} color={COLORS.navy} />
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
  const [icon, setIcon] = useState<string>(existing?.icon ?? ICONS[0]);
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");

  const count = existing ? itemCount(products, existing) : 0;
  const ready = name.trim().length > 0;

  const onSave = () => {
    const error = saveCategory(existing ? existing.id : null, name, icon);
    if (error) {
      setMessage(error);
      return;
    }
    goBack();
  };

  const onDelete = () => {
    if (!existing) return;
    deleteCategory(existing.id);
    goBack();
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={{
          width: FW - 36 * u,
          backgroundColor: COLORS.card,
          borderRadius: 18 * u,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 16 * u,
        }}
      >
        <Heading size={30}>
          {existing ? "Edit Category" : "New Category"}
        </Heading>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 12,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowIcons(!showIcons)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: COLORS.cream,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CategoryIcon name={icon} size={32} color="#243759" />
            <View
              style={{
                position: "absolute",
                right: -4,
                bottom: -4,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#243759",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="pencil" size={9} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 11,
                color: "#243759",
                marginBottom: 4,
              }}
            >
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                setMessage("");
              }}
              autoCorrect={false}
              selectionColor="#E8708C"
              style={{
                height: 34,
                borderRadius: 8,
                backgroundColor: COLORS.cream,
                paddingHorizontal: 10,
                paddingVertical: 0,
                fontFamily: F.reg,
                fontSize: 13,
                color: "#243759",
              }}
            />
          </View>
        </View>

        {showIcons ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
              padding: 8,
              borderRadius: 10,
              backgroundColor: COLORS.cream,
            }}
          >
            {ICONS.map((iconName) => {
              const active = iconName === icon;
              return (
                <TouchableOpacity
                  key={iconName}
                  activeOpacity={0.85}
                  onPress={() => {
                    setIcon(iconName);
                    setShowIcons(false);
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? COLORS.pink : COLORS.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon name={iconName} size={26} color="#243759" />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {message ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 11,
              color: "#E8708C",
              marginTop: 8,
            }}
          >
            {message}
          </Text>
        ) : null}

        {existing && count === 0 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onDelete}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 11,
                color: "#E8708C",
                textDecorationLine: "underline",
              }}
            >
              Delete Category
            </Text>
          </TouchableOpacity>
        ) : null}

        {existing && count > 0 ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10,
              color: "#243759",
              marginTop: 10,
            }}
          >
            This category has {count} items. Move or delete them to remove it.
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 * u, marginTop: 16 * u }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PillButton title="Cancel" variant="navy" onPress={goBack} />
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", opacity: ready ? 1 : 0.5 }}
          >
            <PillButton title="Save" onPress={onSave} />
          </View>
        </View>
      </View>
    </View>
  );
}
